# DriveHub GH — Correct Command Centre Invoice Page Patch

## Why this patch targets `command/`
The live Command Centre route `/command/` is served by `command/index.html` and loads `command/app.js`.
The earlier workflow ZIP modified root-level `index.html` and `app.js`, which belong to the public site and did not change the Command Centre page shown in the screenshot.

## Changes
- Removes the `＋ Create invoice` control from the actual Command Centre Invoices page.
- Replaces it with an explanation that invoices originate from rental records.
- Removes the standalone invoice form and its browser-preview invoice creation handler.
- Adds a guard so an attempt to open the standalone invoice action is rejected.
- Updates the app.js query version to avoid stale browser cache.

## Install
Replace these exact paths in the project:
- `command/index.html`
- `command/app.js`

Deploy the project to Cloudflare Pages, then hard-refresh `/command/#invoices`.

## Important limitation
This is the corrective UI patch for the exact files serving the page in the screenshot. It does not by itself complete the rental-to-D1 invoice and payment integration. The uploaded project currently renders rentals, invoices and payments from browser-preview state in `command/app.js`, even though a separate D1 rental API already contains automatic invoice creation logic. That frontend/API connection must be completed and verified as a separate coordinated change before relying on it for live financial records.
