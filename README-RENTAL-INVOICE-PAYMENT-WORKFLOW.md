# DriveHub GH — Rental, Invoice, Payment & Receipt Workflow

## What this update changes

- A new rental is submitted to `POST /command/api/rentals` using D1 customer and operational-vehicle IDs.
- The existing rental API creates the rental, its single invoice, and the invoice line item in one D1 batch. The browser now uses that API rather than creating a local-only rental record.
- A stable rental request ID is retained while the Add Rental dialog remains open, so a retry does not create a second rental/invoice.
- The Invoices page no longer offers **Create invoice**. `POST /command/api/invoices` now returns HTTP 405 with an explanation that invoices are created from rentals only.
- A D1 unique index and triggers enforce at most one primary invoice per rental and reject new invoices without a rental link.
- The Payments & receipts form only offers outstanding D1 rental invoices. The payment API independently rejects legacy invoices without a rental link. Customer and invoice details are derived from the selected invoice; the payment amount is checked against the balance.
- Payments are saved to D1. A unique receipt number is returned and the payment appears in the Payments & receipts register.
- Payment submission uses an idempotency key to prevent duplicate entries when the same request is retried.
- The invoice balance/status is refreshed from the D1 payment ledger. Partial and final payments update the invoice to Partially paid or Paid.
- The Rentals list offers invoice download/print for linked invoices. The Invoices list offers Download / Print and Record payment actions.
- Receipts show the payment, invoice and rental reference. Use the browser print dialog's **Save as PDF** destination to download a PDF.
- Financial lists are D1-only. If the API or database is unavailable, sample browser records are suppressed and a visible warning is shown instead of presenting demo figures as live accounts.
- The approved Command Centre menu order is preserved: Overview, Rentals, Invoices, Payments & receipts, Reviews, Fleet, Customers, Audit trail, Reports.

## Files included

- `command/app.js`
- `command/index.html`
- `functions/command/api/invoices.js`
- `functions/command/api/payments.js`
- `command/migrations/0006_rental_linked_financial_ledger.sql`

## Deployment steps

1. Back up the current repository and D1 database.
2. Confirm the intended DriveHub production D1 database is selected. Do not use the FamilyGuard database.
3. Confirm the existing DriveHub schema and invoice-items migration are present (`invoices`, `payments`, `rentals`, `vehicles`, `customers`, `invoice_items`). This update assumes the initial schema and `0002_invoice_items.sql` have already been applied.
4. Before applying migration 0006, check for duplicate invoice links:

   ```sql
   SELECT rental_id, COUNT(*) AS invoice_count
   FROM invoices
   WHERE rental_id IS NOT NULL
   GROUP BY rental_id
   HAVING COUNT(*) > 1;
   ```

   If this returns any rows, stop and review those invoices before applying the unique index. Do not delete historical financial records to make the migration pass.

5. Apply `command/migrations/0006_rental_linked_financial_ledger.sql` once to the DriveHub production D1 database. It adds the rental-invoice constraints and `payments.idempotency_key`. Do not run it against FamilyGuard or run it twice.
6. Replace the four application/API files using the paths shown in the ZIP.
7. Deploy the project to Cloudflare Pages. Keep the existing Cloudflare Access middleware, D1 binding (`DB`) and staff-role configuration; do not bypass authentication.
8. Hard-refresh `/command/` after deployment.

## Test plan — use test records first

1. Add a test customer and ensure one operational vehicle with a registration number exists in the D1 Fleet.
2. Create a rental. Confirm the response returns an invoice number and that the rental and invoice appear in their respective lists.
3. From Rentals, use Download invoice. In the print dialog, choose Save as PDF. Repeat from Invoices.
4. Open Invoices and confirm there is no Create invoice button.
5. Record a partial payment against the test invoice. Confirm exactly one payment and one receipt number appear in Payments & receipts, and the invoice becomes Partially paid.
6. Retry the same payment request only as a technical idempotency test; it should return the existing receipt rather than create another payment.
7. Record the remaining balance. Confirm the invoice becomes Paid and the receipt is available for Download / Print.
8. Attempt an overpayment and confirm it is rejected.
9. Refresh the browser and verify rentals, invoices and payments remain present from D1.

## Important scope and limitations

- Existing legacy invoices that have no `rental_id` are preserved for historical review; this update does not guess which old rental they belong to or retroactively bill old rentals. New invoices are rental-linked by database rule.
- Existing rentals without an invoice are shown as having no linked invoice. Review and approve any historical backfill separately before creating invoices for them.
- The current receipt PDF action opens the browser print dialog; choose **Save as PDF** to download. No third-party PDF service is used.
- Do not use live transactions until the migration is applied to the correct D1 database and the end-to-end test plan succeeds.
