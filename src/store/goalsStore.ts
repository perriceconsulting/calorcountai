import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MacroGoals, GoalSettings } from '../types/goals';
import { startOfDay, formatDate } from '../utils/dateUtils';

interface GoalsHistory {
  [date: string]: MacroGoals;
}

interface GoalsStore {
  defaultGoals: MacroGoals;
  goalsHistory: GoalsHistory;
  setDefaultGoals: (goals: MacroGoals) => void;
  setGoalsForDate: (date: Date, goals: MacroGoals) => void;
  setGoalsForDateRange: (
    startDate: Date,
    endDate: Date,
    goals: MacroGoals,
    repeat?: 'none' | 'daily' | 'weekly'
  ) => void;
  getGoalsForDate: (date: Date) => MacroGoals;
  clearGoalsForDate: (date: Date) => void;
  hasCustomGoalsForDate: (date: Date) => boolean;
}

const DEFAULT_GOALS: MacroGoals = {
  calories: 2000,
  protein: 150,
  fat: 65,
  carbs: 250,
};

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set, get) => ({
      defaultGoals: DEFAULT_GOALS,
      goalsHistory: {},
      
      setDefaultGoals: (goals) => set({ defaultGoals: goals }),
      
      setGoalsForDate: (date, goals) => {
        const dateKey = startOfDay(date).toISOString();
        set((state) => ({
          goalsHistory: {
            ...state.goalsHistory,
            [dateKey]: goals,
          },
        }));
      },

      setGoalsForDateRange: (startDate, endDate, goals, repeat = 'none') => {
        const newHistory = { ...get().goalsHistory };
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          if (repeat === 'weekly') {
            // Only apply to same day of week
            if (currentDate.getDay() === startDate.getDay()) {
              newHistory[startOfDay(currentDate).toISOString()] = goals;
            }
          } else {
            newHistory[startOfDay(currentDate).toISOString()] = goals;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }

        set({ goalsHistory: newHistory });
      },
      
      getGoalsForDate: (date) => {
        const dateKey = startOfDay(date).toISOString();
        return get().goalsHistory[dateKey] || get().defaultGoals;
      },
      
      clearGoalsForDate: (date) => {
        const dateKey = startOfDay(date).toISOString();
        set((state) => {
          const { [dateKey]: _, ...rest } = state.goalsHistory;
          return { goalsHistory: rest };
        });
      },
      
      hasCustomGoalsForDate: (date) => {
        const dateKey = startOfDay(date).toISOString();
        return dateKey in get().goalsHistory;
      },
    }),
    {
      name: 'macro-goals',
      version: 2,
    }
  )
);