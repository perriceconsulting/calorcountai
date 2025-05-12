import React from 'react';
import { Target, ArrowRight, ArrowLeft } from 'lucide-react';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { StepProps } from '../../types';

export function GoalsStep({ onNext, onBack }: StepProps) {
  const { preferences, setPreferences } = useOnboardingStore();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">What's your goal?</h2>
      <p className="text-gray-600 mb-8">
        This helps us personalize your macro targets and recommendations
      </p>

      <div className="grid gap-4 mb-8">
        <GoalOption
          title="Lose Weight"
          description="Create a caloric deficit with balanced macros"
          isSelected={preferences.fitnessGoal === 'lose'}
          onClick={() => setPreferences({ fitnessGoal: 'lose' })}
        />
        <GoalOption
          title="Maintain Weight"
          description="Balance your intake with your daily needs"
          isSelected={preferences.fitnessGoal === 'maintain'}
          onClick={() => setPreferences({ fitnessGoal: 'maintain' })}
        />
        <GoalOption
          title="Gain Weight"
          description="Build muscle with a protein-focused surplus"
          isSelected={preferences.fitnessGoal === 'gain'}
          onClick={() => setPreferences({ fitnessGoal: 'gain' })}
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface GoalOptionProps {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

function GoalOption({ title, description, isSelected, onClick }: GoalOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 hover:border-blue-200'
      }`}
    >
      <Target className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
      <div className="text-left">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </button>
  );
}