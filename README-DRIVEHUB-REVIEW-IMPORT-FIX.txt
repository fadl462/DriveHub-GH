DriveHub GH — Live review import fix

UPDATED FILE (keep this exact path in the repository):
functions/command/api/reviews.js

WHY THIS FIX
The repository already had a migration containing the seven testimonials, but Pages deployment does not automatically execute arbitrary SQL files. That is why the testimonials were still missing from production D1.

WHAT THIS UPDATE DOES
- On a successful authenticated Command Centre Reviews API GET, inserts the seven verified public testimonials into the bound D1 database.
- Uses stable IDs PUBLIC-REVIEW-001 through PUBLIC-REVIEW-007 and INSERT OR IGNORE, so refreshes/retries do not create duplicates or overwrite records with those IDs.
- Marks imported testimonials approved and sets published_at.
- Leaves the existing test review and all other records untouched.
- Continues to return live D1 records to the existing Reviews UI.
- Keeps public submission separate at /api/reviews and retains the existing Cloudflare Access middleware for /command/api/*.

DEPLOY
1. In GitHub, replace DriveHub-GH/functions/command/api/reviews.js with the file in this ZIP at the same relative path.
2. Commit the change and wait for the Cloudflare Pages production deployment to finish.
3. Sign in to DriveHub Command and open Reviews. The first authenticated GET runs the idempotent import against the configured DB binding.
4. Select Approved or All reviews. The seven public testimonials should appear alongside the existing test review.
5. Confirm the Pending tab still shows the test review, if it has not been approved/rejected.

IMPORTANT
- Do not delete or replace functions/command/api/_middleware.js.
- The Cloudflare Pages production binding DB must point to drivehub-command-db.
- This package has not been deployed to your Cloudflare account from this environment. Confirm the live result after GitHub deployment.
