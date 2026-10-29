# DriveHub GH — Automatic Rental Invoicing & Linked Payment Status (workflow update)

## What changed in this update
- Creating a rental now automatically creates a linked invoice in the Command Centre's current app state. The invoice includes the customer, vehicle, rental reference, issue date, due date (rental return date), total charge and initial unpaid status.
- The success message returns both the rental reference and invoice reference, reducing the chance of staff forgetting to create an invoice separately.
- The invoice status is calculated from the invoice total, allocated payments and due date: Paid, Partially paid, Unpaid or Overdue. Staff should record customer money only through Payments & receipts; this recalculates the invoice status from the allocated total.
- Payments & receipts now displays the linked invoice's current status beside each receipt.
- The Payments & receipts description now explains that payments are linked to invoices rather than being standalone entries.
- Partner sourcing, supplier records and their existing APIs/migration are retained in this package.

## Pages affected
- **Rentals:** creating a rental automatically creates an invoice.
- **Invoices:** automatically created invoices appear with a computed status and printable invoice output.
- **Payments & receipts:** recorded customer payments continue to allocate against an invoice, prevent overpayment, and show the invoice's status.
- **Overview / Reports / Customers:** existing summary functions consume the linked invoice and payment records in the app's current state.
- **Partners & sourcing:** retained, including the private supplier-cost fields and separate supplier payment workflow.

## Critical persistence limitation
This is a workflow/UI improvement over the current Command Centre application, but the existing non-partner rental and invoice/payment screens in this codebase still use the browser's `dh-command-demo` localStorage state. The partner-sourced rental itself is stored in D1, while this front-end auto-generated invoice is currently created in that browser-side state. **Do not treat this as a complete live financial-ledger integration yet.** To make the workflow production-safe, the next backend phase must create the owned/partner rental and its invoice together in D1, make invoices and payments load from D1, and use transactional/conditional payment allocation so a refresh or another staff session cannot cause duplicate or inconsistent records. Do not rely on the browser-side invoice as the official accounting record until that backend phase is deployed and tested.

## Deployment
1. Back up the repository and D1 database.
2. Replace `command/index.html`, `command/app.js`, and `command/styles.css` from this ZIP.
3. Add the partner API files under `functions/command/api/` if they are not already deployed.
4. Apply `command/migrations/0003_partner_sourcing.sql` only if it has not already been applied successfully. Do not rerun a successful migration containing `ALTER TABLE ADD COLUMN` statements.
5. Deploy to Cloudflare Pages.
6. Use a test customer and rental. Confirm an invoice appears automatically, then record a test payment and verify the invoice status changes to Partially paid and Paid as appropriate. Delete test records before real use.

## Validation
`command/app.js` passes `node --check`. This package has not been tested against the user's live Cloudflare Access/D1 environment. The production D1 accounting workflow described under Critical persistence limitation remains required before relying on this for official financial records.
