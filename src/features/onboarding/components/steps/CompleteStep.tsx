import React from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import type { StepProps } from '../../types';

export function CompleteStep({ onBack, onComplete, preferences }: StepProps) {
  if (!preferences) return null;

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-green-600" />
      </div>

      <h2 className="text-2xl font-bold mb-6">You're All Set!</h2>
      <p className="text-gray-600 mb-8">
        We've personalized your experience based on your preferences
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="font-medium mb-4">Your Profile Summary</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-600">Goal</dt>
            <dd className="font-medium capitalize">{preferences.fitnessGoal}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Activity Level</dt>
            <dd className="font-medium capitalize">{preferences.activityLevel}</dd>
          </div>
          {preferences.dietaryRestrictions.length > 0 && (
            <div className="flex justify-between">
              <dt className="text-gray-600">Dietary Preferences</dt>
              <dd className="font-medium text-right">
                {preferences.dietaryRestrictions.join(', ')}
              </dd>
            </div>
          )}
        </dl>
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
          onClick={onComplete}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}