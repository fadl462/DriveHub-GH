# DriveHub GH — Payments & Receipts Outstanding-Balance Workflow Restored

## Replace these exact files
- `command/app.js`
- `command/index.html`

This package is based on the latest rental D1 restoration and rental-delete update. It preserves those changes while restoring the earlier outstanding-balance payment workflow.

## Restored payment page
- Outstanding invoices are listed separately from payment history.
- The page displays total payments received, total outstanding balance, transaction count and payment methods.
- Each unpaid or partly paid invoice shows invoice total, amount already paid and remaining balance.
- Staff can select **Part payment** or **Mark fully paid** for an individual invoice.
- The payment form is prefilled with the selected invoice and customer.
- The amount is validated against the current outstanding balance; overpayments are rejected.
- Payments are submitted to `/command/api/payments` and stored in D1. Browser-only payment recording is disabled.
- After the API confirms success, the page reloads live invoices and payments and opens the new receipt for immediate printing or saving as PDF.
- Payment history retains each transaction as a separate receipt.
- The outstanding list automatically removes invoices once their balance reaches zero.

## Preserved from the previous rental correction
- D1-backed rental creation, editing, completion and cancellation.
- Rental delete action and its financial safeguards.
- DH-211 local rental recovery queue.
- Linked rental invoice generation and payment-history protection.

## Apply
1. Extract the ZIP at the root of the GitHub repository, preserving the `command/` paths.
2. Replace the two files at the exact paths.
3. Commit and push to the branch deployed by Cloudflare Pages.
4. Wait for deployment, then hard-refresh the Command Centre (Ctrl+Shift+R).

## Verification
1. Open Payments & receipts. Confirm the Outstanding invoices panel and outstanding balance metric appear.
2. Confirm invoices with partial balances have both Part payment and Mark fully paid actions.
3. Record a small partial payment against a test invoice. Confirm a receipt opens immediately and the remaining balance decreases.
4. Refresh. Confirm the payment and updated balance remain.
5. For a test invoice, record the exact remaining balance and confirm the invoice disappears from Outstanding invoices after successful payment.

## Safety and validation
- Payments are only recorded after the D1 API confirms success.
- The form blocks payments above the outstanding balance.
- The existing D1 payment endpoint remains unchanged.
- `command/app.js` passed `node --check`.
- This package has not been deployed and does not change database records by itself.
