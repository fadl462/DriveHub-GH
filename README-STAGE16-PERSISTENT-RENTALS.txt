DRIVEHUB GH — STAGE 16: PERSISTENT RENTAL MANAGEMENT

Changes in this update
- Added the deployed Pages Function route at functions/command/api/rentals.js for /command/api/rentals.
- GET reads saved D1 rentals with customer and vehicle names.
- POST validates rental dates, inclusive billable days, customer and vehicle records, vehicle status, overlapping rentals and scheduled maintenance; then inserts the rental and audit record.
- PATCH changes a saved rental status and records an audit entry. Terminal states (cancelled/completed) cannot be reopened.
- Command Centre now loads D1 rentals, displays them alongside clearly separate local preview records, creates database rentals when both selected customer and vehicle are D1 records, and persists cancellation/completion for D1 rentals.
- Local demonstration rentals remain browser-local and are not silently migrated or deleted.

Deployment
1. Merge these changed files into the existing DriveHub-GH-main project, preserving all other files.
2. Deploy the whole project to Cloudflare Pages (the functions directory must be at the project root).
3. Confirm the existing Pages D1 binding is named DB and Cloudflare Access variables ACCESS_TEAM_DOMAIN and ACCESS_AUD are configured.
4. Confirm migration 0001_initial_schema.sql has been applied to the intended D1 database and staff_users contains an active authorized staff account.
5. Test GET /command/api/rentals while signed in through Cloudflare Access.
6. Create a rental using a D1-backed customer and D1-backed vehicle. Confirm it appears after refresh.
7. Cancel that rental and refresh; confirm status remains Cancelled and the vehicle dates are released. Repeat for Complete.
8. Test an overlapping booking; the API should return HTTP 409 and must not create a duplicate booking.

Important
- The API uses the project's existing D1 schema and verified Access/staff middleware. It is not possible to confirm live database configuration from source code alone.
- Invoice/payment/review/maintenance workflows are not made persistent by this stage.
