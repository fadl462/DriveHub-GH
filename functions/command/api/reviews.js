// Authenticated Command Centre review moderation API. The shared _middleware.js verifies Access + staff authorization.
import { json, readJson, requireRole, audit, errorResponse } from "./_utils.js";


// Idempotently seed the 20 supplied customer testimonials as PENDING records.
// Stable IDs make this safe on every authenticated Reviews page load; existing
// records are never overwritten, and pending entries are not publicly published.
const IMPORT_PENDING_TESTIMONIALS_SQL = `
-- DriveHub GH: import 20 customer testimonials as PENDING reviews.
-- Safe to rerun: INSERT OR IGNORE avoids duplicating stable IDs.
-- Source: DriveHub_GH_Testimonials_Final(2).docx.
-- The source does not provide email addresses or verified submission dates; neither is invented.
INSERT OR IGNORE INTO reviews
  (id, customer_name, rating, what_went_well, status, submitted_at)
VALUES
('PENDING-TESTIMONIAL-001', 'Kwabena Agyeman-Duah', 5, 'I booked the Toyota RAV4 from DriveHub GH for a week of client visits around Kumasi and Ejisu. It started every morning without fuss, the cabin stayed cool, and the fuel economy surprised me. By the end of the week I did not want to hand it back.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-002', 'Ama Essuman', 5, 'I needed a vehicle for a full month while working on a project at the port, and DriveHub GH made it simple. The Outlander was clean on day one and just as reliable on day thirty. No breakdowns, no stress, just a car I could depend on.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-003', 'Emmanuel Tetteh', 5, 'Our firm has rented a Santa Fe from DriveHub GH on a long-term basis for over six months now. Servicing is handled on time, the paperwork is clear, and the car looks as good today as when we collected it. It has been far easier than owning and maintaining our own vehicle.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-004', 'Alhassan Iddrisu', 5, 'I spent a month travelling between communities for fieldwork, and the Prado never let me down. Long hours behind the wheel, dusty roads, hot afternoons, and it kept going comfortably. Renting monthly with DriveHub GH was the best decision for this assignment.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-005', 'Selorm Agbenyega', 5, 'My family came home for a week-long visit and we needed room for everyone. The CR-V handled airport runs, church, market trips and a day out to Hohoe without a single problem. It felt like our own car for the week.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-006', 'Mavis Appiah-Kubi', 5, 'The 7-seater Outlander was perfect for our family of six. Everyone had room, the kids were comfortable on the long drive, and there was still space for the luggage. For the quality of the car, DriveHub GH gave us excellent value.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-007', 'Priscilla Nartey', 5, 'I wanted something refined for a week of business meetings, and the Acura MDX delivered. The ride is smooth, the seats are superb, and I arrived at every appointment feeling fresh. It is rare to get this level of comfort from a rental.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-008', 'Yaw Frimpong', 5, 'I was not sure what to expect, but the Honda CR-V from DriveHub GH was a pleasant surprise. Practical, comfortable and economical on fuel, it covered everything I needed. I got far more than I paid for.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-009', 'Nii Armah Quaye', 5, 'We rented the Land Cruiser V8 for my brother''s wedding weekend, and it turned heads everywhere we went. It was spotless, powerful and extremely comfortable. DriveHub GH helped make our family''s big day even more special.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-010', 'Rukaya Mohammed', 5, 'I drove the Hyundai Santa Fe from Wa to Kumasi and back, and I barely felt the distance. The seats were comfortable, the air conditioning was excellent, and the car stayed steady the whole way. I would happily book it again.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-011', 'Atuguba Akolgo', 5, 'The road to the border communities near Paga is not kind to vehicles, but the Prado took it in its stride. No rattles, no warning lights, and no worries. These are cars built for real Ghanaian roads, and DriveHub GH keeps them in top shape.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-012', 'Gifty Nyarko', 5, 'I rented the RAV4 in the middle of the rainy season, with flooded stretches and plenty of potholes on the way. The car stayed composed and confident throughout. I have rented from other places before and none felt this solid.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-013', 'Kofi Sarpong', 5, 'Our site visits around Tarkwa involve rough, uneven tracks, and the Land Cruiser V8 handled all of it. It is powerful, sturdy and still comfortable inside. DriveHub GH clearly looks after its vehicles properly.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-014', 'Edem Dzifa Kpodo', 5, 'We took the Outlander up the hilly road toward Wli Falls and it climbed without complaint. Steady on the bends, firm on the rough patches, and comfortable for the whole group. A great car for exploring the Volta Region.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-015', 'Nana Akua Serwaa', 5, 'I had a question late in the evening and someone from DriveHub GH replied quickly and politely. When I needed a small adjustment to my booking, it was sorted without any drama. Support like this is what keeps me coming back.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-016', 'Barrister Kwesi Hammond', 5, 'I asked for a driver for a court week and the experience was excellent. He was punctual, courteous, and knew the routes well, and he drove smoothly and safely throughout. It allowed me to prepare my cases in the back seat in complete comfort.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-017', 'Comfort Ayisi', 5, 'Every car I have collected from DriveHub GH has been spotless inside and out, with everything working properly. You can tell the vehicles are checked and cared for before they reach the customer. That attention to detail builds real trust.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-018', 'Joseph Nkrumah', 5, 'I found the cars on the DriveHub GH website, chose the one I liked and sent an enquiry. The team got back to me quickly and the pickup was smooth. Booking a rental has never been this straightforward.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-019', 'Ibrahim Salifu', 5, 'We rent from DriveHub GH for our team''s field trips across the Savannah Region. The vehicles are dependable, the team is professional, and they respond fast whenever we need to adjust our plans. They understand what organisations need from a rental partner.', 'pending', CURRENT_TIMESTAMP),
('PENDING-TESTIMONIAL-020', 'Esi Quansah', 5, 'Great cars, honest people, no stress. Highly recommended.', 'pending', CURRENT_TIMESTAMP);
`;

async function ensurePendingTestimonials(db) {
  await db.prepare(IMPORT_PENDING_TESTIMONIALS_SQL).run();
}

export async function onRequestGet({ env }) {
  try {
    await ensurePendingTestimonials(env.DB);
  } catch (importError) {
    // Do not hide existing reviews if the database schema or import has an issue.
    console.error("Pending testimonial import failed", importError);
  }
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
