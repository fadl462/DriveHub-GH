DriveHub GH — Stage 16.1 Rental Filter Fix

Changed file:
  command/app.js

Fix:
- Connects All rentals, Active, Upcoming, and Completed buttons to the rental filter state.
- Updates the selected-tab styling when a filter is chosen.
- Connects the rental search field to the same renderer.
- Keeps the existing D1 rental loading and rental save/status handlers intact.

Install:
1. Extract this ZIP.
2. Upload/replace command/app.js in the DriveHub-GH repository, preserving the folder path.
3. Commit the change and wait for the Cloudflare Pages deployment to succeed.
4. Hard-refresh the Command Centre (Ctrl+Shift+R).
5. Test each filter and the search field.

Expected behavior:
- All rentals: all statuses, including cancelled records if retained in the records.
- Active: rentals whose status is Active.
- Upcoming: rentals whose status is Upcoming.
- Completed: rentals whose status is Completed.
- Search filters the currently selected set by booking ID, customer, or vehicle.

This package contains only the changed app file plus this note. Test in the deployed environment before treating the workflow as production-verified.
