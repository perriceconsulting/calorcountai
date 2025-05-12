import { useState, useEffect } from 'react';
import { OnboardingStep } from '../types';

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Get started with AI Food Tracker'
  },
  {
    id: 'photo',
    title: 'Take a Photo',
    description: 'Learn how to log meals with your camera'
  },
  {
    id: 'goals',
    title: 'Set Goals',
    description: 'Configure your nutrition targets'
  }
];

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  return {
    currentStep,
    step: ONBOARDING_STEPS[currentStep],
    nextStep,
    completed
  };
}