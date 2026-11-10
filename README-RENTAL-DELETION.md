# DriveHub GH — Safe rental deletion and cancellation

## Updated files
- `command/index.html`
- `command/app.js`
- `functions/command/api/rentals.js`

## Behaviour in Command Centre browser preview
- Rentals with no explicitly linked invoice expose **Delete**.
- Deleting such a draft removes only the rental and writes an audit entry.
- Rentals with an explicitly linked invoice expose **Cancel** instead.
- Cancelling an unpaid linked rental changes rental status to `Cancelled` and invoice status to `void`.
- If a linked invoice has one or more payments, cancellation is blocked with a clear message. Payment and receipt records are never deleted.
- Invoice filters include **Voided**. Voided invoices are excluded from active invoiced, collected and outstanding totals.
- The sidebar order remains Overview, Rentals, Invoices, Payments & receipts, Reviews, Fleet, Customers, Audit trail, Reports.

## D1 API behaviour
`DELETE /command/api/rentals?id=<rental_id>`:
- Permanently deletes a rental only when no invoice is linked.
- Voids the linked invoice and cancels the rental when the invoice has no payments.
- Returns HTTP 409 when payments exist. Refund/credit-note handling is not implemented in this patch, so the endpoint deliberately blocks cancellation rather than damaging the financial ledger.
- Writes audit records.

## Important data-source limitation
The screenshot/project's standard rental list still uses browser-preview state. This patch adds the safe preview behaviour and the production D1 endpoint, but does not claim the page has been fully switched to D1 for rental listing/deletion. Do not treat preview deletion as a production database deletion until the frontend is connected to the D1 rental API and tested.

## Install
Replace the three files at the exact paths above and deploy to Cloudflare Pages. No database migration is required for this patch.
