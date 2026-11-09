# DriveHub GH — Customer archive database fix

## Why this is needed
The Command Centre customer DELETE endpoint archives customer profiles by setting `customers.archived_at`. The live D1 database currently has no such column, which causes `D1_ERROR: no such column: archived_at`.

## Apply the fix
1. Open Cloudflare Dashboard → Workers & Pages → D1.
2. Open the **production D1 database actually bound to the Command Centre as `DB`**. Do not use a development database.
3. Open its Console.
4. Run the contents of `command/migrations/0005_customer_archive.sql` exactly once:

```sql
ALTER TABLE customers ADD COLUMN archived_at TEXT;
CREATE INDEX IF NOT EXISTS idx_customers_archived_at ON customers(archived_at);
```

5. Refresh the Command Centre and try deleting a customer again.

This is a schema-only change. It does not delete or modify existing customer rows, rentals, invoices, payments or reviews. No frontend redeployment is required for this specific error.

## Important
- Run this migration only once. If the column already exists, SQLite will report a duplicate-column error; do not try to add it again.
- If the dashboard is connected to a different D1 database than the one you updated, the error will remain. Confirm the Pages project's `DB` binding points to the database you changed.
- Customer deletion is implemented as archiving to preserve linked financial and rental history.
