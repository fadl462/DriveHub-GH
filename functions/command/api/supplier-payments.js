import { json, readJson, requireRole, audit, errorResponse } from './_utils.js';
export async function onRequestGet({env,data}){
 if(!requireRole(data.staff,['admin','operations','finance','read_only']))return json({error:'forbidden'},403);
 const rows=await env.DB.prepare('SELECT sp.*,p.company_name AS partner_name FROM supplier_payments sp JOIN rental_partners p ON p.id=sp.partner_id ORDER BY sp.paid_on DESC,sp.created_at DESC LIMIT 500').all();return json({data:rows.results||[]});
}
export async function onRequestPost({env,data,request}){
 if(!requireRole(data.staff,['admin','finance']))return json({error:'forbidden'},403);
 try{const b=await readJson(request),partner=String(b.partner_id||''),amount=Number(b.amount_minor),date=String(b.paid_on||''),method=String(b.payment_method||'').trim(),ref=String(b.payment_reference||'').trim()||null,notes=String(b.notes||'').trim()||null;
 if(!partner||!Number.isSafeInteger(amount)||amount<=0||!/^\d{4}-\d{2}-\d{2}$/.test(date)||method.length<2)return json({error:'Partner, positive amount, payment date and method are required'},400);
 const exists=await env.DB.prepare('SELECT id FROM rental_partners WHERE id=?').bind(partner).first();if(!exists)return json({error:'partner_not_found'},404);
 const id='SPAY-'+crypto.randomUUID();await env.DB.prepare('INSERT INTO supplier_payments (id,partner_id,amount_minor,payment_method,payment_reference,paid_on,notes,recorded_by) VALUES (?,?,?,?,?,?,?,?)').bind(id,partner,amount,method,ref,date,notes,data.staff.id).run();
 await audit(env.DB,data.staff,'supplier_payment.recorded','supplier_payment',id,{partner_id:partner,amount_minor:amount,paid_on:date});return json({data:{id,partner_id:partner,amount_minor:amount,payment_method:method,payment_reference:ref,paid_on:date,notes}},201);
 }catch(e){return errorResponse(e)}
}
