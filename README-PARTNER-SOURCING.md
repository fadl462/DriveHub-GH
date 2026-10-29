# DriveHub GH — Partner Sourcing Update

## What this adds
- A private **Partners & sourcing** workspace in Command Centre.
- Database-backed rental partner directory (`/command/api/partners`).
- Temporary partner-sourced vehicle records (`/command/api/sourced-vehicles`). These are kept separate from `vehicles`, so they do not inflate DriveHub GH's owned fleet.
- Database-backed supplier payment records (`/command/api/supplier-payments`), separate from customer receipts.
- Partner-sourced rental booking endpoint (`/command/api/partner-rentals`) that stores the customer-facing rate and supplier cost separately, calculates totals in minor currency units, and checks overlapping dates for the same vehicle name.
- The Add Rental form now lets staff choose DriveHub GH fleet or Partner-sourced vehicle. Partner-sourced rentals require an active partner and supplier daily cost. The rental is saved to the database before it is added to the on-screen rental list.
- Partner rate, supplier cost and margin are internal Command Centre information and are not inserted into customer-facing public pages.

## Deployment
1. Back up the current GitHub repository and Cloudflare D1 database before deploying.
2. Add/replace `command/index.html`, `command/app.js`, and `command/styles.css` from this package.
3. Add these new API files at their exact paths:
   - `functions/command/api/partners.js`
   - `functions/command/api/sourced-vehicles.js`
   - `functions/command/api/supplier-payments.js`
   - `functions/command/api/partner-rentals.js`
4. Apply `command/migrations/0003_partner_sourcing.sql` **once** to the same Cloudflare D1 database used by Command Centre, after migration `0001_initial_schema.sql` (and any intervening migrations). Do not re-run migration 0003 after it has succeeded because SQLite `ALTER TABLE ADD COLUMN` statements are not repeatable.
5. Commit and push to the branch connected to Cloudflare Pages, then wait for deployment.
6. In Command Centre, open **Partners & sourcing** and add a test partner, test sourced vehicle, and test supplier payment. Then add a test partner-sourced rental and verify it appears in D1 `partner_rentals`.
7. Remove test records before using the workflow for live bookings.

## Required existing infrastructure
- Cloudflare Pages Functions enabled.
- Existing `DB` D1 binding.
- Existing Cloudflare Access and staff authorization middleware configured. This package does not bypass or weaken authentication.
- Existing `functions/command/api/_utils.js` and `_middleware.js` retained unchanged.

## Important current boundary
The new partner and supplier records, and partner-sourced rental booking, are saved through the new APIs. The legacy general rental workflow in this project still uses its existing browser-side records for non-partner rentals; this package does not claim to convert all existing owned-fleet rental operations to D1 persistence. Also, supplier payment records currently capture outgoing payments but do not yet allocate those payments against individual supplier invoices/obligations, so outstanding supplier balances should not be treated as a fully reconciled accounts-payable ledger yet.

## Validation
`command/app.js` passes `node --check`. Live Cloudflare D1/API behavior must be confirmed after migration and deployment; it cannot be verified from the local package alone.
