# DriveHub GH — Functional controls restored + refresh route fix

This consolidated package uses the safe-rental-deletion frontend as its functional base. It does not replace it with the older route-only frontend.

## Included files
- `command/index.html`
- `command/app.js`
- `functions/command/api/rentals.js`

## Preserved management controls
- Rental Edit and Complete actions.
- Draft rental Delete and invoiced rental Cancel actions.
- Customer Edit and Delete actions.
- Fleet vehicle Edit and Delete actions.
- Safe invoice/payment handling from the rental-deletion patch.
- Audit trail entries for draft deletion and cancellation.
- Invoice filters including Voided; voided invoices excluded from active totals.

## Preserved interface requirements
- Sidebar order: Overview, Rentals, Invoices, Payments & receipts, Reviews, Fleet, Customers, Audit trail, Reports.
- No standalone Create invoice button.
- Invoices page explains invoices are generated from rentals.
- Direct invoice-dialog attempts are blocked with a clear message.
- Route is saved in URL hash, session storage and local storage and restored on startup/pageshow.

## Install
Replace the three files at the exact paths above, then deploy to Cloudflare Pages.

## Regression test checklist
1. Open Rentals. Check the Actions column (scroll the table horizontally if necessary) for Edit and Delete/Cancel.
2. Open Fleet. Confirm Edit and Delete controls appear on vehicle cards.
3. Open Customers. Confirm Edit and Delete controls appear.
4. Refresh on Rentals, Invoices, and Payments & receipts; confirm each section remains selected.
5. Confirm Create invoice is absent and the automatic-invoice note is visible.

## Important limitation
The safe deletion frontend still includes browser-preview state for some rental operations. The D1 DELETE API is included, but production persistence must be verified against the live database; do not interpret browser-only changes as confirmed D1 changes. Cancellation is deliberately blocked when payments exist until refund/credit handling is implemented.
