import { useState, useCallback } from 'react';
import { useGoalsStore } from '../store/goalsStore';
import type { MacroGoals, GoalSettings } from '../types/goals';
import { startOfDay, formatDate } from '../utils/dateUtils';

export function useGoalSync() {
  const [isSaving, setIsSaving] = useState(false);
  const { setGoalsForDate, setGoalsForDateRange, clearGoalsForDate } = useGoalsStore();

  const saveGoals = useCallback(async (
    goals: MacroGoals,
    date: Date,
    settings?: GoalSettings
  ) => {
    try {
      setIsSaving(true);
      
      if (!settings || !settings.useCustom) {
        await setGoalsForDate(date, goals);
        return;
      }

      if (settings.startDate && settings.endDate) {
        await setGoalsForDateRange(
          new Date(settings.startDate),
          new Date(settings.endDate),
          goals,
          settings.repeat
        );
      }
    } catch (error) {
      console.error('Error saving goals:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [setGoalsForDate, setGoalsForDateRange]);

  const resetGoals = useCallback(async (date: Date) => {
    try {
      setIsSaving(true);
      await clearGoalsForDate(date);
    } finally {
      setIsSaving(false);
    }
  }, [clearGoalsForDate]);

  return {
    isSaving,
    saveGoals,
    resetGoals
  };
}