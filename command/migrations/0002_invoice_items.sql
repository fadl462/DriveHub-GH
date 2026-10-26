-- Stage 17B.2: invoice line items and transparent rental charges. Apply to D1 before deployment.
PRAGMA foreign_keys = ON;
ALTER TABLE invoices ADD COLUMN vehicle_id TEXT REFERENCES vehicles(id);
CREATE TABLE IF NOT EXISTS invoice_items (
 id TEXT PRIMARY KEY,
 invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
 description TEXT NOT NULL,
 quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
 unit_amount_minor INTEGER NOT NULL CHECK (unit_amount_minor >= 0),
 line_total_minor INTEGER NOT NULL CHECK (line_total_minor >= 0),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
