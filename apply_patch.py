from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent

def read(rel):
    p = ROOT / rel
    if not p.exists():
        raise SystemExit(f"Missing required file: {rel}")
    return p, p.read_text(encoding="utf-8")

def write(p, content):
    backup = p.with_suffix(p.suffix + ".before-drivehub-fix")
    if not backup.exists():
        shutil.copy2(p, backup)
    p.write_text(content, encoding="utf-8")

# 1. Homepage: move the review invitation out of the hero so it cannot be clipped.
p, s = read("index.html")
cta = '<div class="testimonial-actions"><a class="testimonial-review-link" href="leave-a-review.html">Share your experience </a><span>Your feedback helps future guests choose with confidence.</span></div>'
boundary = '</section><section class="booking-wrap" id="book">'
if cta in s and boundary in s:
    s = s.replace(cta, "", 1)
    s = s.replace(
        boundary,
        '</section><section class="home-review-invite" aria-label="Customer feedback">'
        '<a class="testimonial-review-link" href="leave-a-review.html">Share your experience</a>'
        '<span>Your feedback helps future guests choose with confidence.</span>'
        '</section><section class="booking-wrap" id="book">',
        1
    )
elif 'class="home-review-invite"' not in s:
    raise SystemExit("Homepage markup did not match the expected current version; no files changed.")
write(p, s)

# 2. Shared CSS: contain the entire selected vehicle, and give the homepage CTA its own row.
p, s = read("styles.css")
if "Regression repair — keep selected vehicles fully visible" not in s:
    s += r"""

/* Regression repair — keep selected vehicles fully visible in the Find Your Ride summary. */
.ride-page .summary-car-art img {
  object-fit: contain !important;
  object-position: center center !important;
  padding: 8px 14px !important;
  background: linear-gradient(145deg, #34282b, #171416) !important;
  transform: none !important;
}
.ride-page .summary-car-art:hover img { transform: none !important; }

/* Homepage review invitation sits between the hero and booking panel, never clipped by the hero. */
.home-review-invite {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 9px 14px;
  min-height: 58px;
  padding: 13px 6%;
  background: #f5f2ed;
  border-bottom: 1px solid #e8e1db;
  text-align: center;
}
.home-review-invite .testimonial-review-link {
  color: #be1e2d;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
}
.home-review-invite .testimonial-review-link:hover { text-decoration: underline; }
.home-review-invite span {
  color: #777176;
  font-size: 10px;
  line-height: 1.5;
}
@media (max-width: 600px) {
  .home-review-invite { gap: 5px; padding: 12px 6%; }
  .home-review-invite span { flex-basis: 100%; }
}
"""
write(p, s)

# 3. AI Partner: do not repeat a stale, hard-coded review count; give exact supporting page URLs.
p, s = read("functions/api/chat.js")
old = "- Current website review snapshot: 5.0/5.0 from 9 reviews as shown on The Experience page. Treat this as a published snapshot, not a live database query; if asked to read reviews, direct the visitor to the page instead of copying reviews into chat."
new = "- Reviews: The Experience page is the authoritative public destination for current published reviews and any displayed rating/count. Do not state a fixed review count or rating from memory; direct visitors to the live page for the current figures and published feedback."
if old in s:
    s = s.replace(old, new, 1)
elif new not in s:
    raise SystemExit("AI Partner review fact did not match the expected current version.")
old = "- Experience/reviews page: https://drivehub-gh.pages.dev/experience"
new = old + "\n- How it works page: https://drivehub-gh.pages.dev/how-it-works\n- AI Partner page: https://drivehub-gh.pages.dev/faqs"
if old in s and "How it works page:" not in s:
    s = s.replace(old, new, 1)
old = "- For an overall review-score question, answer: “The Experience page currently shows 5.0/5.0 from 9 reviews.” Then invite the visitor to browse the full published reviews. End with the exact marker [[REVIEWS_LINK]] on its own line so the interface displays a prominent link."
new = "- For an overall review-score or review-count question, do not guess or use a stored number. Say that the current rating and published reviews are shown on The Experience page, then end with the exact marker [[REVIEWS_LINK]] on its own line."
if old in s:
    s = s.replace(old, new, 1)
elif new not in s:
    raise SystemExit("AI Partner score-answer instruction did not match the expected current version.")
old = "- If asked about an exact quote, availability, or policy detail not covered above, be transparent and offer to connect the visitor to the team."
new = "- When a visitor asks for a source, supporting page, or link, include the most relevant exact DriveHub GH page URL in the answer. Use the fleet page for vehicle listings, Find Your Ride for enquiries, How It Works for the process, The Experience for published reviews, and Leave a Review for feedback submission. Never fabricate a page, link, policy or live status.\n- If asked about an exact quote, availability, or policy detail not covered above, be transparent and offer to connect the visitor to the team."
if old in s and "When a visitor asks for a source" not in s:
    s = s.replace(old, new, 1)
write(p, s)

# 4. FAQ knowledge: answer review-count questions without stale numbers.
p, s = read("functions/api/faq-knowledge.js")
old = '"question": "How many reviews do you have?",\n    "answer": "The current website snapshot shows 9 reviews. This is a published snapshot and may not update instantly."'
new = '"question": "How many reviews do you have?",\n    "answer": "The Experience page shows the current published review count and rating. Please check that page for the latest figures: https://drivehub-gh.pages.dev/experience."'
if old in s:
    s = s.replace(old, new, 1)
elif new not in s:
    raise SystemExit("FAQ review-count answer did not match the expected current version.")
write(p, s)

# 5. Chat link rendering: allow the additional public information pages to become clickable.
p, s = read("script.js")
old = r'const urlPattern=/(https?:\/\/[^\s<>]+|\/find-your-ride(?:\?[^\s<>]*)?|\/experience|\/leave-a-review|\/fleet)(?![^\s<>])/g;'
new = r'const urlPattern=/(https?:\/\/[^\s<>]+|\/(?:find-your-ride|experience|leave-a-review|fleet|how-it-works|faqs)(?:\?[^\s<>]*)?)(?![^\s<>])/g;'
if old in s:
    s = s.replace(old, new, 1)
elif new not in s:
    raise SystemExit("AI Partner URL matcher did not match the expected current version.")
write(p, s)

print("Patch applied. Backups were created beside each changed file with .before-drivehub-fix suffix.")
