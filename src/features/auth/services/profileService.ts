import { supabase } from '../../../lib/supabase';

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('check_username_available', { username: username.trim() });

    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Username check error:', error);
    return false;
  }
}

export async function validateUsername(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('validate_username', { username: username.trim() });

    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Username validation error:', error);
    return false;
  }
}