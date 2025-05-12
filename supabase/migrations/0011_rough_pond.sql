-- Drop existing objects with dependencies
DROP FUNCTION IF EXISTS get_profile_simple CASCADE;
DROP VIEW IF EXISTS profile_view CASCADE;

-- Create a simplified profile view
CREATE VIEW profile_view AS 
SELECT 
  id,
  email,
  full_name,
  date_of_birth,
  gender,
  height,
  weight,
  activity_level,
  fitness_goal,
  onboarding_completed,
  preferences,
  last_active,
  created_at,
  updated_at
FROM profiles;

-- Create a simple profile fetch function that explicitly matches column types
CREATE OR REPLACE FUNCTION get_profile_simple(user_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  date_of_birth date,
  gender text,
  height numeric,
  weight numeric,
  activity_level text,
  fitness_goal text,
  onboarding_completed boolean,
  preferences jsonb,
  last_active timestamptz,
  created_at timestamptz,
  updated_at timestamptz
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.date_of_birth,
    p.gender,
    p.height,
    p.weight,
    p.activity_level,
    p.fitness_goal,
    p.onboarding_completed,
    p.preferences,
    p.last_active,
    p.created_at,
    p.updated_at
  FROM profiles p 
  WHERE p.id = user_id;
$$;