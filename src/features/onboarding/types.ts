export interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
  preferences?: OnboardingPreferences;
  setPreferences?: (prefs: Partial<OnboardingPreferences>) => void;
  isFirst?: boolean;
  isLast?: boolean;
  username?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
}

export interface OnboardingPreferences {
  dietaryRestrictions: string[];
  fitnessGoal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'moderate' | 'active';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface OnboardingState {
  isComplete: boolean;
  currentStep: number;
  preferences: OnboardingPreferences;
}