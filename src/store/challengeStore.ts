import create from 'zustand';
import type { Challenge, NewChallenge, ChallengeParticipant } from '../types/challenge';
import {
  listPublicChallenges,
  listMyChallenges,
  createChallenge,
  joinFamilyChallenge,
  joinChallengeById,
  leaveChallengeById,
  listMyParticipants,
} from '../services/challengeService';

interface ChallengeState {
  publicChallenges: Challenge[];
  myChallenges: Challenge[];
  loadingPublic: boolean;
  loadingMy: boolean;
  loadingParticipants: boolean;
  error?: string;
  fetchPublic: () => Promise<void>;
  fetchMy: () => Promise<void>;
  fetchParticipants: () => Promise<void>;
  addChallenge: (challenge: NewChallenge) => Promise<Challenge | null>;
  joinFamily: (code: string) => Promise<boolean>;
  join: (challengeId: string) => Promise<boolean>;
  leave: (challengeId: string) => Promise<boolean>;
  participants: ChallengeParticipant[];
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  publicChallenges: [],
  myChallenges: [],
  participants: [],
  loadingPublic: false,
  loadingMy: false,
  loadingParticipants: false,
  error: undefined,

  fetchPublic: async () => {
    set({ loadingPublic: true, error: undefined });
    try {
      const data = await listPublicChallenges();
      set({ publicChallenges: data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loadingPublic: false });
    }
  },

  fetchMy: async () => {
    set({ loadingMy: true, error: undefined });
    try {
      const data = await listMyChallenges();
      set({ myChallenges: data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loadingMy: false });
    }
  },
  fetchParticipants: async () => {
    set({ loadingParticipants: true, error: undefined });
    try {
      const data = await listMyParticipants();
      set({ participants: data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loadingParticipants: false });
    }
  },

    addChallenge: async (challenge) => {
    const newCh = await createChallenge(challenge);
    // refresh myChallenges and publicChallenges if applicable
    if (newCh) {
      set((state) => ({
        myChallenges: [newCh, ...state.myChallenges],
        publicChallenges: newCh.visibility === 'public'
          ? [newCh, ...state.publicChallenges]
          : state.publicChallenges
      }));
      return newCh;
    }
    return null;
  },

  joinFamily: async (code) => {
    try {
      const part = await joinFamilyChallenge(code);
      if (part) {
        // Refresh myChallenges after joining
        await get().fetchMy();
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },
  join: async (challengeId) => {
    try {
      await joinChallengeById(challengeId);
      // optionally refresh lists
      await get().fetchMy();
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },
  leave: async (challengeId) => {
    try {
      await leaveChallengeById(challengeId);
      await get().fetchMy();
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },
}));
