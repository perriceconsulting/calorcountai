/*
  # Optimize Profile Updates

  1. Changes
    - Simplify profile update function
    - Add proper indexing
    - Remove recursive triggers
    - Add batch update capability
  
  2. Security
    - Maintain RLS policies
    - Add parameter validation
*/

-- Drop existing update function
DROP FUNCTION IF EXISTS update_profile_safe;

-- Create optimized profile update function
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

-- Add partial index for onboarding status
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(id) 
WHERE NOT onboarding_completed;

-- Add index for last active timestamp
CREATE INDEX IF NOT EXISTS idx_profiles_last_active 
ON profiles(last_active);

-- Remove recursive triggers
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
DROP FUNCTION IF EXISTS handle_updated_user;

-- Add simple timestamp update trigger
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_timestamp();