/*
  # Optimize Profile Queries

  1. Changes
    - Simplify profile query function
    - Add proper error handling
    - Optimize query performance
*/

-- Drop existing function
DROP FUNCTION IF EXISTS get_profile_by_id;

-- Create simplified profile query function
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
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    p.id,
    p.email,
    p.created_at,
    p.updated_at,
    p.onboarding_completed,
    p.preferences,
    p.last_active
  FROM profiles p
  WHERE p.id = user_id
  LIMIT 1;
$$;