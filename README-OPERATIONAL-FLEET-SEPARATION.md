# DriveHub GH — Operational Fleet Separation

## What changed

- The public website fleet catalogue is no longer synchronised into the Command Centre's `vehicles` table.
- The Command Centre now treats `vehicles` as the operational register of actual hire vehicles only.
- Old catalogue-only rows created by the previous sync are excluded from the operational list. Existing rows with no registration number are also excluded until they are completed as real vehicle records.
- Each operational vehicle must have a unique registration number. This allows multiple vehicles of the same model to be registered separately.
- Add and edit operations create/update individual vehicle records by ID; adding another vehicle of the same model no longer overwrites the first one.
- Fleet cards have Edit and Delete controls. A vehicle with rental or maintenance history is archived (set to Inactive) instead of being physically deleted, preserving historical and financial references. A vehicle with no such references can be permanently deleted.
- Inactive and maintenance vehicles are excluded from new rental selection; the rental API also rejects them.

## Files to replace

1. `functions/command/api/vehicles.js`
2. `functions/command/api/rentals.js`
3. `command/app.js`
4. `command/styles.css`

Keep the directory paths exactly as shown. No D1 schema migration is required for these changes.

## Deployment and first-use checklist

1. Back up the current GitHub repository and production D1 database.
2. Replace the four files above and deploy through Cloudflare Pages.
3. Open Command Centre → Fleet. The old public-catalogue-only records should no longer appear as operational vehicles.
4. Add each actual hire vehicle separately, entering its correct model/description, registration number, daily rate, status, service due date and notes.
5. Test editing a vehicle and adding a second vehicle of the same model with a different registration number.
6. Test deleting a vehicle with no history (permanent deletion) and one with rental/maintenance history (archive only).
7. Confirm the public website's Fleet page still displays its vehicle categories; this change does not edit the public-facing catalogue or its images/prices.

## Important data handling

Existing D1 rows are not automatically deleted or rewritten. The old sync-generated rows are simply excluded from the Command Centre's operational fleet list. Vehicles with rental or maintenance references are archived rather than hard-deleted so that historic rentals, invoices and service records remain intact.
