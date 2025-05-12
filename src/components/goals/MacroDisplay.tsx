import React from 'react';
import type { MacroGoals } from '../../types/goals';

interface MacroDisplayProps {
  goals: MacroGoals;
}

export function MacroDisplay({ goals }: MacroDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MacroItem label="Calories" value={goals.calories} unit="kcal" />
      <MacroItem label="Protein" value={goals.protein} unit="g" />
      <MacroItem label="Fat" value={goals.fat} unit="g" />
      <MacroItem label="Carbs" value={goals.carbs} unit="g" />
    </div>
  );
}

interface MacroItemProps {
  label: string;
  value: number;
  unit: string;
}

function MacroItem({ label, value, unit }: MacroItemProps) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">
        {value}
        <span className="text-sm text-gray-600 ml-1">{unit}</span>
      </p>
    </div>
  );
}