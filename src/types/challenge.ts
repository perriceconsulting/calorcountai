export type ChallengeVisibility = 'public' | 'private' | 'family';

export interface Challenge {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  visibility: ChallengeVisibility;
  invite_code: string | null;
  inserted_at: string;
  updated_at: string;
  target_points: number;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at: string;
  progress: number;
  points: number;
}

// Payload for creating a new challenge (owner_id is set server-side)
// Payload for creating a new challenge (owner_id and timestamps are server-side, target_points optional)
export type NewChallenge = Omit<Challenge, 'id' | 'inserted_at' | 'updated_at' | 'owner_id'> & {
  target_points?: number;
};
