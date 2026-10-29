import { json, readJson, requireRole, audit, errorResponse } from './_utils.js';
const readable=['admin','operations','finance','read_only'];
export async function onRequestGet({env,data}){
 if(!requireRole(data.staff,readable))return json({error:'forbidden'},403);
 const rows=await env.DB.prepare('SELECT r.*,p.company_name AS partner_name FROM partner_rentals r JOIN rental_partners p ON p.id=r.partner_id ORDER BY r.created_at DESC LIMIT 500').all();return json({data:rows.results||[]});
}
export async function onRequestPost({env,data,request}){
 if(!requireRole(data.staff,['admin','operations']))return json({error:'forbidden'},403);
 try{const b=await readJson(request),customer=String(b.customer_name||'').trim(),partner=String(b.partner_id||''),vehicle=String(b.vehicle_name||'').trim(),plate=String(b.registration_number||'').trim().toUpperCase()||null,pickup=String(b.pickup_date||''),returned=String(b.return_date||''),days=Number(b.billable_days),customerRate=Number(b.customer_daily_rate_minor),supplierRate=Number(b.supplier_daily_rate_minor),status=String(b.status||'upcoming');
 if(customer.length<2||!partner||vehicle.length<2||!/^\d{4}-\d{2}-\d{2}$/.test(pickup)||!/^\d{4}-\d{2}-\d{2}$/.test(returned)||returned<pickup||!Number.isSafeInteger(days)||days<1||!Number.isSafeInteger(customerRate)||customerRate<0||!Number.isSafeInteger(supplierRate)||supplierRate<0||!['upcoming','active','completed','cancelled'].includes(status))return json({error:'Invalid partner rental details'},400);
 const p=await env.DB.prepare("SELECT id FROM rental_partners WHERE id=? AND status='active'").bind(partner).first();if(!p)return json({error:'active_partner_not_found'},400);
 const conflict=await env.DB.prepare("SELECT booking_reference FROM partner_rentals WHERE vehicle_name=? AND status IN ('upcoming','active') AND pickup_date<=? AND return_date>=? LIMIT 1").bind(vehicle,returned,pickup).first();if(conflict)return json({error:'sourced_vehicle_date_conflict',conflicting_booking:conflict.booking_reference},409);
 const id='PRNT-'+crypto.randomUUID(),ref=String(b.booking_reference||('DH-PS-'+Date.now()));const customerTotal=days*customerRate,supplierTotal=days*supplierRate;
 await env.DB.prepare('INSERT INTO partner_rentals (id,booking_reference,customer_name,partner_id,vehicle_name,registration_number,pickup_date,return_date,billable_days,customer_daily_rate_minor,supplier_daily_rate_minor,customer_total_minor,supplier_total_minor,status,notes,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,ref,customer,partner,vehicle,plate,pickup,returned,days,customerRate,supplierRate,customerTotal,supplierTotal,status,b.notes||null,data.staff.id).run();
 await audit(env.DB,data.staff,'partner_rental.created','partner_rental',id,{booking_reference:ref,partner_id:partner,vehicle_name:vehicle,customer_total_minor:customerTotal,supplier_total_minor:supplierTotal});return json({data:{id,booking_reference:ref,customer_name:customer,partner_id:partner,vehicle_name:vehicle,registration_number:plate,pickup_date:pickup,return_date:returned,billable_days:days,customer_daily_rate_minor:customerRate,supplier_daily_rate_minor:supplierRate,customer_total_minor:customerTotal,supplier_total_minor:supplierTotal,status}},201);
 }catch(e){return errorResponse(e)}
}
