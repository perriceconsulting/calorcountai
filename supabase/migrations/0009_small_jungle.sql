-- Drop previous functions and views for cleanup
DROP FUNCTION IF EXISTS get_profile;
DROP MATERIALIZED VIEW IF EXISTS profile_summary;

-- Create a simple profiles view without recursion
CREATE VIEW profile_view AS 
SELECT 
  id,
  email,
  onboarding_completed,
  preferences,
  last_active,
  created_at,
  updated_at
FROM profiles;

-- Create a simple, non-recursive profile fetch function
CREATE OR REPLACE FUNCTION get_profile_simple(user_id uuid)
RETURNS SETOF profile_view
LANGUAGE sql
SECURITY DEFINER
STABLE
PARALLEL SAFE
AS $$
  SELECT * FROM profile_view WHERE id = user_id LIMIT 1;
$$;