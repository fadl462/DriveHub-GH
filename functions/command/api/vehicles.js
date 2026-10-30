import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

const validStatuses = ["available", "reserved", "rented", "maintenance", "inactive"];

// Canonical public fleet catalogue. D1 stores prices in pesewas.
const PUBLIC_FLEET = [
  { key: "TOYOTA-PRADO", name: "Toyota Prado", aliases: [], rateGhs: 1500 },
  { key: "MITSUBISHI-OUTLANDER-SILVER-METALLIC", name: "Mitsubishi Outlander (Silver Metallic)", aliases: ["Mitsubishi Outlander", "Mitsubishi Outlander - Silver Metallic"], rateGhs: 800 },
  { key: "TOYOTA-RAV4", name: "Toyota RAV4", aliases: [], rateGhs: 800 },
  { key: "HYUNDAI-SANTAFE-SILVER-METALLIC", name: "Hyundai Santafe (Silver Metallic)", aliases: ["Hyundai Santa Fe", "Santafe (Silver Metallic)", "Hyundai Santa Fe (Silver Metallic)"], rateGhs: 800 },
  { key: "HONDA-CR-V", name: "Honda CR-V", aliases: [], rateGhs: 1000 },
  { key: "TOYOTA-LAND-CRUISER-V8", name: "Toyota Land Cruiser V8", aliases: [], rateGhs: 2000 },
  { key: "ACURA-MDX", name: "Acura MDX", aliases: [], rateGhs: 1000 }
];

const normalize = value => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

async function syncPublicFleetToD1(db) {
  for (const vehicle of PUBLIC_FLEET) {
    const rateMinor = Math.round(vehicle.rateGhs * 100);
    const names = [vehicle.name, ...vehicle.aliases];
    const placeholders = names.map(() => "?").join(", ");
    const existingRows = await db.prepare(
      `SELECT id, name, registration_number, status, service_due_on, notes
       FROM vehicles WHERE lower(trim(name)) IN (${placeholders}) ORDER BY
       CASE WHEN lower(trim(name)) = lower(trim(?)) THEN 0 ELSE 1 END, created_at`
    ).bind(...names.map(n => n.toLowerCase()), vehicle.name).all();

    const rows = existingRows.results || [];
    if (!rows.length) {
      const id = `PUBLIC-${vehicle.key}`;
      await db.prepare(`
        INSERT INTO vehicles (id, name, registration_number, daily_rate_minor, status, notes)
        SELECT ?, ?, NULL, ?, 'available', 'Synced from the public website fleet catalogue.'
        WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE lower(trim(name)) = lower(trim(?)))
      `).bind(id, vehicle.name, rateMinor, vehicle.name).run();
    } else {
      // Rename one matching record to the canonical model label while retaining its
      // ID, registration, status, service date, notes and any rental relationships.
      // Other same-model rows are intentionally not deleted automatically: they may
      // represent separate physical vehicles with their own plates/history.
      const chosen = rows.find(row => normalize(row.name) === normalize(vehicle.name)) || rows[0];
      if (chosen.name !== vehicle.name) {
        await db.prepare("UPDATE vehicles SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
          .bind(vehicle.name, chosen.id).run();
      }
      await db.prepare("UPDATE vehicles SET daily_rate_minor = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .bind(rateMinor, chosen.id).run();
    }
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
