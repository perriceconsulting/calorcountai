-- Add username column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE;

-- Create function to generate unique username
CREATE OR REPLACE FUNCTION generate_unique_username(base_username text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_username text;
  counter integer := 0;
BEGIN
  new_username := base_username;
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = new_username) LOOP
    counter := counter + 1;
    new_username := base_username || counter;
  END LOOP;
  RETURN new_username;
END;
$$;

-- Update existing profiles with usernames if they don't have one
UPDATE profiles 
SET username = generate_unique_username('user_' || substr(id::text, 1, 8))
WHERE username IS NULL;

-- Make username required
ALTER TABLE profiles 
ALTER COLUMN username SET NOT NULL;

-- Add index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username 
ON profiles(username);

-- Update the handle_new_user function to properly set username
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      (new.raw_user_meta_data->>'username')::text,
      generate_unique_username('user_' || substr(new.id::text, 1, 8))
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;