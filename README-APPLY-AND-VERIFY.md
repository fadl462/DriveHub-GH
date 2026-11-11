# DriveHub GH — Rental Filters & Historical Entries Hide

## Replace only
- `command/app.js`

## Fixes
1. Restores the missing click handler for the Rentals page status tabs:
   - All rentals
   - Active
   - Upcoming
   - Completed
2. Restores live search input handling on the Rentals page.
3. Hides completed historical rentals `DH-216` and `DH-210` from the operational Rentals list and its status counts.
4. Hides the invoices linked to those two rental IDs from the Invoices page and its totals.
5. Hides payment history entries linked to those invoices from the Payments & receipts page, including the payment totals, transaction count and method count.

## Financial data safety
This is an operational archive/hide, not a deletion. The D1 rentals, invoices, payment records, receipts and audit history remain intact for accounting and reconciliation. The records are excluded from the three operational pages only. No D1 rows are deleted or modified by this update.

## Apply
1. Extract `command/app.js` into the repository, replacing the existing file.
2. Commit and push to the Cloudflare Pages deployment branch.
3. Wait for deployment, then hard-refresh the Command Centre (Ctrl+Shift+R).

## Verification
- Click each Rentals tab and confirm the rows and selected-tab styling change.
- Search for an active or upcoming rental to confirm search still works.
- Confirm DH-216 and DH-210 no longer appear in Rentals.
- Confirm their linked invoices are not in Invoices.
- Confirm their linked payment transactions are not in Payments & receipts.
- Confirm unrelated rentals, invoices and payments remain visible.

## Validation
`command/app.js` passed `node --check`.
This package has not been deployed and does not modify the live database.
