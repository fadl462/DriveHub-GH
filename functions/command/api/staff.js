import { json, readJson, audit, errorResponse } from "./_utils.js";

const INVITABLE_ROLES = new Set([
  "operations_manager", "rental_officer", "finance_officer", "review_moderator", "read_only"
]);
const LEGACY_ROLE = {
  operations_manager: "operations",
  rental_officer: "operations",
  finance_officer: "finance",
  review_moderator: "review_moderator",
  read_only: "read_only"
};
const isAdmin = (staff) => staff?.role === "super_admin";
const cleanEmail = (value) => String(value || "").trim().toLowerCase();
const validEmail = (value) => value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function onRequestGet({ env, data }) {
  if (!isAdmin(data?.staff)) return json({ error: "forbidden" }, 403);
  try {
    const [users, invitations] = await Promise.all([
      env.DB.prepare(
        "SELECT id, display_name, email, access_role AS role, active, created_at, updated_at FROM staff_users ORDER BY display_name COLLATE NOCASE"
      ).all(),
      env.DB.prepare(
        "SELECT id, display_name, email, access_role AS role, expires_at, created_at FROM staff_invitations WHERE accepted_at IS NULL AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC"
      ).all()
    ]);
    const activeEmails = new Set((users.results || []).map(x => String(x.email).toLowerCase()));
    const pending = (invitations.results || []).filter(x => !activeEmails.has(String(x.email).toLowerCase()))
      .map(x => ({ ...x, status: "pending" }));
    return json({
      data: (users.results || []).map(x => ({ ...x, status: Number(x.active) === 1 ? "active" : "suspended" })),
      invitations: pending
    });
  } catch (error) { return errorResponse(error); }
}

export async function onRequestPost({ env, data, request }) {
  const actor = data?.staff;
  if (!isAdmin(actor)) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const displayName = String(body.display_name || "").trim();
    const email = cleanEmail(body.email);
    const role = String(body.role || "");
    if (displayName.length < 2 || displayName.length > 120) return json({ error: "Enter a staff name between 2 and 120 characters." }, 400);
    if (!validEmail(email)) return json({ error: "Enter a valid email address." }, 400);
    if (!INVITABLE_ROLES.has(role)) return json({ error: "This role cannot be invited. Super Admin is assigned only through protected owner provisioning." }, 400);

    const existing = await env.DB.prepare("SELECT id FROM staff_users WHERE lower(email)=lower(?) LIMIT 1").bind(email).first();
    if (existing) return json({ error: "A staff account already exists for this email address." }, 409);
    const pending = await env.DB.prepare("SELECT id FROM staff_invitations WHERE lower(email)=lower(?) AND accepted_at IS NULL AND expires_at > CURRENT_TIMESTAMP LIMIT 1").bind(email).first();
    if (pending) return json({ error: "An active invitation already exists for this email address." }, 409);

    const id = crypto.randomUUID();
    await env.DB.prepare(
      "INSERT INTO staff_invitations (id, display_name, email, access_role, invited_by, expires_at) VALUES (?, ?, ?, ?, ?, datetime('now', '+7 days'))"
    ).bind(id, displayName, email, role, actor.id).run();
    await audit(env.DB, actor, "staff_invited", "staff_invitation", id, { display_name: displayName, email, role });
    return json({
      invitation: { id, display_name: displayName, email, role, status: "pending" },
      message: "Invitation created. Add this email to the Cloudflare Access allow policy; the staff member will be provisioned on their first successful PIN login."
    }, 201);
  } catch (error) { return errorResponse(error); }
}

export async function onRequestPatch({ env, data, request }) {
  const actor = data?.staff;
  if (!isAdmin(actor)) return json({ error: "forbidden" }, 403);
  try {
    const body = await readJson(request);
    const id = String(body.id || "").trim();
    const action = String(body.action || "");
    if (!id) return json({ error: "staff_id_required" }, 400);
    const target = await env.DB.prepare("SELECT id, display_name, email, access_role, active FROM staff_users WHERE id=?").bind(id).first();
    if (!target) return json({ error: "staff_not_found" }, 404);
    if (target.access_role === "super_admin") return json({ error: "Super Admin accounts are protected from staff-management changes." }, 409);
    if (target.id === actor.id) return json({ error: "You cannot change your own staff access." }, 409);

    if (action === "suspend" || action === "reactivate") {
      const active = action === "reactivate" ? 1 : 0;
      await env.DB.prepare("UPDATE staff_users SET active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(active, id).run();
      await audit(env.DB, actor, `staff_${action}d`, "staff_user", id, { email: target.email, active });
      return json({ success: true, active });
    }
    if (action === "change_role") {
      const role = String(body.role || "");
      if (!INVITABLE_ROLES.has(role)) return json({ error: "Invalid staff role." }, 400);
      await env.DB.prepare("UPDATE staff_users SET access_role=?, role=?, updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .bind(role, LEGACY_ROLE[role], id).run();
      await audit(env.DB, actor, "staff_role_changed", "staff_user", id, { email: target.email, from: target.access_role, to: role });
      return json({ success: true, role });
    }
    return json({ error: "Unsupported staff action." }, 400);
  } catch (error) { return errorResponse(error); }
}
