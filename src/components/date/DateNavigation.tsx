import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDateStore } from '../../store/dateStore';

export function DateNavigation() {
  const { goToPreviousDay, goToNextDay, resetToToday, getIsCurrentDay } = useDateStore();
  const isCurrentDay = getIsCurrentDay();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={goToPreviousDay}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {!isCurrentDay && (
        <button
          onClick={resetToToday}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          Today
        </button>
      )}
      
      <button
        onClick={goToNextDay}
        disabled={isCurrentDay}
        className={`p-1 rounded-full ${
          isCurrentDay 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'hover:bg-gray-100'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}