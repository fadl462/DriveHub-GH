DriveHub GH — Import verified real records (Stage 17B.4)

Contents
- 0003_import_verified_business_records.sql

What this imports
- 7 five-star testimonials transcribed from the two attached Word documents, marked approved/published.
- Customers, vehicles, and rental history required for the two attached invoice records.
- Invoices DHG-00033 (GHS 7,000) and DHG-00102 (GHS 4,500), marked paid in full as explicitly confirmed by the business owner.
- Matching payment rows so paid totals and outstanding balances reconcile to zero.

Important source-data caveats
- The supplied PDFs say Paid but also show Amount Paid = GHS 0 and the full amount as Balance. The owner separately confirmed both were paid in full; the SQL follows that confirmation.
- The PDFs do not specify payment method or actual payment date. To meet the payments table's required date field, the script temporarily uses each invoice's issue date and method 'other'. This is explicitly documented in the payment reference/notes. Replace those values with actual receipt details when available.
- The Humanity First invoice's body shows invoice number DHG-00102, despite the uploaded filename beginning YAH-00102; booking reference is YAH-00054. The database uses DHG-00102 as printed on the invoice.
- Rental return/pickup dates and billable days are imported as shown. The Humanity First PDF says 5 billable days between 16 and 23 Oct; the script preserves the source's 5 billable days and notes the date-span mismatch.
- The vehicle status defaults to available only for newly inserted vehicle IDs; confirm against current fleet operations before relying on that status.

How to apply
1. Open Cloudflare Dashboard > D1 > drivehub-command-db > Console.
2. Make a D1 backup / bookmark before applying this import.
3. Paste and execute the SQL in 0003_import_verified_business_records.sql.
4. Confirm the final summary returns 2 customers, 2 invoices, 2 payments, and 7 published_reviews.
5. Refresh Command Centre and verify invoices and reviews.

Idempotency / safety
- Stable IDs and invoice numbers are used so rerunning the script does not duplicate these records.
- The script does not delete other D1 records. It does not purge demo records because doing so blindly in production could delete valid records. Dummy records must be removed based on explicit demo IDs/known demo values, after a backup and table-by-table inspection.
- This SQL import does not itself remove browser-only demo arrays from command/app.js or connect the Reviews screen to D1. Those require a separate frontend/API patch and deployment. Do not interpret successful SQL execution alone as proof every Command Centre section is live.
