import React from 'react';
import { Apple, ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '../../store/onboardingStore';
import type { StepProps } from '../../types';

const DIETARY_OPTIONS = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'none', label: 'No Restrictions' }
];

export function DietaryStep({ onNext, onBack }: StepProps) {
  const { preferences, setPreferences } = useOnboardingStore();

  const toggleRestriction = (id: string) => {
    const current = preferences.dietaryRestrictions;
    const updated = current.includes(id)
      ? current.filter(r => r !== id)
      : [...current, id];
    setPreferences({ dietaryRestrictions: updated });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dietary Preferences</h2>
      <p className="text-gray-600 mb-8">
        Select any dietary restrictions or preferences you follow
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {DIETARY_OPTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => toggleRestriction(id)}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
              preferences.dietaryRestrictions.includes(id)
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <Apple className={`w-5 h-5 ${
              preferences.dietaryRestrictions.includes(id)
                ? 'text-blue-600'
                : 'text-gray-400'
            }`} />
            <span className="font-medium">{label}</span>
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