import React from 'react';
import { Flame } from 'lucide-react';
import { useAchievementStore } from '../store/achievementStore';

export function StreakDisplay() {
  const { progress } = useAchievementStore();
  const { mealLogging, waterTracking } = progress.streaks;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold">Current Streaks</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StreakCard
          title="Meal Logging"
          days={mealLogging}
          color="bg-green-50"
          textColor="text-green-600"
        />
        <StreakCard
          title="Water Tracking"
          days={waterTracking}
          color="bg-blue-50"
          textColor="text-blue-600"
        />
      </div>
    </div>
  );
}

interface StreakCardProps {
  title: string;
  days: number;
  color: string;
  textColor: string;
}

function StreakCard({ title, days, color, textColor }: StreakCardProps) {
  return (
    <div className={`${color} rounded-lg p-4`}>
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${textColor}`}>{days}</span>
        <span className="text-sm text-gray-600">days</span>
      </div>
    </div>
  );
}