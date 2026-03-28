
-- Remove the redundant password column from users table
-- Supabase Auth already handles password storage securely
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
ALTER TABLE users DROP COLUMN password;
