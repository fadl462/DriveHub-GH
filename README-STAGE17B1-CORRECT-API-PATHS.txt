DriveHub GH — Stage 17B.1: Correct API Paths for Invoice & Payment Foundation

WHY THIS PACKAGE EXISTS
The deployed Command API routes use the repository-root Pages Functions path:
  functions/command/api/*  -> /command/api/*
The first Stage 17B foundation package placed API handlers under command/functions/api, which may not be discovered by the current Pages Functions routing setup. This package puts the handlers at the same routing level as the existing command API middleware and health/customer/vehicle endpoints.

FILES IN THIS PACKAGE
1. functions/command/api/invoices.js
   GET /command/api/invoices[?id=...&status=...&limit=...]
   POST /command/api/invoices
2. functions/command/api/payments.js
   GET /command/api/payments[?invoice_id=...&limit=...]
   POST /command/api/payments
3. command/migrations/0002_invoice_items.sql
   Creates invoice_items and supporting indexes.

UPLOAD STEPS
1. Extract this ZIP.
2. In the GitHub repository, upload/replace the two JavaScript files in the exact folder:
   functions/command/api/
   Do NOT put them in command/functions/api/.
3. Upload the migration to:
   command/migrations/0002_invoice_items.sql
4. Commit directly to main.
5. Do not run the migration against production until confirming that migration 0001 has been applied to the target D1 database and a backup/recovery route is available.

IMPORTANT SAFETY / READINESS NOTES
- The existing root-level functions/command/api/_middleware.js is expected to protect these routes using Cloudflare Access JWT verification and staff_users role checks. Do not weaken or bypass that middleware.
- These API endpoints are not yet connected to the dashboard's invoice and payment screens. Existing browser-local sample records should not be treated as production financial records.
- Before use with real records, verify Cloudflare Pages sees the new routes, D1 migration is applied, the staff account is authorized, and invoice/payment CRUD tests pass.
- Amounts use integer pesewas (minor units). For example, GH₵ 24.50 is sent as amount_minor: 2450.
- Invoice creation payload requires invoice_number, customer_id, issued_on, and items. Each item requires description, integer quantity >= 1, and unit_price_minor.
- Payment creation payload requires invoice_id, receipt_number, amount_minor, payment_method, and optionally received_at/reference.
- Payment methods accepted: cash, bank_transfer, mobile_money, card, other.

TEST CHECKLIST AFTER DEPLOYMENT
[ ] GET /command/api/health still works.
[ ] Unauthenticated invoice/payment API requests are rejected.
[ ] Authorized finance/admin staff can list invoices and payments.
[ ] Creating an invoice stores invoice and line items in D1.
[ ] Duplicate invoice number is rejected.
[ ] Payment greater than remaining balance is rejected.
[ ] Duplicate receipt number is rejected.
[ ] Partial payment updates invoice status to partially_paid.
[ ] Full payment updates invoice status to paid.
[ ] Audit records are created for invoice and payment actions.
[ ] Existing rentals, fleet, customers, invoice PDF Download, and Print remain unaffected.

This package corrects file routing and supplies backend foundation files. It is not a claim that the routes have been deployed or live-tested.
