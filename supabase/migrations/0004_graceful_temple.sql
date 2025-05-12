/*
  # Optimize profiles table and queries

  1. Changes
    - Add indexes for better query performance
    - Optimize profile table structure
    - Add function to handle large profile updates

  2. Security
    - Maintain existing RLS policies
*/

-- Add index for faster profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);

-- Optimize profile preferences storage
ALTER TABLE profiles
ALTER COLUMN preferences SET DEFAULT '{}',
ALTER COLUMN preferences SET NOT NULL;

-- Create optimized profile query function
CREATE OR REPLACE FUNCTION get_profile_by_id(user_id uuid, minimal boolean DEFAULT false)
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF minimal THEN
    RETURN QUERY 
    SELECT id, onboarding_completed
    FROM profiles
    WHERE id = user_id;
  ELSE
    RETURN QUERY 
    SELECT *
    FROM profiles
    WHERE id = user_id;
  END IF;
END;
$$;