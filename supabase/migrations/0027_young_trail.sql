-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved profile handler function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_username text;
BEGIN
  -- Get username from metadata or generate default
  new_username := COALESCE(
    (NEW.raw_user_meta_data->>'username')::text,
    'user_' || substr(NEW.id::text, 1, 8)
  );

  -- Insert profile with retry logic
  FOR i IN 1..3 LOOP
    BEGIN
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
        NEW.id,
        NEW.email,
        new_username,
        NOW(),
        NOW(),
        false,
        '{}'::jsonb,
        NOW()
      );
      
      EXIT; -- Exit loop if insert succeeds
    EXCEPTION 
      WHEN unique_violation THEN
        -- If username exists, append number and retry
        new_username := new_username || '_' || i;
      WHEN OTHERS THEN
        RAISE NOTICE 'Error creating profile: %', SQLERRM;
        RETURN NEW;
    END;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();