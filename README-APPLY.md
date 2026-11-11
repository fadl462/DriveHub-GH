# DriveHub GH — Rental Editor and D1 Persistence Fix

Replace these files at their exact repository paths:
- `command/app.js`
- `functions/command/api/rentals.js`

## What this fixes
- Removes the browser `prompt()` rental editor that changed only local preview state.
- Adds a proper edit dialog populated from the selected rental's actual D1 customer and vehicle IDs.
- Saves edits through `PUT /command/api/rentals/{route}` (Cloudflare Pages function uses the same `/command/api/rentals` path and PUT method).
- Updates the selected rental by its exact rental ID, not by customer name. This prevents Agent Larbi (DH-211, February) from being confused with Company (Larbi) (DH-210, October).
- Recalculates the linked invoice subtotal and total when dates or daily rate change, retaining the same invoice ID/number, discount and existing payment rows. Invoice payment status is recalculated from the preserved payments.
- Refreshes Rentals and Invoices from D1 after a successful edit. Failed edits do not mutate local preview state.

## Important record protection
This is an editor/API correction. It does not directly change DH-210, DH-211, any customer assignment, or any existing payment. Select the intended rental row before editing. DH-211 remains Agent Larbi (February); DH-210 remains Company (Larbi) (October).

## Deploy and verify
1. Replace the two files at the paths above.
2. Commit and push to the Cloudflare Pages deployment branch.
3. Wait for deployment.
4. Open Rentals and edit DH-211. Confirm Agent Larbi and its February dates are preselected.
5. Save without changing values; confirm the rental and linked invoice remain consistent.
6. Open DH-210 separately and confirm Company (Larbi), October dates, 31 days and its payment history remain unchanged.

The updated frontend and API JavaScript passed syntax checks.
