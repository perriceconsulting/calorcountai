import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../../../lib/supabase';
import { useToastStore } from '../../../store/toastStore';
import { useProfile } from './useProfile';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser, setSession, setLoading, loading } = useAuthStore();
  const { fetchProfile } = useProfile();
  const { addToast } = useToastStore();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Session error:', error);
          setUser(null);
          setSession(null);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          setSession(session);
          await fetchProfile();
        } else {
          setUser(null);
          setSession(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setSession(null);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Initialize auth state
    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      switch (event) {
        case 'SIGNED_OUT':
          setUser(null);
          setSession(null);
          navigate('/login', { replace: true });
          break;
        case 'SIGNED_IN':
          if (session) {
            setUser(session.user);
            setSession(session);
            await fetchProfile();
            navigate('/', { replace: true });
          }
          break;
        case 'TOKEN_REFRESHED':
          if (session) {
            setUser(session.user);
            setSession(session);
            await fetchProfile();
          }
          break;
        default:
          if (session) {
            setUser(session.user);
            setSession(session);
            await fetchProfile();
          }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setLoading, navigate, addToast, fetchProfile]);

  return { loading };
}