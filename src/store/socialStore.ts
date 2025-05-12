import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Challenge, Leader } from '../types/social';

interface SocialStore {
  challenges: Challenge[];
  activeChallenge: Challenge | null;
  joinChallenge: (challengeId: string) => void;
  getLeaderboard: (challengeId?: string) => Promise<Leader[]>;
}

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Protein Champion',
    description: 'Hit your daily protein goals for 7 days straight',
    duration: 7,
    targetValue: 7,
    currentValue: 3,
    unit: 'days',
    type: 'protein'
  },
  {
    id: '2',
    title: 'Calorie Consistency',
    description: 'Stay within 100 calories of your goal for 5 days',
    duration: 5,
    targetValue: 5,
    currentValue: 0,
    unit: 'days',
    type: 'calories'
  }
];

const MOCK_LEADERS: Leader[] = [
  { id: '1', name: 'Sarah J.', score: 850 },
  { id: '2', name: 'Mike R.', score: 720 },
  { id: '3', name: 'Emma L.', score: 695 },
  { id: '4', name: 'John D.', score: 560 },
  { id: '5', name: 'Alex M.', score: 445 }
];

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      challenges: MOCK_CHALLENGES,
      activeChallenge: null,
      joinChallenge: (challengeId) => {
        const challenge = get().challenges.find(c => c.id === challengeId);
        if (challenge) {
          set({ activeChallenge: challenge });
        }
      },
      getLeaderboard: async (challengeId) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return MOCK_LEADERS;
      }
    }),
    {
      name: 'social-store'
    }
  )
);