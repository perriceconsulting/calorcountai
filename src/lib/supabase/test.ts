import { supabase } from './client';

export async function testSupabaseSetup(): Promise<boolean> {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;

    if (session) {
      const { error: dbError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('id', session.user.id)
        .single();

      if (dbError && !dbError.message.includes('no rows returned')) {
        throw dbError;
      }
    }

    return true;
  } catch (error) {
    console.error('Supabase setup test failed:', error);
    return false;
  }
}