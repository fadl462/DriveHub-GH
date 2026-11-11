# DriveHub GH — Branded Receipt Restoration

Built by merging the previously approved DriveHub GH A4 receipt design into the current outstanding-invoice payment workflow.

## Replace these exact files
- `command/app.js`
- `command/index.html`

The HTML file is included from the current payments workflow package unchanged; the substantive code correction is in `command/app.js`.

## What this restores
The generic, reverted receipt is replaced with the approved branded A4 DriveHub GH receipt:
- DriveHub GH logo
- 22 Baiden Avenue | 2nd Manu Street, Westland, Accra - Ghana
- Phone: 020 411 6245
- Email: drivehubgh1@gmail.com
- Receipt number and payment date
- Customer and invoice number
- Payment method and transaction reference
- Prominent amount received
- Invoice total, cumulative amount paid to date, and outstanding balance
- Paid / Partially paid status
- Professional A4 layout, print styling, and automatic print dialog for PDF saving

The receipt is still generated immediately after a successful live D1 payment. It reads the updated invoice/payment state so the cumulative paid amount and outstanding balance reflect the recorded allocation.

## Additional correction found
The payments workflow source contained a duplicate `renderPayments()` declaration. The stale renderer was removed, leaving one renderer with the outstanding invoice table, partial-payment action, and full-payment action. This also avoids a JavaScript redeclaration syntax error.

## Preserved
- Outstanding invoice selection
- Part payment and Mark fully paid actions
- D1 payment persistence and receipt generation
- Rental recovery, editing, and deletion safeguards already present in this source package
- Download / Print PDF-only receipt action

## Apply
1. Extract at the root of the GitHub repository, preserving folder paths.
2. Commit and push to the branch deployed by Cloudflare Pages.
3. Wait for deployment.
4. Hard-refresh the Command Centre (Ctrl+Shift+R).
5. Record a small test payment against an outstanding invoice and confirm the branded receipt opens with the correct running paid total and balance.

## Validation
- `command/app.js` passed `node --check`.
- Confirmed exactly one `renderPayments()` and one `printReceipt(p)` declaration.
- Confirmed receipt branding, contacts, reference, invoice total, cumulative paid amount and outstanding balance fields are present.
- This package has not been deployed and has not changed D1 data.
