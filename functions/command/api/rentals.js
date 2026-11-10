import { json, readJson, requireRole, audit, errorResponse } from './_utils.js';
const readRoles=['admin','operations','finance','read_only'];
const writeRoles=['admin','operations'];
const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(String(s||''));
const moneyMinor=(v,name)=>{const n=Number(v);if(!Number.isSafeInteger(n)||n<0)throw Object.assign(new Error(`${name} must be a non-negative integer`),{status:400});return n;};
export async function onRequestGet({env,data,request}){
 if(!requireRole(data.staff,readRoles))return json({error:'forbidden'},403);
 try{const url=new URL(request.url),limit=Math.min(500,Math.max(1,Number.parseInt(url.searchParams.get('limit')||'200',10)||200));const rows=await env.DB.prepare(`SELECT r.id,r.customer_id,c.full_name AS customer_name,r.vehicle_id,v.name AS vehicle_name,v.registration_number,r.pickup_date,r.return_date,r.daily_rate_minor,r.billable_days,r.status,r.notes,r.created_at,i.id AS invoice_id,i.invoice_number,i.total_minor AS invoice_total_minor,i.status AS invoice_status,COALESCE((SELECT SUM(p.amount_minor) FROM payments p WHERE p.invoice_id=i.id),0) AS paid_minor FROM rentals r JOIN customers c ON c.id=r.customer_id JOIN vehicles v ON v.id=r.vehicle_id LEFT JOIN invoices i ON i.rental_id=r.id ORDER BY r.created_at DESC LIMIT ?`).bind(limit).all();return json({data:rows.results||[],limit});}catch(e){return errorResponse(e)}
}
export async function onRequestPost({env,data,request}){
 if(!requireRole(data.staff,writeRoles))return json({error:'forbidden'},403);
 try{
  const b=await readJson(request),customerId=String(b.customer_id||''),vehicleId=String(b.vehicle_id||''),pickup=String(b.pickup_date||''),returned=String(b.return_date||''),status=String(b.status||'upcoming'),notes=String(b.notes||'').trim().slice(0,3000),rate=moneyMinor(b.daily_rate_minor,'daily_rate_minor');
  if(!customerId||!vehicleId)throw Object.assign(new Error('customer_id and vehicle_id are required'),{status:400});
  if(!validDate(pickup)||!validDate(returned)||returned<pickup)throw Object.assign(new Error('Valid pickup_date and return_date are required'),{status:400});
  if(!['upcoming','active','completed','cancelled'].includes(status))throw Object.assign(new Error('Invalid rental status'),{status:400});
  const [customer,vehicle]=await Promise.all([env.DB.prepare('SELECT id,full_name FROM customers WHERE id=?').bind(customerId).first(),env.DB.prepare('SELECT id,name,daily_rate_minor,status FROM vehicles WHERE id=?').bind(vehicleId).first()]);
  if(!customer)throw Object.assign(new Error('customer_not_found'),{status:404});if(!vehicle)throw Object.assign(new Error('vehicle_not_found'),{status:404});if(['inactive','maintenance'].includes(String(vehicle.status||'').toLowerCase()))throw Object.assign(new Error('vehicle_not_available_for_rental'),{status:409});
  const conflict=await env.DB.prepare("SELECT id FROM rentals WHERE vehicle_id=? AND status IN ('upcoming','active') AND pickup_date<=? AND return_date>=? LIMIT 1").bind(vehicleId,returned,pickup).first();if(conflict)throw Object.assign(new Error('vehicle_date_conflict'),{status:409});
  const days=Math.round((Date.parse(returned+'T12:00:00Z')-Date.parse(pickup+'T12:00:00Z'))/86400000)+1;if(days<1)throw Object.assign(new Error('invalid_rental_period'),{status:400});
  const total=days*rate;if(!Number.isSafeInteger(total))throw Object.assign(new Error('invoice_total_out_of_range'),{status:400});
  const rentalId=String(b.rental_id||`RNT-${crypto.randomUUID()}`),invoiceId=`INV-${crypto.randomUUID()}`,invoiceNumber=`DHG-${Date.now().toString().slice(-8)}-${crypto.randomUUID().slice(0,4).toUpperCase()}`,today=new Date().toISOString().slice(0,10),due=validDate(b.due_on)?String(b.due_on):returned;
  // Idempotency: a client retry with the same rental ID returns the existing rental/invoice instead of creating a second invoice.
  const existing=await env.DB.prepare('SELECT r.id,i.id AS invoice_id,i.invoice_number,i.total_minor FROM rentals r LEFT JOIN invoices i ON i.rental_id=r.id WHERE r.id=?').bind(rentalId).first();
  if(existing)return json({data:{rental_id:existing.id,invoice_id:existing.invoice_id,invoice_number:existing.invoice_number,total_minor:existing.total_minor,duplicate:true}},200);
  const statements=[
   env.DB.prepare('INSERT INTO rentals (id,customer_id,vehicle_id,pickup_date,return_date,daily_rate_minor,billable_days,status,notes,created_by) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(rentalId,customerId,vehicleId,pickup,returned,rate,days,status,notes||null,data.staff.id),
   env.DB.prepare("INSERT INTO invoices (id,invoice_number,customer_id,rental_id,vehicle_id,issued_on,due_on,currency,subtotal_minor,discount_minor,total_minor,status,notes,created_by) VALUES (?,?,?,?,?,?,?,'GHS',?,0,?,'issued',?,?)").bind(invoiceId,invoiceNumber,customerId,rentalId,vehicleId,today,due,total,total,`Automatically generated from rental ${rentalId}.`,data.staff.id),
   env.DB.prepare('INSERT INTO invoice_items (id,invoice_id,description,quantity,unit_amount_minor,line_total_minor) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),invoiceId,`Vehicle rental — ${days} billable day(s)`,days,rate,total)
  ];
  await env.DB.batch(statements);await audit(env.DB,data.staff,'rental.created_with_invoice','rental',rentalId,{invoice_id:invoiceId,invoice_number:invoiceNumber,customer_id:customerId,vehicle_id:vehicleId,total_minor:total});
  return json({data:{rental_id:rentalId,invoice_id:invoiceId,invoice_number:invoiceNumber,customer_id:customerId,vehicle_id:vehicleId,pickup_date:pickup,return_date:returned,billable_days:days,daily_rate_minor:rate,total_minor:total,paid_minor:0,balance_minor:total,invoice_status:'issued',status}},201);
 }catch(e){return errorResponse(e)}
}


export async function onRequestDelete({env,data,request}){
 if(!requireRole(data.staff,writeRoles))return json({error:'forbidden'},403);
 if(!env.DB)return json({error:'database_not_configured'},503);
 try{
  const url=new URL(request.url),body=await readJson(request).catch(()=>({}));
  const id=String(url.searchParams.get('id')||body.id||'').trim();
  if(!id)return json({error:'rental_id_required'},400);
  const rental=await env.DB.prepare(`SELECT id,customer_id,vehicle_id,status FROM rentals WHERE id=?`).bind(id).first();
  if(!rental)return json({error:'rental_not_found'},404);
  const linked=await env.DB.prepare(`SELECT id,invoice_number,status,total_minor FROM invoices WHERE rental_id=? ORDER BY created_at`).bind(id).all();
  const invoices=linked.results||[];
  if(invoices.length>1)return json({error:'multiple_invoices_linked_to_rental; manual_reconciliation_required'},409);
  if(!invoices.length){
   await env.DB.batch([
    env.DB.prepare('DELETE FROM rentals WHERE id=?').bind(id),
    env.DB.prepare(`INSERT INTO audit_log (id,actor_staff_id,action,entity_type,entity_id,before_json,after_json)
      VALUES (?,?, 'rental.deleted', 'rental', ?, ?, ?)`).bind(crypto.randomUUID(),data.staff.id,id,JSON.stringify(rental),JSON.stringify({deleted:true,reason:'no linked invoice'}))
   ]);
   return json({ok:true,action:'deleted',rental_id:id});
  }
  const invoice=invoices[0];
  const payment=await env.DB.prepare('SELECT COUNT(*) AS payment_count, COALESCE(SUM(amount_minor),0) AS paid_minor FROM payments WHERE invoice_id=?').bind(invoice.id).first();
  if(Number(payment?.payment_count||0)>0){
   return json({error:'rental_has_payments_refund_or_credit_workflow_required',rental_id:id,invoice_id:invoice.id,payment_count:Number(payment.payment_count),paid_minor:Number(payment.paid_minor||0)},409);
  }
  if(String(invoice.status).toLowerCase()==='void'&&String(rental.status).toLowerCase()==='cancelled'){
   return json({ok:true,action:'already_cancelled',rental_id:id,invoice_id:invoice.id});
  }
  await env.DB.batch([
   env.DB.prepare("UPDATE rentals SET status='cancelled',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(id),
   env.DB.prepare("UPDATE invoices SET status='void',updated_at=CURRENT_TIMESTAMP WHERE id=? AND status<>'void'").bind(invoice.id),
   env.DB.prepare(`INSERT INTO audit_log (id,actor_staff_id,action,entity_type,entity_id,before_json,after_json)
    VALUES (?,?, 'rental.cancelled_invoice.voided', 'rental', ?, ?, ?)`).bind(crypto.randomUUID(),data.staff.id,id,JSON.stringify({rental_status:rental.status,invoice_status:invoice.status}),JSON.stringify({rental_status:'cancelled',invoice_status:'void',invoice_id:invoice.id}))
  ]);
  return json({ok:true,action:'cancelled',rental_id:id,invoice_id:invoice.id,invoice_status:'void'});
 }catch(e){return errorResponse(e)}
}
