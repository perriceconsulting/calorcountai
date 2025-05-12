-- Drop existing function as it's causing stack depth issues
DROP FUNCTION IF EXISTS get_profile_by_id;

-- Create optimized profile view for faster queries
CREATE OR REPLACE VIEW profile_details AS
SELECT 
  id,
  email,
  created_at,
  updated_at,
  onboarding_completed,
  preferences,
  last_active
FROM profiles;

-- Add materialized indexes for the view
CREATE INDEX IF NOT EXISTS idx_profile_details_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profile_details_email ON profiles(email);

-- Create simple profile fetch function without recursion
CREATE OR REPLACE FUNCTION fetch_profile(user_id uuid, minimal boolean DEFAULT false)
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
  SELECT 
    p.id,
    p.email,
    p.onboarding_completed,
    p.preferences,
    p.last_active
  FROM profile_details p 
  WHERE p.id = user_id
  LIMIT 1;
$$;