import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAchievementStore } from './achievementStore';

// Types for challenge configuration
export type ChallengeType = 'daily' | 'weekly';
export type MetricKey = 'mealLogs' | 'waterIntake';

// Challenge definition
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  goal: number;
  metric: MetricKey;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

// State and actions
interface ChallengesState {
  challenges: Challenge[];
  lastDailyReset: string;
  lastWeeklyReset: string;
  loadDefaults: () => void;
  increment: (metric: MetricKey, amount?: number) => void;
  updateProgress: (metric: MetricKey, type: ChallengeType, progress: number) => void;
  reset: (type: ChallengeType) => void;
  claim: (id: string) => void;
  checkResets: () => void;
}

// Default list of challenges
const defaultChallenges: Challenge[] = [
  {
    id: 'daily-meal-3',
    title: '3 Meals Logged',
    description: 'Log 3 meals today',
    type: 'daily',
    goal: 3,
    metric: 'mealLogs',
    progress: 0,
    completed: false,
    claimed: false,
  },
  {
    id: 'daily-water-64',
    title: '64 oz Water Intake',
    description: 'Drink 64 oz of water today',
    type: 'daily',
    goal: 64,
    metric: 'waterIntake',
    progress: 0,
    completed: false,
    claimed: false,
  },
  {
    id: 'weekly-meal-21',
    title: '21 Meals Logged',
    description: 'Log 21 meals this week',
    type: 'weekly',
    goal: 21,
    metric: 'mealLogs',
    progress: 0,
    completed: false,
    claimed: false,
  },
  {
    id: 'weekly-water-448',
    title: '448 oz Water Intake',
    description: 'Drink 448 oz of water this week',
    type: 'weekly',
    goal: 448,
    metric: 'waterIntake',
    progress: 0,
    completed: false,
    claimed: false,
  },
];

// Create the persistent store
export const useChallengesStore = create<ChallengesState>()(
  persist(
    (set) => ({
      challenges: defaultChallenges,
      // initialize reset markers
      lastDailyReset: new Date().toISOString().split('T')[0],
      lastWeeklyReset: (() => { const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d.toISOString().split('T')[0]; })(),
      // reload defaults
      loadDefaults: () => set({ challenges: defaultChallenges }),

      // increment progress (useful for real-time events)
      increment: (metric, amount = 1) =>
        set((state) => ({
          challenges: state.challenges.map((ch) => {
            if (ch.metric === metric && !ch.completed) {
              const newProg = ch.progress + amount;
              const updated = { ...ch, progress: newProg };
              if (newProg >= ch.goal) updated.completed = true;
              return updated;
            }
            return ch;
          }),
        })),

      // batch update based on measured counts
      updateProgress: (metric, type, progress) =>
        set((state) => ({
          challenges: state.challenges.map((ch) => {
            if (ch.metric === metric && ch.type === type) {
              const updated = { ...ch, progress };
              if (progress >= ch.goal) updated.completed = true;
              return updated;
            }
            return ch;
          }),
        })),

      // reset challenges of a particular period
      reset: (type) =>
        set((state) => ({
          challenges: state.challenges.map((ch) =>
            ch.type === type
              ? { ...ch, progress: 0, completed: false, claimed: false }
              : ch
          ),
        })),

      // mark challenge as claimed
      claim: (id) =>
        set((state) => ({
          challenges: state.challenges.map((ch) =>
            ch.id === id ? { ...ch, claimed: true } : ch
          ),
        })),

      // check and apply daily/weekly resets
      checkResets: () => {
        const today = new Date().toISOString().split('T')[0];
        const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekIso = weekStart.toISOString().split('T')[0];
        set(state => {
          const updates: Partial<ChallengesState> = {};
          if (state.lastDailyReset < today) {
            // award consistency champ if all daily challenges were completed and claimed
            const allDailyClaimed = state.challenges
              .filter(ch => ch.type === 'daily')
              .every(ch => ch.completed && ch.claimed);
            if (allDailyClaimed) {
              useAchievementStore.getState().unlockAchievement('consistency-champ');
            }
            updates.lastDailyReset = today;
            updates.challenges = state.challenges.map(ch =>
              ch.type === 'daily' ? { ...ch, progress: 0, completed: false, claimed: false } : ch
            );
          }
          if (state.lastWeeklyReset < weekIso) {
            updates.lastWeeklyReset = weekIso;
            updates.challenges = updates.challenges || state.challenges;
            updates.challenges = updates.challenges.map(ch => ch.type === 'weekly' ? { ...ch, progress: 0, completed: false, claimed: false } : ch);
          }
          return updates;
        });
      },
    }),
    {
      name: 'challenges-storage',
      onRehydrateStorage: () => (state) => {
        state?.checkResets();
      }
    }
  )
);
