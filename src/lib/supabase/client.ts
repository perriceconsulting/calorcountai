import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

// read environment variables
// DEBUG: dump all env vars Vite loaded
console.log('import.meta.env:', import.meta.env);
// debug output: verify env loading
// Always use hosted Supabase Cloud instance
const supabaseUrl = 'https://gbycvrxgqpbkccquglxe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdieWN2cnhncXBia2NjcXVnbHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NjQ3NzksImV4cCI6MjA2OTE0MDc3OX0.uzrIKLVQuJKyTUtkldA20_Ohq3S0QfYmK9JId9NU5Mo';

// Ensure environment variables are present
// Remove the check for environment variables as we are using hard-coded values
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        try {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        } catch {
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error storing auth session:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing auth session:', error);
        }
      }
    },
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'ai-food-tracker'
    }
  }
});

// Initialize session recovery
supabase.auth.onAuthStateChange((event, session) => {
  // Only handle sign-out events (USER_DELETED removed to match AuthChangeEvent types)
  if (event === 'SIGNED_OUT') {
    // Clear all auth data
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-access-token');
    localStorage.removeItem('sb-refresh-token');
    localStorage.removeItem('supabase.auth.refreshToken');
    localStorage.removeItem('supabase.auth.accessToken');
    sessionStorage.clear();
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    // Store session token securely
    if (session?.access_token) {
      localStorage.setItem('supabase.auth.accessToken', session.access_token);
      if (session.refresh_token) {
        localStorage.setItem('supabase.auth.refreshToken', session.refresh_token);
      }
    }
  }
});