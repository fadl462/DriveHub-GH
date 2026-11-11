# DriveHub GH — Automatic Rental Invoice Generation

## Replace this file
- `command/app.js`

## What this fixes
- Standard DriveHub fleet rentals are saved to Cloudflare D1 through `/command/api/rentals`, rather than being stored only in the browser.
- The existing D1 rental API creates the rental, linked invoice, and invoice line item in one D1 batch. A successful save therefore creates the invoice automatically.
- The customer and vehicle selectors submit their D1 record IDs, not display names, preserving correct foreign-key links even when two customers share a name.
- The Rentals and Invoices views load their records from D1 at startup and after a rental is created. The generated invoice remains visible after refresh.
- Existing vehicle/date conflict checks and maintenance checks are retained.

## Partner-sourced rentals
The existing partner-rental endpoint stores partner rentals separately and does not create a standard fleet invoice. This package preserves that workflow and clearly informs staff of that limitation. Automatic invoicing is implemented for standard DriveHub-owned fleet rentals.

## Deploy and test
1. Replace `command/app.js` at the exact path above.
2. Commit and push to the Cloudflare Pages deployment branch.
3. Wait for deployment to complete.
4. Add a test rental using a customer and vehicle from the live D1 selectors.
5. Confirm the success message shows the generated invoice number and total.
6. Open Invoices and confirm the invoice is present.
7. Refresh the Command Centre and confirm the rental and invoice remain.

The existing `/command/api/rentals` backend already performs rental + invoice + invoice-item creation in one D1 batch and returns the generated invoice number. This update connects the front-end rental workflow to that existing API.
