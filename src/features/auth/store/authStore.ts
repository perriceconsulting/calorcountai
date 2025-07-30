import { create } from 'zustand';
import { supabase } from '../../../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { signIn as serviceSignIn } from '../services/authService';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resendVerification: (email: string) => Promise<{ error?: string }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),

  signIn: async (email: string, password: string, rememberMe: boolean) => {
    try {
      const { data, error } = await serviceSignIn(email, password, rememberMe);
      if (error) throw new Error(error);
      if (!data?.user) throw new Error('No user returned');
      set({ user: data.user, session: data.session });
      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error instanceof Error ? error.message : 'Invalid login credentials' };
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) throw error;
      return {};
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to create account'
      };
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resendVerification: async (email: string) => {
    try {
      const { error } = await supabase.auth.resendVerificationEmail({ email: email.trim().toLowerCase() });
      if (error) throw error;
      return {};
    } catch (error) {
      console.error('Resend verification error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to resend verification email' };
    }
  }
}));