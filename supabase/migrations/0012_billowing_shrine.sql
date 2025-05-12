-- Drop existing functions and views
DROP FUNCTION IF EXISTS get_profile_simple CASCADE;
DROP VIEW IF EXISTS profile_view CASCADE;

-- Optimize profiles table
ALTER TABLE profiles
ALTER COLUMN preferences SET DEFAULT '{}'::jsonb,
ALTER COLUMN preferences SET NOT NULL;

-- Create a simple view for profiles
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

-- Create an optimized profile fetch function
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
PARALLEL SAFE
AS $$
  SELECT * FROM profile_view WHERE id = user_id;
$$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Add function to safely update profile
CREATE OR REPLACE FUNCTION update_profile_safe(
  user_id uuid,
  profile_updates jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET
    full_name = COALESCE(profile_updates->>'full_name', full_name),
    date_of_birth = COALESCE((profile_updates->>'date_of_birth')::date, date_of_birth),
    gender = COALESCE(profile_updates->>'gender', gender),
    height = COALESCE((profile_updates->>'height')::numeric, height),
    weight = COALESCE((profile_updates->>'weight')::numeric, weight),
    activity_level = COALESCE(profile_updates->>'activity_level', activity_level),
    fitness_goal = COALESCE(profile_updates->>'fitness_goal', fitness_goal),
    onboarding_completed = COALESCE((profile_updates->>'onboarding_completed')::boolean, onboarding_completed),
    preferences = COALESCE(profile_updates->'preferences', preferences),
    updated_at = now()
  WHERE id = user_id;
END;
$$;