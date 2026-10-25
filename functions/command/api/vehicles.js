import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

const validStatuses = ["available", "reserved", "rented", "maintenance", "inactive"];

export async function onRequestGet({ env, data, request }) {
  if (!requireRole(data.staff, ["admin", "operations", "finance", "review_moderator", "read_only"])) return json({ error: "forbidden" }, 403);
  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "";
  if (status && !validStatuses.includes(status)) return json({ error: "invalid_status" }, 400);
  const rows = await env.DB.prepare(
    "SELECT id, name, registration_number, daily_rate_minor, status, service_due_on, notes, created_at, updated_at FROM vehicles WHERE (? = '' OR status = ?) ORDER BY name LIMIT 200"
  ).bind(status, status).all();
  return json({ data: rows.results || [] });
}

export async function onRequestPost({ env, data, request }) {
  if (!requireRole(data.staff, ["admin", "operations"])) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const name = String(body.name || "").trim();
    const plate = body.registration_number == null || body.registration_number === "" ? null : String(body.registration_number).trim().toUpperCase();
    const rate = Number(body.daily_rate_minor);
    const status = String(body.status || "available");
    const serviceDue = body.service_due_on == null || body.service_due_on === "" ? null : String(body.service_due_on);
    const notes = body.notes == null || body.notes === "" ? null : String(body.notes).trim();
    if (name.length < 2 || name.length > 160) return json({ error: "name must be 2–160 characters" }, 400);
    if (plate && plate.length > 32) return json({ error: "registration number too long" }, 400);
    if (!Number.isSafeInteger(rate) || rate < 0) return json({ error: "daily_rate_minor must be a non-negative integer" }, 400);
    if (!validStatuses.includes(status)) return json({ error: "invalid_status" }, 400);
    if (serviceDue && !/^\d{4}-\d{2}-\d{2}$/.test(serviceDue)) return json({ error: "service_due_on must use YYYY-MM-DD" }, 400);
    if (notes && notes.length > 3000) return json({ error: "notes too long" }, 400);

    const id = `VEH-${crypto.randomUUID()}`;
    await env.DB.prepare("INSERT INTO vehicles (id, name, registration_number, daily_rate_minor, status, service_due_on, notes) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(id, name, plate, rate, status, serviceDue, notes).run();
    await audit(env.DB, data.staff, "vehicle.created", "vehicle", id, { name, registration_number: plate, daily_rate_minor: rate, status });
    return json({ data: { id, name, registration_number: plate, daily_rate_minor: rate, status, service_due_on: serviceDue, notes } }, 201);
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE")) return json({ error: "registration_number_already_exists" }, 409);
    return errorResponse(error);
  }
}
