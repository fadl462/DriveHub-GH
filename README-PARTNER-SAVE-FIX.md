# DriveHub GH — Fix for Save Partner

## What the screenshot tells us
The API is explicitly returning `partner_sourcing_migration_missing`. The partner-saving endpoint is reaching the database, but the D1 database bound to the live deployment does not have the `rental_partners` table. This is a database migration problem, not a form layout problem.

The repository's migration is included at `command/migrations/0003_partner_sourcing.sql`.

## Apply it to the correct D1 database
1. Open Cloudflare Dashboard → Workers & Pages → D1 SQL databases.
2. Identify the D1 database bound as `DB` to the deployed DriveHub GH Pages Functions/Worker. Do not choose a similarly named database by guesswork.
3. Before changing production, take a backup/export of that database.
4. Open that exact database's SQL Console and execute the contents of `command/migrations/0003_partner_sourcing.sql` once. This migration assumes the initial schema already exists, including `rentals` and `staff_users`.
5. Verify the SQL completed successfully and that `rental_partners`, `sourced_vehicles`, `supplier_payments`, and `partner_rentals` exist, and that the partner-sourcing columns exist on `rentals`.
6. Refresh `/command/#partners` and save the partner again.

Alternative using Wrangler from the repository root (replace `<DB_NAME>` with the actual database name from the binding/configuration):

```bash
npx wrangler d1 execute <DB_NAME> --remote --file=command/migrations/0003_partner_sourcing.sql
```

Do not run the migration against a guessed database. If the SQL errors that a column already exists, or another statement fails partway through, stop and inspect the database schema before retrying; do not blindly rerun the whole file.

## Important
This package supplies the migration that the current API error says is missing. It does not itself apply changes to Cloudflare, and I cannot execute the production D1 migration from this chat. The migration must be run against the same D1 database bound to the live deployment.
