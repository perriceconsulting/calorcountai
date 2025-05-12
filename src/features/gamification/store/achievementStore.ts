import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Achievement, Badge, UserProgress, Streaks } from '../types';
import { ACHIEVEMENTS, BADGES } from '../constants';

interface AchievementStore {
  progress: UserProgress;
  addPoints: (points: number) => void;
  unlockAchievement: (id: string) => void;
  updateStreaks: (streaks: Streaks) => void;
  getUnlockedAchievements: () => Achievement[];
  getAvailableBadges: () => Badge[];
  resetProgress: () => void;
}

const initialProgress: UserProgress = {
  points: 0,
  achievements: [],
  badges: [],
  streaks: {
    mealLogging: 0,
    waterTracking: 0
  }
};

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      progress: initialProgress,

      addPoints: (points) => {
        set((state) => {
          const newPoints = state.progress.points + points;
          const newBadges = [...state.progress.badges];
          
          // Check for new badges
          BADGES.forEach(badge => {
            if (newPoints >= badge.requiredPoints && !newBadges.includes(badge.id)) {
              newBadges.push(badge.id);
            }
          });

          return {
            progress: {
              ...state.progress,
              points: newPoints,
              badges: newBadges
            }
          };
        });
      },

      unlockAchievement: (id) => {
        set((state) => {
          if (state.progress.achievements.includes(id)) return state;

          const achievement = ACHIEVEMENTS.find(a => a.id === id);
          if (!achievement) return state;

          return {
            progress: {
              ...state.progress,
              achievements: [...state.progress.achievements, id],
              points: state.progress.points + achievement.points
            }
          };
        });
      },

      updateStreaks: (streaks) => {
        set((state) => ({
          progress: {
            ...state.progress,
            streaks
          }
        }));
      },

      getUnlockedAchievements: () => {
        const { achievements } = get().progress;
        return ACHIEVEMENTS.filter(a => achievements.includes(a.id));
      },

      getAvailableBadges: () => {
        const { points, badges } = get().progress;
        return BADGES.filter(b => 
          points >= b.requiredPoints && !badges.includes(b.id)
        );
      },

      resetProgress: () => set({ progress: initialProgress })
    }),
    {
      name: 'achievement-store'
    }
  )
);