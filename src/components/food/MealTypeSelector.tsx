import React from 'react';
import { Coffee, Sun, Moon, Apple } from 'lucide-react';
import { MEAL_TYPES, MEAL_LABELS, type MealType } from '../../types/meals';

interface MealTypeSelectorProps {
  value: MealType;
  onChange: (type: MealType) => void;
}

const MEAL_ICONS = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Apple,
};

export function MealTypeSelector({ value, onChange }: MealTypeSelectorProps) {
  return (
    <div className="flex gap-2">
      {MEAL_TYPES.map((type) => {
        const Icon = MEAL_ICONS[type];
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              value === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {MEAL_LABELS[type]}
          </button>
        );
      })}
    </div>
  );
}