DRIVEHUB GH AI PARTNER — 100 QUESTION / ANSWER INTENT UPDATE

FILES TO UPLOAD (preserve paths):
1. functions/api/chat.js
2. functions/api/faq-knowledge.js

WHAT THIS DOES
- Adds 100 natural-language question/answer examples across fleet, prices, recommendations, booking, availability, policies, contact, reviews, vehicle details and general support.
- Includes indirect, differently worded questions so the model is instructed to match the user's underlying intent rather than exact wording.
- Adds the FAQ knowledge into the server-side system context for every chat request.
- Keeps uncertain policies and live availability conservative; the assistant must not invent deposit, age, insurance, mileage, technical specifications, or availability information.
- Preserves answer-first and quick referral behaviour for Find Your Ride, The Experience and Leave a Review.

INSTALL
Upload/replace these two files in the repository at the exact paths shown above, then deploy the Cloudflare Pages project. No frontend file is changed.

TEST AFTER DEPLOYMENT
Try paraphrases, not just the exact examples. For example:
- “Need wheels for the weekend, what’s the damage?”
- “Do you guys have the Acura and how much?”
- “Where can I check if people liked your service?”
- “What’s the least expensive option?”
- “Can I pick it up tomorrow?”
- “What do I need to qualify?”

IMPORTANT
This is prompt-based FAQ grounding, not model fine-tuning. The examples improve consistency but do not create access to live inventory, booking calendars, payments or undocumented company policies. The review count and score are the currently published snapshot (5.0/5.0 from 9 reviews) and should be updated in the business facts when the website's displayed figures change.
