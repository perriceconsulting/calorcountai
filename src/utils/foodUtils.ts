import type { FoodAnalysis } from '../types/food';
import { startOfDay, endOfDay } from './dateUtils';

export function filterEntriesByDate(entries: FoodAnalysis[], date: Date) {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  return entries.filter(entry => {
    const entryDate = new Date(entry.timestamp!);
    return entryDate >= dayStart && entryDate <= dayEnd;
  });
}

export function calculateTotalMacros(entries: FoodAnalysis[]) {
  return entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.macros.calories,
      protein: acc.protein + entry.macros.protein,
      fat: acc.fat + entry.macros.fat,
      carbs: acc.carbs + entry.macros.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}