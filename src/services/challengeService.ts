import { supabase } from '../lib/supabase';
import type { Challenge, ChallengeParticipant, NewChallenge } from '../types/challenge';

/**
 * Fetch all public challenges
 */
export async function listPublicChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('visibility', 'public')
    .order('inserted_at', { ascending: false });
  if (error) {
    console.error('Error fetching public challenges:', error);
    return [];
  }
  return data || [];
}

/**
 * Fetch challenges owned or accessible by current user
 * RLS policies will enforce visibility
 */
export async function listMyChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('inserted_at', { ascending: false });
  if (error) {
    console.error('Error fetching my challenges:', error);
    return [];
  }
  return data || [];
}

/**
 * Create a new challenge
 */
export async function createChallenge(challenge: NewChallenge): Promise<Challenge | null> {
  // Set the current user as owner
  const user = await supabase.auth.getUser();
  const ownerId = user.data.user?.id;
  if (!ownerId) {
    console.error('Debug createChallenge: no ownerId, user:', user);
    throw new Error('Not authenticated. Please sign in again.');
  }
  console.log('Debug createChallenge payload:', { owner_id: ownerId, ...challenge });
  const { data, error } = await supabase
    .from('challenges')
    .insert([{
      owner_id: ownerId,
      title: challenge.title,
      description: challenge.description,
      visibility: challenge.visibility,
      invite_code: challenge.visibility === 'family' ? challenge.invite_code : null,
      target_points: challenge.target_points ?? 0,
    }])
    .select('*') // return the inserted row
    .single();
  if (error || !data) {
    // More descriptive error when no data is returned
    console.error('Failed to create challenge: Supabase insert returned no data or error.', { error, data });
    throw new Error(error?.message || 'Failed to create challenge: no data returned');
  }
  // auto-join the creator to this challenge
  const { error: joinError } = await supabase
    .from('challenge_participants')
    .insert([{ challenge_id: data.id, user_id: ownerId }]);
  if (joinError) console.error('Error auto-joining creator:', joinError);
  return data;
}

/**
 * Join a family challenge by invite code
 */
export async function joinFamilyChallenge(inviteCode: string): Promise<ChallengeParticipant | null> {
  // find challenge by code
  const { data: challenges, error: findError } = await supabase
    .from('challenges')
    .select('id')
    .eq('invite_code', inviteCode)
    .single();
  if (findError || !challenges) {
    console.error('No challenge found for code:', inviteCode, findError);
    return null;
  }

  // insert participant
  const userResult = await supabase.auth.getUser();
  const userId = userResult.data.user?.id ?? '';
  const { data, error } = await supabase
    .from('challenge_participants')
    .insert([{ challenge_id: challenges.id, user_id: userId }])
    .single();
  if (error) {
    console.error('Error joining family challenge:', error);
    return null;
  }
  return data;
}
/**
 * Join a challenge by id
 */
export async function joinChallengeById(challengeId: string): Promise<boolean> {
  const userResult = await supabase.auth.getUser();
  const userId = userResult.data.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('challenge_participants')
    .insert([{ challenge_id: challengeId, user_id: userId }]);
  if (error) throw error;
  return true;
}
/**
 * Leave a challenge by id
 */
export async function leaveChallengeById(challengeId: string): Promise<boolean> {
  const userResult = await supabase.auth.getUser();
  const userId = userResult.data.user?.id;
  if (!userId) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('challenge_participants')
    .delete()
    .match({ challenge_id: challengeId, user_id: userId });
  if (error) throw error;
  return true;
}
/**
 * List current user's participant entries (with progress and points)
 */
export async function listMyParticipants(): Promise<ChallengeParticipant[]> {
  const { data, error } = await supabase
    .from('challenge_participants')
    .select('*')
    .order('joined_at', { ascending: false });
  if (error) {
    console.error('Error fetching my participant entries:', error);
    return [];
  }
  return data || [];
}
