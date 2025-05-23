import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { FoodAnalysis } from '../types/food';
import { useToastStore } from '../components/feedback/Toast';

interface FoodStore {
  foodEntries: FoodAnalysis[];
  isAnalyzing: boolean;
  setIsAnalyzing: (status: boolean) => void;
  addFoodEntry: (entry: FoodAnalysis) => Promise<void>;
  fetchEntries: () => Promise<void>;
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
      if (!user) return;

      const { data: entries, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      if (entries) {
        const foodEntries: FoodAnalysis[] = entries.map(entry => ({
          description: entry.description,
          macros: entry.macros,
          mealType: entry.meal_type,
          imageUrl: entry.image_url,
          timestamp: entry.timestamp
        }));
        set({ foodEntries });
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }
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