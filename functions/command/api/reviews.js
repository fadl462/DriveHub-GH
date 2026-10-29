// Authenticated Command Centre review moderation API. The shared _middleware.js verifies Access + staff authorization.
import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

export async function onRequestGet({ env }) {
  try {
    const result = await env.DB.prepare(`SELECT id, customer_name AS name, customer_email AS email,
      rating, what_went_well AS whatWentWell, what_to_improve AS whatToImprove,
      status, submitted_at AS submittedAt, published_at AS publishedAt
      FROM reviews ORDER BY submitted_at DESC LIMIT 500`).all();
    return json({ data: result.results || [] });
  } catch (error) { return errorResponse(error); }
}

export async function onRequestPatch({ request, env, data }) {
  const staff = data?.staff;
  if (!requireRole(staff, ["admin", "review_moderator"])) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const id = String(body.id || "").trim();
    const status = String(body.status || "").toLowerCase();
    if (!id || !["pending", "approved", "rejected", "flagged"].includes(status)) {
      return json({ error: "Provide a review id and a valid status." }, 400);
    }
    const existing = await env.DB.prepare("SELECT id, status FROM reviews WHERE id = ?").bind(id).first();
    if (!existing) return json({ error: "review_not_found" }, 404);
    const publishedAt = status === "approved" ? "CURRENT_TIMESTAMP" : "NULL";
    await env.DB.prepare(`UPDATE reviews SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP,
      published_at = ${publishedAt} WHERE id = ?`).bind(status, staff.id, id).run();
    await audit(env.DB, staff, `review_${status}`, "review", id, { status });
    return json({ ok: true, id, status });
  } catch (error) { return errorResponse(error); }
}
