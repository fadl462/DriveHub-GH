# DriveHub Command API contract — Stage 13

## Implemented in this stage

| Method | Route (likely nested under `/command`) | Purpose | Authorization |
|---|---|---|---|
| GET | `/command/api/health` | Check whether D1 binding exists | Public readiness probe; no business data |
| GET | `/command/api/customers` | Search/list up to 100 customers | Active staff; role allowlist |
| POST | `/command/api/customers` | Create customer | `admin`, `operations` |
| GET | `/command/api/vehicles` | List/filter up to 200 vehicles | Active staff; role allowlist |
| POST | `/command/api/vehicles` | Create vehicle | `admin`, `operations` |

## Authentication model
- Cloudflare Access protects the Command route and sends `Cf-Access-Jwt-Assertion`.
- Middleware verifies the JWT RS256 signature using the Access team's published JWKs, plus issuer, audience and time claims.
- The verified `sub` and `email` must match an active `staff_users` record.
- Role authorization is enforced in each endpoint. A request header containing an email is not accepted as authentication.

## Required Pages project environment
- D1 binding named `DB`.
- `ACCESS_TEAM_DOMAIN`: Access team hostname, e.g. `example.cloudflareaccess.com` (hostname only).
- `ACCESS_AUD`: the Access application's audience tag.

Use Cloudflare Pages environment variables/bindings, not frontend JavaScript or committed secrets. Protect `/command/*` with Cloudflare Access. Test in a development environment first.

## API behavior and limitations
- JSON content type and request size are checked for writes.
- SQL uses bound parameters.
- Currency is stored as integer minor units (`daily_rate_minor`).
- Create operations write an `audit_log` event.
- Protected routes return 503 until DB and identity configuration are present; invalid/missing identity returns 401; unregistered/inactive staff returns 403.
- Customer email is not unique in the current schema, so the endpoint does not enforce uniqueness by email.
- These endpoints do not yet connect the frontend UI, and they do not implement rentals, invoices, payments, reviews, maintenance, or reports.
- Multi-step write and audit operations are not yet transactional. Production hardening should make business mutation + audit atomic and add rate limits, pagination cursors, monitoring, and tests.
