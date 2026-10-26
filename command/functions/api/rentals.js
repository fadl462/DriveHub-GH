import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

const readableRoles = ["admin", "operations", "finance", "review_moderator", "read_only"];
const writableRoles = ["admin", "operations"];
const activeStatuses = ["upcoming", "active"];
const allStatuses = ["upcoming", "active", "completed", "cancelled"];

function validDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}
function inclusiveDays(from, to) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000) + 1;
}
function statusFromInput(value) {
  const v = String(value || "upcoming").trim().toLowerCase();
  return allStatuses.includes(v) ? v : null;
}

export async function onRequestGet({ env, data, request }) {
  if (!requireRole(data.staff, readableRoles)) return json({ error: "forbidden" }, 403);
  try {
    const url = new URL(request.url);
    const status = String(url.searchParams.get("status") || "").toLowerCase();
    if (status && !allStatuses.includes(status)) return json({ error: "invalid_status" }, 400);
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";
    if ((from && !validDate(from)) || (to && !validDate(to)) || (from && to && from > to)) {
      return json({ error: "invalid_date_range" }, 400);
    }
    const limit = Math.min(200, Math.max(1, Number.parseInt(url.searchParams.get("limit") || "100", 10) || 100));
    const result = await env.DB.prepare(`
      SELECT r.id, r.customer_id, c.full_name AS customer_name, r.vehicle_id,
             v.name AS vehicle_name, v.registration_number, r.pickup_date, r.return_date,
             r.daily_rate_minor, r.billable_days, r.status, r.notes, r.created_at, r.updated_at
      FROM rentals r
      JOIN customers c ON c.id = r.customer_id
      JOIN vehicles v ON v.id = r.vehicle_id
      WHERE (? = '' OR r.status = ?)
        AND (? = '' OR r.pickup_date >= ?)
        AND (? = '' OR r.pickup_date <= ?)
      ORDER BY r.pickup_date DESC, r.created_at DESC
      LIMIT ?
    `).bind(status, status, from, from, to, to, limit).all();
    return json({ data: result.results || [], limit });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function onRequestPost({ env, data, request }) {
  if (!requireRole(data.staff, writableRoles)) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const customerId = String(body.customer_id || "").trim();
    const vehicleId = String(body.vehicle_id || "").trim();
    const pickup = String(body.pickup_date || "").trim();
    const returned = String(body.return_date || "").trim();
    const status = statusFromInput(body.status);
    const notes = body.notes == null ? null : String(body.notes).trim();

    if (!customerId || customerId.length > 100) return json({ error: "valid_customer_id_required" }, 400);
    if (!vehicleId || vehicleId.length > 100) return json({ error: "valid_vehicle_id_required" }, 400);
    if (!validDate(pickup) || !validDate(returned) || returned < pickup) {
      return json({ error: "pickup_date_and_return_date_must_be_valid_and_return_not_before_pickup" }, 400);
    }
    if (!status) return json({ error: "invalid_status" }, 400);
    if (notes && notes.length > 3000) return json({ error: "notes_too_long" }, 400);
    const billableDays = inclusiveDays(pickup, returned);
    if (!Number.isSafeInteger(billableDays) || billableDays < 1 || billableDays > 366) {
      return json({ error: "rental_duration_must_be_between_1_and_366_days" }, 400);
    }

    const customer = await env.DB.prepare(
      "SELECT id, full_name FROM customers WHERE id = ?"
    ).bind(customerId).first();
    if (!customer) return json({ error: "customer_not_found" }, 404);

    const vehicle = await env.DB.prepare(
      "SELECT id, name, daily_rate_minor, status FROM vehicles WHERE id = ?"
    ).bind(vehicleId).first();
    if (!vehicle) return json({ error: "vehicle_not_found" }, 404);
    if (["maintenance", "inactive"].includes(String(vehicle.status).toLowerCase())) {
      return json({ error: "vehicle_not_available_for_rental", vehicle_status: vehicle.status }, 409);
    }

    if (activeStatuses.includes(status)) {
      const conflict = await env.DB.prepare(`
        SELECT id, pickup_date, return_date FROM rentals
        WHERE vehicle_id = ?
          AND status IN ('upcoming', 'active')
          AND pickup_date <= ?
          AND return_date >= ?
        LIMIT 1
      `).bind(vehicleId, returned, pickup).first();
      if (conflict) {
        return json({
          error: "vehicle_rental_date_conflict",
          conflicting_rental: conflict.id,
          conflicting_pickup: conflict.pickup_date,
          conflicting_return: conflict.return_date
        }, 409);
      }

      const maintenance = await env.DB.prepare(`
        SELECT id, description, due_on FROM maintenance_records
        WHERE vehicle_id = ?
          AND status IN ('scheduled', 'in_progress')
          AND due_on IS NOT NULL
          AND due_on BETWEEN ? AND ?
        LIMIT 1
      `).bind(vehicleId, pickup, returned).first();
      if (maintenance) {
        return json({
          error: "vehicle_maintenance_conflict",
          maintenance_id: maintenance.id,
          maintenance_due_on: maintenance.due_on
        }, 409);
      }
    }

    const id = `RNT-${crypto.randomUUID()}`;
    const rate = Number(vehicle.daily_rate_minor || 0);
    await env.DB.prepare(`
      INSERT INTO rentals
        (id, customer_id, vehicle_id, pickup_date, return_date, daily_rate_minor,
         billable_days, status, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, customerId, vehicleId, pickup, returned, rate, billableDays, status, notes, data.staff.id).run();

    await audit(env.DB, data.staff, "rental.created", "rental", id, {
      customer_id: customerId,
      vehicle_id: vehicleId,
      pickup_date: pickup,
      return_date: returned,
      daily_rate_minor: rate,
      billable_days: billableDays,
      status
    });

    return json({
      data: {
        id,
        customer_id: customerId,
        customer_name: customer.full_name,
        vehicle_id: vehicleId,
        vehicle_name: vehicle.name,
        pickup_date: pickup,
        return_date: returned,
        daily_rate_minor: rate,
        billable_days: billableDays,
        total_minor: rate * billableDays,
        status,
        notes
      }
    }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
