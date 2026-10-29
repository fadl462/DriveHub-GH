import { json, readJson, requireRole, audit, errorResponse } from './_utils.js';
const readRoles=['admin','operations','finance','read_only'];
export async function onRequestGet({env,data,request}){
 if(!requireRole(data.staff,readRoles)) return json({error:'forbidden'},403);
 const url=new URL(request.url), status=url.searchParams.get('status')||'';
 if(status&&!['active','inactive'].includes(status)) return json({error:'invalid_status'},400);
 const rows=await env.DB.prepare("SELECT p.*, (SELECT COUNT(*) FROM sourced_vehicles v WHERE v.partner_id=p.id) AS sourced_vehicle_count, (SELECT COALESCE(SUM(sp.amount_minor),0) FROM supplier_payments sp WHERE sp.partner_id=p.id) AS payments_total_minor FROM rental_partners p WHERE (?='' OR p.status=?) ORDER BY p.created_at DESC LIMIT 300").bind(status,status).all();
 return json({data:rows.results||[]});
}
export async function onRequestPost({env,data,request}){
 if(!requireRole(data.staff,['admin','operations'])) return json({error:'forbidden'},403);
 try{const b=await readJson(request);const company=String(b.company_name||'').trim();if(company.length<2||company.length>180)return json({error:'company_name must be 2–180 characters'},400);
 const values=['contact_name','phone','email','address','payment_terms','payment_details','notes'].map(k=>b[k]==null?'':String(b[k]).trim());
 if(values.some(v=>v.length>2000))return json({error:'One or more fields are too long'},400);
 const id='PARTNER-'+crypto.randomUUID();await env.DB.prepare('INSERT INTO rental_partners (id,company_name,contact_name,phone,email,address,payment_terms,payment_details,notes) VALUES (?,?,?,?,?,?,?,?,?)').bind(id,company,...values).run();
 await audit(env.DB,data.staff,'partner.created','rental_partner',id,{company_name:company});return json({data:{id,company_name:company,contact_name:values[0],phone:values[1],email:values[2],address:values[3],payment_terms:values[4],payment_details:values[5],notes:values[6],status:'active'}},201);
 }catch(e){return errorResponse(e)}
}
