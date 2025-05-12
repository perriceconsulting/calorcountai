import React from 'react';
import { useAchievementStore } from '../store/achievementStore';
import { BadgeDisplay } from './BadgeDisplay';
import { BADGES } from '../constants';

export function BadgeList() {
  const { progress } = useAchievementStore();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {BADGES.map(badge => (
        <BadgeDisplay
          key={badge.id}
          badge={badge}
          isEarned={progress.badges.includes(badge.id)}
        />
      ))}
    </div>
  );
}