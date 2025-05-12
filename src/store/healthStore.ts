import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Exercise } from '../types/health';
import { useToastStore } from '../components/feedback/Toast';

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
  waterIntake: 0,
  exercises: [],
  isLoading: false,

  addWater: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const newIntake = get().waterIntake + 1;

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
    } catch (error) {
      useToastStore.getState().addToast('Failed to update water intake', 'error');
      console.error('Error updating water intake:', error);
    }
  },

  removeWater: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const newIntake = Math.max(0, get().waterIntake - 1);

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

      set({
        waterIntake: waterData?.glasses || 0,
        exercises: exerciseData?.map(e => ({
          activity: e.activity,
          duration: e.duration,
          calories: e.calories
        })) || []
      });
    } catch (error) {
      console.error('Error fetching health data:', error);
      useToastStore.getState().addToast('Failed to fetch health data', 'error');
    } finally {
      set({ isLoading: false });
    }
  }
}));

// Set up real-time subscription
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Fetch initial data
    useHealthStore.getState().fetchHealthData();

    // Set up real-time subscription for water logs
    const waterChannel = supabase.channel('water_logs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'water_logs',
          filter: `user_id=eq.${session?.user.id}`
        },
        () => {
          useHealthStore.getState().fetchHealthData();
        }
      )
      .subscribe();

    // Set up real-time subscription for exercise logs
    const exerciseChannel = supabase.channel('exercise_logs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exercise_logs',
          filter: `user_id=eq.${session?.user.id}`
        },
        () => {
          useHealthStore.getState().fetchHealthData();
        }
      )
      .subscribe();

    // Store channel references for cleanup
    (window as any).__healthChannels = [waterChannel, exerciseChannel];
  } else if (event === 'SIGNED_OUT') {
    // Clean up subscriptions
    const channels = (window as any).__healthChannels;
    if (channels) {
      channels.forEach((channel: any) => channel.unsubscribe());
      delete (window as any).__healthChannels;
    }
    // Clear data
    useHealthStore.setState({ waterIntake: 0, exercises: [] });
  }
});