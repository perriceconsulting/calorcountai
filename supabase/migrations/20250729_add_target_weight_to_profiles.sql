-- 20250729_add_target_weight_to_profiles.sql
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS target_weight DECIMAL(6,2);
