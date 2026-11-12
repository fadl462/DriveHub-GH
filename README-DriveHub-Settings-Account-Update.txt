DriveHub GH Command Centre — Settings & Account Header Update

Files included (preserve these paths in the repository):
- command/index.html
- command/app.js
- command/styles.css
- command/functions/api/rentals.js
- command/functions/api/invoices.js
- command/functions/api/payments.js
- command/migrations/0009_set_super_admin_display_name.sql

Changes:
1. Settings now appears directly below Reports in the main sidebar navigation.
2. Selecting Settings resets the document scroll position to the top of the page.
3. The account header continues to show the authenticated staff member's D1 display name and role.
4. The latest receipt booking-reference retrieval fix is retained in app.js and the three API files.
5. The Authorised By signature markup is preserved.

D1 name update:
The SQL migration sets the existing super-admin display_name to Fadl Rahman Essel for the account email fadl_rahman3@yahoo.com. Apply this SQL once to the production database drivehub-command-db using the Cloudflare D1 Console (or your established migration process). It does not alter authentication, role, payments, invoices, rentals, or audit records.

Deploy the files to the GitHub main branch, preserving the folder structure, then allow Cloudflare Pages to deploy.
