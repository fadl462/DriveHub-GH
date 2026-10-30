CREATE TABLE IF NOT EXISTS sourced_vehicles (
 id TEXT PRIMARY KEY,
 partner_id TEXT NOT NULL REFERENCES rental_partners(id),
 vehicle_name TEXT NOT NULL,
 registration_number TEXT,
 supplier_daily_rate_minor INTEGER NOT NULL CHECK(supplier_daily_rate_minor >= 0),
 customer_daily_rate_minor INTEGER NOT NULL CHECK(customer_daily_rate_minor >= 0),
 available_from TEXT,
 available_to TEXT,
 status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available','reserved','on_rent','returned','cancelled')),
 notes TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK(available_to IS NULL OR available_from IS NULL OR available_to >= available_from)
);
