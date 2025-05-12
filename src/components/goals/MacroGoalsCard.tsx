import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';
import { useDateStore } from '../../store/dateStore';
import { MacroDisplay } from './MacroDisplay';
import { MacroGoalsEditor } from './MacroGoalsEditor';
import { InfoTooltip } from '../accessibility/Tooltip';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

export function MacroGoalsCard() {
  const [isEditing, setIsEditing] = useState(false);
  const { selectedDate } = useDateStore();
  const { getGoalsForDate, hasCustomGoalsForDate } = useGoalsStore();
  const { isMobile } = useDeviceCapabilities();
  const goals = getGoalsForDate(selectedDate);

  if (!goals) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Set Your Goals</h2>
          <p className="text-gray-600 mb-4">No macro goals set for this date</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Set Goals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">Daily Macro Goals</h2>
          <InfoTooltip content="Set your daily targets for calories and macronutrients" />
        </div>
        <div className="flex items-center gap-4">
          {hasCustomGoalsForDate(selectedDate) && (
            <span className="text-xs sm:text-sm text-blue-600">Custom Goals</span>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Edit macro goals"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <MacroDisplay goals={goals} />

      {isEditing && (
        <MacroGoalsEditor onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}