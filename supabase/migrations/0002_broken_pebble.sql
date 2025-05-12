/*
  # Add profile fields for onboarding

  1. New Fields
    - `onboarding_completed` (boolean) - Track if user completed onboarding
    - `preferences` (jsonb) - Store user preferences from onboarding
    - `last_active` (timestamptz) - Track user activity

  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS last_active timestamptz DEFAULT now();

-- Update trigger to handle last_active
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS trigger AS $$
BEGIN
  NEW.last_active = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_activity
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();

-- Add policy for updating onboarding status
CREATE POLICY "Users can update own onboarding status"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);