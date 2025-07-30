-- 20250727_add_personal_info_columns_to_profiles.sql
-- Add missing personal info fields to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS height DECIMAL(6,2),
  ADD COLUMN IF NOT EXISTS weight DECIMAL(6,2);
