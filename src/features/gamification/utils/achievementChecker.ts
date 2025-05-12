import type { Achievement, UserProgress } from '../types';
import { ACHIEVEMENTS } from '../constants';

export function checkNewAchievements(
  progress: UserProgress,
  unlockedAchievements: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => {
    // Skip already unlocked achievements
    if (unlockedAchievements.includes(achievement.id)) {
      return false;
    }

    // Check achievement conditions
    switch (achievement.id) {
      case 'first-meal':
        return progress.streaks.mealLogging > 0;
      case 'week-streak':
        return progress.streaks.mealLogging >= 7;
      case 'hydration-master':
        return progress.streaks.waterTracking >= 5;
      default:
        return false;
    }
  });
}

export function getNextAchievements(
  progress: UserProgress,
  limit = 3
): Achievement[] {
  const unlockedIds = new Set(progress.achievements);
  return ACHIEVEMENTS
    .filter(a => !unlockedIds.has(a.id))
    .sort((a, b) => a.points - b.points)
    .slice(0, limit);
}