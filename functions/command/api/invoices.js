import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

const readRoles = ["admin", "operations", "finance", "read_only"];
const writeRoles = ["admin", "finance", "operations"];
const statuses = ["draft", "issued"];
const validDate = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const validMoney = n => Number.isSafeInteger(n) && n >= 0;

export async function onRequestGet({ env, data, request }) {
  if (!requireRole(data.staff, readRoles)) return json({ error: "forbidden" }, 403);
  if (!env.DB) return json({ error: "database_not_configured" }, 503);
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (id) {
      const invoice = await env.DB.prepare(`
        SELECT i.*, c.full_name AS customer_name, c.email AS customer_email, c.phone AS customer_phone,
          r.pickup_date, r.return_date, v.name AS vehicle_name, v.registration_number,
          COALESCE((SELECT SUM(p.amount_minor) FROM payments p WHERE p.invoice_id=i.id),0) AS paid_minor
        FROM invoices i JOIN customers c ON c.id=i.customer_id
        LEFT JOIN rentals r ON r.id=i.rental_id LEFT JOIN vehicles v ON v.id=r.vehicle_id
        WHERE i.id=?
      `).bind(id).first();
      if (!invoice) return json({ error: "invoice_not_found" }, 404);
      const items = await env.DB.prepare("SELECT id, description, quantity, unit_price_minor, line_total_minor, position FROM invoice_items WHERE invoice_id=? ORDER BY position, created_at").bind(id).all();
      const payments = await env.DB.prepare("SELECT id, receipt_number, amount_minor, currency, payment_method, reference, received_at FROM payments WHERE invoice_id=? ORDER BY received_at DESC, created_at DESC").bind(id).all();
      return json({ invoice: { ...invoice, balance_minor: Math.max(0, invoice.total_minor - invoice.paid_minor) }, items: items.results || [], payments: payments.results || [] });
    }
    const status = url.searchParams.get("status") || "";
    if (status && !["draft", "issued", "partially_paid", "paid", "overdue", "void"].includes(status)) return json({ error: "invalid_status" }, 400);
    const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") || "100", 10) || 100));
    const rows = await env.DB.prepare(`
      SELECT i.id, i.invoice_number, i.customer_id, c.full_name AS customer_name, i.rental_id,
        i.issued_on, i.due_on, i.currency, i.subtotal_minor, i.discount_minor, i.total_minor, i.status,
        i.created_at, i.updated_at,
        COALESCE(SUM(p.amount_minor),0) AS paid_minor,
        MAX(0, i.total_minor-COALESCE(SUM(p.amount_minor),0)) AS balance_minor
      FROM invoices i JOIN customers c ON c.id=i.customer_id
      LEFT JOIN payments p ON p.invoice_id=i.id
      WHERE (? = '' OR i.status = ?)
      GROUP BY i.id ORDER BY i.issued_on DESC, i.created_at DESC LIMIT ?
    `).bind(status, status, limit).all();
    return json({ invoices: rows.results || [] });
  } catch (error) { return errorResponse(error); }
}

export async function onRequestPost({ env, data, request }) {
  if (!requireRole(data.staff, writeRoles)) return json({ error: "forbidden" }, 403);
  if (!env.DB) return json({ error: "database_not_configured" }, 503);
  try {
    const body = await readJson(request);
    const invoiceNumber = String(body.invoice_number || "").trim();
    const customerId = String(body.customer_id || "").trim();
    const issuedOn = body.issued_on;
    const dueOn = body.due_on || null;
    const status = body.status || "issued";
    const discount = body.discount_minor ?? 0;
    const notes = body.notes == null ? null : String(body.notes).trim().slice(0, 2000);
    const items = body.items;
    if (!invoiceNumber || invoiceNumber.length > 64 || !/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(invoiceNumber)) return json({ error: "invalid_invoice_number" }, 400);
    if (!customerId) return json({ error: "customer_required" }, 400);
    if (!validDate(issuedOn) || (dueOn && !validDate(dueOn)) || (dueOn && dueOn < issuedOn)) return json({ error: "invalid_invoice_dates" }, 400);
    if (!statuses.includes(status)) return json({ error: "invalid_invoice_status" }, 400);
    if (!validMoney(discount)) return json({ error: "invalid_discount" }, 400);
    if (!Array.isArray(items) || items.length < 1 || items.length > 100) return json({ error: "invoice_items_required" }, 400);
    const normalized = [];
    let subtotal = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i] || {};
      const description = String(item.description || "").trim();
      const quantity = item.quantity;
      const unit = item.unit_price_minor;
      if (!description || description.length > 500 || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100000 || !validMoney(unit)) return json({ error: "invalid_invoice_item", item_index: i }, 400);
      const line = quantity * unit;
      if (!Number.isSafeInteger(line) || !Number.isSafeInteger(subtotal + line)) return json({ error: "invoice_total_out_of_range" }, 400);
      subtotal += line;
      normalized.push({ id: crypto.randomUUID(), description, quantity, unit_price_minor: unit, line_total_minor: line, position: i });
    }
    if (discount > subtotal) return json({ error: "discount_exceeds_subtotal" }, 400);
    const total = subtotal - discount;
    const customer = await env.DB.prepare("SELECT id FROM customers WHERE id=?").bind(customerId).first();
    if (!customer) return json({ error: "customer_not_found" }, 404);
    const rentalId = body.rental_id ? String(body.rental_id).trim() : null;
    if (rentalId) {
      const rental = await env.DB.prepare("SELECT id, customer_id FROM rentals WHERE id=?").bind(rentalId).first();
      if (!rental) return json({ error: "rental_not_found" }, 404);
      if (rental.customer_id !== customerId) return json({ error: "rental_customer_mismatch" }, 400);
    }
    const id = crypto.randomUUID();
    const staffId = data.staff?.id;
    const statements = [env.DB.prepare(`INSERT INTO invoices
      (id, invoice_number, customer_id, rental_id, issued_on, due_on, currency, subtotal_minor, discount_minor, total_minor, status, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, 'GHS', ?, ?, ?, ?, ?, ?)`)
      .bind(id, invoiceNumber, customerId, rentalId, issuedOn, dueOn, subtotal, discount, total, status, notes, staffId)];
    for (const item of normalized) statements.push(env.DB.prepare(`INSERT INTO invoice_items
      (id, invoice_id, description, quantity, unit_price_minor, line_total_minor, position)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(item.id, id, item.description, item.quantity, item.unit_price_minor, item.line_total_minor, item.position));
    statements.push(env.DB.prepare(`INSERT INTO audit_log (id, actor_staff_id, action, entity_type, entity_id, after_json)
      VALUES (?, ?, 'invoice.created', 'invoice', ?, ?)`)
      .bind(crypto.randomUUID(), staffId, id, JSON.stringify({ invoice_number: invoiceNumber, customer_id: customerId, total_minor: total, status })));
    await env.DB.batch(statements);
    return json({ ok: true, id, invoice_number: invoiceNumber, subtotal_minor: subtotal, discount_minor: discount, total_minor: total, status }, 201);
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE constraint failed: invoices.invoice_number")) return json({ error: "invoice_number_already_exists" }, 409);
    return errorResponse(error);
  }
}
