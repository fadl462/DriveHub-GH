# DriveHub Command — production API setup checklist

This directory currently contains setup notes only. The browser UI is not yet wired to a production API. Do not mistake this checklist or `schema.sql` for a live backend.

## Recommended deployment sequence

1. **Protect the Command route first.** In Cloudflare Zero Trust, create an Access application for `drivehub-gh.pages.dev/command/*` (or preferably a dedicated staff subdomain) and allow only named staff identities. Test denial from a logged-out/private browser. A hidden button or client-side role selector is not access control.
2. **Create a Cloudflare D1 database** for production. Keep a separate development database.
3. **Bind D1 to the Pages project** with a binding named `DB` in the Pages project settings. Do not paste credentials into frontend JavaScript or commit secrets.
4. **Apply `command/schema.sql`** to the development database first. Verify foreign keys, constraints and indexes, then repeat against production only after review and backup.
5. **Implement server-side API handlers** under `functions/api/`. Each handler must validate the authenticated Access identity, enforce the role from `staff_users`, validate all inputs, use parameterized SQL, and write an `audit_log` event for sensitive changes.
6. **Use integer minor currency units** (`amount_minor`, `total_minor`) for money; format GHS only in the UI. Do not use floating-point arithmetic for financial persistence.
7. **Migrate the UI from browser-local state to the API** only after the endpoints and permissions have been tested. Do not silently merge demo rows into production.
8. **Add backups and recovery tests** and document who can restore data. Restrict database and deployment access to named administrators.

## Minimum release tests

- Anonymous visitor cannot load the staff workspace or call API endpoints.
- Authenticated user without permission receives `403`.
- Staff cannot read or modify records outside their role.
- Invalid dates, negative money, duplicate invoice/receipt numbers and nonexistent foreign keys are rejected.
- Payment cannot exceed an invoice balance unless an explicit, approved overpayment/refund workflow is implemented.
- Invoice balance is calculated server-side from posted payment allocations, not trusted from the browser.
- Sensitive create/update/delete operations create an audit event.
- A backup can be restored to a separate test database.

## Current status

The provided schema is a starting point for review, not a final accounting design. It currently links each payment to one invoice; if split payments, refunds, reversals or one payment allocated across multiple invoices are required, introduce payment-allocation and reversal tables before go-live. Authentication and authorization are not implemented by these notes.
