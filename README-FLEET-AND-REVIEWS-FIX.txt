DriveHub GH — Reviews and Fleet Correction (updated files only)

Included files (preserve these exact paths in the repository):
1. functions/command/api/vehicles.js
2. import-20-testimonials-pending.sql
3. migrations/2026-10-30-canonical-fleet-names.sql

FLEET FIX
The Command Centre vehicle API no longer displays the retired generic labels “Mitsubishi Outlander” and “Hyundai Santa Fe”. It retains the canonical models “Mitsubishi Outlander (Silver Metallic)” and “Hyundai Santafe (Silver Metallic)”. The API still synchronizes the public catalogue and preserves vehicle IDs and rental relationships. This change hides legacy generic labels from the Fleet list; it does not delete vehicle records.

IMPORTANT: If the unwanted entries are distinct old vehicle records, they remain in D1 and are hidden from the Fleet list. Do not delete them without checking rental history and registration details. The canonical SQL migration renames known aliases and is safe to run more than once.

20 PENDING REVIEWS
The SQL file import-20-testimonials-pending.sql contains the 20 prepared testimonials with stable IDs and pending status. They will NOT appear merely by uploading this ZIP to GitHub. After deploying the API update, open Cloudflare Dashboard > D1 > drivehub-command-db > Console and execute the contents of import-20-testimonials-pending.sql against the production database. Then refresh Command Centre > Reviews and select Pending. The import uses INSERT OR IGNORE, so it is safe to rerun and will not create duplicate IDs. Review each submission before approving or rejecting it.

DEPLOY
- Replace functions/command/api/vehicles.js at the same path in GitHub and wait for Cloudflare Pages deployment.
- Run migrations/2026-10-30-canonical-fleet-names.sql in the production D1 Console if not already applied.
- Run import-20-testimonials-pending.sql in the production D1 Console.
- Verify Fleet shows only the canonical silver-metallic Outlander and Santafe labels, and Reviews > Pending shows the imported reviews.

This package has not been deployed to your Cloudflare account from this environment. No production database has been changed by creating this ZIP.
