-- Stage 17C: enforce one primary invoice per rental and make payment submissions idempotent.
-- Existing legacy invoices with NULL rental_id are preserved; this migration does not delete or rewrite them.
PRAGMA foreign_keys = ON;
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_one_primary_per_rental
  ON invoices(rental_id) WHERE rental_id IS NOT NULL;
CREATE TRIGGER IF NOT EXISTS trg_invoices_require_rental_insert
BEFORE INSERT ON invoices
WHEN NEW.rental_id IS NULL OR trim(NEW.rental_id) = ''
BEGIN
  SELECT RAISE(ABORT, 'invoice_requires_rental');
END;
CREATE TRIGGER IF NOT EXISTS trg_invoices_require_rental_update
BEFORE UPDATE OF rental_id ON invoices
WHEN NEW.rental_id IS NULL OR trim(NEW.rental_id) = ''
BEGIN
  SELECT RAISE(ABORT, 'invoice_requires_rental');
END;
ALTER TABLE payments ADD COLUMN idempotency_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_idempotency_key
  ON payments(idempotency_key) WHERE idempotency_key IS NOT NULL;
