# DriveHub GH — Outstanding Payments & Receipt Workflow

## Updated files
- `command/index.html`
- `command/app.js`
- `command/styles.css`

## What this adds
- Payments & receipts now includes an Outstanding invoices table sourced from invoices.
- Each unpaid or partly paid invoice shows invoice number, customer, due date, invoice total, amount paid and remaining balance.
- **Part payment** opens the payment form with the invoice/customer selected and the amount left blank.
- **Mark fully paid** opens the same payment form with the exact remaining balance prefilled. Staff still select/confirm payment method and date; the system does not assume money was received.
- Each successful payment is recorded as its own transaction in D1, using the existing conditional payment API. Overpayments are rejected by both frontend and backend.
- After successful payment, invoice balance/status reloads from D1.
- Each payment gets its own receipt number and a print dialog suitable for saving as PDF.
- Payment history remains visible, with a PDF print option for each transaction.
- A new outstanding-balance metric is included.

## D1 integration
The frontend loads `/command/api/invoices` and `/command/api/payments` and records payments through `POST /command/api/payments`.
This uses the existing backend endpoints in `functions/command/api/` and requires:
- Cloudflare Pages Functions deployed from `functions/command/api/invoices.js` and `payments.js`
- D1 binding `DB` correctly configured
- Existing invoice/payment tables and migration `command/migrations/0002_invoice_items.sql` (plus any previously applied schema/ledger migrations)

If the D1 financial API is unavailable, the UI explicitly falls back to the browser preview state; preview entries are not production accounting records. Check the browser console and Cloudflare Pages Functions logs if the live ledger cannot be loaded.

## Install
Replace the three files at their exact paths. No new migration is required for this frontend update.

## Validation
`node --check command/app.js` should pass. Live D1 authentication, staff roles, and payment writes must be tested in the deployed Cloudflare environment. The PDF action opens the browser print dialog; choose **Save as PDF**.
