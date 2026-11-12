import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";
const readRoles=["super_admin","operations_manager","rental_officer","finance_officer","read_only"];
const writeRoles=["super_admin"];
const minor=(v,name,{optional=false}={})=>{if(optional&&(v===null||v===undefined||v===""))return 0;const n=Number(v);if(!Number.isSafeInteger(n)||n<0)throw Object.assign(new Error(`${name} must be a non-negative integer`),{status:400});return n;};
export async function onRequestGet({env,data,request}){
 if(!requireRole(data.staff,readRoles))return json({error:"forbidden"},403);
 try{
  const url=new URL(request.url),id=url.searchParams.get("id");
  if(id){
   const invoice=await env.DB.prepare(`SELECT i.*,c.full_name AS customer_name,c.email AS customer_email,c.phone AS customer_phone,r.rental_reference,r.pickup_date,r.return_date,r.billable_days,r.daily_rate_minor,v.name AS vehicle_name,v.registration_number,COALESCE((SELECT SUM(p.amount_minor) FROM payments p WHERE p.invoice_id=i.id),0) AS paid_minor FROM invoices i JOIN customers c ON c.id=i.customer_id LEFT JOIN rentals r ON r.id=i.rental_id LEFT JOIN vehicles v ON v.id=COALESCE(i.vehicle_id,r.vehicle_id) WHERE i.id=?`).bind(id).first();
   if(!invoice)return json({error:"invoice_not_found"},404);
   const items=await env.DB.prepare("SELECT id,description,quantity,unit_amount_minor AS unit_price_minor,line_total_minor FROM invoice_items WHERE invoice_id=? ORDER BY created_at").bind(id).all();
   return json({invoice:{...invoice,balance_minor:Math.max(0,Number(invoice.total_minor||0)-Number(invoice.paid_minor||0))},items:items.results||[]});
  }
  const limit=Math.min(200,Math.max(1,Number.parseInt(url.searchParams.get("limit")||"100",10)||100));
  const rows=await env.DB.prepare(`SELECT i.id,i.invoice_number,i.customer_id,c.full_name AS customer_name,i.rental_id,i.issued_on,i.due_on,i.currency,i.subtotal_minor,i.discount_minor,i.total_minor,i.status,i.notes,i.created_at,r.rental_reference,COALESCE((SELECT SUM(p.amount_minor) FROM payments p WHERE p.invoice_id=i.id),0) AS paid_minor,r.pickup_date,r.return_date,r.billable_days,r.daily_rate_minor,v.id AS vehicle_id,v.name AS vehicle_name,v.registration_number FROM invoices i JOIN customers c ON c.id=i.customer_id LEFT JOIN rentals r ON r.id=i.rental_id LEFT JOIN vehicles v ON v.id=COALESCE(i.vehicle_id,r.vehicle_id) ORDER BY i.created_at DESC LIMIT ?`).bind(limit).all();
  return json({data:rows.results||[],limit});
 }catch(e){return errorResponse(e)}
}
export async function onRequestPost() {
  return json({ error: "manual_invoice_creation_disabled", message: "Invoices are generated automatically when a rental is created." }, 405);
}
