DriveHub Command Centre — Scoped Customer D1 Integration Fix

UPLOAD ONLY: command/app.js

This ZIP intentionally contains only the updated command/app.js. Do not replace the public website files, command/index.html, schema, migrations, functions, or other modules.

Changes:
- Loads customer records from /command/api/customers and merges them into the existing browser demo records without deleting local demo records.
- Displays D1 customers in the Customer directory and includes them in rental/invoice/payment customer dropdowns.
- Sends new customer creation to POST /command/api/customers; reports API errors rather than silently saving a local-only customer.
- Preserves the active Command Centre section in the URL hash and restores it on refresh.

Important:
- The existing API must be deployed and Cloudflare Access/D1 configured for D1 calls to succeed.
- This is a scoped frontend fix. It does not yet make rental creation persistent in D1; that is a separate integration.
- Existing browser-local demo records remain in localStorage. No database or migration changes are included.
