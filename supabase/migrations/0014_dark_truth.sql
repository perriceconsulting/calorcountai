-- Drop existing functions
DROP FUNCTION IF EXISTS update_profile_safe;
DROP FUNCTION IF EXISTS get_profile_simple;

-- Create a more efficient profile update function
CREATE OR REPLACE FUNCTION update_profile_safe(
  user_id uuid,
  profile_updates jsonb
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE profiles
  SET
    full_name = COALESCE((profile_updates->>'full_name')::text, full_name),
    date_of_birth = COALESCE((profile_updates->>'date_of_birth')::date, date_of_birth),
    gender = COALESCE((profile_updates->>'gender')::text, gender),
    height = COALESCE((profile_updates->>'height')::numeric, height),
    weight = COALESCE((profile_updates->>'weight')::numeric, weight),
    activity_level = COALESCE((profile_updates->>'activity_level')::text, activity_level),
    fitness_goal = COALESCE((profile_updates->>'fitness_goal')::text, fitness_goal),
    onboarding_completed = COALESCE((profile_updates->>'onboarding_completed')::boolean, onboarding_completed),
    preferences = COALESCE(profile_updates->'preferences', preferences),
    updated_at = now()
  WHERE id = user_id;
$$;

-- Create a simplified profile fetch function
CREATE OR REPLACE FUNCTION get_profile_simple(user_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  onboarding_completed boolean,
  preferences jsonb,
  last_active timestamptz
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    id,
    email,
    full_name,
    onboarding_completed,
    preferences,
    last_active
  FROM profiles 
  WHERE id = user_id;
$$;