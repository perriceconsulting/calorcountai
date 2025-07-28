-- Add gamification columns for challenges
-- Track overall challenge metrics and per-participant progress/points

-- Add goal/target field to challenges table (number of points to complete)
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS target_points integer NOT NULL DEFAULT 0;

-- Add progress and points tracking to participants
ALTER TABLE public.challenge_participants
  ADD COLUMN IF NOT EXISTS progress integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS points integer NOT NULL DEFAULT 0;

-- Ensure these columns are covered by RLS policies
-- (No additional policy needed for reading as policies apply to entire row)
