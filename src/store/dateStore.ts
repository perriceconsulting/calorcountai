import { create } from 'zustand';
import { startOfDay } from '../utils/dateUtils';

interface DateStore {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  resetToToday: () => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  getIsCurrentDay: () => boolean;
}

export const useDateStore = create<DateStore>((set, get) => ({
  selectedDate: startOfDay(new Date()),
  setSelectedDate: (date: Date) => {
    const newDate = startOfDay(date);
    if (newDate <= startOfDay(new Date())) {
      set({ selectedDate: newDate });
    }
  },
  resetToToday: () => set({ selectedDate: startOfDay(new Date()) }),
  goToPreviousDay: () => {
    const prevDate = new Date(get().selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    set({ selectedDate: prevDate });
  },
  goToNextDay: () => {
    const nextDate = new Date(get().selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    if (nextDate <= startOfDay(new Date())) {
      set({ selectedDate: nextDate });
    }
  },
  getIsCurrentDay: () => get().selectedDate.getTime() === startOfDay(new Date()).getTime(),
}));