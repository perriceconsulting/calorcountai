import React, { memo, useCallback } from 'react';
import type { MacroGoals } from '../../types/goals';

interface GoalSliderProps {
  id: keyof MacroGoals;
  label: string;
  unit: string;
  max: number;
  value: number;
  onChange: (key: keyof MacroGoals, value: number) => void;
}

export const GoalSlider = memo(function GoalSlider({ id, label, unit, max, value, onChange }: GoalSliderProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedChange(id, Number(e.target.value));
  }, [id, onChange]);

  // debounce helper
  const debouncedChange = React.useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (key: keyof MacroGoals, val: number) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => onChange(key, val), 150);
    };
  }, [onChange]);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}: {value} {unit}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
});
