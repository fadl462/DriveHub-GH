# DriveHub GH — Live-only Command Centre

This update removes the browser-preview fallback for the core operational records and makes the Command Centre wait for live D1 data before displaying operational screens.

## Files to replace in GitHub

- `command/index.html`
- `command/app.js`
- `command/styles.css`

Keep the directory paths exactly as shown.

## Behaviour after deployment

- The header starts with “Connecting to live database…”.
- It changes to “Live database” only after live customers, fleet, rentals, invoices, payments and reviews load successfully.
- If any required live API fails, the page shows “Database unavailable” and a Retry connection button. It does not silently show stale browser-cached/demo business records.
- The status pill is an indicator, not a switch.
- Existing local browser data is not deleted by this code change, but it is no longer used as the operational source for the supported live modules.
- The demo maintenance list is suppressed.

## Deployment

1. Download and extract this ZIP.
2. Replace the three files at the exact paths in your GitHub repository.
3. Commit and push.
4. Wait for Cloudflare Pages to deploy.
5. Open `https://drivehub-gh.pages.dev/command/` and hard-refresh with Ctrl+F5.

## Important scope note

This makes the customer, fleet, rental, invoice, payment and review screens fail closed unless their D1-backed APIs load. The audit log and business-profile preferences in this supplied project are still browser-local features; they require a separate D1-backed implementation before the entire Command Centre can truthfully be described as fully database-persistent.

No live database records are modified by this frontend package. The live deployment and D1 connectivity must be verified after upload.
