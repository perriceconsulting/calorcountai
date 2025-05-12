import React from 'react';
import { InfoTooltip } from '../accessibility/Tooltip';
import type { MacroGoals } from '../../types/goals';
import { MACRO_PRESETS } from '../../constants/macroPresets';

interface MacroPresetsProps {
  onSelect: (goals: MacroGoals) => void;
}

export function MacroPresets({ onSelect }: MacroPresetsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-sm font-medium">Quick Presets</h4>
        <InfoTooltip content="Select a preset to automatically set recommended macro goals" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(MACRO_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => onSelect(preset.macros)}
            className="flex flex-col items-start p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group relative"
          >
            <span className="font-medium capitalize">{preset.name}</span>
            <span className="text-xs text-gray-500 mt-1">{preset.shortDesc}</span>
            
            <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg z-10">
              <p className="mb-2">{preset.description}</p>
              <div className="text-xs space-y-1 text-gray-300">
                <p>• Calories: {preset.macros.calories}</p>
                <p>• Protein: {preset.macros.protein}g</p>
                <p>• Fat: {preset.macros.fat}g</p>
                <p>• Carbs: {preset.macros.carbs}g</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}