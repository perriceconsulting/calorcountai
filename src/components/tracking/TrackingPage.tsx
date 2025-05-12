import React, { useEffect } from 'react';
import { ImageUpload } from '../upload/ImageUpload';
import { FoodList } from '../food/FoodList';
import { MacrosPieChart } from '../charts/MacrosPieChart';
import { MacroGoalsCard } from '../goals/MacroGoalsCard';
import { DailyProgress } from '../progress/DailyProgress';
import { DateTimeDisplay } from '../datetime/DateTimeDisplay';
import { MacroFeedback } from '../food/MacroFeedback';
import { HealthInsights } from '../health/HealthInsights';
import { CommunityBanner } from '../../features/community/components/CommunityBanner';
import { useFoodStore } from '../../store/foodStore';
import { useDateStore } from '../../store/dateStore';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

export function TrackingPage() {
  const { isAnalyzing, fetchEntries } = useFoodStore();
  const { getIsCurrentDay } = useDateStore();
  const { isMobile } = useDeviceCapabilities();
  const isCurrentDay = getIsCurrentDay();

  // Fetch entries when component mounts
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <div className="flex items-center justify-center mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Food Tracker</h1>
      </div>

      <CommunityBanner />
      <DateTimeDisplay />

      <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
        <div className="space-y-4 sm:space-y-8">
          {isCurrentDay && (
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Upload Food Image</h2>
              <ImageUpload />
              {isAnalyzing && (
                <p className="text-center mt-4 text-blue-600">
                  Analyzing your food image...
                </p>
              )}
            </div>
          )}
          <MacroGoalsCard />
          <MacroFeedback />
          {!isMobile && <HealthInsights />}
        </div>

        <div className="space-y-4 sm:space-y-8">
          <DailyProgress />
          <MacrosPieChart />
        </div>
      </div>

      {isMobile && <HealthInsights />}

      <div className="mt-4 sm:mt-8 bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Food Entries</h2>
        <FoodList />
      </div>
    </div>
  );
}