-- Ensure all required columns exist with proper types
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS activity_level text,
ADD COLUMN IF NOT EXISTS fitness_goal text;

-- Add constraints for valid values
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS valid_activity_level;

ALTER TABLE profiles
ADD CONSTRAINT valid_activity_level 
CHECK (activity_level IS NULL OR activity_level IN ('sedentary', 'moderate', 'active'));

ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS valid_fitness_goal;

ALTER TABLE profiles
ADD CONSTRAINT valid_fitness_goal 
CHECK (fitness_goal IS NULL OR fitness_goal IN ('lose', 'maintain', 'gain'));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(id) 
WHERE NOT onboarding_completed;

-- Ensure preferences column is properly configured
ALTER TABLE profiles
ALTER COLUMN preferences SET DEFAULT '{}'::jsonb,
ALTER COLUMN preferences SET NOT NULL;