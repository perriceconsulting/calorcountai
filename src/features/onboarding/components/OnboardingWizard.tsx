import { lazy, Suspense, useReducer, useState } from 'react';
import { useOnboardingCompletion } from '../hooks/useOnboardingCompletion';
import { useToastStore } from '../../../components/feedback/Toast';
import { useProfileStore } from '../../auth/store/profileStore';
import { OnboardingProgress } from './OnboardingProgress';

// lazy load onboarding steps for code-splitting
const WelcomeStep = lazy(() => import('./steps/WelcomeStep').then(m => ({ default: m.WelcomeStep })));
const FeatureOverviewStep = lazy(() => import('./steps/FeatureOverviewStep').then(m => ({ default: m.FeatureOverviewStep })));
const PersonalInfoStep = lazy(() => import('./steps/PersonalInfoStep').then(m => ({ default: m.PersonalInfoStep })));
const GoalsStep = lazy(() => import('./steps/GoalsStep').then(m => ({ default: m.GoalsStep })));
const DietaryStep = lazy(() => import('./steps/DietaryStep').then(m => ({ default: m.DietaryStep })));
const CompleteStep = lazy(() => import('./steps/CompleteStep').then(m => ({ default: m.CompleteStep })));

const STEPS = [WelcomeStep, FeatureOverviewStep, PersonalInfoStep, GoalsStep, DietaryStep, CompleteStep];

// navigation reducer for pure step logic
function navReducer(state: number, action: { type: 'NEXT' } | { type: 'BACK' }) {
  switch (action.type) {
    case 'NEXT':
      return state + 1;
    case 'BACK':
      return state - 1;
    default:
      return state;
  }
}

export function OnboardingWizard() {
  const { completeOnboarding } = useOnboardingCompletion();
  const { addToast } = useToastStore();
  const { profile } = useProfileStore();
  const [currentStep, dispatch] = useReducer(navReducer, 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferencesState] = useState<import('../types').OnboardingPreferences>({
    dietaryRestrictions: [],
    fitnessGoal: 'maintain',
    activityLevel: 'moderate',
    experienceLevel: 'beginner'
  });
  // wrapper to update partial preferences
  const updatePreferences = (prefs: Partial<import('../types').OnboardingPreferences>) => {
    setPreferencesState(prev => ({ ...prev, ...prefs }));
  };

  const CurrentStep = STEPS[currentStep];

  const handleNext = () => dispatch({ type: 'NEXT' });
  const handleBack = () => dispatch({ type: 'BACK' });

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    const success = await completeOnboarding(preferences);
    setLoading(false);
    if (!success) {
      setError('Failed to complete setup. Please try again.');
      addToast('Failed to complete setup. Please try again.', 'error');
    }
  };

  return (
    <div className="relative">
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <OnboardingProgress
            currentStep={currentStep}
            totalSteps={STEPS.length}
          />
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
              <span>Saving...</span>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8">
            <Suspense fallback={<div>Loading step...</div>}>
              <CurrentStep
                onNext={handleNext}
                onBack={handleBack}
                onComplete={handleComplete}
                preferences={preferences}
                setPreferences={updatePreferences}
                isFirst={currentStep === 0}
                isLast={currentStep === STEPS.length - 1}
                username={profile?.username}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}