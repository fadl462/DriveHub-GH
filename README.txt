DriveHub GH — Payment Removal HTTP 405 Fix

Replace these files at the project root (preserve the folder paths):
- command/app.js
- command/styles.css
- functions/command/api/payments.js

Important routing correction:
The live Command Centre endpoint is /command/api/payments. In Cloudflare Pages, that route is supplied by functions/command/api/payments.js. The previous removal package placed the API under command/functions/api/payments.js, which does not implement the live /command/api/payments route. The live route therefore had no onRequestDelete handler and returned HTTP 405.

This package keeps the existing GET and POST handlers from the latest supplied project source, adds an admin/finance-only DELETE handler to the correct Pages Functions route, and includes the payment-history Remove UI. The delete operation removes only the selected payment, recalculates the invoice status from remaining payments, and writes an audit before-image. It does not issue a refund.

Deploy the three files to the DriveHub GH Cloudflare Pages project using the same root structure, then test with one incorrect payment. After successful removal, refresh Payments & receipts: the invoice should appear under Outstanding invoices with its recalculated balance, and the receipt should disappear from payment history.

This is a code package only. It has not been deployed or executed against live D1. Do not upload the API file under command/functions; that is the wrong route for /command/api.
