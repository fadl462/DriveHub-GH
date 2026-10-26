DriveHub GH — Stage 17A PDF Export Reliability Fix

Files:
- command/app.js — updated invoice and receipt PDF export/share handling.

Changes:
1. Loads jsPDF from multiple CDN sources in sequence (jsDelivr, cdnjs, unpkg) instead of relying on one host.
2. Makes PDF download more reliable by attaching the download link to the document and allowing more time before revoking the temporary file URL.
3. On desktop browsers without native PDF file sharing, Share PDF downloads the PDF so staff can attach it to WhatsApp or email.
4. If PDF generation still fails, the invoice or receipt action falls back to the branded print view, where staff can choose “Save as PDF” in the browser print dialog.
5. Keeps the existing DriveHub GH branding and current invoice/receipt layouts.

Upload instructions:
Replace the existing repository file at command/app.js with this file. Do not upload it to the repository root. Commit to main and wait for Cloudflare Pages to deploy.

Testing checklist:
- Invoices: Download PDF, Share PDF, Print.
- Receipts: Download PDF, Share PDF, Print.
- Test with network access enabled (the direct PDF generator loads jsPDF from a CDN).
- If direct export fails, verify that the branded print fallback opens and that Chrome offers “Save as PDF”.

Note: On desktop Chrome, “Share PDF” may not open a native share sheet because file sharing support varies by platform. In that case, it downloads the PDF for manual attachment to WhatsApp/email. Automatic emailing or WhatsApp sending requires a separate integration.
