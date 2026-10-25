# Cloudflare Pages Functions — Stage 12

This directory contains a public readiness probe and a fail-closed middleware scaffold. It does **not** yet expose business records.

## Setup order
1. Create a separate Cloudflare D1 development database.
2. Review and apply `command/migrations/0001_initial_schema.sql` to development.
3. Configure a D1 binding named `DB` for the Pages project.
4. Deploy and test `/command/api/health`.
5. Implement verified Cloudflare Access JWT validation and `staff_users` role checks before adding data endpoints.
6. Test server-side transactional rental/maintenance conflict prevention before connecting the UI.

`wrangler.toml.example` is an example, not a ready-to-deploy config. Replace the placeholder database ID and configure the binding in the actual Cloudflare project. The frontend continues to use browser-local demo data in this stage.
