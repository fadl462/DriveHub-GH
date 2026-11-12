import { json, requireRole, errorResponse } from "./_utils.js";

export async function onRequestGet({ env, data, request }) {
  if (!requireRole(data?.staff, ["super_admin", "operations_manager", "finance_officer", "read_only"])) {
    return json({ error: "forbidden" }, 403);
  }
  try {
    const url = new URL(request.url);
    const limit = Math.min(500, Math.max(1, Number.parseInt(url.searchParams.get("limit") || "200", 10) || 200));
    const rows = await env.DB.prepare(
      `SELECT a.id, a.action, a.entity_type, a.entity_id, a.before_json, a.after_json, a.created_at,
              s.display_name AS actor_name, s.email AS actor_email
       FROM audit_log a
       LEFT JOIN staff_users s ON s.id = a.actor_staff_id
       ORDER BY a.created_at DESC LIMIT ?`
    ).bind(limit).all();
    return json({ data: rows.results || [], limit });
  } catch (error) { return errorResponse(error); }
}
