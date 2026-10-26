DRIVEHUB GH — STAGE 17A: BRANDED INVOICE & RECEIPT PDFS

Files in this update
- command/app.js

What changed
- Uses DriveHub GH branding and the existing project logo asset (assets/drivehub-logo.png). No third-party rental-company imagery is used.
- Invoice form supports description, pickup location, discount, additional fees/taxes and notes.
- Newly created demo invoices use DHG-00103-style numbering (next number after 00102, increasing based on existing DHG invoice numbers).
- Invoice PDF document includes business contact details, invoice and booking references, customer/vehicle/rental details where available, charges, totals, paid amount, balance, terms and signature areas.
- Paid stamp is shown only when the calculated invoice status is Paid.
- Invoice and payment receipt rows now offer Download PDF, Share PDF and Print actions.
- Share uses the browser/device share sheet when file sharing is supported; otherwise it downloads the PDF so staff can attach it to WhatsApp or email.
- Existing rental filter fixes from Stage 16.1 are retained in command/app.js.

Important limitations
- The PDF generator loads jsPDF from cdnjs when first used, so the browser needs internet access for direct PDF download/share. If loading fails, use Print and choose Save as PDF.
- This update does NOT connect invoice or payment records to Cloudflare D1. The existing invoice/payment records remain browser-local preview data. Do not use this version as the source of truth for live financial records until the database-backed invoice/payment API stage is completed and tested.
- Contact, vehicle registration, pickup/return and rental reference fields are populated from available records; fields not currently stored in the source data display a dash or the documented default. Confirm details before sending a PDF to a client.

Deployment
1. In the DriveHub-GH repository, replace only command/app.js with the file in this ZIP.
2. Commit to main and wait for Cloudflare Pages deployment to succeed.
3. Hard refresh the Command Centre (Ctrl+Shift+R).
4. Create a test invoice, then test Download PDF, Share PDF (if your browser/device supports it), and Print.
5. Record a test payment and test its receipt PDF. Use demo/test records only.
