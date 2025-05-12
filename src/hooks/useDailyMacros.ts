import { useMemo } from 'react';
import { useFoodStore } from '../store/foodStore';
import { useDateStore } from '../store/dateStore';
import { filterEntriesByDate, calculateTotalMacros } from '../utils/foodUtils';
import type { MacroNutrients } from '../types/food';

const emptyMacros: MacroNutrients = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
};

export function useDailyMacros() {
  const { selectedDate } = useDateStore();
  const { foodEntries } = useFoodStore();

  return useMemo(() => {
    const dayEntries = filterEntriesByDate(foodEntries, selectedDate);
    
    if (dayEntries.length === 0) {
      return emptyMacros;
    }

    return calculateTotalMacros(dayEntries);
  }, [selectedDate, foodEntries]);
}