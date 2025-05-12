import { supabase } from '../../../lib/supabase';
import type { OnboardingPreferences } from '../types';

export async function completeOnboarding(userId: string, preferences: OnboardingPreferences) {
  try {
    // First update the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        preferences,
        activity_level: preferences.activityLevel,
        fitness_goal: preferences.fitnessGoal,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Then verify the update was successful
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (!data?.onboarding_completed) throw new Error('Failed to verify onboarding completion');

    return true;
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return false;
  }
}