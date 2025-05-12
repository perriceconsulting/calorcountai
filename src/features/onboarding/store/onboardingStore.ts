import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingState, OnboardingPreferences } from '../types';

interface OnboardingStore extends OnboardingState {
  setStep: (step: number) => void;
  setPreferences: (prefs: Partial<OnboardingPreferences>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const initialState: OnboardingState = {
  isComplete: false,
  currentStep: 0,
  preferences: {
    dietaryRestrictions: [],
    fitnessGoal: 'maintain',
    activityLevel: 'moderate',
    experienceLevel: 'beginner'
  }
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      setPreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs }
      })),
      completeOnboarding: () => set({ isComplete: true }),
      resetOnboarding: () => set(initialState)
    }),
    {
      name: 'onboarding-store',
      version: 1,
    }
  )
);