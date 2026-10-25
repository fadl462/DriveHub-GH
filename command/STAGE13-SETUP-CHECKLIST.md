# Stage 13 setup checklist

## Before deployment
- [ ] Create a separate Cloudflare D1 development database.
- [ ] Apply `migrations/0001_initial_schema.sql` to development and verify the tables/indexes.
- [ ] Bind the database as `DB` to the Pages project.
- [ ] Configure `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` as Pages environment variables.
- [ ] Protect `/command/*` with Cloudflare Access.
- [ ] Create the initial admin staff row using the exact verified Access subject and email. Do this through a controlled admin procedure; do not expose public self-registration.
- [ ] Deploy to a development/preview environment first.
- [ ] Verify `/command/api/health` reports `database: bound`.
- [ ] Verify unauthenticated customer/vehicle requests fail with 401.
- [ ] Verify an authenticated identity not in `staff_users` fails with 403.
- [ ] Verify an active operations staff identity can create a test customer and vehicle.
- [ ] Verify read-only and finance roles cannot create either record.
- [ ] Verify every create writes an audit row.
- [ ] Remove test records and review logs before considering production.

## Endpoint smoke tests
Use an authenticated browser session or a controlled API client after Access is configured. Do not paste JWTs into tickets or source code.

- `GET /command/api/customers?limit=20`
- `POST /command/api/customers` JSON body: `{"full_name":"Stage 13 Test Customer","email":"test@example.invalid"}`
- `GET /command/api/vehicles`
- `POST /command/api/vehicles` JSON body: `{"name":"Stage 13 Test Vehicle","registration_number":"TEST-013","daily_rate_minor":100000,"status":"available"}`

The vehicle rate example uses minor units; confirm the currency minor-unit convention and display formatting with finance before live use.
