DriveHub GH — Stage 17B.3: live financial workflow hardening

Included targeted files only:
- command/app.js — financial state never falls back to demo invoices/payments; live empty state; dynamic financial connection status; invoice/receipt Download PDF and Print actions. Download PDF uses the browser's native print dialog; choose “Save as PDF”.
- command/index.html — updated preview notice wording.
- functions/command/api/invoices.js and payments.js — retained the role-protected D1 endpoints from Stage 17B.2.
- command/migrations/0002_invoice_items.sql — migration used by Stage 17B.2.

Important: your current live API returns an empty invoices array, so this package will correctly show no invoices until a real invoice is created. Existing demo totals are not migrated into D1. The Download PDF button opens the browser print dialog with a branded document; choose “Save as PDF” to save a PDF.

Deploy the files preserving these exact repository paths. D1 migration 0002 was manually applied in your database. After deployment, test with a real D1 customer and vehicle, create one test invoice, confirm it persists after refresh, then record a small test payment only after invoice creation is verified. Do not use old demo data as accounting records.
