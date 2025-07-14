-- 0014_community_recipes.sql
-- Create community_recipes table to store shared recipes

-- Ensure pgcrypto extension is available for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.community_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  recipe text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
