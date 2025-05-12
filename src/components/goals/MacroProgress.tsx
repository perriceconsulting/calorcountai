import React from 'react';
import { useDailyMacros } from '../../hooks/useDailyMacros';
import type { MacroGoals } from '../../types/goals';
import { calculateMacroRatio } from '../../utils/macroCalculations';

interface MacroProgressProps {
  currentGoals: MacroGoals;
  newGoals: MacroGoals;
}

export function MacroProgress({ currentGoals, newGoals }: MacroProgressProps) {
  const consumed = useDailyMacros();
  const currentRatio = calculateMacroRatio(currentGoals);
  const newRatio = calculateMacroRatio(newGoals);

  const getProgress = (value: number, goal: number) => 
    Math.round((value / goal) * 100);

  const getProgressColor = (progress: number) =>
    progress > 100 ? 'text-red-600' :
    progress >= 90 ? 'text-green-600' :
    progress >= 70 ? 'text-blue-600' :
    'text-gray-600';

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h4 className="text-sm font-medium mb-3">Progress with New Goals</h4>
      
      <div className="space-y-3">
        <ProgressItem
          label="Calories"
          value={consumed.calories}
          oldGoal={currentGoals.calories}
          newGoal={newGoals.calories}
          unit="kcal"
        />
        
        <ProgressItem
          label="Protein"
          value={consumed.protein}
          oldGoal={currentGoals.protein}
          newGoal={newGoals.protein}
          oldRatio={currentRatio.protein}
          newRatio={newRatio.protein}
          unit="g"
        />
        
        <ProgressItem
          label="Fat"
          value={consumed.fat}
          oldGoal={currentGoals.fat}
          newGoal={newGoals.fat}
          oldRatio={currentRatio.fat}
          newRatio={newRatio.fat}
          unit="g"
        />
        
        <ProgressItem
          label="Carbs"
          value={consumed.carbs}
          oldGoal={currentGoals.carbs}
          newGoal={newGoals.carbs}
          oldRatio={currentRatio.carbs}
          newRatio={newRatio.carbs}
          unit="g"
        />
      </div>
    </div>
  );
}

interface ProgressItemProps {
  label: string;
  value: number;
  oldGoal: number;
  newGoal: number;
  oldRatio?: number;
  newRatio?: number;
  unit: string;
}

function ProgressItem({ 
  label, 
  value, 
  oldGoal, 
  newGoal,
  oldRatio,
  newRatio,
  unit 
}: ProgressItemProps) {
  const oldProgress = Math.round((value / oldGoal) * 100);
  const newProgress = Math.round((value / newGoal) * 100);
  
  const progressColor = newProgress > 100 ? 'bg-red-600' :
                       newProgress >= 90 ? 'bg-green-600' :
                       'bg-blue-600';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {value}{unit} 
            <span className="text-gray-500 text-xs">
              /{newGoal}{unit}
            </span>
          </span>
          {oldRatio !== undefined && newRatio !== undefined && (
            <span className="text-xs text-gray-500">
              {oldRatio}% → {newRatio}%
            </span>
          )}
        </div>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-300`}
          style={{ width: `${Math.min(newProgress, 100)}%` }}
        />
      </div>
      
      {oldGoal !== newGoal && (
        <div className="flex justify-end mt-1">
          <span className={`text-xs ${
            newProgress > oldProgress ? 'text-red-600' : 'text-green-600'
          }`}>
            {newProgress > oldProgress ? '↑' : '↓'} 
            {Math.abs(newProgress - oldProgress)}% change
          </span>
        </div>
      )}
    </div>
  );
}