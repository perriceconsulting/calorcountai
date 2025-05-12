import type { UserProgress } from '../types';
import { POINT_VALUES } from '../constants';

export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  let streak = 1;
  const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if the most recent date is today or yesterday
  const mostRecent = sortedDates[0];
  mostRecent.setHours(0, 0, 0, 0);
  
  if (mostRecent.getTime() < today.getTime() - 86400000) {
    return 0; // Streak broken - last entry was before yesterday
  }

  for (let i = 1; i < sortedDates.length; i++) {
    const current = sortedDates[i];
    const prev = sortedDates[i - 1];
    
    const diffDays = (prev.getTime() - current.getTime()) / 86400000;
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateBonusPoints(progress: UserProgress): number {
  let bonus = 0;

  // Streak bonuses
  if (progress.streaks.mealLogging >= 7) {
    bonus += POINT_VALUES.STREAK_BONUS;
  }
  if (progress.streaks.waterTracking >= 5) {
    bonus += POINT_VALUES.STREAK_BONUS / 2;
  }

  return bonus;
}