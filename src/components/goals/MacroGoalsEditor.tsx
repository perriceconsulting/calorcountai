import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';
import { useDateStore } from '../../store/dateStore';
import type { MacroGoals } from '../../types/goals';
import { MacroPresets } from './MacroPresets';
import { MacroProgress } from './MacroProgress';
import { useToastStore } from '../feedback/Toast';
import { InfoTooltip } from '../accessibility/Tooltip';

interface MacroGoalsEditorProps {
  onClose: () => void;
}

export function MacroGoalsEditor({ onClose }: MacroGoalsEditorProps) {
  const { selectedDate } = useDateStore();
  const { 
    getGoalsForDate,
    setDefaultGoals,
    setGoalsForDate,
    clearGoalsForDate,
    hasCustomGoalsForDate
  } = useGoalsStore();
  
  const currentGoals = getGoalsForDate(selectedDate);
  const [newGoals, setNewGoals] = useState<MacroGoals>(currentGoals);
  const [applyToDefault, setApplyToDefault] = useState(false);
  const { addToast } = useToastStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (applyToDefault) {
      setDefaultGoals(newGoals);
      addToast('Default macro goals updated', 'success');
    } else {
      setGoalsForDate(selectedDate, newGoals);
      addToast('Macro goals updated for selected date', 'success');
    }
    
    onClose();
  };

  const handleReset = () => {
    clearGoalsForDate(selectedDate);
    addToast('Reset to default goals for this date', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Macro Goals</h3>
          <button onClick={onClose} className="text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">
            {hasCustomGoalsForDate(selectedDate) 
              ? 'Custom goals set for this date'
              : 'Using default goals'}
          </span>
          <InfoTooltip content="You can set specific goals for each day or use default goals" />
        </div>

        <MacroProgress currentGoals={currentGoals} newGoals={newGoals} />
        
        <MacroPresets onSelect={setNewGoals} />

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Macro goal sliders */}
          <div className="space-y-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
                Calories: {newGoals.calories} kcal
              </label>
              <input
                id="calories"
                type="range"
                min={0}
                max={currentGoals.calories * 2}
                value={newGoals.calories}
                onChange={(e) => setNewGoals({ ...newGoals, calories: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="protein" className="block text-sm font-medium text-gray-700">
                Protein: {newGoals.protein} g
              </label>
              <input
                id="protein"
                type="range"
                min={0}
                max={currentGoals.protein * 2}
                value={newGoals.protein}
                onChange={(e) => setNewGoals({ ...newGoals, protein: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="fat" className="block text-sm font-medium text-gray-700">
                Fat: {newGoals.fat} g
              </label>
              <input
                id="fat"
                type="range"
                min={0}
                max={currentGoals.fat * 2}
                value={newGoals.fat}
                onChange={(e) => setNewGoals({ ...newGoals, fat: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="carbs" className="block text-sm font-medium text-gray-700">
                Carbs: {newGoals.carbs} g
              </label>
              <input
                id="carbs"
                type="range"
                min={0}
                max={currentGoals.carbs * 2}
                value={newGoals.carbs}
                onChange={(e) => setNewGoals({ ...newGoals, carbs: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="applyToDefault"
              checked={applyToDefault}
              onChange={(e) => setApplyToDefault(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="applyToDefault" className="text-sm text-gray-600">
              Save as default goals
            </label>
            <InfoTooltip content="Apply these goals to all dates without custom settings" />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors"
            >
              Save Goals
            </button>
            
            {hasCustomGoalsForDate(selectedDate) && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Reset to Default
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}