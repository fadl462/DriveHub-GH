import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

const validStatuses = ["available", "reserved", "rented", "maintenance", "inactive"];

export async function onRequestGet({ env, data, request }) {
  if (!requireRole(data.staff, ["admin", "operations", "finance", "review_moderator", "read_only"])) return json({ error: "forbidden" }, 403);
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "";
    if (status && !validStatuses.includes(status)) return json({ error: "invalid_status" }, 400);
    const rows = await env.DB.prepare(
      `SELECT id, name, registration_number, daily_rate_minor, status, service_due_on, notes, created_at, updated_at
       FROM vehicles WHERE (? = '' OR status = ?) AND id NOT LIKE 'PUBLIC-%' AND COALESCE(notes, '') <> 'Synced from the public website fleet catalogue.' AND registration_number IS NOT NULL AND trim(registration_number) <> '' ORDER BY name, registration_number LIMIT 500`
    ).bind(status, status).all();
    return json({ data: rows.results || [], source: "operational_fleet" });
  } catch (error) {
    return errorResponse(error);
  }
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
    if (!plate) return json({ error: "registration_number_required_for_operational_vehicle" }, 400);
    if (plate.length > 32) return json({ error: "registration number too long" }, 400);
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


export async function onRequestPut({ env, data, request }) {
  if (!requireRole(data.staff, ["admin", "operations"])) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const id = String(body.id || "").trim();
    const name = String(body.name || "").trim();
    const plate = body.registration_number == null || body.registration_number === "" ? null : String(body.registration_number).trim().toUpperCase();
    const rate = Number(body.daily_rate_minor);
    const status = String(body.status || "available");
    const serviceDue = body.service_due_on == null || body.service_due_on === "" ? null : String(body.service_due_on);
    const notes = body.notes == null || body.notes === "" ? null : String(body.notes).trim();
    if (!id) return json({ error: "vehicle_id_required" }, 400);
    if (name.length < 2 || name.length > 160) return json({ error: "name must be 2–160 characters" }, 400);
    if (!plate) return json({ error: "registration_number_required_for_operational_vehicle" }, 400);
    if (plate.length > 32) return json({ error: "registration number too long" }, 400);
    if (!Number.isSafeInteger(rate) || rate < 0) return json({ error: "daily_rate_minor must be a non-negative integer" }, 400);
    if (!validStatuses.includes(status)) return json({ error: "invalid_status" }, 400);
    if (serviceDue && !/^\d{4}-\d{2}-\d{2}$/.test(serviceDue)) return json({ error: "service_due_on must use YYYY-MM-DD" }, 400);
    if (notes && notes.length > 3000) return json({ error: "notes too long" }, 400);
    const existing = await env.DB.prepare("SELECT id FROM vehicles WHERE id = ?").bind(id).first();
    if (!existing) return json({ error: "vehicle_not_found" }, 404);
    await env.DB.prepare("UPDATE vehicles SET name = ?, registration_number = ?, daily_rate_minor = ?, status = ?, service_due_on = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(name, plate, rate, status, serviceDue, notes, id).run();
    await audit(env.DB, data.staff, "vehicle.updated", "vehicle", id, { name, registration_number: plate, daily_rate_minor: rate, status, service_due_on: serviceDue });
    const updated = await env.DB.prepare("SELECT id, name, registration_number, daily_rate_minor, status, service_due_on, notes, created_at, updated_at FROM vehicles WHERE id = ?").bind(id).first();
    return json({ data: updated });
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE")) return json({ error: "registration_number_already_exists" }, 409);
    return errorResponse(error);
  }
}

export async function onRequestDelete({ env, data, request }) {
  if (!requireRole(data.staff, ["admin", "operations"])) return json({ error: "forbidden" }, 403);
  try {
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!id) return json({ error: "vehicle_id_required" }, 400);
    const vehicle = await env.DB.prepare("SELECT id, name, registration_number, status FROM vehicles WHERE id = ?").bind(id).first();
    if (!vehicle) return json({ error: "vehicle_not_found" }, 404);
    const rentalRefs = await env.DB.prepare("SELECT COUNT(*) AS n FROM rentals WHERE vehicle_id = ?").bind(id).first();
    const maintenanceRefs = await env.DB.prepare("SELECT COUNT(*) AS n FROM maintenance_records WHERE vehicle_id = ?").bind(id).first();
    if (Number(rentalRefs?.n || 0) > 0 || Number(maintenanceRefs?.n || 0) > 0) {
      await env.DB.prepare("UPDATE vehicles SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
      await audit(env.DB, data.staff, "vehicle.archived", "vehicle", id, { name: vehicle.name, rental_references: Number(rentalRefs?.n || 0), maintenance_references: Number(maintenanceRefs?.n || 0) });
      return json({ data: { id, archived: true, message: "Vehicle has historical records and was archived instead of permanently deleted." } });
    }
    await env.DB.prepare("DELETE FROM vehicles WHERE id = ?").bind(id).run();
    await audit(env.DB, data.staff, "vehicle.deleted", "vehicle", id, { name: vehicle.name, registration_number: vehicle.registration_number });
    return json({ data: { id, deleted: true } });
  } catch (error) { return errorResponse(error); }
}
