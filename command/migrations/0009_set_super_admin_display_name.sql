-- Set the existing super-admin account to the owner's preferred display name.
-- Safe and targeted: updates only the matching super-admin email.
UPDATE staff_users
SET display_name = 'Fadl Rahman Essel',
    updated_at = CURRENT_TIMESTAMP
WHERE LOWER(email) = LOWER('fadl_rahman3@yahoo.com')
  AND role = 'super_admin';
