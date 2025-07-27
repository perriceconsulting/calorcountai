import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { FoodAnalysis } from '../types/food';
import { useToastStore } from './toastStore';
import { useAchievementStore } from '../features/gamification/store/achievementStore';
import { useChallengesStore } from '../features/gamification/store/challengesStore';
import { POINT_VALUES } from '../features/gamification/constants';

interface FoodStore {
  foodEntries: FoodAnalysis[];
  isAnalyzing: boolean;
  setIsAnalyzing: (status: boolean) => void;
  addFoodEntry: (entry: FoodAnalysis) => Promise<void>;
  fetchEntries: () => Promise<void>;
  deleteFoodEntry: (id: string, imageUrl?: string) => Promise<void>;
}

export const useFoodStore = create<FoodStore>((set, get) => ({
  foodEntries: [],
  isAnalyzing: false,

  setIsAnalyzing: (status) => set({ isAnalyzing: status }),

  addFoodEntry: async (entry) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // capture previous entry count for first-meal achievement
      const prevCount = get().foodEntries.length;
      const { error } = await supabase
        .from('food_entries')
        .insert([{
          user_id: user.id,
          description: entry.description,
          macros: entry.macros,
          meal_type: entry.mealType,
          image_url: entry.imageUrl,
          timestamp: entry.timestamp || new Date().toISOString()
        }]);

      if (error) throw error;
      // Refresh local entries so UI updates immediately
      await get().fetchEntries();
      // award achievement and points
      const { unlockAchievement, addPoints } = useAchievementStore.getState();
      if (prevCount === 0) {
        unlockAchievement('first-meal');
      }
      addPoints(POINT_VALUES.MEAL_LOG);
      // challenges updated in fetchEntries via updateProgress
    } catch (error) {
      useToastStore.getState().addToast(
        'Failed to save food entry',
        'error'
      );
      console.error('Error saving food entry:', error);
    }
  },

  fetchEntries: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      // (Achievements are handled when adding entries)
      if (!user) return;

      const { data: entries, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (entries) {
        const foodEntries: FoodAnalysis[] = entries.map(entry => ({
          id: entry.id.toString(),
          description: entry.description,
          macros: entry.macros,
          mealType: entry.meal_type,
          imageUrl: entry.image_url,
          timestamp: entry.timestamp
        }));
        set({ foodEntries });
        // reset challenge progress before updating based on fresh data
        useChallengesStore.getState().loadDefaults();
        // compute meal logging streak
        const today = new Date();
        const datesWithMeals = new Set(
          foodEntries.map(e => new Date(e.timestamp!).toDateString())
        );
        // compute meal streak with up to 1-day miss grace
        let streak = 0;
        let misses = 0;
        for (let i = 0; i < 30; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          if (datesWithMeals.has(d.toDateString())) {
            streak++;
            misses = 0;
          } else {
            misses++;
            if (misses > 1) break;
          }
        }
        // update streak in achievement store
        const ach = useAchievementStore.getState();
        ach.updateStreaks({ ...ach.progress.streaks, mealLogging: streak });
        // update meal challenges based on current counts using ISO date strings
        const todayISO = today.toISOString().split('T')[0];
        const dailyCount = foodEntries.filter(e => e.timestamp!.split('T')[0] === todayISO).length;
        useChallengesStore.getState().updateProgress('mealLogs', 'daily', dailyCount);
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekStartISO = weekStart.toISOString().split('T')[0];
        const weeklyCount = foodEntries.filter(e => {
          const dateISO = e.timestamp!.split('T')[0];
          return dateISO >= weekStartISO && dateISO <= todayISO;
        }).length;
        useChallengesStore.getState().updateProgress('mealLogs', 'weekly', weeklyCount);
        // unlock week-streak if reached 7 days
        if (streak >= 7 && !ach.progress.achievements.includes('week-streak')) {
          ach.unlockAchievement('week-streak');
          ach.addPoints(POINT_VALUES.STREAK_BONUS);
        }
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  },
  // Delete entry from database and optional image from storage
  deleteFoodEntry: async (id, imageUrl) => {
    try {
      // Remove entry row
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', id);
      if (error) throw error;
      // Remove image from storage if present
      if (imageUrl) {
        const key = imageUrl.split('/').pop();
        if (key) {
          const { error: storageError } = await supabase
            .storage
            .from('food-images')
            .remove([key]);
          if (storageError) console.error('Error removing image from storage:', storageError);
        }
      }
      useToastStore.getState().addToast('Entry deleted', 'success');
      // Refresh entries
      await get().fetchEntries();
    } catch (err) {
      useToastStore.getState().addToast('Failed to delete entry', 'error');
      console.error('Error deleting food entry:', err);
    }
  },
}));

// Set up real-time subscription
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Fetch initial data
    useFoodStore.getState().fetchEntries();

    // Set up real-time subscription
    const channel = supabase.channel('food_entries')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'food_entries',
          filter: `user_id=eq.${session?.user.id}`
        },
        () => {
          // Fetch latest data when changes occur
          useFoodStore.getState().fetchEntries();
        }
      )
      .subscribe();

    // Store channel reference for cleanup
    (window as any).__foodEntriesChannel = channel;
  } else if (event === 'SIGNED_OUT') {
    // Clean up subscription
    const channel = (window as any).__foodEntriesChannel;
    if (channel) {
      channel.unsubscribe();
      delete (window as any).__foodEntriesChannel;
    }
    // Clear entries
    useFoodStore.setState({ foodEntries: [] });
  }
});