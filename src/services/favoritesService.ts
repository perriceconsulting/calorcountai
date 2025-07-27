import { supabase } from '../lib/supabase';

// Fetch the current user's favorite food IDs
export async function fetchFavorites(): Promise<string[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('favorites')
    .select('food_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data.map((row: { food_id: string }) => row.food_id);
}

// Add a favorite entry for the current user
export async function addFavorite(foodId: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase.from('favorites').insert({
    user_id: userId,
    food_id: foodId,
  });
  if (error) throw error;
}

// Remove a favorite entry for the current user
export async function removeFavorite(foodId: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('food_id', foodId);
  if (error) throw error;
}
