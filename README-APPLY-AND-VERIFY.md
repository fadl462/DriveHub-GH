# DriveHub GH — Latest Source Restoration & Rental D1 Fix

Built from the latest project ZIP supplied in this conversation.

## Replace these exact files
- `command/app.js`
- `command/index.html`
- `functions/command/api/rentals.js`

No public website pages, CSS, vehicle images, AI Partner files, customer API, invoice API, payment API, or database migrations are overwritten.

## Root cause found
The current Command Centre fetched Rentals and Invoices from D1, but the standard Add rental form still created the rental in browser `localStorage`. On the next page load, the D1 fetch replaced the browser list. This is why a rental such as DH-211 could appear temporarily and then disappear, while older D1 rows returned. The interface also contained a static note incorrectly claiming standard rentals were browser-only.

## Changes

### Standard rental creation
- Customer and vehicle selectors now use their actual D1 IDs, not display names.
- The form refuses to create a browser-only rental if any required live API is unavailable.
- New rentals are POSTed to `/command/api/rentals`.
- The API creates the rental, invoice and invoice line item together in a D1 batch.
- If an existing rental is retried with the same ID and matching details but has no invoice, the API backfills one. If the ID exists with different details, the API rejects the request rather than treating it as a duplicate.
- The success message is shown only after the API succeeds and reports the rental ID, invoice number and total.

### Rental editing and status changes
- Keeps the existing D1 edit dialog and PUT API.
- Complete and Cancel now update D1, not browser-only state.
- The API only checks date conflicts when a rental is Upcoming or Active.
- Invoice identity, discount and payment rows are preserved when recalculating the linked invoice. If a revised total would be lower than the amount already paid, the API rejects the edit rather than changing payment history.

### Recovery of old browser-only rentals
- Before the live D1 list replaces browser state, user-created non-seed local rentals are copied to a separate localStorage recovery queue.
- The Rentals page displays these separately as unreconciled browser records, not as live D1 rentals.
- Recovery is available only when exactly one live customer and one live vehicle match, and the dates and daily rate are valid.
- Recovery requires confirmation, uses the original rental ID, and creates its linked invoice.
- If a customer or vehicle is missing or ambiguous, the record is retained in the recovery queue and the UI explains what needs resolving.
- This can recover DH-211 only if its browser copy still exists in browser storage when this updated app first runs. If it was already overwritten or cleared, the source ZIP does not contain the missing customer/rental details needed to reconstruct it safely.

### Data visibility and navigation
- Rentals API uses LEFT JOINs so orphaned rental rows are not silently hidden when a customer or vehicle link is missing.
- Removed the obsolete helper note that said standard rentals were browser-only.
- Restored the agreed navigation order: Overview, Rentals, Invoices, Payments & receipts, Reviews, Fleet, Customers, Audit trail, Reports. Settings remains at the bottom.

## Deployment
1. Replace the three files at their exact paths in the repository.
2. Commit and push to the same branch used by Cloudflare Pages.
3. Wait for the deployment to finish.
4. Hard-refresh the Command Centre with Ctrl+Shift+R and sign in again.

## Verification
1. Check whether an unreconciled local rental recovery panel appears. If DH-211 is still in browser storage, it should be listed there.
2. If recovery is enabled, confirm its customer and vehicle match before recovering it. This creates the rental and linked invoice in D1.
3. Add a new test rental. Confirm the success message contains a rental ID, invoice number and total.
4. Refresh. Confirm the rental and invoice remain visible.
5. Edit a test rental, then complete or cancel it. Confirm changes persist after refresh.
6. Check DH-210 separately and confirm Company (Larbi), October dates and its existing payment history remain unchanged.

## Validation and scope
- `command/app.js` and `functions/command/api/rentals.js` passed Node.js syntax checks.
- The latest source already contains the footer tagline removal and order-slip image fit rule; those public-site files are deliberately not overwritten.
- This package has not been deployed. Creating it did not change any D1 records.
