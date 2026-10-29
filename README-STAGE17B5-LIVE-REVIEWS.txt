DriveHub GH — Stage 17B.5: live review import and moderation

Files are supplied at their exact repository paths. Upload/commit these files into the DriveHub-GH repository and deploy Pages.

1) Run command/migrations/0003_import_published_reviews.sql once against the production D1 database drivehub-command-db. It is idempotent and uses stable IDs.
2) Deploy the changed command/app.js, functions/api/reviews.js and functions/command/api/reviews.js with the existing repository. Do not remove or replace the existing Access middleware.
3) Confirm the Pages production DB binding is named DB and points to drivehub-command-db. Public form POSTs to /api/reviews; Command Centre reads and moderates /command/api/reviews.
4) Sign into Command Centre and open Reviews. It should list only D1 records; the seven imported records are Approved. New public form submissions are Pending.
5) Test: submit one review on /leave-a-review, then refresh Command Centre Reviews and select Pending. The API should return HTTP 201 and the new review should appear. If the public endpoint returns an error, use DevTools Network response and Cloudflare Pages function logs to diagnose; do not mark it successful unless confirmed.

Security: /command/api/reviews remains behind the existing authenticated staff middleware. Public users can submit reviews but cannot list or moderate them.

Data note: supplied documents do not include email addresses, review dates, or vehicle details for all reviews. Those fields are intentionally left blank/not specified rather than invented. The UI should display Not specified where vehicle is absent.
