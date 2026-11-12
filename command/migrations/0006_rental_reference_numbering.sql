-- DriveHub GH rental reference numbering
-- Keeps the internal rentals.id stable for foreign keys while adding a readable public reference.
ALTER TABLE rentals ADD COLUMN rental_reference TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_rentals_rental_reference
ON rentals(rental_reference)
WHERE rental_reference IS NOT NULL AND rental_reference <> '';

CREATE TABLE IF NOT EXISTS rental_reference_sequences (
  year TEXT PRIMARY KEY,
  last_number INTEGER NOT NULL CHECK (last_number >= 1009),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
