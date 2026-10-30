ALTER TABLE rentals ADD COLUMN partner_id TEXT REFERENCES rental_partners(id);
