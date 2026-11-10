import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";
const readRoles=["admin","operations","finance","read_only"],writeRoles=["admin","finance"];
export async function onRequestGet({env,data,request}){
 if(!requireRole(data.staff,readRoles))return json({error:"forbidden"},403);
 try{
  const url=new URL(request.url),limit=Math.min(500,Math.max(1,Number.parseInt(url.searchParams.get("limit")||"200",10)||200));
  const invoiceId=url.searchParams.get("invoice_id")||"";
  const rows=await env.DB.prepare("SELECT p.id,p.receipt_number,p.invoice_id,p.customer_id,c.full_name AS customer_name,i.invoice_number,r.id AS rental_reference,p.amount_minor,p.currency,p.payment_method,p.reference,p.received_at,p.created_at FROM payments p JOIN customers c ON c.id=p.customer_id JOIN invoices i ON i.id=p.invoice_id LEFT JOIN rentals r ON r.id=i.rental_id WHERE (? = '' OR p.invoice_id = ?) ORDER BY p.received_at DESC,p.created_at DESC LIMIT ?").bind(invoiceId,invoiceId,limit).all();
  return json({data:rows.results||[],limit});
 }catch(e){return errorResponse(e)}
}
export async function onRequestPost({env,data,request}){
 if(!requireRole(data.staff,writeRoles))return json({error:"forbidden"},403);
 let requestKey="",requestInvoiceId="",requestCustomerId="",requestAmount=0;
 try{
  const b=await readJson(request),invoiceId=String(b.invoice_id||""),customerId=String(b.customer_id||""),method=String(b.payment_method||""),received=String(b.received_at||""),reference=b.reference?String(b.reference).trim().slice(0,160):null,idempotencyKey=String(b.idempotency_key||""),amount=Number(b.amount_minor);
  requestKey=idempotencyKey;requestInvoiceId=invoiceId;requestCustomerId=customerId;requestAmount=amount;
  if(!invoiceId||!customerId)throw Object.assign(new Error("invoice_id and customer_id are required"),{status:400});
  if(idempotencyKey.length<16||idempotencyKey.length>100)throw Object.assign(new Error("A valid idempotency_key is required"),{status:400});
  if(!Number.isSafeInteger(amount)||amount<=0)throw Object.assign(new Error("amount_minor must be a positive integer"),{status:400});
  if(!["cash","bank_transfer","mobile_money","card","other"].includes(method))throw Object.assign(new Error("invalid_payment_method"),{status:400});
  if(!/^\d{4}-\d{2}-\d{2}$/.test(received))throw Object.assign(new Error("received_at must use YYYY-MM-DD"),{status:400});
  const prior=await env.DB.prepare("SELECT id,receipt_number,invoice_id,customer_id,amount_minor FROM payments WHERE idempotency_key=?").bind(idempotencyKey).first();
  if(prior){if(prior.invoice_id!==invoiceId||prior.customer_id!==customerId||Number(prior.amount_minor)!==amount)throw Object.assign(new Error("idempotency_key_reused_with_different_payment_details"),{status:409});return json({data:{id:prior.id,receipt_number:prior.receipt_number,invoice_id:prior.invoice_id,amount_minor:prior.amount_minor,duplicate:true}},200);}
  const inv=await env.DB.prepare("SELECT id,invoice_number,customer_id,rental_id,total_minor,status FROM invoices WHERE id=?").bind(invoiceId).first();
  if(!inv)throw Object.assign(new Error("invoice_not_found"),{status:404});
  if(!inv.rental_id)throw Object.assign(new Error("invoice_requires_rental"),{status:409});
  if(inv.customer_id!==customerId)throw Object.assign(new Error("payment_customer_mismatch"),{status:400});
  if(["void","draft"].includes(inv.status))throw Object.assign(new Error("invoice_not_payable"),{status:409});
  const id=`PAY-${crypto.randomUUID()}`,receipt=`DHG-R-${Date.now().toString().slice(-8)}-${crypto.randomUUID().slice(0,4).toUpperCase()}`;
  // Conditional INSERT prevents two concurrent staff sessions from allocating more than the remaining balance.
  const result=await env.DB.prepare(`INSERT INTO payments (id,receipt_number,invoice_id,customer_id,amount_minor,currency,payment_method,reference,received_at,recorded_by,idempotency_key)
   SELECT ?,?,i.id,i.customer_id,?,'GHS',?,?,?,?,? FROM invoices i
   WHERE i.id=? AND i.customer_id=? AND i.status NOT IN ('void','draft')
   AND ? <= (i.total_minor - COALESCE((SELECT SUM(p.amount_minor) FROM payments p WHERE p.invoice_id=i.id),0))`)
   .bind(id,receipt,amount,method,reference,received,data.staff.id,idempotencyKey,invoiceId,customerId,amount).run();
  if(Number(result.meta?.changes||0)!==1)throw Object.assign(new Error("payment_exceeds_balance_or_invoice_changed"),{status:409});
  const paid=await env.DB.prepare("SELECT COALESCE(SUM(amount_minor),0) AS paid_minor FROM payments WHERE invoice_id=?").bind(invoiceId).first();
  const status=Number(paid?.paid_minor||0)>=Number(inv.total_minor)?"paid":"partially_paid";
  await env.DB.prepare("UPDATE invoices SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(status,invoiceId).run();
  await audit(env.DB,data.staff,"payment.recorded","payment",id,{receipt_number:receipt,invoice_number:inv.invoice_number,amount_minor:amount});
  return json({data:{id,receipt_number:receipt,invoice_id:invoiceId,invoice_number:inv.invoice_number,amount_minor:amount,status}},201);
 }catch(e){
  if(String(e?.message||"").includes("UNIQUE")||String(e?.message||"").includes("unique constraint")){
   const bKey=requestKey;
   if(bKey){const prior=await env.DB.prepare("SELECT id,receipt_number,invoice_id,customer_id,amount_minor FROM payments WHERE idempotency_key=?").bind(bKey).first().catch(()=>null);if(prior){if(prior.invoice_id!==requestInvoiceId||prior.customer_id!==requestCustomerId||Number(prior.amount_minor)!==requestAmount)return json({error:"idempotency_key_reused_with_different_payment_details"},409);return json({data:{id:prior.id,receipt_number:prior.receipt_number,invoice_id:prior.invoice_id,amount_minor:prior.amount_minor,duplicate:true}},200);}}
  }
  return errorResponse(e)
 }
}
