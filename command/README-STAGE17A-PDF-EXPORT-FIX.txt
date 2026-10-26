DriveHub GH — Stage 17A PDF Export Update

Files:
- command/app.js — updated invoice and receipt PDF actions.

Changes:
1. Removed the Share PDF action from invoice and receipt lists.
2. Kept Download PDF and Print for both invoices and payment receipts.
3. Keeps jsPDF CDN fallback and the branded print-view fallback if direct PDF generation fails.
4. Preserves existing DriveHub GH branding and document layouts.

Upload instructions:
Replace the repository file at command/app.js with this file. Keep the README in the command folder if desired. Commit to main and wait for Cloudflare Pages to deploy.

Testing checklist:
- Invoices: confirm only Download PDF and Print appear; test both.
- Receipts: confirm only Download PDF and Print appear; test both.
- If direct PDF generation fails, verify the branded print fallback opens and Chrome offers Save as PDF.

Note: Direct PDF generation loads jsPDF from a CDN and requires network access.
