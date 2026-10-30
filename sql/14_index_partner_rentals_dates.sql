CREATE INDEX IF NOT EXISTS idx_partner_rentals_dates ON partner_rentals(partner_id,pickup_date,return_date,status);
