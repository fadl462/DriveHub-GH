DriveHub GH — Reviews restore (updated file only)

Updated file to place at the same path in the DriveHub-GH repository:
  functions/command/api/reviews.js

What this fixes:
- Keeps Command Centre reviews loading if the private-feedback migration fields are not yet present in the live D1 database.
- Uses the extended query when the fields exist, preserving the Overview customer-improvement workflow.
- Keeps database ordering newest-first and does not insert, delete, or change review records or statuses.
- Includes What could improve only in the authenticated Command Centre API response. Keep the public reviews endpoint separate and do not expose that field publicly.

Deploy the updated file to GitHub so Cloudflare Pages Functions rebuilds.

Important:
If the private management workflow needs status/note editing and migration 0004 has not been applied to the live D1 database, apply the existing repository migration:
  command/migrations/0004_customer_improvement_management.sql
The fallback allows reviews to display before that migration is applied; it does not create the new columns automatically.
