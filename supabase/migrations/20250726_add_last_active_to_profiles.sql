-- Add last_active column to profiles
do \$\$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='profiles' AND column_name='last_active'
  ) THEN
    ALTER TABLE profiles
      ADD COLUMN last_active timestamp with time zone;
  END IF;
END
\$\$;
