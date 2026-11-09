# DriveHub GH — D1 Rental, Invoice & Payment Workflow

## What this update changes

- The owned-fleet rental form now saves to `POST /command/api/rentals` using D1 customer and vehicle IDs.
- The rental API creates the rental, invoice and invoice line item in one D1 batch. The invoice is issued immediately, with the return date as its due date and the rental amount calculated using inclusive billable days.
- The Command Centre now loads rentals, invoices and payments from their D1 APIs. Older browser-preview records are retained and visibly marked **Browser preview · not in D1** so they are not silently lost during the transition.
- Each rental with a linked invoice has a **Download invoice** action. The Invoices page offers **Download PDF** and **Print** for the same invoice. Direct PDF generation uses jsPDF from a CDN and falls back to the print view if the library cannot load.
- Recording a payment now posts to the D1 payment API. The payment and updated invoice balance/status are then reloaded; the generated receipt appears in Payments & receipts with **Download PDF** and **Print** actions. Direct PDF generation uses jsPDF from a CDN and falls back to the print view if the library cannot load.
- The payment API now uses a conditional database insert to reject payments that exceed the remaining invoice balance, including concurrent payment attempts.
- The UI does not create a local-only rental or payment if the relevant D1 operation fails.

## Files changed

- `command/app.js`
- `functions/command/api/payments.js`

The rental and invoice API already existed in `functions/command/api/rentals.js` and `functions/command/api/invoices.js`; this update wires the frontend to those endpoints and hardens payment allocation.

## Deployment

1. Back up the current site source and the production D1 database.
2. Replace `command/app.js` in the project.
3. Replace `functions/command/api/payments.js` in the project.
4. Confirm the Pages Functions deployment includes the existing files:
   - `functions/command/api/rentals.js`
   - `functions/command/api/invoices.js`
   - `functions/command/api/payments.js`
   - `functions/command/api/_middleware.js`
   - `functions/command/api/_utils.js`
5. Confirm the D1 database has the base Command Centre schema and has applied `command/migrations/0002_invoice_items.sql` (including the `invoices.vehicle_id` column and `invoice_items` table). Do not re-run an already-applied ALTER TABLE migration.
6. Confirm the Pages project has its D1 binding named `DB`, and Cloudflare Access authentication variables and staff role records are configured. Do not bypass the existing middleware.
7. Deploy the Pages project.

## Required production tests

Use a test customer and vehicle in a non-production/test database first:

1. Create a rental and verify the rental and its invoice are both saved in D1.
2. Refresh the page and sign in from another authorized staff session; verify the rental and invoice remain visible.
3. Download/print the invoice from both Rentals and Invoices; verify both actions open the same invoice number and amounts.
4. Record a partial payment; verify it appears in Payments & receipts and the invoice shows the correct balance and Partially paid status.
5. Record the remaining balance; verify the invoice changes to Paid and the receipt is available.
6. Attempt an overpayment and simultaneous payment allocation; verify the API rejects any amount beyond the remaining balance.
7. Verify unauthorized staff roles cannot create rentals or record payments.

## Scope and important limitations

- Existing rentals, invoices and payments that were previously stored only in this browser are **not automatically migrated into D1** by this patch. They remain visible as marked browser-preview records. Before relying on the D1 ledger, reconcile and migrate any legitimate historical records; do not assume a browser-preview invoice or payment is in the production database.

- This integration covers **DriveHub GH owned-fleet rentals** using customers and vehicles already stored in D1.
- Partner-sourced rentals still use the separate `partner_rentals` workflow. That workflow does not yet create a D1 invoice linked to the partner rental; the UI therefore blocks partner-sourced rental creation through this path rather than silently creating an unlinked invoice or a browser-only financial record. Partner rental invoicing needs a separate schema/API integration.
- This ZIP has passed JavaScript syntax checks. It has not been deployed or tested against the live Cloudflare Access/D1 environment. Do not treat production operation as verified until the tests above pass.
