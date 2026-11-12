-- Run this migration against the live drivehub-command-db database.
-- The rentals.rental_reference column was added separately in the D1 Console.
-- This script deliberately does NOT attempt to add that column again.

CREATE TABLE IF NOT EXISTS rental_reference_sequences (
  year TEXT PRIMARY KEY,
  last_number INTEGER NOT NULL CHECK (last_number >= 1009),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_rentals_rental_reference
ON rentals(rental_reference)
WHERE rental_reference IS NOT NULL AND rental_reference <> '';

-- Seed the global sequence at 1009 so the first issued reference is 1010.
-- If references already exist, continue after the highest suffix instead.
INSERT OR IGNORE INTO rental_reference_sequences (year, last_number)
VALUES ('GLOBAL', 1009);

UPDATE rental_reference_sequences
SET last_number = MAX(
  last_number,
  COALESCE((
    SELECT MAX(CAST(substr(rental_reference, 12) AS INTEGER))
    FROM rentals
    WHERE rental_reference LIKE 'RNT-DHG-__-%'
      AND length(rental_reference) >= 15
  ), 1009),
  1009
),
updated_at = CURRENT_TIMESTAMP
WHERE year = 'GLOBAL';
