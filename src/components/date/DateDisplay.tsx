import React from 'react';
import { useDateStore } from '../../store/dateStore';
import { formatDate } from '../../utils/dateUtils';

export function DateDisplay() {
  const { selectedDate, getIsCurrentDay } = useDateStore();
  const isCurrentDay = getIsCurrentDay();
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        {formatDate(selectedDate)}
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        {isCurrentDay ? "Today's Tracking" : "Historical View"}
      </p>
    </div>
  );
}