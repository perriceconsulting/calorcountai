/*
  # Add Username Support
  
  1. Changes
    - Add username column to profiles table
    - Add unique constraint on username
    - Add validation for minimum length
    - Update profile handler function
  
  2. Security
    - Maintain existing RLS policies
    - Username is readable by authenticated users
*/

-- Add username column with constraints
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Add check constraint for minimum length
ALTER TABLE profiles
ADD CONSTRAINT username_min_length 
CHECK (char_length(username) >= 3);

-- Update profile handler to include username
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (
    new.id, 
    new.email,
    COALESCE(
      (new.raw_user_meta_data->>'username')::text,
      'user_' || substr(new.id::text, 1, 8)
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username 
ON profiles(username);