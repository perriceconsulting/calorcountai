import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { useProfile } from '../../auth/hooks/useProfile';
import { useToastStore } from '../../../components/feedback/Toast';
import { completeOnboarding } from '../services/onboardingService';
import type { OnboardingPreferences } from '../types';

export function useOnboardingCompletion() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchProfile } = useProfile();
  const { addToast } = useToastStore();

  const handleCompletion = useCallback(async (preferences: OnboardingPreferences) => {
    if (!user?.id) {
      addToast('Authentication error. Please try again.', 'error');
      return false;
    }

    const success = await completeOnboarding(user.id, preferences);
    
    if (success) {
      // Refresh profile data after completion
      await fetchProfile();
      addToast('Profile setup completed!', 'success');
      navigate('/', { replace: true });
      return true;
    } else {
      addToast('Failed to complete setup. Please try again.', 'error');
      return false;
    }
  }, [user?.id, navigate, addToast, fetchProfile]);

  return { completeOnboarding: handleCompletion };
}