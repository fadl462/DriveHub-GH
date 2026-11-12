-- DriveHub GH Stage 18: individual staff access and invitations.
-- Apply to production D1 only after taking a backup. Additive migration; no existing
-- rental, invoice, payment, customer, vehicle, review or audit records are deleted.
ALTER TABLE staff_users ADD COLUMN access_role TEXT NOT NULL DEFAULT 'read_only';

UPDATE staff_users
SET access_role = CASE role
  WHEN 'admin' THEN 'super_admin'
  WHEN 'operations' THEN 'operations_manager'
  WHEN 'finance' THEN 'finance_officer'
  WHEN 'review_moderator' THEN 'review_moderator'
  WHEN 'read_only' THEN 'read_only'
  ELSE 'read_only'
END;

CREATE TABLE IF NOT EXISTS staff_invitations (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  access_role TEXT NOT NULL CHECK (access_role IN (
    'operations_manager','rental_officer','finance_officer','review_moderator','read_only'
  )),
  invited_by TEXT NOT NULL REFERENCES staff_users(id),
  expires_at TEXT NOT NULL,
  accepted_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_staff_invitations_email_status
ON staff_invitations(email, accepted_at, expires_at);

CREATE INDEX IF NOT EXISTS idx_staff_users_access_role_active
ON staff_users(access_role, active);
