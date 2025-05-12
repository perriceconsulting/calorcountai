/*
  # Fix profile query function return type

  1. Changes
    - Fix return type of get_profile_by_id function
    - Add proper column selection
*/

-- Drop existing function
DROP FUNCTION IF EXISTS get_profile_by_id;

-- Create fixed profile query function
CREATE OR REPLACE FUNCTION get_profile_by_id(user_id uuid, minimal boolean DEFAULT false)
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  updated_at timestamptz,
  onboarding_completed boolean,
  preferences jsonb,
  last_active timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF minimal THEN
    RETURN QUERY 
    SELECT 
      p.id,
      p.email,
      p.created_at,
      p.updated_at,
      p.onboarding_completed,
      p.preferences,
      p.last_active
    FROM profiles p
    WHERE p.id = user_id;
  ELSE
    RETURN QUERY 
    SELECT 
      p.id,
      p.email,
      p.created_at,
      p.updated_at,
      p.onboarding_completed,
      p.preferences,
      p.last_active
    FROM profiles p
    WHERE p.id = user_id;
  END IF;
END;
$$;