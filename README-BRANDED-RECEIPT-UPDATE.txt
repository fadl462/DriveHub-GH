DRIVEHUB GH — BRANDED PAYMENT RECEIPT UPDATE

Files in this package (copy into the matching project paths):
- command/app.js
- command/index.html

What changed:
- Reworked the existing Download / Print PDF receipt action into a branded, print-ready A4 receipt.
- Uses the existing /assets/drivehub-logo.png project asset; no new logo file is required.
- Includes DriveHub GH business contact details, receipt number, customer, invoice, payment date/method, transaction reference (or “Not provided”), amount received, invoice total, total paid to date and outstanding balance.
- Preserves the current D1-backed invoice/payment state and existing receipt identifiers.
- Cache-busts the Command Centre app.js reference so the updated script is loaded.

Deployment:
1. Replace the two files at the matching paths in the DriveHub GH project.
2. Deploy the project to Cloudflare Pages.
3. Open Command Centre > Payments & receipts and use Download / Print PDF on a receipt.
4. In the print dialog, choose Save as PDF to download a PDF, or select a printer.

Notes:
- This package changes receipt presentation only. It does not modify D1 data, invoice/payment records, receipt numbers, authentication, or APIs.
- The logo is loaded from the existing site asset at /assets/drivehub-logo.png. Confirm that this asset is present in the deployed root assets directory.
- Print colour/background settings can vary by browser; enable background graphics if the red amount panel or pale summary panel is not printed.
