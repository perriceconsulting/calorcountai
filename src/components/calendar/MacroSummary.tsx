import React from 'react';
import type { MacroNutrients } from '../../types/food';

interface MacroSummaryProps {
  macros: MacroNutrients;
}

export function MacroSummary({ macros }: MacroSummaryProps) {
  return (
    <div className="mt-1 space-y-1 text-xs">
      <div className="flex justify-between">
        <span className="text-gray-600">Cal:</span>
        <span className="font-medium">{macros.calories}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">P:</span>
        <span className="font-medium">{macros.protein}g</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">F:</span>
        <span className="font-medium">{macros.fat}g</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">C:</span>
        <span className="font-medium">{macros.carbs}g</span>
      </div>
    </div>
  );
}