import { json, readJson, requireRole, audit, errorResponse } from './_utils.js';
const readRoles=['admin','operations','finance','read_only'];
const writeRoles=['admin','operations'];
const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(String(s||''));
const moneyMinor=(v,name)=>{const n=Number(v);if(!Number.isSafeInteger(n)||n<0)throw Object.assign(new Error(`${name} must be a non-negative integer`),{status:400});return n;};
const currentYearCode=()=>String(new Date().getFullYear()).slice(-2);
const validRentalReference=value=>/^RNT-DHG-\d{2}-\d{4,}$/.test(String(value||'').trim());
async function allocateRentalReference(db,year=currentYearCode()){
 const row=await db.prepare("INSERT INTO rental_reference_sequences (year,last_number) VALUES ('GLOBAL',1010) ON CONFLICT(year) DO UPDATE SET last_number=last_number+1 RETURNING last_number").first();
 if(!row?.last_number)throw new Error('rental_reference_allocation_failed');
 return `RNT-DHG-${year}-${String(row.last_number).padStart(4,'0')}`;
}
async function syncRentalReferenceSequence(db,reference){
 const match=String(reference||'').match(/^RNT-DHG-(\d{2})-(\d{4,})$/);
 if(!match)return;
 const number=Number(match[2]);
 await db.prepare("INSERT INTO rental_reference_sequences (year,last_number) VALUES ('GLOBAL',?) ON CONFLICT(year) DO UPDATE SET last_number=MAX(last_number,excluded.last_number)").bind(number).run();
}
export async function onRequestGet({env,data,request}){
 if(!requireRole(data.staff,readRoles))return json({error:'forbidden'},403);
 try{const url=new URL(request.url),limit=Math.min(500,Math.max(1,Number.parseInt(url.searchParams.get('limit')||'200',10)||200));const rows=await env.DB.prepare(`SELECT r.id,r.rental_reference,r.customer_id,COALESCE(c.full_name,'Unlinked customer') AS customer_name,r.vehicle_id,COALESCE(v.name,'Unlinked vehicle') AS vehicle_name,v.registration_number,r.pickup_date,r.return_date,r.daily_rate_minor,r.billable_days,r.status,r.notes,r.created_at,i.id AS invoice_id,i.invoice_number,i.total_minor AS invoice_total_minor,i.status AS invoice_status,COALESCE((SELECT SUM(p.amount_minor) FROM payments p WHERE p.invoice_id=i.id),0) AS paid_minor FROM rentals r LEFT JOIN customers c ON c.id=r.customer_id LEFT JOIN vehicles v ON v.id=r.vehicle_id LEFT JOIN invoices i ON i.rental_id=r.id ORDER BY r.created_at DESC LIMIT ?`).bind(limit).all();const year=currentYearCode();
 const sequence=await env.DB.prepare("SELECT last_number FROM rental_reference_sequences WHERE year='GLOBAL'").first();
 const nextNumber=Number(sequence?.last_number||1009)+1;
 return json({data:rows.results||[],limit,next_rental_reference:`RNT-DHG-${year}-${String(nextNumber).padStart(4,'0')}`});}catch(e){return errorResponse(e)}
}
export async function onRequestPost({env,data,request}){
 if(!requireRole(data.staff,writeRoles))return json({error:'forbidden'},403);
 try{
  const b=await readJson(request),customerId=String(b.customer_id||''),vehicleId=String(b.vehicle_id||''),pickup=String(b.pickup_date||''),returned=String(b.return_date||''),status=String(b.status||'upcoming'),notes=String(b.notes||'').trim().slice(0,3000),rate=moneyMinor(b.daily_rate_minor,'daily_rate_minor');
  if(!customerId||!vehicleId)throw Object.assign(new Error('customer_id and vehicle_id are required'),{status:400});
  if(!validDate(pickup)||!validDate(returned)||returned<pickup)throw Object.assign(new Error('Valid pickup_date and return_date are required'),{status:400});
  if(!['upcoming','active','completed','cancelled'].includes(status))throw Object.assign(new Error('Invalid rental status'),{status:400});
  const [customer,vehicle]=await Promise.all([env.DB.prepare('SELECT id,full_name FROM customers WHERE id=? AND archived_at IS NULL').bind(customerId).first(),env.DB.prepare('SELECT id,name,daily_rate_minor,status FROM vehicles WHERE id=?').bind(vehicleId).first()]);
  if(!customer)throw Object.assign(new Error('customer_not_found'),{status:404});if(!vehicle)throw Object.assign(new Error('vehicle_not_found'),{status:404});if(['inactive','maintenance'].includes(String(vehicle.status||'').toLowerCase()))throw Object.assign(new Error('vehicle_not_available_for_rental'),{status:409});
  const conflict=await env.DB.prepare("SELECT id FROM rentals WHERE vehicle_id=? AND status IN ('upcoming','active') AND pickup_date<=? AND return_date>=? LIMIT 1").bind(vehicleId,returned,pickup).first();if(conflict)throw Object.assign(new Error('vehicle_date_conflict'),{status:409});
  const days=Math.round((Date.parse(returned+'T12:00:00Z')-Date.parse(pickup+'T12:00:00Z'))/86400000)+1;if(days<1)throw Object.assign(new Error('invalid_rental_period'),{status:400});
  const total=days*rate;if(!Number.isSafeInteger(total))throw Object.assign(new Error('invoice_total_out_of_range'),{status:400});
  const rentalId=String(b.rental_id||`RNT-${crypto.randomUUID()}`),invoiceId=`INV-${crypto.randomUUID()}`,invoiceNumber=`DHG-${Date.now().toString().slice(-8)}-${crypto.randomUUID().slice(0,4).toUpperCase()}`,today=new Date().toISOString().slice(0,10),due=validDate(b.due_on)?String(b.due_on):returned;
  // Idempotency: a client retry with the same rental ID returns the existing rental/invoice instead of creating a second invoice.
  const existing=await env.DB.prepare('SELECT r.id,r.rental_reference,i.id AS invoice_id,i.invoice_number,i.total_minor FROM rentals r LEFT JOIN invoices i ON i.rental_id=r.id WHERE r.id=?').bind(rentalId).first();
  if(existing){
   const same=await env.DB.prepare('SELECT customer_id,vehicle_id,pickup_date,return_date,daily_rate_minor FROM rentals WHERE id=?').bind(rentalId).first();
   if(!same||same.customer_id!==customerId||same.vehicle_id!==vehicleId||same.pickup_date!==pickup||same.return_date!==returned||Number(same.daily_rate_minor)!==rate)throw Object.assign(new Error('rental_id_already_exists_with_different_details'),{status:409});
   let existingReference=existing.rental_reference;
   if(!existingReference){existingReference=await allocateRentalReference(env.DB);await env.DB.prepare('UPDATE rentals SET rental_reference=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(existingReference,rentalId).run();}
   if(!existing.invoice_id){
    const days=Math.round((Date.parse(returned+'T12:00:00Z')-Date.parse(pickup+'T12:00:00Z'))/86400000)+1,total=days*rate;
    if(days<1||!Number.isSafeInteger(total))throw Object.assign(new Error('invoice_total_out_of_range'),{status:400});
    const invoiceId=`INV-${crypto.randomUUID()}`,invoiceNumber=`DHG-${Date.now().toString().slice(-8)}-${crypto.randomUUID().slice(0,4).toUpperCase()}`,today=new Date().toISOString().slice(0,10);
    await env.DB.batch([
     env.DB.prepare("INSERT INTO invoices (id,invoice_number,customer_id,rental_id,vehicle_id,issued_on,due_on,currency,subtotal_minor,discount_minor,total_minor,status,notes,created_by) VALUES (?,?,?,?,?,?,?,'GHS',?,0,?,'issued',?,?)").bind(invoiceId,invoiceNumber,customerId,rentalId,vehicleId,today,returned,total,total,`Automatically generated for existing rental ${rentalId}.`,data.staff.id),
     env.DB.prepare('INSERT INTO invoice_items (id,invoice_id,description,quantity,unit_amount_minor,line_total_minor) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),invoiceId,`Vehicle rental — ${days} billable day(s)`,days,rate,total)
    ]);
    await audit(env.DB,data.staff,'rental.invoice_backfilled','rental',rentalId,{invoice_id:invoiceId,invoice_number:invoiceNumber,total_minor:total});
    return json({data:{rental_id:existing.id,rental_reference:existingReference,invoice_id:invoiceId,invoice_number:invoiceNumber,total_minor:total,duplicate:true,invoice_created:true}},200);
   }
   return json({data:{rental_id:existing.id,rental_reference:existingReference,invoice_id:existing.invoice_id,invoice_number:existing.invoice_number,total_minor:existing.total_minor,duplicate:true}},200);
  }
  const rentalReference=await allocateRentalReference(env.DB);
  const statements=[
   env.DB.prepare('INSERT INTO rentals (id,rental_reference,customer_id,vehicle_id,pickup_date,return_date,daily_rate_minor,billable_days,status,notes,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)').bind(rentalId,rentalReference,customerId,vehicleId,pickup,returned,rate,days,status,notes||null,data.staff.id),
   env.DB.prepare("INSERT INTO invoices (id,invoice_number,customer_id,rental_id,vehicle_id,issued_on,due_on,currency,subtotal_minor,discount_minor,total_minor,status,notes,created_by) VALUES (?,?,?,?,?,?,?,'GHS',?,0,?,'issued',?,?)").bind(invoiceId,invoiceNumber,customerId,rentalId,vehicleId,today,due,total,total,`Automatically generated from rental ${rentalId}.`,data.staff.id),
   env.DB.prepare('INSERT INTO invoice_items (id,invoice_id,description,quantity,unit_amount_minor,line_total_minor) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),invoiceId,`Vehicle rental — ${days} billable day(s)`,days,rate,total)
  ];
  await env.DB.batch(statements);await audit(env.DB,data.staff,'rental.created_with_invoice','rental',rentalId,{invoice_id:invoiceId,invoice_number:invoiceNumber,customer_id:customerId,vehicle_id:vehicleId,total_minor:total});
  return json({data:{rental_id:rentalId,rental_reference:rentalReference,invoice_id:invoiceId,invoice_number:invoiceNumber,customer_id:customerId,vehicle_id:vehicleId,pickup_date:pickup,return_date:returned,billable_days:days,daily_rate_minor:rate,total_minor:total,paid_minor:0,balance_minor:total,invoice_status:'issued',status}},201);
 }catch(e){return errorResponse(e)}
}

export async function onRequestPut({env,data,request}){
 if(!requireRole(data.staff,writeRoles))return json({error:'forbidden'},403);
 try{
  const b=await readJson(request),rentalId=String(b.rental_id||'').trim(),customerId=String(b.customer_id||''),vehicleId=String(b.vehicle_id||''),pickup=String(b.pickup_date||''),returned=String(b.return_date||''),status=String(b.status||'upcoming'),notes=String(b.notes||'').trim().slice(0,3000),rate=moneyMinor(b.daily_rate_minor,'daily_rate_minor'),rentalReference=b.rental_reference===undefined?null:String(b.rental_reference||'').trim();
  if(!rentalId)throw Object.assign(new Error('rental_id_required'),{status:400});
  if(rentalReference!==null&&rentalReference!==''&&!validRentalReference(rentalReference))throw Object.assign(new Error('invalid_rental_reference_format'),{status:400});
  if(!customerId||!vehicleId)throw Object.assign(new Error('customer_id_and_vehicle_id_required'),{status:400});
  if(!validDate(pickup)||!validDate(returned)||returned<pickup)throw Object.assign(new Error('invalid_rental_dates'),{status:400});
  if(!['upcoming','active','completed','cancelled'].includes(status))throw Object.assign(new Error('invalid_rental_status'),{status:400});
  const [rental,customer,vehicle]=await Promise.all([
   env.DB.prepare('SELECT id,rental_reference FROM rentals WHERE id=?').bind(rentalId).first(),
   env.DB.prepare('SELECT id FROM customers WHERE id=? AND archived_at IS NULL').bind(customerId).first(),
   env.DB.prepare('SELECT id,name,status FROM vehicles WHERE id=?').bind(vehicleId).first()
  ]);
  if(!rental)throw Object.assign(new Error('rental_not_found'),{status:404});
  if(!customer)throw Object.assign(new Error('customer_not_found'),{status:404});
  if(!vehicle)throw Object.assign(new Error('vehicle_not_found'),{status:404});
  if(['inactive','maintenance'].includes(String(vehicle.status||'').toLowerCase()))throw Object.assign(new Error('vehicle_not_available_for_rental'),{status:409});
  const conflict=['upcoming','active'].includes(status)?await env.DB.prepare("SELECT id FROM rentals WHERE vehicle_id=? AND id<>? AND status IN ('upcoming','active') AND pickup_date<=? AND return_date>=? LIMIT 1").bind(vehicleId,rentalId,returned,pickup).first():null;
  if(conflict)throw Object.assign(new Error(`vehicle_date_conflict:${conflict.id}`),{status:409});
  const days=Math.round((Date.parse(returned+'T12:00:00Z')-Date.parse(pickup+'T12:00:00Z'))/86400000)+1;
  if(days<1)throw Object.assign(new Error('invalid_rental_period'),{status:400});
  const rentalLineTotal=days*rate;
  if(!Number.isSafeInteger(rentalLineTotal))throw Object.assign(new Error('invoice_total_out_of_range'),{status:400});
  const invoice=await env.DB.prepare('SELECT id,discount_minor FROM invoices WHERE rental_id=? ORDER BY created_at DESC LIMIT 1').bind(rentalId).first();
  const statements=[env.DB.prepare("UPDATE rentals SET customer_id=?,vehicle_id=?,pickup_date=?,return_date=?,daily_rate_minor=?,billable_days=?,status=?,notes=?,rental_reference=COALESCE(NULLIF(?,''),rental_reference),updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(customerId,vehicleId,pickup,returned,rate,days,status,notes||null,rentalReference||'',rentalId)];
  let invoiceNumber=null,updatedTotal=null;
  if(invoice){
   const line=await env.DB.prepare("SELECT id FROM invoice_items WHERE invoice_id=? AND (description LIKE 'Vehicle rental%' OR description LIKE 'Vehicle hire%') ORDER BY rowid LIMIT 1").bind(invoice.id).first();
   const existingLines=await env.DB.prepare('SELECT COALESCE(SUM(line_total_minor),0) AS subtotal FROM invoice_items WHERE invoice_id=?').bind(invoice.id).first();
   const oldLine= line ? await env.DB.prepare('SELECT line_total_minor FROM invoice_items WHERE id=?').bind(line.id).first() : null;
   const subtotal=Math.max(0,Number(existingLines?.subtotal||0)-Number(oldLine?.line_total_minor||0)+rentalLineTotal);
   const discount=Number(invoice.discount_minor||0),total=Math.max(0,subtotal-discount);
   const paidRow=await env.DB.prepare('SELECT COALESCE(SUM(amount_minor),0) AS paid FROM payments WHERE invoice_id=?').bind(invoice.id).first();
   const paid=Number(paidRow?.paid||0);
   if(total<paid)throw Object.assign(new Error('invoice_total_below_amount_already_paid'),{status:409});
   const invoiceRow=await env.DB.prepare('SELECT invoice_number FROM invoices WHERE id=?').bind(invoice.id).first();
   invoiceNumber=invoiceRow?.invoice_number||null;updatedTotal=total;
   if(line)statements.push(env.DB.prepare('UPDATE invoice_items SET description=?,quantity=?,unit_amount_minor=?,line_total_minor=? WHERE id=?').bind(`Vehicle rental — ${days} billable day(s)`,days,rate,rentalLineTotal,line.id));
   else statements.push(env.DB.prepare('INSERT INTO invoice_items (id,invoice_id,description,quantity,unit_amount_minor,line_total_minor) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),invoice.id,`Vehicle rental — ${days} billable day(s)`,days,rate,rentalLineTotal));
   const invoiceStatus=paid>=total?'paid':paid>0?'partially_paid':'issued';
   statements.push(env.DB.prepare('UPDATE invoices SET customer_id=?,vehicle_id=?,due_on=?,subtotal_minor=?,total_minor=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(customerId,vehicleId,returned,subtotal,total,invoiceStatus,invoice.id));
  }
  await env.DB.batch(statements);
  if(rentalReference)await syncRentalReferenceSequence(env.DB,rentalReference);
  await audit(env.DB,data.staff,'rental.updated','rental',rentalId,{customer_id:customerId,vehicle_id:vehicleId,pickup_date:pickup,return_date:returned,billable_days:days,daily_rate_minor:rate,invoice_number:invoiceNumber,total_minor:updatedTotal});
  return json({data:{rental_id:rentalId,rental_reference:rentalReference||rental.rental_reference||null,customer_id:customerId,vehicle_id:vehicleId,pickup_date:pickup,return_date:returned,billable_days:days,daily_rate_minor:rate,invoice_number:invoiceNumber,total_minor:updatedTotal,updated:true}});
 }catch(e){return errorResponse(e)}
}


export async function onRequestDelete({env,data,request}){
 if(!requireRole(data.staff,writeRoles))return json({error:'forbidden'},403);
 try{
  const url=new URL(request.url),rentalId=String(url.searchParams.get('id')||'').trim();
  if(!rentalId)throw Object.assign(new Error('rental_id_required'),{status:400});
  if(rentalReference!==null&&rentalReference!==''&&!validRentalReference(rentalReference))throw Object.assign(new Error('invalid_rental_reference_format'),{status:400});
  const rental=await env.DB.prepare('SELECT id,status FROM rentals WHERE id=?').bind(rentalId).first();
  if(!rental)throw Object.assign(new Error('rental_not_found'),{status:404});
  const invoice=await env.DB.prepare('SELECT id,invoice_number,status FROM invoices WHERE rental_id=? ORDER BY created_at DESC LIMIT 1').bind(rentalId).first();
  let paid=0;
  if(invoice){
   const payment=await env.DB.prepare('SELECT COALESCE(SUM(amount_minor),0) AS paid FROM payments WHERE invoice_id=?').bind(invoice.id).first();
   paid=Number(payment?.paid||0);
   if(paid>0)throw Object.assign(new Error('rental_has_payments_cannot_delete: this rental has recorded payments. Cancel it through the rental status action; payment history is protected.'),{status:409});
  }
  await audit(env.DB,data.staff,'rental.deleted','rental',rentalId,{invoice_id:invoice?.id||null,invoice_number:invoice?.invoice_number||null,invoice_voided_or_removed:!!invoice});
  const statements=[];
  if(invoice){
   statements.push(env.DB.prepare('DELETE FROM invoice_items WHERE invoice_id=?').bind(invoice.id));
   statements.push(env.DB.prepare('DELETE FROM invoices WHERE id=?').bind(invoice.id));
  }
  statements.push(env.DB.prepare('DELETE FROM rentals WHERE id=?').bind(rentalId));
  await env.DB.batch(statements);
  return json({data:{rental_id:rentalId,deleted:true,invoice_deleted:!!invoice}});
 }catch(e){return errorResponse(e)}
}
