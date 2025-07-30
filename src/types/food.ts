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
  imageUrl?: string;
  timestamp?: string;
  mealType?: MealType;
}