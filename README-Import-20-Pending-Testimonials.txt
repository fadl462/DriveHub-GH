DRIVEHUB GH — IMPORT 20 TESTIMONIALS TO D1

This SQL file inserts the 20 testimonials from DriveHub_GH_Testimonials_Final(1).docx into the existing reviews table with status=pending. It uses the schema verified from your screenshots: customer_name (not name), rating, what_went_well, status, submitted_at.

SAFETY
- INSERT OR IGNORE and stable IDs make reruns non-duplicating.
- Existing records are not updated or deleted.
- Each testimonial is assigned a 5-star rating because the source document displays five stars for each one.
- No customer location is inserted into an unavailable database column; the full name and review text are preserved.

HOW TO RUN
1. Open Cloudflare Dashboard > D1 > drivehub-command-db > Console.
2. Open the .sql file in a text editor and copy its contents into the SQL console. If the console rejects multi-statement scripts, run only the 20 INSERT statements first, then run the verification SELECT statements separately.
3. Click Execute.
4. Confirm imported_batch_count = 20. Confirm status totals show pending increased by 20, with approved and rejected unchanged.
5. Reload Command Centre > Reviews and choose Pending.

Important: I cannot execute queries directly against your Cloudflare account from this chat, so this package prepares the import but does not claim the live database has already changed.
