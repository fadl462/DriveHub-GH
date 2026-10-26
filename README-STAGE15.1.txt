DriveHub Command — Stage 15.1 Rental Fleet Dropdown Fix

PURPOSE
Restore the D1-backed fleet vehicle dropdown in the rental/invoice/payment dialogs while preserving the working D1 customer integration and page-on-refresh hash behavior.

CHANGED FILE
- command/app.js (only)

WHAT CHANGED
- Adds a D1 vehicle loader using /command/api/vehicles?limit=200.
- Loads customers and vehicles before opening rental, invoice, or payment dialogs.
- Updates the fleet view and overview after a successful vehicle API response.
- Keeps the existing browser fleet preview if the vehicle API fails; it does not replace it with an empty list on API failure.
- Preserves the customer loader and the current page hash/navigation behavior.

UPLOAD
Upload only command/app.js into the existing command/ folder in the DriveHub-GH repository, replacing that file. Do not upload this ZIP's folder as a new nested command/command directory. Do not replace index.html, styles.css, schema.sql, migrations, or the public website files.

IMPORTANT
This is a targeted frontend repair. It expects the existing /command/api/vehicles endpoint to be deployed and the D1 binding/authentication to be configured. If that endpoint returns no vehicle rows, the live dropdown will be empty because the connected database is reporting an empty fleet; if the API request fails, the local preview fleet is retained.
