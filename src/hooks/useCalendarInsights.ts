import { useMemo } from 'react';
import { useFoodStore } from '../store/foodStore';
import { useGoalsStore } from '../store/goalsStore';
import { getGoalStatus } from '../utils/macroCalculations';
import { startOfMonth, endOfMonth, formatDate } from '../utils/dateUtils';

export function useCalendarInsights() {
  const { foodEntries } = useFoodStore();
  const { goals } = useGoalsStore();

  return useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    const monthEntries = foodEntries.filter(entry => {
      const date = new Date(entry.timestamp!);
      return date >= monthStart && date <= monthEnd;
    });

    // Group entries by day
    const dailyEntries = monthEntries.reduce((acc, entry) => {
      const date = new Date(entry.timestamp!).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {} as Record<string, typeof monthEntries>);

    // Calculate success rate
    let successDays = 0;
    let totalDays = Object.keys(dailyEntries).length;

    // Calculate streak and find best day
    let currentStreak = 0;
    let bestDay = { date: '', percentage: 0 };

    Object.entries(dailyEntries).forEach(([date, entries]) => {
      const macros = entries.reduce(
        (acc, entry) => ({
          calories: acc.calories + entry.macros.calories,
          protein: acc.protein + entry.macros.protein,
          fat: acc.fat + entry.macros.fat,
          carbs: acc.carbs + entry.macros.carbs,
        }),
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
      );

      const status = getGoalStatus(macros, goals);
      
      if (status === 'success') {
        successDays++;
        currentStreak++;

        const percentage = Math.round(
          ((macros.calories / goals.calories +
            macros.protein / goals.protein +
            macros.fat / goals.fat +
            macros.carbs / goals.carbs) /
            4) *
            100
        );

        if (percentage > bestDay.percentage) {
          bestDay = {
            date: formatDate(new Date(date)),
            percentage,
          };
        }
      } else {
        currentStreak = 0;
      }
    });

    return {
      successRate: totalDays ? Math.round((successDays / totalDays) * 100) : 0,
      streak: currentStreak,
      bestDay: bestDay.date ? bestDay : { date: 'No data', percentage: 0 },
    };
  }, [foodEntries, goals]);
}