ALTER TABLE rentals ADD COLUMN source_type TEXT NOT NULL DEFAULT 'owned' CHECK(source_type IN ('owned','partner'));
