export interface MacroGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface GoalPreset {
  id: string;
  name: string;
  goals: MacroGoals;
}

export interface GoalSettings {
  useCustom: boolean;
  startDate?: string;
  endDate?: string;
  repeat?: 'none' | 'daily' | 'weekly';
}