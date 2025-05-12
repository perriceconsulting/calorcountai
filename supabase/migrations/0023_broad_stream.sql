-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS check_username_available(text) CASCADE;
DROP FUNCTION IF EXISTS validate_username(text) CASCADE;

-- Create improved username validation function
CREATE OR REPLACE FUNCTION validate_username(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    username IS NOT NULL AND
    length(username) >= 3 AND
    username ~ '^[a-zA-Z0-9_-]+$'
  );
END;
$$;

-- Create function to check username availability
CREATE OR REPLACE FUNCTION check_username_available(username text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM profiles WHERE profiles.username = check_username_available.username
  );
END;
$$;

-- Create function to generate unique username
CREATE OR REPLACE FUNCTION generate_unique_username(base_username text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_username text;
  counter integer := 0;
BEGIN
  -- Clean input
  new_username := regexp_replace(lower(base_username), '[^a-z0-9_-]', '', 'g');
  
  -- Ensure minimum length
  IF length(new_username) < 3 THEN
    new_username := 'user_' || substr(gen_random_uuid()::text, 1, 8);
  END IF;
  
  -- Make unique if needed
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = new_username) LOOP
    counter := counter + 1;
    new_username := base_username || counter;
  END LOOP;
  
  RETURN new_username;
END;
$$;

-- Create improved user handler function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_username text;
BEGIN
  -- Get username from metadata or generate one
  new_username := COALESCE(
    (new.raw_user_meta_data->>'username')::text,
    generate_unique_username('user_' || substr(new.id::text, 1, 8))
  );

  -- Insert new profile
  INSERT INTO public.profiles (
    id,
    email,
    username,
    created_at,
    updated_at,
    onboarding_completed,
    preferences,
    last_active
  )
  VALUES (
    new.id,
    new.email,
    new_username,
    now(),
    now(),
    false,
    '{}'::jsonb,
    now()
  );

  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Fallback insert with generated username
    INSERT INTO public.profiles (
      id,
      email,
      username,
      created_at,
      updated_at,
      onboarding_completed,
      preferences,
      last_active
    )
    VALUES (
      new.id,
      new.email,
      generate_unique_username('user_' || substr(new.id::text, 1, 8)),
      now(),
      now(),
      false,
      '{}'::jsonb,
      now()
    );
    
    RETURN new;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT EXECUTE ON FUNCTION check_username_available TO anon, authenticated;
GRANT EXECUTE ON FUNCTION validate_username TO anon, authenticated;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);