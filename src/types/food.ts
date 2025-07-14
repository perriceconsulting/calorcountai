import type { MealType } from './meals';

export interface MacroNutrients {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface FoodAnalysis {
  description: string;
  macros: MacroNutrients;
  id?: string;  // optional DB record ID
  imageUrl?: string;
  timestamp?: string;
  mealType?: MealType;
}