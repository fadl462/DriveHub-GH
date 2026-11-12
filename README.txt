DriveHub GH — Receipt Rental Reference Fix

Replace command/app.js with the file in this package.

The receipt now resolves the booking/rental reference through the direct payment reference, invoice reference, linked rental ID, and the rental row's invoice ID/number relationship. This addresses older records where the invoice/payment row omits rental_reference but the rental record still contains it.

No D1 data, payment records, invoice totals, receipt numbers, or signature assets are changed. Keep command/fadl-signature.png as it is.
