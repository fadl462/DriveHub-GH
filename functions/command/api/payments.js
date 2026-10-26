import { json, readJson, requireRole, errorResponse } from "./_utils.js";

const readRoles = ["admin", "operations", "finance", "read_only"];
const writeRoles = ["admin", "finance"];
const methods = ["cash", "bank_transfer", "mobile_money", "card", "other"];
const validDateTime = value => typeof value === "string" && !Number.isNaN(Date.parse(value)) && value.length <= 40;

export async function onRequestGet({ env, data, request }) {
  if (!requireRole(data.staff, readRoles)) return json({ error: "forbidden" }, 403);
  if (!env.DB) return json({ error: "database_not_configured" }, 503);
  try {
    const url = new URL(request.url);
    const invoiceId = url.searchParams.get("invoice_id") || "";
    const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") || "100", 10) || 100));
    const rows = await env.DB.prepare(`
      SELECT p.id, p.receipt_number, p.invoice_id, i.invoice_number, p.customer_id,
        c.full_name AS customer_name, p.amount_minor, p.currency, p.payment_method, p.reference, p.received_at, p.created_at
      FROM payments p JOIN invoices i ON i.id=p.invoice_id JOIN customers c ON c.id=p.customer_id
      WHERE (? = '' OR p.invoice_id = ?) ORDER BY p.received_at DESC, p.created_at DESC LIMIT ?
    `).bind(invoiceId, invoiceId, limit).all();
    return json({ payments: rows.results || [] });
  } catch (error) { return errorResponse(error); }
}

export async function onRequestPost({ env, data, request }) {
  if (!requireRole(data.staff, writeRoles)) return json({ error: "forbidden" }, 403);
  if (!env.DB) return json({ error: "database_not_configured" }, 503);
  try {
    const body = await readJson(request);
    const invoiceId = String(body.invoice_id || "").trim();
    const receiptNumber = String(body.receipt_number || "").trim();
    const amount = body.amount_minor;
    const method = String(body.payment_method || "").trim();
    const receivedAt = body.received_at || new Date().toISOString();
    const reference = body.reference == null ? null : String(body.reference).trim().slice(0, 200);
    if (!invoiceId) return json({ error: "invoice_required" }, 400);
    if (!receiptNumber || receiptNumber.length > 64 || !/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(receiptNumber)) return json({ error: "invalid_receipt_number" }, 400);
    if (!Number.isSafeInteger(amount) || amount <= 0) return json({ error: "invalid_payment_amount" }, 400);
    if (!methods.includes(method)) return json({ error: "invalid_payment_method" }, 400);
    if (!validDateTime(receivedAt)) return json({ error: "invalid_received_at" }, 400);
    const invoice = await env.DB.prepare(`SELECT i.id, i.customer_id, i.total_minor, i.status,
      COALESCE((SELECT SUM(p.amount_minor) FROM payments p WHERE p.invoice_id=i.id),0) AS paid_minor
      FROM invoices i WHERE i.id=?`).bind(invoiceId).first();
    if (!invoice) return json({ error: "invoice_not_found" }, 404);
    if (invoice.status === "void" || invoice.status === "draft") return json({ error: "invoice_not_payable" }, 409);
    if (amount > invoice.total_minor - invoice.paid_minor) return json({ error: "payment_exceeds_balance", balance_minor: Math.max(0, invoice.total_minor - invoice.paid_minor) }, 409);
    const id = crypto.randomUUID();
    const staffId = data.staff?.id;
    // Conditional insert rechecks the balance in SQL to prevent concurrent overpayments.
    const insert = await env.DB.prepare(`INSERT INTO payments
      (id, receipt_number, invoice_id, customer_id, amount_minor, currency, payment_method, reference, received_at, recorded_by)
      SELECT ?, ?, i.id, i.customer_id, ?, 'GHS', ?, ?, ?, ? FROM invoices i
      WHERE i.id=? AND i.status <> 'void' AND i.status <> 'draft'
      AND ? <= i.total_minor - COALESCE((SELECT SUM(p.amount_minor) FROM payments p WHERE p.invoice_id=i.id),0)`)
      .bind(id, receiptNumber, amount, method, reference, receivedAt, staffId, invoiceId, amount).run();
    if (!insert.meta?.changes) return json({ error: "balance_changed_retry" }, 409);
    const updated = await env.DB.prepare(`UPDATE invoices SET status = CASE
      WHEN (SELECT COALESCE(SUM(amount_minor),0) FROM payments WHERE invoice_id=?) >= total_minor THEN 'paid'
      WHEN (SELECT COALESCE(SUM(amount_minor),0) FROM payments WHERE invoice_id=?) > 0 THEN 'partially_paid'
      ELSE status END, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .bind(invoiceId, invoiceId, invoiceId).run();
    await env.DB.prepare(`INSERT INTO audit_log (id, actor_staff_id, action, entity_type, entity_id, after_json)
      VALUES (?, ?, 'payment.recorded', 'payment', ?, ?)`)
      .bind(crypto.randomUUID(), staffId, id, JSON.stringify({ invoice_id: invoiceId, receipt_number: receiptNumber, amount_minor: amount, payment_method: method })).run();
    const paid = invoice.paid_minor + amount;
    return json({ ok: true, id, receipt_number: receiptNumber, invoice_id: invoiceId, amount_minor: amount, paid_minor: paid, balance_minor: Math.max(0, invoice.total_minor - paid), status: paid >= invoice.total_minor ? "paid" : "partially_paid" }, 201);
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE constraint failed: payments.receipt_number")) return json({ error: "receipt_number_already_exists" }, 409);
    return errorResponse(error);
  }
}
