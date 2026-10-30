CREATE INDEX IF NOT EXISTS idx_supplier_payments_partner_date ON supplier_payments(partner_id,paid_on DESC);
