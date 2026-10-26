-- DriveHub GH Stage 17B.4 — import verified business records only.
-- Idempotent for the stable IDs/invoice numbers below. Does not delete unrelated D1 rows.
-- IMPORTANT: payment dates/methods were not present in the supplied PDFs. received_at uses invoice issue date as a temporary bookkeeping date; update it to the actual receipt date when confirmed. Method is recorded as 'other' because the source does not specify one.
PRAGMA foreign_keys = ON;

-- Real customers from the supplied issued invoices.
INSERT INTO customers (id, full_name, email, phone, notes)
VALUES ('CUS-CMG-DHG00033','Curious Minds Ghana (Prince Kwesi Bonney)','pbonney@cmghana.org','0245209721','Imported from issued invoice DHG-00033. Customer and contact details from source PDF.')
ON CONFLICT(id) DO UPDATE SET full_name=excluded.full_name,email=excluded.email,phone=excluded.phone,notes=excluded.notes;

INSERT INTO customers (id, full_name, email, phone, notes)
VALUES ('CUS-HFUSA-DHG00102','Dr Fizan Abdullah Hagura (Humanity First USA)','jawaadpass@gmail.com','0542729109','Imported from issued invoice DHG-00102; booking reference YAH-00054.')
ON CONFLICT(id) DO UPDATE SET full_name=excluded.full_name,email=excluded.email,phone=excluded.phone,notes=excluded.notes;

-- Real vehicles shown on the source invoices. Do not overwrite unrelated vehicles.
INSERT INTO vehicles (id,name,registration_number,daily_rate_minor,status,notes)
VALUES ('VEH-GE252223','Mitsubishi Outlander (Red)','GE-2522-23',140000,'available','Imported from invoice DHG-00033; availability/status must be checked against current fleet operations.')
ON CONFLICT(id) DO UPDATE SET name=excluded.name,registration_number=excluded.registration_number,daily_rate_minor=excluded.daily_rate_minor,notes=excluded.notes;

INSERT INTO vehicles (id,name,registration_number,daily_rate_minor,status,notes)
VALUES ('VEH-GW100224','Hyundai Santa Fe (Silver Metallic)','GW 1002-24',90000,'available','Imported from invoice DHG-00102; source describes airport transfer service. Fleet status must be checked against current operations.')
ON CONFLICT(id) DO UPDATE SET name=excluded.name,registration_number=excluded.registration_number,daily_rate_minor=excluded.daily_rate_minor,notes=excluded.notes;

-- Rental history reflected in the invoices. The inclusive day count follows the source invoices (5 days).
INSERT INTO rentals (id,customer_id,vehicle_id,pickup_date,return_date,daily_rate_minor,billable_days,status,notes)
VALUES ('RNT-AYS-00053','CUS-CMG-DHG00033','VEH-GE252223','2026-10-19','2026-10-23',140000,5,'completed','Historical rental imported from invoice DHG-00033 / booking AYS-00053.')
ON CONFLICT(id) DO UPDATE SET customer_id=excluded.customer_id,vehicle_id=excluded.vehicle_id,pickup_date=excluded.pickup_date,return_date=excluded.return_date,daily_rate_minor=excluded.daily_rate_minor,billable_days=excluded.billable_days,status=excluded.status,notes=excluded.notes;

INSERT INTO rentals (id,customer_id,vehicle_id,pickup_date,return_date,daily_rate_minor,billable_days,status,notes)
VALUES ('RNT-YAH-00054','CUS-HFUSA-DHG00102','VEH-GW100224','2026-10-16','2026-10-23',90000,5,'completed','Historical airport transfer service imported from invoice DHG-00102 / booking YAH-00054. Source states five billable days; calendar span is eight dates inclusive.')
ON CONFLICT(id) DO UPDATE SET customer_id=excluded.customer_id,vehicle_id=excluded.vehicle_id,pickup_date=excluded.pickup_date,return_date=excluded.return_date,daily_rate_minor=excluded.daily_rate_minor,billable_days=excluded.billable_days,status=excluded.status,notes=excluded.notes;

-- Real invoices: source PDFs say Paid; user separately confirmed both have been paid in full.
-- Amounts are stored in minor currency units (pesewas): GHS 7,000 = 700000; GHS 4,500 = 450000.
INSERT INTO invoices (id,invoice_number,customer_id,rental_id,vehicle_id,issued_on,due_on,currency,subtotal_minor,discount_minor,total_minor,status,notes)
VALUES ('INV-DHG-00033','DHG-00033','CUS-CMG-DHG00033','RNT-AYS-00053','VEH-GE252223','2026-10-19',NULL,'GHS',700000,0,700000,'paid','Source PDF: 5 days x GHS 1,400. User confirms paid in full. Source PDF has inconsistent Amount Paid GHS 0 / Balance GHS 7,000 fields; payment recorded from user confirmation. Payment method/date not supplied.')
ON CONFLICT(invoice_number) DO UPDATE SET customer_id=excluded.customer_id,rental_id=excluded.rental_id,vehicle_id=excluded.vehicle_id,issued_on=excluded.issued_on,subtotal_minor=excluded.subtotal_minor,discount_minor=excluded.discount_minor,total_minor=excluded.total_minor,status='paid',notes=excluded.notes,updated_at=CURRENT_TIMESTAMP;

INSERT INTO invoices (id,invoice_number,customer_id,rental_id,vehicle_id,issued_on,due_on,currency,subtotal_minor,discount_minor,total_minor,status,notes)
VALUES ('INV-DHG-00102','DHG-00102','CUS-HFUSA-DHG00102','RNT-YAH-00054','VEH-GW100224','2026-10-23',NULL,'GHS',450000,0,450000,'paid','Source PDF: airport transfer, 5 billable days x GHS 900. User confirms paid in full. Source PDF has inconsistent Amount Paid GHS 0 / Balance GHS 4,500 fields; payment recorded from user confirmation. Payment method/date not supplied.')
ON CONFLICT(invoice_number) DO UPDATE SET customer_id=excluded.customer_id,rental_id=excluded.rental_id,vehicle_id=excluded.vehicle_id,issued_on=excluded.issued_on,subtotal_minor=excluded.subtotal_minor,discount_minor=excluded.discount_minor,total_minor=excluded.total_minor,status='paid',notes=excluded.notes,updated_at=CURRENT_TIMESTAMP;

-- Payment rows make the paid balance mathematically consistent. Uses invoice issue date only as a temporary date until actual payment dates are supplied.
INSERT INTO payments (id,receipt_number,invoice_id,customer_id,amount_minor,currency,payment_method,reference,received_at)
SELECT 'PAY-DHG-00033','DHG-00033-PAYMENT','INV-DHG-00033','CUS-CMG-DHG00033',700000,'GHS','other','User confirmed paid in full; actual method/date not shown on source PDF','2026-10-19'
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE invoice_id='INV-DHG-00033');

INSERT INTO payments (id,receipt_number,invoice_id,customer_id,amount_minor,currency,payment_method,reference,received_at)
SELECT 'PAY-DHG-00102','DHG-00102-PAYMENT','INV-DHG-00102','CUS-HFUSA-DHG00102',450000,'GHS','other','User confirmed paid in full; actual method/date not shown on source PDF','2026-10-23'
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE invoice_id='INV-DHG-00102');

-- Seven real five-star testimonials transcribed from the two supplied review documents.
-- Approved + published timestamp means they are treated as published testimonials in Command Centre.
INSERT INTO reviews (id,customer_name,rating,what_went_well,what_to_improve,status,submitted_at,reviewed_at,published_at)
VALUES
('REV-DHG-REAL-001','Kwame Mensah, Airport Residential Area, Accra',5,'I rented a Toyota Corolla from DriveHub GH for a week of back-to-back meetings across Accra, and it ran flawlessly. The car was spotless, the AC was ice cold, and the fuel tank was full at pickup. After years of rental cars that came with surprises, this was a relief.','', 'approved','2026-10-26','2026-10-26','2026-10-26'),
('REV-DHG-REAL-002','Abena Owusu-Ansah, Dzorwulu, Accra',5,'I landed at Kotoka after a long flight from London, and the team was already waiting with my name on a sign. The paperwork took less than ten minutes and the car was ready to go. It made my first hour back in Ghana completely stress-free.','', 'approved','2026-10-26','2026-10-26','2026-10-26'),
('REV-DHG-REAL-003','Nana Yaw Boateng, East Legon, Accra',5,'What I appreciate most about DriveHub GH is the honesty. The quote I received was the price I paid, with no hidden charges, no surprise deposits, and no fine print traps. For a business that manages travel budgets, that kind of transparency is rare and valuable.','', 'approved','2026-10-26','2026-10-26','2026-10-26'),
('REV-DHG-REAL-004','Efua Asante, Tema Community 18',5,'My tyre went flat near Tema on a Sunday evening and I was a bit panicked. I called the support line and someone answered right away, and a replacement was arranged within the hour. That kind of responsiveness is why I now recommend them to all my colleagues.','', 'approved','2026-10-26','2026-10-26','2026-10-26'),
('REV-DHG-REAL-005','Samuel Ofori-Atta, Adenta, Accra',5,'We hired an SUV from DriveHub GH for a family trip to Cape Coast and Kakum National Park. The car was spacious, comfortable and well maintained, and they were happy to extend the booking by a day when we wanted to stay longer. The kids loved the ride, and we loved how easy it all was.','', 'approved','2026-10-26','2026-10-26','2026-10-26'),
('REV-DHG-REAL-006','Akosua Dapaah, Osu, Accra',5,'Smooth booking, clean car, friendly team. DriveHub GH made it easy.','', 'approved','2026-10-26','2026-10-26','2026-10-26'),
('REV-DHG-REAL-007','Kojo Annan, Ridge, Accra',5,'Our company has leased two vehicles from DriveHub GH for our field staff since the start of the year. Invoicing is clear, maintenance is handled promptly, and whenever a car is due for service, a replacement is delivered the same day. It has taken a real burden off our operations team.','', 'approved','2026-10-26','2026-10-26','2026-10-26')
ON CONFLICT(id) DO UPDATE SET customer_name=excluded.customer_name,rating=excluded.rating,what_went_well=excluded.what_went_well,what_to_improve=excluded.what_to_improve,status='approved',reviewed_at=excluded.reviewed_at,published_at=excluded.published_at;

-- Report summary after import.
SELECT 'customers' AS record_type, COUNT(*) AS imported_count FROM customers WHERE id IN ('CUS-CMG-DHG00033','CUS-HFUSA-DHG00102')
UNION ALL SELECT 'invoices', COUNT(*) FROM invoices WHERE invoice_number IN ('DHG-00033','DHG-00102')
UNION ALL SELECT 'payments', COUNT(*) FROM payments WHERE id IN ('PAY-DHG-00033','PAY-DHG-00102')
UNION ALL SELECT 'published_reviews', COUNT(*) FROM reviews WHERE id LIKE 'REV-DHG-REAL-%' AND status='approved' AND published_at IS NOT NULL;
