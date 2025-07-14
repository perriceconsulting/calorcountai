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
  // User identity
  name?: string;
  birthdate?: string;
  // Nutrition targets
  macros?: { protein: number; carbs: number; fat: number };
  dietaryRestrictions?: string[];
  fitnessGoal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'moderate' | 'active';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  // Progressive profiling
  mealFrequency?: number;                // meals per day
  cookingSkill?: 'beginner' | 'pro' | 'homecook';
  trackingStyle?: 'photo' | 'manual';    // preferred logging method
  activeDays?: string[];                // days for reminders, e.g. ['Mon','Wed']
  focusArea?: 'energy' | 'weight' | 'muscle';
  reminderTime?: string;           // e.g. '07:30' for daily reminders
}

export interface OnboardingState {
  isComplete: boolean;
  currentStep: number;
  preferences: OnboardingPreferences;
}