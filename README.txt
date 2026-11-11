DriveHub GH — Consolidated Rental Editing + Payment Removal Fix

This package intentionally combines the rental edit-form changes with the payment-history removal fix. It avoids replacing the rental-edit-capable command/app.js with the older app.js from the payment-removal patch.

Replace these files in the project, preserving paths:
- command/app.js
- command/styles.css
- functions/command/api/payments.js

Included behaviour:
- Restores the full rental edit form (customer, vehicle, daily rate, pickup/return dates, status and notes).
- Keeps the rental edit handler and linked invoice recalculation logic from the rental-edit package.
- Keeps payment-history Remove action and its API DELETE endpoint.
- After payment removal, reloads D1 financial records so invoice balance/status and outstanding invoice list refresh.
- API removal is restricted to Admin/Finance and writes an audit record.

Deployment:
1. Back up the current three files.
2. Replace the files above with these package versions.
3. Commit/push to GitHub or upload to Cloudflare Pages.
4. Wait for the deployment to complete, then hard-refresh the Command Centre.
5. Test editing a rental and confirm the daily rate/date edits recalculate the linked invoice correctly. Also test removing a payment only when authorised.

Important:
- This is a code package, not a deployment. It has not been deployed or tested against the live D1 instance here.
- Rental edits update the browser-preview rental/invoice state in the current UI implementation; do not assume this makes the underlying D1 rental record editable unless the API-backed rental workflow is enabled.
- Do not restore an older command/app.js over this consolidated version.
