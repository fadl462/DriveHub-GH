# Cloudflare Pages Functions — Stage 13

This stage adds a small protected API for customers and vehicles. It is not yet connected to the dashboard UI.

## Required configuration
1. Create a separate D1 development database.
2. Apply `migrations/0001_initial_schema.sql` in development.
3. Add a D1 binding named `DB`.
4. Set `ACCESS_TEAM_DOMAIN` to the Cloudflare Access team hostname and `ACCESS_AUD` to the Access application audience tag.
5. Protect `/command/*` with a Cloudflare Access application and allow only named staff.
6. Add each authorized person to `staff_users`, matching the verified Access JWT `sub` and email, with the least-privilege role required.
7. Test unauthenticated, unauthorized, duplicate, malformed and successful requests before any production deployment.

## Routes
- `GET /command/api/health`
- `GET|POST /command/api/customers`
- `GET|POST /command/api/vehicles`

The middleware cryptographically verifies Access JWTs and then checks active staff in D1. Do not trust raw identity headers. Business mutation + audit writes are not yet atomic; this stage is a development foundation, not a production release.
