-- Enable Row Level Security on challenges table
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Allow users to insert challenges they own
CREATE POLICY "Allow users to insert challenges" ON public.challenges
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Allow anyone to select public challenges
CREATE POLICY "Allow select public challenges" ON public.challenges
  FOR SELECT
  USING (visibility = 'public');

-- Allow users to select their own challenges (private & family)
CREATE POLICY "Allow select own challenges" ON public.challenges
  FOR SELECT
  USING (owner_id = auth.uid());

-- Allow users to update or delete their own challenges
CREATE POLICY "Allow modify own challenges" ON public.challenges
  FOR UPDATE, DELETE
  USING (owner_id = auth.uid());
