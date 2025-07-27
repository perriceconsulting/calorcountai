import { useEffect } from 'react';
import { Trophy, Star } from 'lucide-react';
import { ProgressOverview } from './ProgressOverview';
import { AchievementList } from './AchievementList';
import { BadgeList } from './BadgeList';
import { StreakDisplay } from './StreakDisplay';
import { ChallengesList } from './ChallengesList';
import { useAchievementStore } from '../store/achievementStore';

export function GamificationPage() {
  // clear notification dot when entering Achievements page
  const clearLastUnlocked = useAchievementStore(s => s.clearLastUnlocked);
  useEffect(() => {
    clearLastUnlocked();
  }, [clearLastUnlocked]);
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <p className="text-gray-600">Track your progress and earn rewards</p>
        </div>
      </div>

      <div className="space-y-8">
        <ProgressOverview />
        <ChallengesList />
        <StreakDisplay />
        
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Your Badges</h2>
          </div>
          <BadgeList />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Achievements</h2>
          </div>
          <AchievementList />
        </div>
      </div>
    </div>
  );
}