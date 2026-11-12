DRIVEHUB GH — RENTAL REFERENCE RECEIPT FIX (SERVER + FRONTEND)

Replace these four files in the repository:
- command/app.js
- command/functions/api/rentals.js
- command/functions/api/invoices.js
- command/functions/api/payments.js

What changed:
- Rentals API exposes rentals.rental_reference.
- Invoices API returns rental_reference by joining the linked rental in both list and detail responses.
- Payments API returns rental_reference by joining payments -> invoices -> rentals.
- Existing response keys are preserved; data aliases are also returned for frontend compatibility.
- Receipt print logic resolves the reference using payment, invoice, then the linked rental record via invoices.rental_id.

No D1 data is changed. No migrations are required. No payment, invoice, or receipt records are modified.
The Authorised By signature remains unchanged.

Deploy to Cloudflare Pages, then hard-refresh the Command Centre and print the same receipt again.
