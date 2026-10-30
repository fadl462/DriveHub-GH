// Authenticated Command Centre review moderation API. The shared _middleware.js verifies Access + staff authorization.
import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

export async function onRequestGet({ env }) {
  try {
    let result;
    let managementFieldsAvailable = true;
    try {
      result = await env.DB.prepare(`SELECT id, customer_name AS name, customer_email AS email,
        rating, what_went_well AS whatWentWell, what_to_improve AS whatToImprove,
        status, submitted_at AS submittedAt, published_at AS publishedAt,
        COALESCE(improvement_status, 'new') AS improvementStatus, management_notes AS managementNotes
        FROM reviews ORDER BY submitted_at DESC LIMIT 500`).all();
    } catch (extendedQueryError) {
      // Keep all review records visible if migration 0004 has not yet been applied.
      // The private feedback workflow fields will default in the UI until migration is deployed.
      managementFieldsAvailable = false;
      result = await env.DB.prepare(`SELECT id, customer_name AS name, customer_email AS email,
        rating, what_went_well AS whatWentWell, what_to_improve AS whatToImprove,
        status, submitted_at AS submittedAt, published_at AS publishedAt
        FROM reviews ORDER BY submitted_at DESC LIMIT 500`).all();
    }
    return json({ data: result.results || [], managementFieldsAvailable });
  } catch (error) { return errorResponse(error); }
}

export async function onRequestPatch({ request, env, data }) {
  const staff = data?.staff;
  if (!requireRole(staff, ["admin", "review_moderator"])) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const id = String(body.id || "").trim();
    if (!id) return json({ error: "Provide a review id." }, 400);
    const existing = await env.DB.prepare("SELECT id, status FROM reviews WHERE id = ?").bind(id).first();
    if (!existing) return json({ error: "review_not_found" }, 404);

    // Improvement workflow is separate from public review approval/publication.
    if (Object.prototype.hasOwnProperty.call(body, "improvementStatus") || Object.prototype.hasOwnProperty.call(body, "managementNotes")) {
      if (!requireRole(staff, ["admin", "review_moderator", "operations"])) return json({ error: "forbidden" }, 403);
      const allowed = ["new", "under_review", "action_planned", "resolved"];
      const improvementStatus = body.improvementStatus == null ? null : String(body.improvementStatus).toLowerCase();
      const managementNotes = body.managementNotes == null ? null : String(body.managementNotes).slice(0, 3000);
      if (improvementStatus !== null && !allowed.includes(improvementStatus)) return json({ error: "Invalid improvement status." }, 400);
      if (improvementStatus !== null && body.managementNotes !== undefined) {
        await env.DB.prepare("UPDATE reviews SET improvement_status = ?, management_notes = ? WHERE id = ?").bind(improvementStatus, managementNotes, id).run();
      } else if (improvementStatus !== null) {
        await env.DB.prepare("UPDATE reviews SET improvement_status = ? WHERE id = ?").bind(improvementStatus, id).run();
      } else {
        await env.DB.prepare("UPDATE reviews SET management_notes = ? WHERE id = ?").bind(managementNotes, id).run();
      }
      await audit(env.DB, staff, "review_improvement_updated", "review", id, { improvementStatus, managementNoteUpdated: body.managementNotes !== undefined });
      return json({ ok: true, id, improvementStatus });
    }

    const status = String(body.status || "").toLowerCase();
    if (!["pending", "approved", "rejected", "flagged"].includes(status)) return json({ error: "Provide a valid review status." }, 400);
    const publishedAt = status === "approved" ? "CURRENT_TIMESTAMP" : "NULL";
    await env.DB.prepare(`UPDATE reviews SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP,
      published_at = ${publishedAt} WHERE id = ?`).bind(status, staff.id, id).run();
    await audit(env.DB, staff, `review_${status}`, "review", id, { status });
    return json({ ok: true, id, status });
  } catch (error) { return errorResponse(error); }
}


export async function onRequestDelete({ request, env, data }) {
  const staff = data?.staff;
  if (!requireRole(staff, ["admin", "review_moderator"])) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const id = String(body.id || "").trim();
    if (!id) return json({ error: "Provide a review id." }, 400);
    const existing = await env.DB.prepare("SELECT id, status FROM reviews WHERE id = ?").bind(id).first();
    if (!existing) return json({ error: "review_not_found" }, 404);
    if (String(existing.status).toLowerCase() !== "rejected") return json({ error: "Only rejected reviews can be permanently deleted." }, 409);
    await env.DB.prepare("DELETE FROM reviews WHERE id = ?").bind(id).run();
    await audit(env.DB, staff, "review_deleted", "review", id, { previousStatus: "rejected" });
    return json({ ok: true, id, deleted: true });
  } catch (error) { return errorResponse(error); }
}
