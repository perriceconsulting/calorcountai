-- Add username validation function
CREATE OR REPLACE FUNCTION validate_username(username text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if username meets requirements
  IF username IS NULL OR 
     length(username) < 3 OR 
     username !~ '^[a-zA-Z0-9_-]+$' THEN
    RETURN false;
  END IF;
  RETURN true;
END;
$$;

-- Add username validation constraint
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS username_validation;

ALTER TABLE profiles
ADD CONSTRAINT username_validation
CHECK (validate_username(username));

-- Update handle_new_user function to include validation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_username text;
BEGIN
  -- Get username from metadata or generate a default one
  new_username := COALESCE(
    (new.raw_user_meta_data->>'username')::text,
    'user_' || substr(new.id::text, 1, 8)
  );

  -- Validate username
  IF NOT validate_username(new_username) THEN
    new_username := 'user_' || substr(new.id::text, 1, 8);
  END IF;

  -- Ensure username is unique
  new_username := generate_unique_username(new_username);

  INSERT INTO public.profiles (
    id,
    email,
    username,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    new_username,
    now(),
    now()
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policy for username uniqueness check
CREATE POLICY "Allow public username checks"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

-- Add function to check username availability
CREATE OR REPLACE FUNCTION check_username_available(username text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM profiles WHERE profiles.username = check_username_available.username
  );
$$;

-- Grant execute permission on functions
GRANT EXECUTE ON FUNCTION check_username_available TO authenticated;
GRANT EXECUTE ON FUNCTION validate_username TO authenticated;