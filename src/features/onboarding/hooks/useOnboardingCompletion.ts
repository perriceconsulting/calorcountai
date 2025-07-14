import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { useProfile } from '../../auth/hooks/useProfile';
import { useToastStore } from '../../../components/feedback/Toast';
import { completeOnboarding as completeOnboardingService } from '../services/onboardingService';
import type { OnboardingPreferences } from '../types';

export function useOnboardingCompletion() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchProfile } = useProfile();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);

  // Generic retry helper with exponential backoff
  const retry = useCallback(async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      if (retries <= 1) throw err;
      await new Promise(res => setTimeout(res, delay));
      return retry(fn, retries - 1, delay * 2);
    }
  }, []);

  const completeOnboarding = useCallback(async (preferences: OnboardingPreferences): Promise<boolean> => {
    if (!user?.id) {
      addToast('Authentication required. Please log in and try again.', 'error');
      return false;
    }
    setLoading(true);
    try {
      // Attempt to complete onboarding with retries
      const success = await retry(() => completeOnboardingService(user.id, preferences));
      if (!success) throw new Error('Onboarding completion failed.');
      // Refresh user profile
      await fetchProfile();
      addToast('Onboarding complete! Welcome aboard.', 'success');
      navigate('/', { replace: true });
      return true;
    } catch (error: any) {
      console.error('useOnboardingCompletion error:', error);
      addToast(error.message || 'Failed to complete onboarding. Please try again.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id, retry, fetchProfile, addToast, navigate]);

  return { completeOnboarding, loading };
}