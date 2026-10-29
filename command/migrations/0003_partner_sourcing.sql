-- DriveHub GH partner sourcing foundation. Apply once after 0001_initial_schema.sql.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS rental_partners (
 id TEXT PRIMARY KEY,
 company_name TEXT NOT NULL,
 contact_name TEXT,
 phone TEXT,
 email TEXT,
 address TEXT,
 payment_terms TEXT,
 payment_details TEXT,
 notes TEXT,
 status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','inactive')),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rental_partners_status ON rental_partners(status, company_name);
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
CREATE INDEX IF NOT EXISTS idx_sourced_vehicles_partner_status ON sourced_vehicles(partner_id,status);
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
CREATE INDEX IF NOT EXISTS idx_supplier_payments_partner_date ON supplier_payments(partner_id,paid_on DESC);
ALTER TABLE rentals ADD COLUMN source_type TEXT NOT NULL DEFAULT 'owned' CHECK(source_type IN ('owned','partner'));
ALTER TABLE rentals ADD COLUMN partner_id TEXT REFERENCES rental_partners(id);
ALTER TABLE rentals ADD COLUMN sourced_vehicle_id TEXT REFERENCES sourced_vehicles(id);
ALTER TABLE rentals ADD COLUMN supplier_daily_rate_minor INTEGER;
ALTER TABLE rentals ADD COLUMN supplier_total_minor INTEGER;
CREATE INDEX IF NOT EXISTS idx_rentals_source_partner ON rentals(source_type,partner_id);
CREATE TABLE IF NOT EXISTS partner_rentals (
 id TEXT PRIMARY KEY,
 booking_reference TEXT NOT NULL UNIQUE,
 customer_name TEXT NOT NULL,
 partner_id TEXT NOT NULL REFERENCES rental_partners(id),
 sourced_vehicle_id TEXT REFERENCES sourced_vehicles(id),
 vehicle_name TEXT NOT NULL,
 registration_number TEXT,
 pickup_date TEXT NOT NULL,
 return_date TEXT NOT NULL,
 billable_days INTEGER NOT NULL CHECK(billable_days >= 1),
 customer_daily_rate_minor INTEGER NOT NULL CHECK(customer_daily_rate_minor >= 0),
 supplier_daily_rate_minor INTEGER NOT NULL CHECK(supplier_daily_rate_minor >= 0),
 customer_total_minor INTEGER NOT NULL CHECK(customer_total_minor >= 0),
 supplier_total_minor INTEGER NOT NULL CHECK(supplier_total_minor >= 0),
 status TEXT NOT NULL DEFAULT 'upcoming' CHECK(status IN ('upcoming','active','completed','cancelled')),
 notes TEXT,
 created_by TEXT REFERENCES staff_users(id),
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CHECK(return_date >= pickup_date)
);
CREATE INDEX IF NOT EXISTS idx_partner_rentals_dates ON partner_rentals(partner_id,pickup_date,return_date,status);
