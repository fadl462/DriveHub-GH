import { json, readJson, requireRole, audit, errorResponse } from './_utils.js';
const readRoles=['admin','operations','finance','read_only'];
export async function onRequestGet({env,data,request}){
 if(!requireRole(data.staff,readRoles))return json({error:'forbidden'},403);
 const url=new URL(request.url), status=url.searchParams.get('status')||'';
 const rows=await env.DB.prepare("SELECT v.*,p.company_name AS partner_name FROM sourced_vehicles v JOIN rental_partners p ON p.id=v.partner_id WHERE (?='' OR v.status=?) ORDER BY v.created_at DESC LIMIT 300").bind(status,status).all();return json({data:rows.results||[]});
}
export async function onRequestPost({env,data,request}){
 if(!requireRole(data.staff,['admin','operations']))return json({error:'forbidden'},403);
 try{const b=await readJson(request),partner=String(b.partner_id||''),name=String(b.vehicle_name||'').trim(),plate=String(b.registration_number||'').trim().toUpperCase()||null,supplier=Number(b.supplier_daily_rate_minor),customer=Number(b.customer_daily_rate_minor),from=b.available_from||null,to=b.available_to||null,notes=String(b.notes||'').trim()||null;
 if(!partner||name.length<2||!Number.isSafeInteger(supplier)||supplier<0||!Number.isSafeInteger(customer)||customer<0)return json({error:'Partner, vehicle name and valid daily rates are required'},400);
 if(from&&to&&to<from)return json({error:'available_to must be on or after available_from'},400);
 const found=await env.DB.prepare("SELECT id FROM rental_partners WHERE id=? AND status='active'").bind(partner).first();if(!found)return json({error:'active_partner_not_found'},400);
 const id='SRC-'+crypto.randomUUID();await env.DB.prepare('INSERT INTO sourced_vehicles (id,partner_id,vehicle_name,registration_number,supplier_daily_rate_minor,customer_daily_rate_minor,available_from,available_to,notes) VALUES (?,?,?,?,?,?,?,?,?)').bind(id,partner,name,plate,supplier,customer,from,to,notes).run();
 await audit(env.DB,data.staff,'sourced_vehicle.created','sourced_vehicle',id,{partner_id:partner,vehicle_name:name,registration_number:plate});return json({data:{id,partner_id:partner,vehicle_name:name,registration_number:plate,supplier_daily_rate_minor:supplier,customer_daily_rate_minor:customer,available_from:from,available_to:to,status:'available',notes}},201);
 }catch(e){return errorResponse(e)}
}
