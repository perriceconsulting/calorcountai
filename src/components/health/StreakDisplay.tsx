import { Flame } from 'lucide-react';
import { useAchievementStore } from '../../features/gamification/store/achievementStore';

export function StreakDisplay() {
  const {
    progress: { streaks: { mealLogging, waterTracking } }
  } = useAchievementStore();

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center text-sm font-medium text-gray-700">
        <Flame className="w-4 h-4 text-red-500 mr-1" />
        {mealLogging}-day meal streak!
      </div>
      <div className="flex items-center text-sm font-medium text-gray-700">
        <Flame className="w-4 h-4 text-blue-500 mr-1" />
        {waterTracking}-day hydration streak!
      </div>
    </div>
  );
}
