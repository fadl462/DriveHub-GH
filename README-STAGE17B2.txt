DriveHub GH — Stage 17B.2 (targeted files only)

Included changes:
- command/app.js: connects invoice and payment list/create flows to protected D1 APIs; rejects demo-only financial writes.
- functions/command/api/invoices.js and payments.js: authenticated role-checked endpoints, D1 reads/writes, amount validation, audit entries.
- command/migrations/0002_invoice_items.sql: invoice item table.

BEFORE DEPLOYING: apply command/migrations/0002_invoice_items.sql to the drivehub-command-db D1 database. Keep the existing DB binding named DB and Access variables/policy.

Important test note: this is a source package, not a verified live deployment. Test in a preview/staging environment first. API schema matches command/migrations/0001_initial_schema.sql. Invoice creation only accepts customers and vehicles returned by the live D1 APIs. The PDF print/download functions remain in app.js.
