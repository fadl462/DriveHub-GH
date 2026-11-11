DriveHub GH — Payment History Removal

Files to replace:
- command/app.js
- command/styles.css
- command/functions/api/payments.js

What this adds:
- A Remove action beside each payment receipt in Payment history & receipts.
- Admin/Finance-only DELETE API endpoint keyed by receipt number.
- Explicit confirmation warning before deletion.
- Invoice paid/partial/issued/overdue status recalculation after removal.
- Audit log entry preserving the removed payment details.
- Existing receipt PDF/print action remains handled by the existing print handler.

Important:
- This permanently removes the selected payment row from payments and makes its receipt unavailable from the live payment history. It does not issue a refund.
- The audit_log retains a before-image of the deleted payment for accountability.
- Use only to correct an erroneous payment entry, such as a duplicate/wrong payment replaced by a correctly recorded rental/invoice.
- This is a code package only. It has not been deployed or executed against the live D1 database.
- The deployment must include the Pages Function route for /command/api/payments and the existing authentication middleware.
