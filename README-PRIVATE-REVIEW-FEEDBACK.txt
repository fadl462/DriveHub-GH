DriveHub GH — Private Review Improvement Feedback

Updated file:
  functions/api/reviews.js

What changed:
- Added GET /api/reviews for public-facing approved testimonials.
- Public GET returns only approved reviews and only id, name, rating, whatWentWell, and submittedAt.
- The internal what_to_improve field and customer email are never returned by this public endpoint.
- Existing POST review submission remains intact: new reviews are saved as pending and the what-could-improve answer remains available to authorised Command Centre staff for internal service improvement.

Deployment:
1. Extract the ZIP into the root of the DriveHub-GH repository, preserving the folder path.
2. Commit and push to GitHub.
3. Let Cloudflare Pages deploy the update.
4. The public GET endpoint is /api/reviews. The current homepage testimonial cards are static markup; they will not automatically switch to database-driven reviews unless the homepage is separately wired to this endpoint.
