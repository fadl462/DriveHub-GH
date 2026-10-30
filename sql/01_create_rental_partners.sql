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
