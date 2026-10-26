DriveHub GH — Stage 17B: Invoice & Payment API Foundation

Included files
- command/migrations/0002_invoice_items.sql
- command/functions/api/invoices.js
- command/functions/api/payments.js

What this stage adds
- A normalized invoice_items table for invoice line descriptions, quantities, unit prices and line totals.
- Read endpoints for invoice lists/details and payment/receipt lists.
- Create-invoice endpoint with server-side total calculation, customer/rental checks, duplicate-number handling and audit entry.
- Record-payment endpoint with positive amount validation, invoice status checks, balance checks and duplicate receipt-number handling.
- Monetary values are stored in integer minor units (pesewas) to avoid floating-point rounding.

IMPORTANT — NOT PRODUCTION-ACTIVE YET
The current command/functions/api/_middleware.js in the project is deliberately fail-closed and returns api_not_enabled for protected API routes until verified staff authentication and role authorization are implemented. Therefore these endpoints will not become usable simply by uploading this ZIP. Do not remove or bypass that middleware. Do not record live financial transactions until staff identity, roles, D1 bindings, migrations, and the frontend integration have been configured and tested.

Safe deployment sequence
1. Keep a backup of the current working repository.
2. Upload the new API files to command/functions/api/.
3. Upload 0002_invoice_items.sql to command/migrations/.
4. Confirm migration 0001 has been applied to the intended D1 database before applying migration 0002.
5. Configure and verify server-side authentication/authorization; do not trust browser-supplied role headers.
6. Test duplicate invoice and receipt numbers, invalid customers/rentals, discounts exceeding subtotal, partial payments, exact-balance payments, overpayments, and unauthorized roles against a development database.
7. Integrate the dashboard to these endpoints only after the API tests pass. The current dashboard remains a browser-local demo until that integration is completed.

API shape
GET  /command/api/invoices
GET  /command/api/invoices?id=<invoice-id>
POST /command/api/invoices
GET  /command/api/payments
GET  /command/api/payments?invoice_id=<invoice-id>
POST /command/api/payments

POST invoice JSON expects invoice_number, customer_id, issued_on (YYYY-MM-DD), optional due_on, optional rental_id, optional discount_minor, optional notes, status ('draft' or 'issued'), and items[] with description, quantity, unit_price_minor.
POST payment JSON expects invoice_id, receipt_number, amount_minor, payment_method ('cash','bank_transfer','mobile_money','card','other'), optional received_at and reference.

This package is a backend foundation only. It does not claim that production persistence is live, and it does not modify the working dashboard UI or PDF download/print actions.
