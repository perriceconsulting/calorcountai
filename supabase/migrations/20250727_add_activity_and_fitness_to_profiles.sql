-- Add activity level and fitness goal columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS activity_level TEXT,
  ADD COLUMN IF NOT EXISTS fitness_goal TEXT;

-- Add check constraints for valid values
ALTER TABLE public.profiles
  ADD CONSTRAINT valid_activity_level CHECK (activity_level IS NULL OR activity_level IN ('sedentary', 'moderate', 'active')),
  ADD CONSTRAINT valid_fitness_goal CHECK (fitness_goal IS NULL OR fitness_goal IN ('lose', 'maintain', 'gain'));
