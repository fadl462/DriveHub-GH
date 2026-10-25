import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

export async function onRequestGet({ env, data, request }) {
  if (!requireRole(data.staff, ["admin", "operations", "finance", "review_moderator", "read_only"])) return json({ error: "forbidden" }, 403);
  const url = new URL(request.url);
  const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get("limit") || "50", 10) || 50));
  const q = (url.searchParams.get("q") || "").trim().slice(0, 100);
  const rows = await env.DB.prepare(
    "SELECT id, full_name, email, phone, notes, created_at, updated_at FROM customers WHERE (? = '' OR full_name LIKE ? OR email LIKE ? OR phone LIKE ?) ORDER BY created_at DESC LIMIT ?"
  ).bind(q, `%${q}%`, `%${q}%`, `%${q}%`, limit).all();
  return json({ data: rows.results || [], limit });
}

export async function onRequestPost({ env, data, request }) {
  if (!requireRole(data.staff, ["admin", "operations"])) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const fullName = String(body.full_name || "").trim();
    const email = body.email == null || body.email === "" ? null : String(body.email).trim().toLowerCase();
    const phone = body.phone == null || body.phone === "" ? null : String(body.phone).trim();
    const notes = body.notes == null || body.notes === "" ? null : String(body.notes).trim();
    if (fullName.length < 2 || fullName.length > 160) return json({ error: "full_name must be 2–160 characters" }, 400);
    if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return json({ error: "valid email required" }, 400);
    if (phone && phone.length > 40) return json({ error: "phone too long" }, 400);
    if (notes && notes.length > 3000) return json({ error: "notes too long" }, 400);

    const id = `CUS-${crypto.randomUUID()}`;
    await env.DB.prepare("INSERT INTO customers (id, full_name, email, phone, notes) VALUES (?, ?, ?, ?, ?)")
      .bind(id, fullName, email, phone, notes).run();
    await audit(env.DB, data.staff, "customer.created", "customer", id, { full_name: fullName, email, phone });
    return json({ data: { id, full_name: fullName, email, phone, notes } }, 201);
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE")) return json({ error: "duplicate_customer_value" }, 409);
    return errorResponse(error);
  }
}
