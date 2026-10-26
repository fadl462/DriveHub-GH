-- DriveHub GH Stage 17B: invoice line items and financial lookup indexes.
-- Apply only after reviewing against the target D1 database and confirming 0001 is applied.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS invoice_items (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL CHECK (length(trim(description)) BETWEEN 1 AND 500),
  quantity INTEGER NOT NULL CHECK (quantity >= 1 AND quantity <= 100000),
  unit_price_minor INTEGER NOT NULL CHECK (unit_price_minor >= 0),
  line_total_minor INTEGER NOT NULL CHECK (line_total_minor >= 0),
  position INTEGER NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_position
  ON invoice_items(invoice_id, position, created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_issued
  ON invoices(customer_id, issued_on DESC);
CREATE INDEX IF NOT EXISTS idx_payments_customer_received
  ON payments(customer_id, received_at DESC);
