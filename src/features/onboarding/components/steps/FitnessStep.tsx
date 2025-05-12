import React from 'react';
import { Activity, ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { StepProps } from '../../types';

const ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    description: 'Little to no regular exercise'
  },
  {
    id: 'moderate',
    label: 'Moderately Active',
    description: '3-5 days of exercise per week'
  },
  {
    id: 'active',
    label: 'Very Active',
    description: '6-7 days of exercise per week'
  }
];

export function FitnessStep({ onNext, onBack }: StepProps) {
  const { preferences, setPreferences } = useOnboardingStore();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Activity Level</h2>
      <p className="text-gray-600 mb-8">
        Help us calculate your daily calorie needs
      </p>

      <div className="space-y-4 mb-8">
        {ACTIVITY_LEVELS.map(({ id, label, description }) => (
          <button
            key={id}
            onClick={() => setPreferences({ activityLevel: id as any })}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
              preferences.activityLevel === id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <Activity className={`w-6 h-6 ${
              preferences.activityLevel === id ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <div className="text-left">
              <h3 className="font-medium">{label}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </button>
        ))}
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