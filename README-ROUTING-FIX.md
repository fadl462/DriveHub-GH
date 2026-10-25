# DriveHub Command — Pages Functions Routing Fix

## What this patch changes
Adds the Command API to the **repository-root** Cloudflare Pages Functions tree without replacing the existing `functions/api/chat.js` handler or modifying the public website assets.

New API URLs:
- `GET /api/command/health` — public readiness probe; does not return business data.
- `GET /api/command/customers` — Cloudflare Access authenticated; staff role required.
- `POST /api/command/customers` — authenticated; admin/operations roles only.
- `GET /api/command/vehicles` — authenticated; staff role required.
- `POST /api/command/vehicles` — authenticated; admin/operations roles only.

The older `/command/api/...` paths are not used by this routing patch. Pages Functions routes are generated from the root `functions/` directory, so the canonical API prefix is `/api/command/`.

## Install
Upload/extract the ZIP contents into the **repository root**, preserving paths. The patch adds `functions/api/command/` and does not include or replace `functions/api/chat.js`.

## Required Cloudflare configuration
In Pages project `drivehub-gh` → Settings → Bindings, add a D1 binding:
- Variable name: `DB`
- Database: the DriveHub Command D1 database you create or select

In Settings → Variables and secrets, add:
- `ACCESS_TEAM_DOMAIN`: Cloudflare Access team hostname only, e.g. `your-team.cloudflareaccess.com` (not a URL, no path)
- `ACCESS_AUD`: the Application Audience (AUD) tag for the Cloudflare Access application protecting the Command Centre

The Cloudflare Access application must protect the Command Centre and send `Cf-Access-Jwt-Assertion` to the API. Do not test authenticated data routes until the app is configured and staff records are provisioned.

## Database
Apply the schema in `command/migrations/0001_initial_schema.sql` to the D1 database before using customer/vehicle endpoints. Create an active staff record whose `identity_subject` exactly matches the Access JWT `sub`, and whose email matches the Access identity email. Use a supported role: `admin`, `operations`, `finance`, `review_moderator`, or `read_only`.

## Verify after deployment
1. Open `https://drivehub-gh.pages.dev/api/command/health`.
2. Before adding the D1 binding, it should return JSON with `database_not_configured` and HTTP 503.
3. After adding the binding and applying the schema, it should return `database_connected` and HTTP 200.
4. Unauthenticated requests to `/api/command/customers` and `/api/command/vehicles` should be rejected.
5. Authenticated staff may use GET; only admin/operations may POST.

## Important limits
This patch establishes correct Pages Functions routing and server-side Access-token verification. It does not yet connect the existing browser-local Command Centre interface to these endpoints. The dashboard will continue to show its preview notice until frontend integration is implemented and tested. The API is not production-ready until D1, Access, staff provisioning, and live endpoint tests are completed.
