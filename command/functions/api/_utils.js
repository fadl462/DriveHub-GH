export const json = (body, status=200) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
export const readJson = async request => {
  const type = request.headers.get("content-type") || "";
  if (!type.toLowerCase().includes("application/json")) throw Object.assign(new Error("Content-Type must be application/json"), { status: 415 });
  const raw = await request.text();
  if (raw.length > 20000) throw Object.assign(new Error("Request body too large"), { status: 413 });
  try { return JSON.parse(raw); } catch { throw Object.assign(new Error("Invalid JSON"), { status: 400 }); }
};
export const requireRole = (staff, roles) => roles.includes(staff?.role);
export const audit = async (db, staff, action, entityType, entityId, after) => {
  await db.prepare(
    "INSERT INTO audit_log (id, actor_staff_id, action, entity_type, entity_id, after_json) VALUES (?, ?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), staff.id, action, entityType, entityId, JSON.stringify(after ?? null)).run();
};
export const errorResponse = error => json({ error: error?.message || "internal_error" }, error?.status || 500);
