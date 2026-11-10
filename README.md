# DriveHub GH — consolidated UI regression correction

This package combines the route-restoration code with the previously agreed menu and invoice-page rules.

## Files
- `command/index.html`
- `command/app.js`

## Restored requirements
- The URL-hash/session/local route restoration logic remains in `app.js`.
- Sidebar order: Overview, Rentals, Invoices, Payments & receipts, Reviews, Fleet, Customers, Audit trail, Reports.
- Settings remains in its existing bottom section.
- The standalone `＋ Create invoice` button and form are removed.
- The invoice page explains that invoices originate from rental records.
- A defensive guard prevents opening a standalone invoice action.
- Adds a Voided invoice filter.
- Cache-busts the Command Centre JavaScript reference.

## Install
Replace these two files at their exact paths and deploy to Cloudflare Pages. Then hard-refresh `/command/#invoices`.

## Test
1. Confirm the sidebar order.
2. Confirm `＋ Create invoice` is absent and the rental-origin message is visible.
3. Open Rentals, refresh, and confirm Rentals remains selected.
4. Open Invoices, refresh, and confirm Invoices remains selected.

This is a code patch and has not been deployed or verified on the live site.
