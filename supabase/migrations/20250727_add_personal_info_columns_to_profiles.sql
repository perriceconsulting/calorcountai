-- Add personal information columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS height double precision,
  ADD COLUMN IF NOT EXISTS weight double precision;

-- Ensure updated_at has default now()
ALTER TABLE public.profiles
  ALTER COLUMN updated_at SET DEFAULT now();
