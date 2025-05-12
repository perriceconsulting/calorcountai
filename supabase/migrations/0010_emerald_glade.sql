/*
  # Add Profile Details

  1. New Columns
    - `full_name` (text): User's full name
    - `date_of_birth` (date): User's birth date
    - `gender` (text): User's gender
    - `height` (numeric): Height in cm
    - `weight` (numeric): Weight in kg
    - `activity_level` (text): Activity level
    - `fitness_goal` (text): Primary fitness goal

  2. Changes
    - Add new profile columns
    - Drop existing view and function with CASCADE
    - Recreate view with new columns
*/

-- Drop existing objects with dependencies
DROP FUNCTION IF EXISTS get_profile_simple CASCADE;
DROP VIEW IF EXISTS profile_view CASCADE;

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS height numeric,
ADD COLUMN IF NOT EXISTS weight numeric,
ADD COLUMN IF NOT EXISTS activity_level text,
ADD COLUMN IF NOT EXISTS fitness_goal text;

-- Recreate the profile view with new columns
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

-- Recreate the profile fetch function
CREATE OR REPLACE FUNCTION get_profile_simple(user_id uuid)
RETURNS SETOF profile_view
LANGUAGE sql
SECURITY DEFINER
STABLE
PARALLEL SAFE
AS $$
  SELECT * FROM profile_view WHERE id = user_id LIMIT 1;
$$;