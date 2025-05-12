import { supabase } from '../../../lib/supabase';

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/reset-password?email=${encodeURIComponent(email)}`
      }
    );

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Password reset error:', error);
    return { error: 'Failed to send reset instructions. Please try again.' };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Password update error:', error);
    return { error: 'Failed to update password. Please try again.' };
  }
}

export async function recoverUsername(email: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error) throw error;
    if (!data?.username) {
      return { error: 'No account found with this email' };
    }

    return { error: null };
  } catch (error) {
    console.error('Username recovery error:', error);
    return { error: 'Failed to recover username. Please try again.' };
  }
}