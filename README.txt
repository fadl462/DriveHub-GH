DriveHub GH — Partial Payment Date Validation Fix
UPDATED FILES ONLY

Replace: functions/command/api/payments.js

Cause: The payment API date validator was incorrectly escaped and rejected valid YYYY-MM-DD dates from the payment form. This blocked partial-payment submission.

Fix: Corrected received_at validation. Existing GET, POST, DELETE handlers, role checks, balance checks and audit logic are retained.

Deploy the file at the exact path above to Cloudflare Pages. Then test a partial payment below the remaining invoice balance and confirm the receipt appears and the balance decreases.

Code package only; not deployed or tested against live D1 from this environment.
