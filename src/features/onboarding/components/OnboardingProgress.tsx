// React import not needed
import { motion } from 'framer-motion';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  const progressPercent = (currentStep / (totalSteps - 1)) * 100;
  const ariaNow = currentStep + 1;
  return (
    <div className="mb-8" role="progressbar" aria-label="Onboarding progress" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={ariaNow}>
      <div className="h-1 bg-gray-200 rounded-full">
        <motion.div
          className="h-full bg-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className="sr-only">Step {ariaNow} of {totalSteps}</span>
    </div>
  );
}