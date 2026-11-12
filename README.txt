DriveHub GH — Receipt Improvements (Updated Files Only)

Updated file:
  command/app.js

Changes:
1. Receipt booking/rental reference now resolves from the linked D1 rental record when it is absent from the payment and invoice payloads.
2. Cash receipts display "Cash payment" as the transaction reference instead of "Not provided".
3. The existing Authorised By signature image reference remains unchanged:
   /command/fadl-signature.png

No D1 schema, payment, invoice, receipt-number, or existing financial records were changed.

Deployment:
Replace only command/app.js in the existing DriveHub GH project, then deploy the Pages project. Keep the existing command/fadl-signature.png asset in place.
