# DriveHub GH — Fleet, Customer Controls & Command Centre Focus

## What this update changes

1. Makes **Edit vehicle** and **Delete vehicle** controls explicitly visible on every active operational fleet card. The page now cache-busts the Command Centre JS and CSS so the updated controls are not masked by an older browser-cached bundle.
2. Keeps vehicle changes connected to the existing `/command/api/vehicles` D1 endpoints. Vehicles with rental or maintenance history are archived (set inactive) rather than hard-deleted.
3. Adds **Edit** and **Delete** actions to the Customers table. Customer edits are saved through the D1 API. Delete archives a customer using `archived_at`, preserving all linked rentals, invoices, payments and reviews.
4. Removes **Partners & sourcing** from the Command Centre navigation and removes its screen from the Command Centre page.
5. Removes partner-sourced vehicle choices from the new-rental form. New rentals are limited to DriveHub GH's own operational fleet.
6. Keeps existing historical records intact. The update does not delete historical partner-sourced rental records or their financial history.

## Files in this ZIP

- `command/app.js`
- `command/styles.css`
- `command/index.html`
- `functions/command/api/vehicles.js`
- `functions/command/api/customers.js`
- `command/migrations/0005_customer_archive.sql`

## Deployment

1. Back up the current repository and D1 database.
2. Replace each file at the exact path shown above.
3. Apply **only** `command/migrations/0005_customer_archive.sql` to the same production D1 database bound to the DriveHub GH Pages/Functions deployment. Earlier migrations are not to be rerun.
4. Commit and deploy the updated project to Cloudflare Pages.
5. Open `/command/#fleet` and hard-refresh. The HTML references a versioned `app.js` and `styles.css` URL to force the updated interface assets to load.
6. Verify that vehicle cards show Edit vehicle and Delete vehicle. Test with a non-critical test record first.
7. Open `/command/#customers` and test editing a customer. Test Delete on a test customer; it should disappear from the active directory while linked history remains intact.
8. Confirm that Partners & sourcing is absent from the sidebar and that the Add rental form only offers DriveHub GH vehicles.

## Important behavior

- Deleting a vehicle with rental or maintenance history archives it by changing its operational status to `inactive`; it is not permanently erased.
- Deleting a customer archives it by setting `archived_at`; it is not permanently erased. This preserves referential integrity and financial history.
- Browser-preview records are clearly local-only. Editing/deleting a preview record changes only this browser's local preview; production records must be loaded from the connected D1 database.
- Existing partner-related API files and database tables are intentionally left in place so historical data is not destroyed. Their management screen and new-rental entry path are removed from the user-facing Command Centre for now.

## Validation performed

- JavaScript syntax check: `command/app.js` passed.
- JavaScript syntax check: `functions/command/api/vehicles.js` passed.
- JavaScript syntax check: `functions/command/api/customers.js` passed.
- SQLite migration sequence tested against a fresh schema through `0005_customer_archive.sql`.
- Live Cloudflare deployment and live D1 actions have not been performed or verified by this update.
