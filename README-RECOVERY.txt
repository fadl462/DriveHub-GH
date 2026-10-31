DriveHub GH Command Centre Recovery — updated files only

Files in this package:
- command/app.js
- command/index.html

Purpose:
- Restore the fuller Command Centre application source from the immediately preceding project archive.
- Keep the Interactive preview banner removed.
- Show live counts on Pending, Approved, Rejected, and All reviews tabs.
- Remove the artificial +10 from the Approved this month count and use the loaded review records instead.
- Replace misleading hard-coded review summary defaults with neutral initial values.

Upload both files to the same paths in the project root, replacing the existing files. This package does not run SQL migrations, import reviews, or modify D1 data. After deployment, verify the review API and production records.
