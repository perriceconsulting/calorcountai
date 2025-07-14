import { useMemo } from 'react';
import { useFoodStore } from '../store/foodStore';
import { useGoalsStore } from '../store/goalsStore';
import type { DayData } from '../types/calendar';
import type { FoodAnalysis } from '../types/food';
import { getGoalStatus } from '../utils/macroCalculations';

export function useCalendarData(currentDate: Date): { days: DayData[]; monthYear: string } {
  const foodEntries = useFoodStore(s => s.foodEntries);
  const defaultGoals = useGoalsStore(s => s.defaultGoals);

  return useMemo(() => {
    // Group entries by date (YYYY-MM-DD)
    const byDate = new Map<string, FoodAnalysis[]>();
    foodEntries.forEach(e => {
      const key = e.timestamp!.slice(0, 10);
      const arr = byDate.get(key) || [];
      arr.push(e);
      byDate.set(key, arr);
    });

    // Month grid calculations
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const padPrev = firstDay.getDay();
    const padNext = 6 - lastDay.getDay();
    const days: DayData[] = [];

    // Previous-month padding
    for (let i = padPrev; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push({ date: d, isCurrentMonth: false, hasData: false, goalsStatus: 'none', macros: { calories:0, protein:0, fat:0, carbs:0 } });
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const key = date.toISOString().slice(0, 10);
      const list = byDate.get(key) || [];
      const macros = list.reduce(
        (acc, e) => ({ calories: acc.calories + e.macros.calories, protein: acc.protein + e.macros.protein, fat: acc.fat + e.macros.fat, carbs: acc.carbs + e.macros.carbs }),
        { calories:0, protein:0, fat:0, carbs:0 }
      );
      days.push({ date, isCurrentMonth: true, hasData: list.length > 0, goalsStatus: getGoalStatus(macros, defaultGoals), macros });
    }

    // Next-month padding
    for (let i = 1; i <= padNext; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false, hasData: false, goalsStatus: 'none', macros: { calories:0, protein:0, fat:0, carbs:0 } });
    }

    return {
      days,
      monthYear: currentDate.toLocaleDateString('en-US', { month:'long', year:'numeric' })
    };
  }, [currentDate, foodEntries, defaultGoals]);
}