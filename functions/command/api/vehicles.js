import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

const validStatuses = ["available", "reserved", "rented", "maintenance", "inactive"];

// Public catalogue currently shown on fleet.html and find-your-ride.html.
// Rates are GHS/day. D1 stores monetary amounts in minor units (pesewas).
// These records are synchronised into the Command Centre inventory on read,
// so staff do not need to recreate the public catalogue by hand.
const PUBLIC_FLEET = [
  { key: "TOYOTA-PRADO", name: "Toyota Prado", rateGhs: 1500 },
  { key: "MITSUBISHI-OUTLANDER", name: "Mitsubishi Outlander", rateGhs: 800 },
  { key: "TOYOTA-RAV4", name: "Toyota RAV4", rateGhs: 800 },
  { key: "HYUNDAI-SANTA-FE", name: "Hyundai Santa Fe", rateGhs: 800 },
  { key: "HONDA-CR-V", name: "Honda CR-V", rateGhs: 1000 },
  { key: "TOYOTA-LAND-CRUISER-V8", name: "Toyota Land Cruiser V8", rateGhs: 2000 },
  { key: "ACURA-MDX", name: "Acura MDX", rateGhs: 1000 }
];

async function syncPublicFleetToD1(db) {
  for (const vehicle of PUBLIC_FLEET) {
    const id = `PUBLIC-${vehicle.key}`;
    const rateMinor = Math.round(vehicle.rateGhs * 100);

    // First create the public vehicle if it is not already represented in D1.
    // Deterministic IDs make repeated requests idempotent. No registration
    // number is invented; operational status defaults to available only on
    // first creation and is never reset on later reads.
    await db.prepare(`
      INSERT INTO vehicles (id, name, registration_number, daily_rate_minor, status, notes)
      SELECT ?, ?, NULL, ?, 'available', 'Synced from the public website fleet catalogue.'
      WHERE NOT EXISTS (
        SELECT 1 FROM vehicles
        WHERE lower(trim(name)) = lower(trim(?))
      )
    `).bind(id, vehicle.name, rateMinor, vehicle.name).run();

    // Keep the starting price aligned with the public catalogue while
    // preserving the D1 vehicle's ID, registration, status and service date.
    await db.prepare(`
      UPDATE vehicles
      SET daily_rate_minor = ?, updated_at = CURRENT_TIMESTAMP
      WHERE lower(trim(name)) = lower(trim(?))
    `).bind(rateMinor, vehicle.name).run();
  }
}

export async function onRequestGet({ env, data, request }) {
  if (!requireRole(data.staff, ["admin", "operations", "finance", "review_moderator", "read_only"])) return json({ error: "forbidden" }, 403);
  try {
    await syncPublicFleetToD1(env.DB);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "";
    if (status && !validStatuses.includes(status)) return json({ error: "invalid_status" }, 400);
    const rows = await env.DB.prepare(
      "SELECT id, name, registration_number, daily_rate_minor, status, service_due_on, notes, created_at, updated_at FROM vehicles WHERE (? = '' OR status = ?) ORDER BY name LIMIT 200"
    ).bind(status, status).all();
    return json({ data: rows.results || [], synced_public_catalogue: true });
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
    if (plate && plate.length > 32) return json({ error: "registration number too long" }, 400);
    if (!Number.isSafeInteger(rate) || rate < 0) return json({ error: "daily_rate_minor must be a non-negative integer" }, 400);
    if (!validStatuses.includes(status)) return json({ error: "invalid_status" }, 400);
    if (serviceDue && !/^\d{4}-\d{2}-\d{2}$/.test(serviceDue)) return json({ error: "service_due_on must use YYYY-MM-DD" }, 400);
    if (notes && notes.length > 3000) return json({ error: "notes too long" }, 400);

    // If the public catalogue already created this model, update that record
    // rather than creating a second copy with the same name.
    const existing = await env.DB.prepare("SELECT id FROM vehicles WHERE lower(trim(name)) = lower(trim(?)) LIMIT 1").bind(name).first();
    if (existing) {
      await env.DB.prepare("UPDATE vehicles SET registration_number = COALESCE(?, registration_number), daily_rate_minor = ?, status = ?, service_due_on = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .bind(plate, rate, status, serviceDue, notes, existing.id).run();
      await audit(env.DB, data.staff, "vehicle.updated", "vehicle", existing.id, { name, registration_number: plate, daily_rate_minor: rate, status });
      const updated = await env.DB.prepare("SELECT id, name, registration_number, daily_rate_minor, status, service_due_on, notes, created_at, updated_at FROM vehicles WHERE id = ?").bind(existing.id).first();
      return json({ data: updated, updated: true });
    }

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
