-- Creates a favorites table to link users with favorite food entries
create table if not exists favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  food_id text not null,
  created_at timestamp with time zone default now(),
  unique(user_id, food_id)
);

-- Enable public role to select favorites
create policy "Public read favorites for authenticated" on favorites
  for select
  using (auth.role() = 'authenticated');

-- Allow authenticated users to insert their own favorites
create policy "Insert favorites" on favorites
  for insert
  with check (auth.uid() = user_id);

-- Allow authenticated users to delete their own favorites
create policy "Delete favorites" on favorites
  for delete
  using (auth.uid() = user_id);
