DriveHub GH — Customer Improvement Feedback D1 Fix

Cause
The live D1 reviews table is missing two columns expected by the Command Centre:
- improvement_status
- management_notes

Files to upload to the GitHub repository (preserve paths):
- command/migrations/0004_customer_improvement_management.sql
- command/schema.sql
- schema.sql

IMPORTANT: Uploading the migration file to GitHub does NOT execute it against an existing D1 database. Apply the migration once to the EXISTING production D1 database using the Cloudflare dashboard:
1. Open Cloudflare Dashboard > Workers & Pages > D1 SQL database used by DriveHub GH Command Centre.
2. Open Console / SQL Console.
3. Run these statements:

ALTER TABLE reviews ADD COLUMN improvement_status TEXT NOT NULL DEFAULT 'new' CHECK (improvement_status IN ('new','under_review','action_planned','resolved'));
ALTER TABLE reviews ADD COLUMN management_notes TEXT;
CREATE INDEX IF NOT EXISTS idx_reviews_improvement_status ON reviews(improvement_status, submitted_at DESC);

Run only once. If Cloudflare reports that a column already exists, do not rerun that ALTER statement; check the table schema and run only missing statements. Do not run the full schema.sql against production as a substitute; it is a bootstrap schema, not a migration.

After applying, reload /command/#overview and test:
- Change feedback status from New to Under review, Action planned, and Resolved. The card should disappear from the active Overview list when marked Resolved (per current UI behavior).
- Add a management note and refresh. The note should remain saved.

This package does not contain customer data and does not delete or recreate any records. No deployment or live database mutation was performed by generating this ZIP.
