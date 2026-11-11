# DriveHub GH — Restore Rental Delete Action

## Replace only these files
- `command/app.js`
- `functions/command/api/rentals.js`

Built on top of the latest rental D1 restoration/invoicing source package.

## What changed
- Restores a **Delete** action for live D1 rental records in the Rentals table.
- Deletion requires a confirmation prompt.
- Deletes the rental and its linked invoice and invoice line items only when the invoice has no recorded payments.
- Writes an audit entry before deleting the record.
- If any payment exists against the linked invoice, the API returns HTTP 409 and blocks deletion. It does not remove or alter payments, receipts or financial history.
- After a successful deletion, the page reloads live rentals and invoices from D1.

## Apply
1. Extract the ZIP at the root of the GitHub repository, preserving the two folder paths.
2. Commit and push to the same branch deployed by Cloudflare Pages.
3. Wait for deployment and hard-refresh the Command Centre (Ctrl+Shift+R).

## Important
This is a permanent deletion for unpaid rental records and their unpaid linked invoice. Paid or partially paid rentals cannot be deleted; use the existing Cancel action instead so financial history remains intact. This package has not been deployed and does not modify any D1 records by itself.

## Validation
Both updated JavaScript files passed `node --check`.
