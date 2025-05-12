import React from 'react';
import { useAchievementStore } from '../store/achievementStore';
import { AchievementCard } from './AchievementCard';
import { ShareAchievement } from './ShareAchievement';
import { ACHIEVEMENTS } from '../constants';

export function AchievementList() {
  const { progress, getUnlockedAchievements } = useAchievementStore();
  const unlockedAchievements = getUnlockedAchievements();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {ACHIEVEMENTS.map(achievement => {
          const isUnlocked = progress.achievements.includes(achievement.id);
          return (
            <div key={achievement.id}>
              <AchievementCard
                achievement={achievement}
                isUnlocked={isUnlocked}
              />
              {isUnlocked && (
                <div className="mt-2 flex justify-end">
                  <ShareAchievement achievement={achievement} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}