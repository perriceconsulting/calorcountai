-- Create food_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.food_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text,
  macros jsonb NOT NULL,
  meal_type text,
  image_url text,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Create water_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.water_logs (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  glasses int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, date)
);

-- Create exercise_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.exercise_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity text NOT NULL,
  duration int NOT NULL,
  calories int NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Ensure extension for uuid generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
