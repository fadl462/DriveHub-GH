import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";
const readRoles=["admin","operations","finance","read_only"];
const writeRoles=["admin","operations","finance"];
const minor=(v,name,{optional=false}={})=>{if(optional&&(v===null||v===undefined||v===""))return 0;const n=Number(v);if(!Number.isSafeInteger(n)||n<0)throw Object.assign(new Error(`${name} must be a non-negative integer`),{status:400});return n;};
export async function onRequestGet({env,data,request}){if(!requireRole(data.staff,readRoles))return json({error:"forbidden"},403);try{const url=new URL(request.url),limit=Math.min(200,Math.max(1,Number.parseInt(url.searchParams.get("limit")||"100",10)||100));const rows=await env.DB.prepare(`SELECT i.id,i.invoice_number,i.customer_id,c.full_name AS customer_name,i.rental_id,i.issued_on,i.due_on,i.currency,i.subtotal_minor,i.discount_minor,i.total_minor,i.status,i.notes,i.created_at,COALESCE((SELECT SUM(p.amount_minor) FROM payments p WHERE p.invoice_id=i.id),0) AS paid_minor, r.id AS rental_reference,r.pickup_date,r.return_date,r.billable_days,r.daily_rate_minor,v.id AS vehicle_id,v.name AS vehicle_name,v.registration_number FROM invoices i JOIN customers c ON c.id=i.customer_id LEFT JOIN rentals r ON r.id=i.rental_id LEFT JOIN vehicles v ON v.id=COALESCE(i.vehicle_id,r.vehicle_id) ORDER BY i.created_at DESC LIMIT ?`).bind(limit).all();return json({data:rows.results||[],limit});}catch(e){return errorResponse(e)}}
export async function onRequestPost(){
 return json({error:"invoices_are_created_automatically_from_rentals"},405);
}
