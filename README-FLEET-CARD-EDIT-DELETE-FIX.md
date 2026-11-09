# DriveHub GH — Fleet card Edit/Delete controls

## What this corrects

- Every vehicle card now displays **Edit vehicle** and **Delete vehicle**, including legacy/browser-preview cards that do not yet have a D1 vehicle ID.
- Editing a D1 vehicle updates that record through `PUT /command/api/vehicles`.
- Editing a legacy/preview vehicle while D1 is connected registers it as a new operational vehicle through the API; it is no longer silently treated as an update to a missing ID.
- When the API is unavailable, preview-only records can still be edited or removed from that browser's local preview. The interface explicitly says this is a local preview action, not a database deletion.
- Deleting a D1 vehicle uses the API. Vehicles with rental or maintenance history are archived by the API; records without history can be permanently deleted.
- Public website fleet categories are not changed.

## Files to replace

1. `command/app.js`
2. `command/styles.css`
3. `functions/command/api/vehicles.js`

Keep the paths exactly as shown. No new D1 migration is required. The API file is included to ensure the corresponding GET/POST/PUT/DELETE handlers are deployed together with the interface.

## Deployment and verification

1. Back up the repository and production D1 database.
2. Replace the three files above and deploy the Cloudflare Pages project.
3. Open Command Centre → Fleet and hard-refresh the page.
4. Confirm each card displays both actions.
5. Edit a vehicle and confirm the registration number/rate/status persist after refresh.
6. Delete a vehicle with no history and confirm it disappears.
7. Test a vehicle with rental or maintenance history; it should be archived, not physically deleted.

If the page still shows old cards after deployment, check the Cloudflare Pages deployment commit and browser cache. If the API is unavailable, preview-only edits/deletes are browser-local and will not update production D1.
