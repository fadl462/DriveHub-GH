# DriveHub GH — Rental/Unpaid Invoice Delete Fix

## What this fixes
The rental DELETE handler referenced `rentalReference` even though that variable is not declared in the handler. This caused a JavaScript `ReferenceError` and stopped deletion before the database operation ran.

## File to replace
`functions/command/api/rentals.js`

Upload this file to the same path in the GitHub repository and allow Cloudflare Pages to deploy.

## How to remove Arif Tahir Essel's new unpaid invoice
The current Command Centre workflow removes an unpaid invoice together with its linked rental. After deployment:
1. Open Command Centre → Rentals.
2. Find Arif Tahir Essel's rental (13 Jan 2027 – 03 Feb 2027).
3. Select Delete and confirm.
4. The system deletes the linked invoice and rental together, provided no payment has been recorded.

Invoices with recorded payments remain protected. This fix does not delete paid or partially paid financial history.

This package contains the actual updated API file, not a patch script. It has not been deployed to the live site.
