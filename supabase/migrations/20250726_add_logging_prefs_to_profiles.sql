-- Add logging preferences to profiles table
-- This migration adds columns to store the user’s tracking style,
-- meal frequency, and cooking skill level.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tracking_style TEXT,
  ADD COLUMN IF NOT EXISTS meal_frequency INTEGER,
  ADD COLUMN IF NOT EXISTS cooking_skill TEXT;

-- Optionally, set defaults for existing rows
UPDATE public.profiles
  SET tracking_style = 'photo',
      meal_frequency = 3,
      cooking_skill = 'homecook'
  WHERE tracking_style IS NULL
    OR meal_frequency IS NULL
    OR cooking_skill IS NULL;
