import React from 'react';
import { Trophy, Star, Award } from 'lucide-react';
import { useAchievementStore } from '../store/achievementStore';
import { BADGES } from '../constants';

export function ProgressOverview() {
  const { progress, getUnlockedAchievements } = useAchievementStore();
  const unlockedAchievements = getUnlockedAchievements();
  const nextBadge = BADGES.find(b => b.requiredPoints > progress.points);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Your Progress</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="text-center">
          <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{progress.points}</p>
          <p className="text-sm text-gray-600">Total Points</p>
        </div>
        <div className="text-center">
          <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
          <p className="text-sm text-gray-600">Achievements</p>
        </div>
        <div className="text-center">
          <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{progress.badges.length}</p>
          <p className="text-sm text-gray-600">Badges Earned</p>
        </div>
      </div>

      {nextBadge && (
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 mb-2">Next Badge</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{nextBadge.name}</p>
              <p className="text-sm text-gray-600">{nextBadge.description}</p>
            </div>
            <p className="text-sm">
              {progress.points} / {nextBadge.requiredPoints} points
            </p>
          </div>
          <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${Math.min(
                  (progress.points / nextBadge.requiredPoints) * 100,
                  100
                )}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}