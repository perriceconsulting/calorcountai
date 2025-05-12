/*
  # Complete Schema Setup for AI Food Tracker

  1. New Tables
    - food_entries
      - id (uuid, primary key)
      - user_id (uuid, references profiles)
      - description (text)
      - macros (jsonb)
      - image_url (text)
      - meal_type (text)
      - timestamp (timestamptz)
      
    - goals
      - id (uuid, primary key)
      - user_id (uuid, references profiles)
      - date (date)
      - macros (jsonb)
      - is_default (boolean)
      
    - exercise_logs
      - id (uuid, primary key)
      - user_id (uuid, references profiles)
      - activity (text)
      - duration (integer)
      - calories (integer)
      - timestamp (timestamptz)
      
    - achievements
      - id (uuid, primary key)
      - user_id (uuid, references profiles)
      - achievement_id (text)
      - unlocked_at (timestamptz)
      
    - challenges
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - start_date (timestamptz)
      - end_date (timestamptz)
      - goal_type (text)
      - goal_value (integer)
      
    - challenge_participants
      - id (uuid, primary key)
      - challenge_id (uuid, references challenges)
      - user_id (uuid, references profiles)
      - progress (integer)
      - joined_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Food Entries Table
CREATE TABLE IF NOT EXISTS food_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  macros jsonb NOT NULL,
  image_url text,
  meal_type text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own food entries"
  ON food_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food entries"
  ON food_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Goals Table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  macros jsonb NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals"
  ON goals FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Exercise Logs Table
CREATE TABLE IF NOT EXISTS exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity text NOT NULL,
  duration integer NOT NULL,
  calories integer NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own exercise logs"
  ON exercise_logs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  goal_type text NOT NULL,
  goal_value integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);

-- Challenge Participants Table
CREATE TABLE IF NOT EXISTS challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  progress integer DEFAULT 0,
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own challenge participation"
  ON challenge_participants FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_food_entries_user_timestamp ON food_entries(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_goals_user_date ON goals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_user_timestamp ON exercise_logs(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON challenge_participants(challenge_id);