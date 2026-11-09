-- DriveHub GH: enable safe customer archiving.
-- Apply ONCE to the production D1 database bound as DB to the Command Centre.
-- The live DELETE endpoint writes archived_at; without this column it fails.
ALTER TABLE customers ADD COLUMN archived_at TEXT;
CREATE INDEX IF NOT EXISTS idx_customers_archived_at ON customers(archived_at);
