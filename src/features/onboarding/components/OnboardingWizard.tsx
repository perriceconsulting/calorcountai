import React, { useState } from 'react';
import { useOnboardingCompletion } from '../hooks/useOnboardingCompletion';
import { useToastStore } from '../../../components/feedback/Toast';
import { useProfileStore } from '../../auth/store/profileStore';
import { OnboardingProgress } from './OnboardingProgress';
import { WelcomeStep } from './steps/WelcomeStep';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { GoalsStep } from './steps/GoalsStep';
import { DietaryStep } from './steps/DietaryStep';
import { CompleteStep } from './steps/CompleteStep';

const STEPS = [
  WelcomeStep,
  PersonalInfoStep,
  GoalsStep,
  DietaryStep,
  CompleteStep
];

export function OnboardingWizard() {
  const { completeOnboarding } = useOnboardingCompletion();
  const { addToast } = useToastStore();
  const { profile } = useProfileStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [],
    fitnessGoal: 'maintain',
    activityLevel: 'moderate'
  });

  const CurrentStep = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    const success = await completeOnboarding(preferences);
    if (!success) {
      addToast('Failed to complete setup. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <OnboardingProgress 
          currentStep={currentStep} 
          totalSteps={STEPS.length} 
        />

        <div className="bg-white rounded-lg shadow-lg p-8">
          <CurrentStep
            onNext={handleNext}
            onBack={handleBack}
            onComplete={handleComplete}
            preferences={preferences}
            setPreferences={setPreferences}
            isFirst={currentStep === 0}
            isLast={currentStep === STEPS.length - 1}
            username={profile?.username}
          />
        </div>
      </div>
    </div>
  );
}