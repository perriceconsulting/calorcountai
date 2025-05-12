import React from 'react';
import { Clock } from 'lucide-react';
import { useCountdown } from '../../hooks/useCountdown';
import { DateDisplay } from '../date/DateDisplay';
import { DateNavigation } from '../date/DateNavigation';
import { useDateStore } from '../../store/dateStore';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

export function DateTimeDisplay() {
  const { getIsCurrentDay } = useDateStore();
  const { isMobile } = useDeviceCapabilities();
  const isCurrentDay = getIsCurrentDay();
  const countdown = useCountdown();

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 mb-4 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-4 sm:gap-6">
          <DateDisplay />
          <DateNavigation />
        </div>
        
        {isCurrentDay && (
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="font-medium text-gray-900">
              {countdown}
            </span>
            <span className="text-gray-600">until midnight</span>
          </div>
        )}
      </div>
    </div>
  );
}