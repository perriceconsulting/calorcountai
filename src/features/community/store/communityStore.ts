import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Challenge, ChallengeGroup, LeaderboardEntry } from '../types';

interface CommunityStore {
  challenges: Challenge[];
  groups: ChallengeGroup[];
  activeChallenges: string[];
  createChallenge: (challenge: Omit<Challenge, 'id' | 'participants' | 'progress'>) => void;
  joinChallenge: (challengeId: string) => void;
  leaveChallenge: (challengeId: string) => void;
  createGroup: (name: string, type: 'family' | 'friends') => void;
  getLeaderboard: (challengeId: string) => Promise<LeaderboardEntry[]>;
}

export const useCommunityStore = create<CommunityStore>()(
  persist(
    (set, get) => ({
      challenges: [],
      groups: [],
      activeChallenges: [],

      createChallenge: (challenge) => {
        const newChallenge = {
          ...challenge,
          id: crypto.randomUUID(),
          participants: 1,
          progress: 0
        };
        set((state) => ({
          challenges: [...state.challenges, newChallenge],
          activeChallenges: [...state.activeChallenges, newChallenge.id]
        }));
      },

      joinChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.map(c => 
            c.id === challengeId 
              ? { ...c, participants: c.participants + 1 }
              : c
          ),
          activeChallenges: [...state.activeChallenges, challengeId]
        }));
      },

      leaveChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId
              ? { ...c, participants: Math.max(0, c.participants - 1) }
              : c
          ),
          activeChallenges: state.activeChallenges.filter(id => id !== challengeId)
        }));
      },

      createGroup: (name, type) => {
        const newGroup = {
          id: crypto.randomUUID(),
          name,
          type,
          members: [],
          challenges: []
        };
        set((state) => ({
          groups: [...state.groups, newGroup]
        }));
      },

      getLeaderboard: async (challengeId) => {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
          { userId: '1', name: 'Sarah J.', score: 850, streak: 7, progress: 85 },
          { userId: '2', name: 'Mike R.', score: 720, streak: 5, progress: 72 },
          { userId: '3', name: 'Emma L.', score: 695, streak: 4, progress: 69 }
        ];
      }
    }),
    {
      name: 'community-store'
    }
  )
);