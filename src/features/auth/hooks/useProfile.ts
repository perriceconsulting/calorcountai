import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { supabase } from '../../../lib/supabase';

export function useProfile() {
  const { user } = useAuthStore();
  const { profile, setProfile, setLoading, setError } = useProfileStore();

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - create one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              email: user.email,
              username: `user_${user.id.slice(0, 8)}`,
              onboarding_completed: false,
              preferences: {}
            }])
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(message);
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.email, setProfile, setLoading, setError]);

  return {
    profile,
    loading: useProfileStore(state => state.loading),
    error: useProfileStore(state => state.error),
    fetchProfile,
  };
}