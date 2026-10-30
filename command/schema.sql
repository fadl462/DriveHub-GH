-- STAGE 6 DATA FOUNDATION — schema only; not applied to a live database.
-- Proposed Cloudflare D1 schema for the production DriveHub Command system.
-- Review and test this schema before applying it to a live database.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS staff_users (
  id TEXT PRIMARY KEY,
  identity_subject TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin','finance','operations','review_moderator','read_only')),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  registration_number TEXT UNIQUE,
  daily_rate_minor INTEGER NOT NULL DEFAULT 0 CHECK (daily_rate_minor >= 0),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','reserved','rented','maintenance','inactive')),
  service_due_on TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rentals (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  pickup_date TEXT NOT NULL,
  return_date TEXT NOT NULL,
  daily_rate_minor INTEGER NOT NULL CHECK (daily_rate_minor >= 0),
  billable_days INTEGER NOT NULL CHECK (billable_days >= 1),
  status TEXT NOT NULL CHECK (status IN ('upcoming','active','completed','cancelled')),
  notes TEXT,
  created_by TEXT REFERENCES staff_users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (return_date >= pickup_date)
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  rental_id TEXT REFERENCES rentals(id),
  issued_on TEXT NOT NULL,
  due_on TEXT,
  currency TEXT NOT NULL DEFAULT 'GHS',
  subtotal_minor INTEGER NOT NULL CHECK (subtotal_minor >= 0),
  discount_minor INTEGER NOT NULL DEFAULT 0 CHECK (discount_minor >= 0),
  total_minor INTEGER NOT NULL CHECK (total_minor >= 0),
  status TEXT NOT NULL CHECK (status IN ('draft','issued','partially_paid','paid','overdue','void')),
  notes TEXT,
  created_by TEXT REFERENCES staff_users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  receipt_number TEXT NOT NULL UNIQUE,
  invoice_id TEXT NOT NULL REFERENCES invoices(id),
  customer_id TEXT NOT NULL REFERENCES customers(id),
  amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
  currency TEXT NOT NULL DEFAULT 'GHS',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash','bank_transfer','mobile_money','card','other')),
  reference TEXT,
  received_at TEXT NOT NULL,
  recorded_by TEXT REFERENCES staff_users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  vehicle_id TEXT REFERENCES vehicles(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  what_went_well TEXT,
  what_to_improve TEXT,
  portrait_object_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','flagged')),
  public_reply TEXT,
  reviewed_by TEXT REFERENCES staff_users(id),
  reviewed_at TEXT,
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT,
  improvement_status TEXT NOT NULL DEFAULT 'new' CHECK (improvement_status IN ('new','under_review','action_planned','resolved')),
  management_notes TEXT
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  description TEXT NOT NULL,
  due_on TEXT,
  completed_on TEXT,
  cost_minor INTEGER CHECK (cost_minor IS NULL OR cost_minor >= 0),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','in_progress','completed','cancelled')),
  created_by TEXT REFERENCES staff_users(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor_staff_id TEXT REFERENCES staff_users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  request_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_status_submitted ON reviews(status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status_due ON invoices(status, due_on);
CREATE INDEX IF NOT EXISTS idx_rentals_status_dates ON rentals(status, pickup_date, return_date);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_received ON payments(invoice_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id, created_at DESC);
