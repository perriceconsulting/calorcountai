import { supabase } from '../lib/supabase';

/**
 * Share a recipe to the community_recipes table
 */
export async function shareRecipeToCommunity(recipe: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('community_recipes')
    .insert([{
      user_id: user.id,
      recipe,
      created_at: new Date().toISOString()
    }]);
  if (error) throw error;
}
/**
 * Retrieve shared recipes from community_recipes table
 */
export async function getCommunityRecipes(): Promise<{ id: string; user_id: string; recipe: string; created_at: string }[]> {
  const { data, error } = await supabase
    .from('community_recipes')
    .select('id, user_id, recipe, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
