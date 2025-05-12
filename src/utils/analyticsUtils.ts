import type { MacroNutrients } from '../types/food';
import type { MacroGoals } from '../types/goals';

export function calculateTrends(macros: MacroNutrients[], goals: MacroGoals) {
  if (!macros.length) return null;

  const averages = macros.reduce(
    (acc, curr) => ({
      calories: acc.calories + curr.calories / macros.length,
      protein: acc.protein + curr.protein / macros.length,
      fat: acc.fat + curr.fat / macros.length,
      carbs: acc.carbs + curr.carbs / macros.length,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  return {
    averages,
    adherence: {
      calories: (averages.calories / goals.calories) * 100,
      protein: (averages.protein / goals.protein) * 100,
      fat: (averages.fat / goals.fat) * 100,
      carbs: (averages.carbs / goals.carbs) * 100,
    }
  };
}

export function calculateWeeklyProgress(macros: MacroNutrients[]) {
  return macros.map((day, index) => ({
    day: index,
    ...day
  }));
}