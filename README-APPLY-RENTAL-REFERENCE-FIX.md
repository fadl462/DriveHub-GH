# DriveHub GH — Rental Reference Numbering Fix

## What this update changes

- Uses `RNT-DHG-YY-NNNN` as the public booking/rental reference.
- Starts the sequence at `RNT-DHG-26-1010` when no references have been issued.
- Keeps the numeric sequence continuous across years: the year prefix changes (for example, `RNT-DHG-27-1011`) while the running number continues.
- Assigns a reference to an older rental when it is edited if it does not already have one.
- Shows the public reference in the Rentals table, Overview recent rentals, invoices and receipts.
- Keeps an issued reference immutable and prevents duplicate references.
- Preserves the internal rental ID used by invoice/payment relationships.

## Important: prepare the live D1 database first

You already added `rentals.rental_reference` manually in the Cloudflare D1 Console. **Do not run migration 0006 again**; its `ALTER TABLE` would fail because that column now exists.

1. Open Cloudflare D1 → `drivehub-command-db` → Console.
2. Copy and execute the complete SQL in `command/migrations/0007_rental_reference_sequence_live_safe.sql`.
3. Verify the sequence table:

   ```sql
   SELECT year, last_number FROM rental_reference_sequences;
   ```

   It should contain `GLOBAL` with `1009` if no references have been assigned yet. The next reference will then be `RNT-DHG-26-1010`.

4. Verify the unique index:

   ```sql
   PRAGMA index_list(rentals);
   ```

## Upload the updated application files

Upload the files in this package to the same paths in the GitHub repository:

- `command/app.js`
- `functions/command/api/rentals.js`
- `command/migrations/0007_rental_reference_sequence_live_safe.sql`
- `README-APPLY-RENTAL-REFERENCE-FIX.md`

Commit/push and wait for Cloudflare Pages to deploy. The ZIP does not deploy itself.

## Assign the first reference to an existing rental

1. Open Command Centre → Rentals.
2. Edit the existing rental that should receive the first number.
3. If it has no reference yet, the form will suggest the next available number (initially `RNT-DHG-26-1010`).
4. Save. The API stores the reference and advances the global sequence.
5. The next newly created rental receives `RNT-DHG-26-1011`.

New rentals receive their reference automatically. Editing a rental that still has no reference also assigns the next one automatically. Once a reference has been issued, it cannot be changed.

## Validation

- JavaScript syntax checks are run before packaging.
- The D1 sequence migration is tested against SQLite, including first allocation, next allocation, and continuation into a new year.
- Existing rental IDs, invoice IDs, invoice numbers and payment IDs are not rewritten by this update.
