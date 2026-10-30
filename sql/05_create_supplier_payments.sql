CREATE TABLE IF NOT EXISTS supplier_payments (
 id TEXT PRIMARY KEY,
 partner_id TEXT NOT NULL REFERENCES rental_partners(id),
 rental_id TEXT REFERENCES rentals(id),
 sourced_vehicle_id TEXT REFERENCES sourced_vehicles(id),
 amount_minor INTEGER NOT NULL CHECK(amount_minor > 0),
 payment_method TEXT NOT NULL,
 payment_reference TEXT,
 paid_on TEXT NOT NULL,
 notes TEXT,
 recorded_by TEXT REFERENCES staff_users(id),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
