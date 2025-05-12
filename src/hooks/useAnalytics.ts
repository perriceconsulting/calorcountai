import { useMemo } from 'react';
import { useFoodStore } from '../store/foodStore';
import { useGoalsStore } from '../store/goalsStore';
import { calculateTrends, calculateWeeklyProgress } from '../utils/analyticsUtils';
import { filterEntriesByDate } from '../utils/foodUtils';
import { startOfDay } from '../utils/dateUtils';

export function useAnalytics(days = 7) {
  const { foodEntries } = useFoodStore();
  const { getGoalsForDate } = useGoalsStore();
  const goals = getGoalsForDate(new Date());

  return useMemo(() => {
    if (!goals) return null;

    const today = new Date();
    const dailyMacros = Array.from({ length: days }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const entries = filterEntriesByDate(foodEntries, date);
      return entries.reduce(
        (acc, entry) => ({
          calories: acc.calories + entry.macros.calories,
          protein: acc.protein + entry.macros.protein,
          fat: acc.fat + entry.macros.fat,
          carbs: acc.carbs + entry.macros.carbs,
        }),
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
      );
    }).reverse();

    return {
      trends: calculateTrends(dailyMacros, goals),
      weeklyProgress: calculateWeeklyProgress(dailyMacros)
    };
  }, [foodEntries, goals, days]);
}