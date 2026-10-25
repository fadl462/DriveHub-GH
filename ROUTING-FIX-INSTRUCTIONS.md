# DriveHub Command — Stage 13 Routing Fix

## What this fixes
The previous API files under `functions/api/command/` map to `/api/command/*`, which does not match the Cloudflare Access application protecting `/command/*`. This package puts the API at `/command/api/*` so the browser URL, Pages Functions route, and Access policy agree.

## Upload carefully
1. Unzip this package.
2. Copy the included `functions/command/` folder into the **repository root**, merging the existing root `functions` folder. Do not put it inside `command/`.
3. In the GitHub repository, remove the old duplicate directory `functions/api/command/` after confirming the new files are present. It creates a second `/api/command/*` API surface. Do not delete `functions/api/chat.js` or other public API functions.
4. Commit and wait for the Cloudflare Pages deployment to finish.

## URLs after deployment
- Health: `https://drivehub-gh.pages.dev/command/api/health`
- Customers: `https://drivehub-gh.pages.dev/command/api/customers`
- Vehicles: `https://drivehub-gh.pages.dev/command/api/vehicles`

The health route is exempt from the Pages JWT-to-staff check but is still behind the Cloudflare Access application path `/command/*`. It reports only D1 connectivity and explicitly does not claim production readiness.

## Required configuration
Cloudflare Pages > Settings > Variables and secrets:
- `ACCESS_TEAM_DOMAIN` = `drivehubghana.cloudflareaccess.com` (team hostname only, no `https://`)
- `ACCESS_AUD` = the audience tag for the DriveHub Command Centre Access application

Cloudflare Pages > Settings > Bindings:
- D1 binding variable name `DB`, bound to the intended DriveHub Command D1 database.

## Critical limitation
The dashboard still uses browser-local demo data. This routing fix does not connect the UI to D1, provision staff accounts, or make the app production-ready. Do not enter real customer or financial data until those steps and authorization tests are complete.
