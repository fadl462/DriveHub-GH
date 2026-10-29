# DriveHub GH — Invoice payment workflow UI update

## Files included
- `command/index.html`
- `command/app.js`

## Changes
- Invoices table now shows Total, Paid, Balance and the calculated payment status.
- Each invoice has a `Record payment` action, disabled when the invoice balance is zero.
- Clicking `Record payment` opens the payment form with the invoice and customer preselected, today's date filled in, and the outstanding balance shown as the amount limit/placeholder.
- Invoice status continues to be derived from recorded amounts: Unpaid, Partially paid, Paid, or Overdue. Staff should not manually override the status.

## Apply
Copy these two files to the matching paths in the repository, commit and deploy, then hard-refresh the Command Centre.

## Important limitation
This package updates the current Command Centre interface and its existing form flow. In the source version used here, the general invoice/payment submit handlers still include browser-state storage. This package does not claim to finish database persistence or replace that handler with D1 transactions. Do not rely on browser-only records as the official ledger; D1-backed invoice/payment integration remains a separate production requirement.
