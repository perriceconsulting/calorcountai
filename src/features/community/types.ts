import type { MacroGoals } from '../types/goals';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'public' | 'private' | 'family';
  startDate: string;
  endDate: string;
  participants: number;
  goal: {
    type: 'calories' | 'protein' | 'consistency';
    target: number;
    unit: string;
  };
  progress: number;
}

export interface ChallengeGroup {
  id: string;
  name: string;
  type: 'family' | 'friends';
  members: string[];
  challenges: Challenge[];
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  streak: number;
  progress: number;
}