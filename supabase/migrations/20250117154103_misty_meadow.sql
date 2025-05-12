-- Grant schema usage
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant permissions on tables
GRANT ALL ON water_logs TO authenticated;
GRANT ALL ON exercise_logs TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage own water logs" ON water_logs;
DROP POLICY IF EXISTS "Users can manage own exercise logs" ON exercise_logs;

-- Create comprehensive policies for water_logs
CREATE POLICY "Enable read for users based on user_id"
  ON water_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id"
  ON water_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
  ON water_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
  ON water_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create comprehensive policies for exercise_logs
CREATE POLICY "Enable read for users based on user_id"
  ON exercise_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id"
  ON exercise_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
  ON exercise_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
  ON exercise_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);