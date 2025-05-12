/*
  # Add Profile Details Columns

  1. New Columns
    - `full_name` (text) - User's full name
    - `date_of_birth` (date) - User's birth date
    - `gender` (text) - User's gender
    - `height` (numeric) - Height in cm
    - `weight` (numeric) - Weight in kg
    - `activity_level` (text) - User's activity level
    - `fitness_goal` (text) - User's fitness goal

  2. Changes
    - Add columns if they don't exist
    - Add comments for documentation
*/

-- Add missing columns for user profile details
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS height numeric,
ADD COLUMN IF NOT EXISTS weight numeric,
ADD COLUMN IF NOT EXISTS activity_level text,
ADD COLUMN IF NOT EXISTS fitness_goal text;

-- Add column comments
COMMENT ON COLUMN profiles.full_name IS 'User''s full name';
COMMENT ON COLUMN profiles.date_of_birth IS 'User''s date of birth';
COMMENT ON COLUMN profiles.gender IS 'User''s gender';
COMMENT ON COLUMN profiles.height IS 'User''s height in centimeters';
COMMENT ON COLUMN profiles.weight IS 'User''s weight in kilograms';
COMMENT ON COLUMN profiles.activity_level IS 'User''s activity level (sedentary, moderate, active)';
COMMENT ON COLUMN profiles.fitness_goal IS 'User''s fitness goal (lose, maintain, gain)';

-- Add validation for gender values
ALTER TABLE profiles
ADD CONSTRAINT valid_gender 
CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

-- Add validation for activity level
ALTER TABLE profiles
ADD CONSTRAINT valid_activity_level 
CHECK (activity_level IS NULL OR activity_level IN ('sedentary', 'moderate', 'active'));

-- Add validation for fitness goal
ALTER TABLE profiles
ADD CONSTRAINT valid_fitness_goal 
CHECK (fitness_goal IS NULL OR fitness_goal IN ('lose', 'maintain', 'gain'));