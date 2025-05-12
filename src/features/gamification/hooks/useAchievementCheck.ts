import { useEffect, useCallback } from 'react';
import { useAchievementStore } from '../store/achievementStore';
import { useFoodStore } from '../../../store/foodStore';
import { useHealthStore } from '../../../store/healthStore';
import { checkNewAchievements } from '../utils/achievementChecker';
import { calculateStreak } from '../utils/pointsCalculator';

export function useAchievementCheck() {
  const { foodEntries } = useFoodStore();
  const { waterIntake } = useHealthStore();
  const { 
    progress, 
    unlockAchievement, 
    addPoints, 
    updateStreaks 
  } = useAchievementStore();

  const checkAchievements = useCallback(() => {
    // Calculate streaks
    const dates = foodEntries.map(entry => new Date(entry.timestamp!));
    const mealStreak = calculateStreak(dates);
    const waterStreak = waterIntake >= 8 ? progress.streaks.waterTracking + 1 : 0;

    // Only update streaks if they've changed
    if (mealStreak !== progress.streaks.mealLogging || 
        waterStreak !== progress.streaks.waterTracking) {
      updateStreaks({
        mealLogging: mealStreak,
        waterTracking: waterStreak
      });
    }

    // Check for new achievements
    const newAchievements = checkNewAchievements({
      ...progress,
      streaks: { mealLogging: mealStreak, waterTracking: waterStreak }
    }, progress.achievements);
    
    newAchievements.forEach(achievement => {
      unlockAchievement(achievement.id);
      addPoints(achievement.points);
    });
  }, [foodEntries, waterIntake, progress.streaks, progress.achievements, unlockAchievement, addPoints, updateStreaks]);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  return null;
}