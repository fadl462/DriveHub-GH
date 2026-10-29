// Public review API.
// POST stores feedback for moderation. GET returns approved public-facing fields only;
// internal "what could improve" feedback is deliberately never returned to public clients.
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  }
});

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: "review_service_unavailable" }, 503);
  try {
    const result = await env.DB.prepare(`
      SELECT id, customer_name AS name, rating,
             what_went_well AS whatWentWell,
             submitted_at AS submittedAt,
             published_at AS publishedAt
      FROM reviews
      WHERE lower(status) = 'approved'
        AND what_went_well IS NOT NULL
        AND trim(what_went_well) <> ''
      ORDER BY COALESCE(published_at, submitted_at) DESC
      LIMIT 100
    `).all();
    return json({ data: result.results || [] });
  } catch (error) {
    console.error("Public review listing failed", error);
    return json({ error: "review_service_unavailable" }, 503);
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "review_service_unavailable" }, 503);
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) return json({ error: "Please submit the form again." }, 415);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid submission. Please try again." }, 400); }

  const name = String(body.name || "").trim().slice(0, 80);
  const email = String(body.email || "").trim().slice(0, 120);
  const rating = Number(body.rating);
  const vehicle = String(body.vehicle || "Not specified").trim().slice(0, 80);
  const good = String(body.whatWentWell || "").trim().slice(0, 1200);
  const improve = String(body.whatToImprove || "").trim().slice(0, 1200);
  if (!name) return json({ error: "Please enter your name." }, 400);
  if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return json({ error: "Please enter a valid email address." }, 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json({ error: "Please select a rating from 1 to 5 stars." }, 400);
  if (!good && !improve) return json({ error: "Please tell us what went well or what we could improve." }, 400);

  const id = `RV-${crypto.randomUUID()}`;
  try {
    await env.DB.prepare(`INSERT INTO reviews
      (id, customer_name, customer_email, rating, what_went_well, what_to_improve, status, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)`)
      .bind(id, name, email || null, rating, good || null, improve || null).run();
    return json({ ok: true, id, status: "pending", message: "Review received and awaiting moderation." }, 201);
  } catch (error) {
    console.error("Review insert failed", error);
    return json({ error: "We could not save your review right now. Please try again shortly." }, 500);
  }
}
