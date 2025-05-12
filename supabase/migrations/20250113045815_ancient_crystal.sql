/*
  # Fix food entries permissions

  1. Grant Permissions
    - Grant usage on schema to authenticated users
    - Grant all permissions on food_entries table to authenticated users
    - Grant usage of sequences to authenticated users

  2. Security
    - Ensure RLS policies are properly enabled
*/

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant table permissions
GRANT ALL ON food_entries TO authenticated;

-- Grant sequence usage (for id generation)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

-- Recreate policies with proper permissions
DROP POLICY IF EXISTS "Users can read own food entries" ON food_entries;
DROP POLICY IF EXISTS "Users can insert own food entries" ON food_entries;
DROP POLICY IF EXISTS "Users can update own food entries" ON food_entries;
DROP POLICY IF EXISTS "Users can delete own food entries" ON food_entries;

CREATE POLICY "Users can read own food entries"
  ON food_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food entries"
  ON food_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food entries"
  ON food_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own food entries"
  ON food_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);