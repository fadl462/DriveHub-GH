-- Persistent private management workflow for customer improvement feedback.
-- Safe to apply once to the existing reviews table. Does not alter review status/publication.
ALTER TABLE reviews ADD COLUMN improvement_status TEXT NOT NULL DEFAULT 'new'
  CHECK (improvement_status IN ('new','under_review','action_planned','resolved'));
ALTER TABLE reviews ADD COLUMN management_notes TEXT;
CREATE INDEX IF NOT EXISTS idx_reviews_improvement_status ON reviews(improvement_status, submitted_at DESC);
