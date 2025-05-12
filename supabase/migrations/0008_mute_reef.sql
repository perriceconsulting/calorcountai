-- Drop previous functions and views
DROP FUNCTION IF EXISTS fetch_profile;
DROP VIEW IF EXISTS profile_details;

-- Optimize profiles table
ALTER TABLE profiles
  ALTER COLUMN preferences SET DEFAULT '{}'::jsonb,
  ALTER COLUMN preferences SET NOT NULL;

-- Create simple materialized view for faster reads
CREATE MATERIALIZED VIEW profile_summary AS
SELECT 
  id,
  email,
  onboarding_completed,
  preferences,
  last_active
FROM profiles;

CREATE UNIQUE INDEX ON profile_summary (id);

-- Create simple fetch function
CREATE OR REPLACE FUNCTION get_profile(user_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  onboarding_completed boolean,
  preferences jsonb,
  last_active timestamptz
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT *
  FROM profile_summary
  WHERE id = user_id
  LIMIT 1;
$$;