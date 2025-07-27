import React, { useState } from 'react';
import { Settings, Lightbulb } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';
import { useDateStore } from '../../store/dateStore';
import { MacroDisplay } from './MacroDisplay';
import { MacroGoalsEditor } from './MacroGoalsEditor';
import { InfoTooltip } from '../accessibility/Tooltip';
// import device capabilities if needed later
import { fetchSuggestions } from '../../services/suggestionsService';

export function MacroGoalsCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const { selectedDate } = useDateStore();
  const { getGoalsForDate, hasCustomGoalsForDate } = useGoalsStore();
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

      {/* Suggestion banner */}
      <div
        className="mt-4 p-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer flex items-center gap-2"
        onClick={async () => {
          setSuggestLoading(true);
          try {
            const items = await fetchSuggestions('more protein-rich foods');
            setSuggestions(items);
          } catch (err) {
            console.error('Failed to fetch suggestions:', err);
          } finally {
            setSuggestLoading(false);
          }
        }}
      >
        {suggestLoading ? (
          <LoadingSpinner size="sm" className="text-blue-600" />
        ) : (
          <Lightbulb className="w-5 h-5" />
        )}
        Try to include more protein-rich foods
      </div>
      {/* Inline suggestions list */}
      {suggestions.length > 0 && (
        <ul className="list-disc list-inside mt-2 text-gray-700">
          {suggestions.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}

      {isEditing && (
        <MacroGoalsEditor onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}
import { LoadingSpinner } from '../shared/LoadingSpinner';