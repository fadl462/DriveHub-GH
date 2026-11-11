# Rental edit form update

## Files
- `command/app.js`

## What changed
- The Rentals table's Edit action now reopens the full rental form instead of using a sequence of browser prompt boxes.
- Existing customer, vehicle, daily rate, pickup date, return date, status and notes are prefilled.
- Saving validates the date range, positive daily rate, vehicle booking conflicts and scheduled maintenance conflicts.
- Billable days continue to be calculated from the inclusive pickup/return dates. Correct the dates to correct the day count.
- If a matching invoice exists in the current browser state, its total is recalculated from daily rate × billable days. Existing payments are retained; the invoice status is recalculated against the revised total.
- Customer names are also refreshed on linked payment rows in the current browser state.
- An audit entry records the before/after details.

## Important limitation
The Rentals screen in the supplied project explicitly identifies standard rental records as browser-preview records. This patch edits that browser-preview state and recalculates a linked invoice in the same state; it does **not** write edits to Cloudflare D1. Do not treat this as a persistent database edit. A D1-backed rental update endpoint and corresponding financial-ledger update workflow are a separate required integration before these edits can be treated as permanent production records.

## Install
Replace `command/app.js` in the project and deploy the updated project to Cloudflare Pages. Hard-refresh the Command Centre after deployment.
