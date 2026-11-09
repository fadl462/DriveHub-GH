-- Adds safe customer archiving so profiles can be removed from the active directory
-- without breaking historical rentals, invoices, payments or reviews.
ALTER TABLE customers ADD COLUMN archived_at TEXT;
CREATE INDEX IF NOT EXISTS idx_customers_archived_at ON customers(archived_at);
