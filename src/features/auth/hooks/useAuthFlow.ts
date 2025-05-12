import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProfile } from './useProfile';

export function useAuthFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { profile, loading, fetchProfile } = useProfile();

  // Only fetch profile once when user is available
  useEffect(() => {
    if (user?.id && !profile && !loading) {
      fetchProfile();
    }
  }, [user?.id, profile, loading, fetchProfile]);

  // Handle navigation based on onboarding status
  useEffect(() => {
    if (!loading && user && profile) {
      const isOnboarding = !profile.onboarding_completed;
      const isOnOnboardingPage = location.pathname === '/onboarding';

      if (isOnboarding && !isOnOnboardingPage) {
        navigate('/onboarding', { replace: true });
      } else if (!isOnboarding && isOnOnboardingPage) {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    }
  }, [user, profile, loading, navigate, location]);

  return { 
    isOnboarding: profile ? !profile.onboarding_completed : false,
    profile,
    loading 
  };
}