import { create } from 'zustand';
import type { MacroFilter } from '../types/calendar';

interface CalendarStore {
  activeFilter: MacroFilter;
  setActiveFilter: (filter: MacroFilter) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));