import { json } from "./_utils.js";

export async function onRequestGet({ data }) {
  const staff = data?.staff;
  if (!staff) return json({ error: "unauthorized" }, 401);
  return json({
    staff: {
      id: staff.id,
      display_name: staff.display_name,
      email: staff.email,
      role: staff.role,
      active: Number(staff.active) === 1
    }
  });
}
