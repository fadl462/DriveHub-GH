// Authenticated Command Centre review moderation API.
// The shared _middleware.js verifies Cloudflare Access and staff authorization.
// On first successful load, import the seven verified public testimonials into D1.
// Stable IDs + INSERT OR IGNORE make this safe to run repeatedly without overwriting
// existing reviews, including reviews submitted through the public form.
import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";

const PUBLIC_TESTIMONIALS = [
  ["PUBLIC-REVIEW-001", "Akosua Dapaah", "Smooth booking, clean car, friendly team. DriveHub GH made it easy."],
  ["PUBLIC-REVIEW-002", "Kojo Annan", "Our company has leased two vehicles from DriveHub GH for our field staff since the start of the year. Invoicing is clear, maintenance is handled promptly, and whenever a car is due for service, a replacement is delivered the same day. It has taken a real burden off our operations team."],
  ["PUBLIC-REVIEW-003", "Kwame Mensah", "I rented a Toyota Corolla from DriveHub GH for a week of back-to-back meetings across Accra, and it ran flawlessly. The car was spotless, the AC was ice cold, and the fuel tank was full at pickup. After years of rental cars that came with surprises, this was a relief."],
  ["PUBLIC-REVIEW-004", "Abena Owusu-Ansah", "I landed at Kotoka after a long flight from London, and the team was already waiting with my name on a sign. The paperwork took less than ten minutes and the car was ready to go. It made my first hour back in Ghana completely stress-free."],
  ["PUBLIC-REVIEW-005", "Nana Yaw Boateng", "What I appreciate most about DriveHub GH is the honesty. The quote I received was the price I paid, with no hidden charges, no surprise deposits, and no fine print traps. For a business that manages travel budgets, that kind of transparency is rare and valuable."],
  ["PUBLIC-REVIEW-006", "Efua Asante", "My tyre went flat near Tema on a Sunday evening and I was a bit panicked. I called the support line and someone answered right away, and a replacement was arranged within the hour. That kind of responsiveness is why I now recommend them to all my colleagues."],
  ["PUBLIC-REVIEW-007", "Samuel Ofori-Atta", "We hired an SUV from DriveHub GH for a family trip to Cape Coast and Kakum National Park. The car was spacious, comfortable and well maintained, and they were happy to extend the booking by a day when we wanted to stay longer. The kids loved the ride, and we loved how easy it all was."]
];

async function ensurePublicTestimonials(db) {
  const statements = PUBLIC_TESTIMONIALS.map(([id, name, text]) => db.prepare(`
    INSERT OR IGNORE INTO reviews
      (id, customer_name, customer_email, rating, what_went_well, what_to_improve, status, submitted_at, reviewed_at, published_at)
    VALUES (?, ?, NULL, 5, ?, NULL, 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(id, name, text));
  // Batch is atomic in D1. INSERT OR IGNORE preserves records with these IDs if already present.
  await db.batch(statements);
}

export async function onRequestGet({ env }) {
  try {
    if (!env.DB) return json({ error: "database_not_configured" }, 503);
    await ensurePublicTestimonials(env.DB);
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
