import { useMemo } from 'react';
import { useFoodStore } from '../store/foodStore';
import { useGoalsStore } from '../store/goalsStore';
import type { DayData } from '../types/calendar';
import { getGoalStatus } from '../utils/macroCalculations';

export function useCalendarData(currentDate: Date) {
  const { foodEntries } = useFoodStore();
  const { goals } = useGoalsStore();

  return useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calculate days needed from previous month
    const daysFromPrevMonth = firstDay.getDay();
    const daysFromNextMonth = 6 - lastDay.getDay();
    
    const days: DayData[] = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1);
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i),
        isCurrentMonth: false,
        hasData: false,
        goalsStatus: 'none',
        macros: { calories: 0, protein: 0, fat: 0, carbs: 0 },
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dayEntries = foodEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp!);
        return (
          entryDate.getFullYear() === date.getFullYear() &&
          entryDate.getMonth() === date.getMonth() &&
          entryDate.getDate() === date.getDate()
        );
      });
      
      const macros = dayEntries.reduce(
        (acc, entry) => ({
          calories: acc.calories + entry.macros.calories,
          protein: acc.protein + entry.macros.protein,
          fat: acc.fat + entry.macros.fat,
          carbs: acc.carbs + entry.macros.carbs,
        }),
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
      );
      
      days.push({
        date,
        isCurrentMonth: true,
        hasData: dayEntries.length > 0,
        goalsStatus: getGoalStatus(macros, goals),
        macros,
      });
    }
    
    // Add days from next month
    const nextMonth = new Date(year, month + 1);
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i),
        isCurrentMonth: false,
        hasData: false,
        goalsStatus: 'none',
        macros: { calories: 0, protein: 0, fat: 0, carbs: 0 },
      });
    }
    
    return {
      days,
      monthYear: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
  }, [currentDate, foodEntries, goals]);
}