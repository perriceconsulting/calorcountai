import React from 'react';
import { useGoalsStore } from '../../store/goalsStore';
import { useDailyMacros } from '../../hooks/useDailyMacros';
import { useDateStore } from '../../store/dateStore';
import type { MacroGoals } from '../../types/goals';

export function DailyProgress() {
  const { selectedDate } = useDateStore();
  const { getGoalsForDate } = useGoalsStore();
  const goals = getGoalsForDate(selectedDate);
  const consumed = useDailyMacros();

  // Early return if no goals are set
  if (!goals) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Progress</h2>
        <p className="text-gray-500 text-center">No goals set for today</p>
      </div>
    );
  }

  const remaining: MacroGoals = {
    calories: Math.max(0, goals.calories - consumed.calories),
    protein: Math.max(0, goals.protein - consumed.protein),
    fat: Math.max(0, goals.fat - consumed.fat),
    carbs: Math.max(0, goals.carbs - consumed.carbs),
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Progress</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <ProgressSection title="Consumed" macros={consumed} />
        <ProgressSection title="Remaining" macros={remaining} />
      </div>
    </div>
  );
}

interface ProgressSectionProps {
  title: string;
  macros: MacroGoals;
}

function ProgressSection({ title, macros }: ProgressSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="space-y-2">
        <MacroProgress label="Calories" value={macros.calories} unit="kcal" />
        <MacroProgress label="Protein" value={macros.protein} unit="g" />
        <MacroProgress label="Fat" value={macros.fat} unit="g" />
        <MacroProgress label="Carbs" value={macros.carbs} unit="g" />
      </div>
    </div>
  );
}

interface MacroProgressProps {
  label: string;
  value: number;
  unit: string;
}

function MacroProgress({ label, value, unit }: MacroProgressProps) {
  return (
    <div className="text-sm">
      <div className="flex justify-between mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">
          {Math.max(0, value).toFixed(1)} {unit}
        </span>
      </div>
    </div>
  );
}