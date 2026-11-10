# DriveHub GH — Refresh Route Hardening (final correction)

## Root cause corrected
The standalone `＋ Create invoice` button had already been removed from `command/index.html`, but `command/app.js` still attempted to assign an `onclick` handler to `#newInvoiceBtn`. Because that element no longer exists, the browser throws a null-reference error during application startup. That interrupts the remaining startup code, including the route restoration logic.

This patch removes that obsolete event binding and keeps invoice creation tied to rental creation, as requested.

## Files
- `command/index.html`
- `command/app.js`

## Also retained
- Early route bootstrap reads the URL hash before the application starts.
- Sidebar and active view are restored from the requested hash (e.g. `#rentals`).
- The rental, fleet and customer edit/delete controls from the Controls Restored package are preserved.
- No standalone Create invoice button is added back.
- Cache-busting version updated.

## Install
Replace only the two files at their exact paths and deploy to Cloudflare Pages. Then hard-refresh `/command/#rentals`.

## Verification checklist
1. Open Rentals and refresh; Rentals must remain selected.
2. Repeat with Invoices, Payments & receipts, Fleet and Customers.
3. Confirm rental Edit/Complete/Delete or Cancel controls are present as appropriate.
4. Confirm vehicle and customer Edit/Delete controls remain present.
5. Confirm the standalone `＋ Create invoice` button remains absent.

The JavaScript passes `node --check`. This package has not been deployed or live-tested on Cloudflare Pages.
