# DriveHub GH — Rental Reference Numbering Fix

## Reference standard

Public rental/booking references use:

`RNT-DHG-YY-NNNN`

Example: `RNT-DHG-26-1010`

- `RNT`: rental
- `DHG`: DriveHub GH
- `YY`: year the reference is issued
- `NNNN`: sequential number, zero-padded to at least four digits

The sequence is continuous across calendar years. For example, if 1010 is issued in 2026, the next reference in 2027 will be `RNT-DHG-27-1011`.

## Files in this patch

- `command/index.html` (asset cache version)
- `command/app.js`
- `functions/command/api/rentals.js`
- `functions/command/api/invoices.js`
- `functions/command/api/payments.js`
- `command/migrations/0006_rental_reference_numbering.sql`

## Deployment order — important

1. **Back up the live D1 database** before applying the migration.
2. In the Cloudflare D1 Console, select the database used by DriveHub Command and run the complete SQL in:
   `command/migrations/0006_rental_reference_numbering.sql`
3. Upload/commit the six files in this ZIP to the same paths in the GitHub repository.
4. Allow Cloudflare Pages to finish deploying, then hard-refresh the Command Centre.

Do not deploy the JavaScript changes before applying the migration. The API now reads the new `rentals.rental_reference` column and `rental_reference_sequences` table.

## Assign the current reference

1. Open Command Centre → Rentals.
2. Edit the existing rental that should carry the first reference.
3. The **Booking / rental reference** field will suggest the next available number. If no reference has yet been issued, it will show `RNT-DHG-26-1010`.
4. Save the rental. The reference is stored on the rental record and the sequence counter is synchronized.
5. Open the linked invoice and print it. The invoice will display the public booking reference, not the internal database ID.

The first new rental created after the migration will also receive the next available reference automatically. If the existing rental is assigned 1010 first, the next new rental will receive 1011.

## Integrity safeguards

- The internal rental ID is deliberately retained. It is the stable key used by invoice and payment relationships.
- The public reference is stored separately and protected by a unique database index.
- Invoice numbers and receipt numbers remain system-generated and unchanged.
- Invoice and receipt layouts read the booking reference from the linked rental record.
- Payment history and existing invoice links are not rewritten by this patch.

## Validation performed

- JavaScript syntax checks passed for all four updated JavaScript files.
- The migration and sequence-allocation SQL were tested against SQLite, including first allocation (1010) and subsequent allocation (1011).

The ZIP updates application code and supplies the D1 migration. It does not itself run the migration or deploy the website.
