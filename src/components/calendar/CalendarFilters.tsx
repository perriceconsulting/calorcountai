import React from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import type { MacroFilter } from '../../types/calendar';

const FILTERS: { id: MacroFilter; label: string }[] = [
  { id: 'all', label: 'All Macros' },
  { id: 'calories', label: 'Calories' },
  { id: 'protein', label: 'Protein' },
  { id: 'fat', label: 'Fat' },
  { id: 'carbs', label: 'Carbs' },
];

export function CalendarFilters() {
  const { activeFilter, setActiveFilter } = useCalendarStore();

  return (
    <div className="flex gap-2 mb-6">
      {FILTERS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveFilter(id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}