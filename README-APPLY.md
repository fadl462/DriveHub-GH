# DriveHub GH — Live Rentals Connection and Database Editing Fix

Replace these three files:
- `command/app.js`
- `command/index.html`
- `functions/command/api/rentals.js`

## What this corrects
- Loads Rentals and Invoices from the authenticated D1 APIs at Command Centre startup.
- Replaces local browser-preview rentals with the persisted D1 rental list after a successful API response.
- Changes the workspace badge from "Workspace preview" to "Live database" only after both live rental and invoice APIs respond successfully.
- Carries the actual `customer_id` and `vehicle_id` through the rental list so the editor targets the selected rental's exact database relationships.
- Replaces the old `prompt()` editor with a proper edit dialog.
- Saves edits with `PUT /command/api/rentals`, updating the selected rental by rental ID.
- Recalculates the linked invoice rental line, subtotal, total and payment status while preserving invoice number, discounts and all payment records.
- If the live API fails, the UI retains preview data but editing is blocked with an explicit explanation. It does not pretend a local preview edit was saved.

## Protecting the two Larbi records
No customer assignment is hard-coded or changed by this update. The editor reads customer and vehicle IDs from the selected D1 row:
- DH-211 should display the customer linked to DH-211 (Agent Larbi).
- DH-210 should display the customer linked to DH-210 (Company (Larbi)).
No database record is modified until a staff member explicitly saves the edit form.

## Deploy
1. Replace the three files at the exact paths above.
2. Commit and push to the Cloudflare Pages production branch.
3. Wait for deployment.
4. Open Command Centre and reload Rentals.
5. Confirm the workspace badge says "Live database".
6. Edit DH-211 and confirm Agent Larbi / February details load.
7. Open DH-210 separately and confirm Company (Larbi), October details and existing payments remain.

Both JavaScript files passed Node syntax validation. The package has not been deployed to Cloudflare.
