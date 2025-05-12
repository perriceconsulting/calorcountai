/*
  # Add achievements and challenges functionality

  1. New Tables
    - `achievements` - Stores available achievements
    - `user_achievements` - Tracks unlocked achievements per user
    - `challenges` - Stores available challenges
    - `challenge_participants` - Tracks user participation and progress
    - `challenge_goals` - Stores challenge completion criteria

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Add indexes for performance

  3. Changes
    - Add relationships between users, achievements, and challenges
    - Add tracking for progress and completion
*/

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  points integer NOT NULL,
  criteria jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  type text NOT NULL,
  goal_type text NOT NULL,
  goal_value integer NOT NULL,
  points integer NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  CHECK (end_date > start_date),
  CHECK (status IN ('active', 'completed', 'cancelled'))
);

-- Create challenge participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  current_value integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert user achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for challenges
CREATE POLICY "Anyone can view active challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (status = 'active' OR EXISTS (
    SELECT 1 FROM challenge_participants
    WHERE challenge_id = id AND user_id = auth.uid()
  ));

-- Create policies for challenge participants
CREATE POLICY "Users can view challenge participation"
  ON challenge_participants FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join challenges"
  ON challenge_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM challenges
      WHERE id = challenge_id AND status = 'active'
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_challenge_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX idx_challenge_participants_user ON challenge_participants(user_id);
CREATE INDEX idx_challenges_status ON challenges(status) WHERE status = 'active';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON achievements TO authenticated;
GRANT ALL ON user_achievements TO authenticated;
GRANT ALL ON challenges TO authenticated;
GRANT ALL ON challenge_participants TO authenticated;

-- Insert some default achievements
INSERT INTO achievements (title, description, icon, points, criteria) VALUES
('First Meal', 'Log your first meal', 'utensils', 50, '{"type": "meal_count", "value": 1}'::jsonb),
('Week Warrior', 'Log meals for 7 days in a row', 'calendar', 100, '{"type": "streak", "value": 7}'::jsonb),
('Hydration Master', 'Meet water goals for 5 days', 'droplet', 75, '{"type": "water_streak", "value": 5}'::jsonb),
('Protein Champion', 'Hit protein goals for 3 days straight', 'target', 100, '{"type": "protein_streak", "value": 3}'::jsonb)
ON CONFLICT DO NOTHING;