import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Exercise } from '../types/health';
import { useToastStore } from './toastStore';
import { useAchievementStore } from '../features/gamification/store/achievementStore';
import { useChallengesStore } from '../features/gamification/store/challengesStore';
import { POINT_VALUES } from '../features/gamification/constants';

interface HealthStore {
  waterIntake: number;
  exercises: Exercise[];
  isLoading: boolean;
  addWater: () => Promise<void>;
  removeWater: () => Promise<void>;
  addExercise: (exercise: Exercise) => Promise<void>;
  fetchHealthData: () => Promise<void>;
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  // waterIntake stored in ounces
  waterIntake: 0, // waterIntake stored in ounces
  exercises: [],
  isLoading: false,

  addWater: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // add one glass (8 oz)
      const GLASS_OZ = 8;
      const DAILY_GOAL_OZ = 8 * GLASS_OZ; // 64 oz
      const today = new Date().toISOString().split('T')[0];
      const current = get().waterIntake;
      const newIntake = Math.min(current + GLASS_OZ, DAILY_GOAL_OZ);

      const { error } = await supabase
        .from('water_logs')
        .upsert({
          user_id: user.id,
          date: today,
          glasses: newIntake,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date'
        });

      if (error) throw error;
      set({ waterIntake: newIntake });
      // update water intake challenges
      useChallengesStore.getState().increment('waterIntake', 1);
    } catch (error) {
      useToastStore.getState().addToast('Failed to update water intake', 'error');
      console.error('Error updating water intake:', error);
    }
  },

  removeWater: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // remove one glass (8 oz)
      const GLASS_OZ = 8;
      const current = get().waterIntake;
      const newIntake = Math.max(0, current - GLASS_OZ);

      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('water_logs')
        .upsert({
          user_id: user.id,
          date: today,
          glasses: newIntake,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date'
        });

      if (error) throw error;
      set({ waterIntake: newIntake });
      // update water intake challenges (decrement)
      useChallengesStore.getState().increment('waterIntake', -GLASS_OZ);
    } catch (error) {
      useToastStore.getState().addToast('Failed to update water intake', 'error');
      console.error('Error updating water intake:', error);
    }
  },

  addExercise: async (exercise) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('exercise_logs')
        .insert([{
          user_id: user.id,
          activity: exercise.activity,
          duration: exercise.duration,
          calories: exercise.calories,
          timestamp: new Date().toISOString()
        }]);

      if (error) throw error;

      // Fetch updated data
      await get().fetchHealthData();
    } catch (error) {
      useToastStore.getState().addToast('Failed to save exercise', 'error');
      console.error('Error saving exercise:', error);
    }
  },

  fetchHealthData: async () => {
    try {
      set({ isLoading: true });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      // Fetch water intake
      const { data: waterData, error: waterError } = await supabase
        .from('water_logs')
        .select('glasses')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows gracefully

      if (waterError && !waterError.message.includes('no rows')) {
        throw waterError;
      }

      // Fetch exercises
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', `${today}T00:00:00`)
        .lte('timestamp', `${today}T23:59:59`)
        .order('timestamp', { ascending: false });

      if (exerciseError) {
        throw exerciseError;
      }

      const todayIntake = waterData?.glasses || 0;
      set({
        waterIntake: todayIntake,
        exercises: exerciseData?.map(e => ({
          activity: e.activity,
          duration: e.duration,
          calories: e.calories
        })) || []
      });

      // compute water-tracking streak (e.g., daily goal of >=8 glasses)
      const goal = 8;
      const todayDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      const start = startDate.toISOString().split('T')[0];
      // fetch last 7 days of water logs
      const { data: history, error: histError } = await supabase
        .from('water_logs')
        .select('date,glasses')
        .eq('user_id', user.id)
        .gte('date', start)
        .order('date', { ascending: false });
      if (!histError && history) {
        // update water intake challenges: daily and weekly totals
        useChallengesStore.getState().updateProgress('waterIntake', 'daily', todayIntake);
        const weeklyTotal = history.reduce((sum, w) => sum + w.glasses, 0);
        useChallengesStore.getState().updateProgress('waterIntake', 'weekly', weeklyTotal);
        // build set of dates meeting goal
        const goodDays = new Set(history
          .filter(w => w.glasses >= goal)
          .map(w => w.date));
        // include today if meets goal
        if (todayIntake >= goal) goodDays.add(todayDate);
        // count consecutive days
        let waterStreak = 0;
        let misses = 0;
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const ds = d.toISOString().split('T')[0];
          if (goodDays.has(ds)) {
            waterStreak++;
            misses = 0;
          } else {
            misses++;
            if (misses > 1) break;
          }
        }
        // update streak in achievement store
        const ach = useAchievementStore.getState();
        ach.updateStreaks({ ...ach.progress.streaks, waterTracking: waterStreak });
        // unlock hydration-master at 5-day streak
        if (waterStreak >= 5 && !ach.progress.achievements.includes('hydration-master')) {
          ach.unlockAchievement('hydration-master');
          ach.addPoints(POINT_VALUES.WATER_GOAL * 5);
          useToastStore.getState().addToast('Hydration Master unlocked! 💧', 'success');
        }
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
      useToastStore.getState().addToast('Failed to fetch health data', 'error');
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Fetch initial health data on auth change
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN') {
    useHealthStore.getState().fetchHealthData();
  } else if (event === 'SIGNED_OUT') {
    useHealthStore.setState({ waterIntake: 0, exercises: [] });
  }
});
// Load data immediately if already signed in
(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    useHealthStore.getState().fetchHealthData();
  }
})();