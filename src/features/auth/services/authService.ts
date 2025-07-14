import { supabase } from '../../../lib/supabase';
import type { AuthError } from '@supabase/supabase-js';
import { AuthRetryableFetchError } from '@supabase/supabase-js';

export async function signUp(email: string, password: string, username: string) {
  try {
    // First create the auth user with username in metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          username: username.trim()
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned');

    // Then create the profile with the username
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: email.trim().toLowerCase(),
          username: username.trim(),
          onboarding_completed: false,
          preferences: {},
          last_active: new Date().toISOString()
        }
      ]);

    if (profileError) throw profileError;

    return { data: authData, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    // Handle network issues with fetch retries
    if (error instanceof AuthRetryableFetchError) {
      return { data: null, error: 'Network error. Please check your internet connection or try again later.' };
    }
    const authError = error as AuthError;
    if (authError.message.includes('already registered')) {
      return { data: null, error: 'This email is already registered' };
    }
    return { data: null, error: 'Failed to create account. Please try again.' };
  }
}

export async function signIn(email: string, password: string, rememberMe: boolean = false) {
    try {
    // reference rememberMe to avoid unused parameter warning
    console.debug('Remember me:', rememberMe);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Invalid email or password'
    };
  }
}

export async function signOut() {
  try {
    // First clear all session data
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-access-token');
    localStorage.removeItem('sb-refresh-token');
    localStorage.removeItem('supabase.auth.refreshToken');
    localStorage.removeItem('supabase.auth.accessToken');
    sessionStorage.clear();

    // Then sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: 'Failed to sign out' };
  }
}