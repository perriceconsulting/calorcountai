import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TooltipState } from '../types';

interface TooltipStore extends TooltipState {
  markTooltipAsSeen: (id: string) => void;
  dismissPrompt: (id: string) => void;
  setActivePrompt: (id: string | null) => void;
  resetTooltips: () => void;
}

const initialState: TooltipState = {
  seenTooltips: [],
  dismissedPrompts: [],
  activePrompt: null
};

export const useTooltipStore = create<TooltipStore>()(
  persist(
    (set) => ({
      ...initialState,
      markTooltipAsSeen: (id) => 
        set((state) => ({
          seenTooltips: [...state.seenTooltips, id]
        })),
      dismissPrompt: (id) =>
        set((state) => ({
          dismissedPrompts: [...state.dismissedPrompts, id],
          activePrompt: state.activePrompt === id ? null : state.activePrompt
        })),
      setActivePrompt: (id) => set({ activePrompt: id }),
      resetTooltips: () => set(initialState)
    }),
    {
      name: 'tooltip-store'
    }
  )
);