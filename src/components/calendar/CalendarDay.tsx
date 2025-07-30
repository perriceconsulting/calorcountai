import React from 'react';
import type { DayData } from '../../types/calendar';
import { MacroSummary } from './MacroSummary';
import { isToday } from '../../utils/dateUtils';

interface CalendarDayProps {
  day: DayData;
}

export function CalendarDay({ day }: CalendarDayProps) {
  const getStatusColor = () => {
    if (!day.hasData) return 'bg-gray-100';
    return day.goalsStatus === 'success' ? 'bg-green-50' : 'bg-red-50';
  };

  const isCurrentDay = isToday(day.date);

  return (
    <div 
      className={`
        min-h-[100px] p-2 
        ${getStatusColor()}
        ${isCurrentDay ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      `}
    >
      <span 
        className={`
          text-sm font-medium
          ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
          ${isCurrentDay ? 'text-blue-600' : ''}
        `}
      >
        {day.date.getDate()}
      </span>
      {day.hasData && <MacroSummary macros={day.macros} />}
    </div>
  );
}