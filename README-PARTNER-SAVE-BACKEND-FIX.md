# DriveHub GH — Fix rental partner save operation

## Updated files
- `command/app.js` — displays the API's actual error detail and shows a returned audit warning without falsely treating a successful insert as a failed save.
- `functions/command/api/partners.js` — handles partner creation and separates the partner insert result from the subsequent audit-log write. If the partner row is inserted but the audit write fails, the API returns a successful create response with an explicit warning instead of reporting that the partner was not saved. It also gives a specific error when the partner-sourcing migration is missing.

## Install
Copy these files to the same paths in the `fadl462/DriveHub-GH` repository, commit/push, and deploy the project to Cloudflare Pages.

## Important database check
The D1 database bound as `DB` must already have the tables created by `command/migrations/0003_partner_sourcing.sql`. If the API reports `partner_sourcing_migration_missing`, apply that migration to the exact D1 database used by this Pages deployment, then retry. The API also requires the signed-in staff role to be `admin` or `operations` to create a partner.

## Validation
`node --check` passed for both JavaScript files. This is a code fix package only; it has not been deployed to Cloudflare Pages and no live D1 insert was performed from this environment.
