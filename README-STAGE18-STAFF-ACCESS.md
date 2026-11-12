# DriveHub GH — Stage 18 Staff Management & Access Control

## What this package changes

- Moves the authenticated account identity and logout into the top-right header.
- Adds a Super Admin-only Staff & Access Management panel under Settings.
- Adds individual staff invitations, directory, role changes, suspension and reactivation.
- Adds `/command/api/me`, `/command/api/staff` and `/command/api/audit` endpoints, plus the Access logout route.
- Adds first-login invitation claiming after Cloudflare Access verifies the staff member's identity.
- Adds canonical access roles while retaining the existing legacy `role` column for schema compatibility.
- Enforces role checks in protected API handlers.
- Disables manual invoice creation through the API; rental creation remains the invoice-generation path.
- Prevents payment-history deletion through the API.

## Required deployment order — do not reverse

### 1. Back up production D1

In Cloudflare Dashboard, open Storage & databases → D1 SQL Database → `drivehub-command-db`. Create/export a backup before applying any migration.

### 2. Apply migration 0008

Run the complete contents of:

`command/migrations/0008_staff_access_management.sql`

against the **production** `drivehub-command-db`.

This is an additive migration. It adds `staff_users.access_role`, backfills existing roles, and creates `staff_invitations`. It does not delete or rewrite rentals, invoices, payments, customers, vehicles, reviews or audit records.

After running, verify:

```sql
PRAGMA table_info(staff_users);

SELECT id, display_name, email, role, access_role, active
FROM staff_users
ORDER BY created_at;

SELECT name
FROM sqlite_master
WHERE type='table' AND name IN ('staff_users','staff_invitations','audit_log');
```

Important: inspect the staff list. Existing rows with legacy role `admin` are mapped to `super_admin`. Confirm that only the intended owner account has that legacy role before allowing staff invitations.

### 3. Confirm Cloudflare Access policy

In Cloudflare Zero Trust, open Access → Applications → the application protecting `/command/*` → its Allow policy.

For each staff member, add their exact email address to the allow policy. Keep the One-time PIN login method enabled. Do not create a broad allow rule for all email addresses or an entire email domain unless that is an intentional company-wide security decision.

DriveHub cannot make Cloudflare send a PIN to an address that the Access policy does not permit. The staff invitation screen therefore explicitly reminds the administrator to add the email to the Access allow policy.

### 4. Deploy the updated files

Upload/commit the files in this package to the same paths in the GitHub repository and let Cloudflare Pages deploy.

Required files:
- `command/index.html`
- `command/app.js`
- `command/styles.css`
- `functions/command/api/_middleware.js`
- `functions/command/api/_utils.js`
- `functions/command/api/me.js`
- `functions/command/api/staff.js`
- `functions/command/api/audit.js`
- `functions/command/api/logout.js`
- `functions/command/api/rentals.js`
- `functions/command/api/vehicles.js`
- `functions/command/api/customers.js`
- `functions/command/api/payments.js`
- `functions/command/api/invoices.js`
- `functions/command/api/reviews.js`
- `command/migrations/0008_staff_access_management.sql`

### 5. Verify Super Admin identity

Log in using the current owner email. The `/command/api/me` endpoint should return the authenticated staff profile with role `super_admin`.

If it returns `staff_account_not_authorized`, stop. Do not invite staff or change the Access policy to a broad allow rule. Check that the existing staff row has the exact Access email and identity subject.

### 6. Invite the first staff member

1. Add their email to the Cloudflare Access Allow policy.
2. Open Command Centre → Settings → Staff & Access Management.
3. Enter their name and individual email.
4. Select a role and create the invitation.
5. Ask them to open `/command/` and request their One-time PIN.
6. After their first successful login, refresh the staff directory. Their pending invitation should become an active staff account.

Invitations expire after 7 days. The staff account is provisioned on first verified login, not merely when an invitation is created.

## Role model

- `super_admin`: full access; cannot be invited, suspended, or changed from the staff screen.
- `operations_manager`: rentals, fleet, customers and operational reports.
- `rental_officer`: rentals, customers and operational coordination; cannot delete rentals or manage fleet.
- `finance_officer`: invoices, payments and customer read access; cannot create or delete rentals.
- `review_moderator`: review moderation only.
- `read_only`: read-only reporting and operational records access; review moderation is not included.

Payment history deletion is disabled. Corrections should use a future traceable reversal/adjustment workflow. Manual invoice creation is disabled; invoices are generated automatically when a rental is created.

## Security notes and known boundaries

- Cloudflare Access authenticates the person; D1 `staff_users` controls the application role.
- Every protected API request verifies the Access JWT and checks the staff row.
- Staff invitations do not send a separate email themselves. Cloudflare Access sends the One-time PIN after the email is allowed by the Access policy.
- The current `audit_log` helper records staff invitation, role and account-status changes. Existing operational API audit behavior remains as in the source project.
- The current Settings business profile remains browser-local; it is not part of staff management.
- Before production use, test each role with a separate email/account. Do not test role changes using the only Super Admin account.
- Do not share screenshots or export files containing staff email addresses publicly.
