import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

const canRead = ["admin", "operations", "finance", "review_moderator", "read_only"];
const canWrite = ["admin", "operations"];

function cleanCustomer(body) {
  const fullName = String(body.full_name || "").trim();
  const email = body.email == null || body.email === "" ? null : String(body.email).trim().toLowerCase();
  const phone = body.phone == null || body.phone === "" ? null : String(body.phone).trim();
  const notes = body.notes == null || body.notes === "" ? null : String(body.notes).trim();
  if (fullName.length < 2 || fullName.length > 160) return { error: "full_name must be 2–160 characters" };
  if (!email && !phone) return { error: "email_or_phone_required" };
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return { error: "valid email required" };
  if (phone && phone.length > 40) return { error: "phone too long" };
  if (notes && notes.length > 3000) return { error: "notes too long" };
  return { fullName, email, phone, notes };
}

export async function onRequestGet({ env, data, request }) {
  if (!requireRole(data.staff, canRead)) return json({ error: "forbidden" }, 403);
  const url = new URL(request.url);
  const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get("limit") || "50", 10) || 50));
  const q = (url.searchParams.get("q") || "").trim().slice(0, 100);
  try {
    const rows = await env.DB.prepare(
      "SELECT id, full_name, email, phone, notes, created_at, updated_at FROM customers WHERE archived_at IS NULL AND (? = '' OR full_name LIKE ? OR email LIKE ? OR phone LIKE ?) ORDER BY created_at DESC LIMIT ?"
    ).bind(q, `%${q}%`, `%${q}%`, `%${q}%`, limit).all();
    return json({ data: rows.results || [], limit });
  } catch (error) { return errorResponse(error); }
}

export async function onRequestPost({ env, data, request }) {
  if (!requireRole(data.staff, canWrite)) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const customer = cleanCustomer(body);
    if (customer.error) return json({ error: customer.error }, 400);
    const id = `CUS-${crypto.randomUUID()}`;
    await env.DB.prepare("INSERT INTO customers (id, full_name, email, phone, notes) VALUES (?, ?, ?, ?, ?)")
      .bind(id, customer.fullName, customer.email, customer.phone, customer.notes).run();
    await audit(env.DB, data.staff, "customer.created", "customer", id, { full_name: customer.fullName, email: customer.email, phone: customer.phone });
    return json({ data: { id, full_name: customer.fullName, email: customer.email, phone: customer.phone, notes: customer.notes } }, 201);
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE")) return json({ error: "duplicate_customer_value" }, 409);
    return errorResponse(error);
  }
}

export async function onRequestPut({ env, data, request }) {
  if (!requireRole(data.staff, canWrite)) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const id = String(body.id || "").trim();
    if (!id) return json({ error: "customer_id_required" }, 400);
    const customer = cleanCustomer(body);
    if (customer.error) return json({ error: customer.error }, 400);
    const existing = await env.DB.prepare("SELECT id FROM customers WHERE id = ? AND archived_at IS NULL").bind(id).first();
    if (!existing) return json({ error: "customer_not_found" }, 404);
    await env.DB.prepare("UPDATE customers SET full_name = ?, email = ?, phone = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND archived_at IS NULL")
      .bind(customer.fullName, customer.email, customer.phone, customer.notes, id).run();
    await audit(env.DB, data.staff, "customer.updated", "customer", id, { full_name: customer.fullName, email: customer.email, phone: customer.phone });
    return json({ data: { id, full_name: customer.fullName, email: customer.email, phone: customer.phone, notes: customer.notes } });
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE")) return json({ error: "duplicate_customer_value" }, 409);
    return errorResponse(error);
  }
}

export async function onRequestDelete({ env, data, request }) {
  if (!requireRole(data.staff, canWrite)) return json({ error: "forbidden" }, 403);
  try {
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!id) return json({ error: "customer_id_required" }, 400);
    const customer = await env.DB.prepare("SELECT id, full_name FROM customers WHERE id = ? AND archived_at IS NULL").bind(id).first();
    if (!customer) return json({ error: "customer_not_found" }, 404);
    // Archive rather than hard-delete: rental, invoice, payment and review records remain intact.
    await env.DB.prepare("UPDATE customers SET archived_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
    await audit(env.DB, data.staff, "customer.archived", "customer", id, { full_name: customer.full_name });
    return json({ data: { id, archived: true, message: "Customer archived; all linked rental and financial history has been preserved." } });
  } catch (error) { return errorResponse(error); }
}
