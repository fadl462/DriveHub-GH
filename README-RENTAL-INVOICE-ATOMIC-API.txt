DriveHub GH — rental + automatic invoice API foundation

Files
- functions/command/api/rentals.js

What this endpoint does
- GET /command/api/rentals returns D1 rental rows joined to customer, vehicle and linked invoice/payment totals.
- POST /command/api/rentals creates a D1 rental, its primary invoice and invoice line item in one D1 batch.
- Uses D1 IDs for customer and vehicle, stores money as integer minor units (pesewas), and calculates inclusive billable days.
- Starts the invoice as issued with zero payments; the UI should render that as Unpaid.
- Prevents date conflicts for owned vehicles and returns an existing record when a retry uses the same rental_id.
- Requires existing _middleware.js, _utils.js, D1 schema (rentals, invoices, invoice_items, payments, customers, vehicles, audit_log) and migration 0002_invoice_items.sql to be deployed.

IMPORTANT
This is the backend endpoint foundation only. It does not by itself wire the currently deployed Command Centre rental form, invoice list, and payment list to these APIs. Do not deploy this file alone and assume the end-to-end workflow is complete. The frontend must submit customer_id/vehicle_id/daily_rate_minor to this endpoint, then reload D1 rentals/invoices/payments; the current UI contains browser-preview paths. Keep the existing access middleware and do not weaken authentication.

Deployment checklist
1. Confirm migration 0002_invoice_items.sql has been applied to the production D1 database.
2. Add this file at the exact path shown.
3. Wire the rental form to POST /command/api/rentals using customer and vehicle D1 IDs.
4. Load GET /command/api/rentals and GET /command/api/invoices to hydrate dashboards from D1.
5. Wire payments to POST /command/api/payments and calculate Unpaid / Partially Paid / Paid / Overdue from due date and saved payments.
6. Test rental create, retry, refresh persistence, partial payment, final payment, overpayment rejection, and cancellation safeguards before calling the workflow complete.
