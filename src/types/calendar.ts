import type { MacroNutrients } from './food';

export type MacroFilter = 'all' | 'calories' | 'protein' | 'fat' | 'carbs';

export interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  hasData: boolean;
  goalsStatus: 'success' | 'fail' | 'none';
  macros: MacroNutrients;
}