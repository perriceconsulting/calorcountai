-- Add gender column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gender text;

-- (Optional) Set a default or NOT NULL constraint as desired
-- ALTER TABLE public.profiles
--   ALTER COLUMN gender SET DEFAULT '';
-- ALTER TABLE public.profiles
--   ALTER COLUMN gender SET NOT NULL;
