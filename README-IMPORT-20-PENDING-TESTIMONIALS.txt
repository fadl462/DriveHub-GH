DriveHub GH — Import 20 Testimonials as Pending Reviews

Files changed:
- functions/command/api/reviews.js
- command/migrations/0005_import_20_pending_testimonials.sql

What this does:
- Imports the 20 testimonials from DriveHub_GH_Testimonials_Final(2).docx.
- Sets all 20 to status 'pending' and rating 5, as shown in the source document.
- Uses stable IDs PENDING-TESTIMONIAL-001 through PENDING-TESTIMONIAL-020.
- Uses INSERT OR IGNORE, so deploying or refreshing Reviews does not duplicate or overwrite existing records.
- The authenticated Command Centre Reviews API performs the import on data load, then returns live D1 records through the existing API.
- The public reviews API only returns approved records, so these 20 will not appear publicly until approved by staff.

Deployment:
1. Commit/deploy the changed functions/command/api/reviews.js at its exact repository path. Do not replace/remove functions/command/api/_middleware.js.
2. Confirm Cloudflare Pages binding DB points to drivehub-command-db.
3. Sign in to DriveHub Command and open Reviews; select Pending. The 20 records should appear.
4. If needed, the SQL migration can also be run against the production D1 database; it is idempotent.

Notes:
- The source provides customer names and testimonial text but not email addresses or submission dates. Those are not invented.
- Customer locations are present in the source but the current reviews table has no dedicated location field, so they are not placed in another field.
