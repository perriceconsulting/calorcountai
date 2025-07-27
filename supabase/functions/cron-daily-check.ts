// @ts-nocheck
// Import Deno runtime libs without TS errors
// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

export default serve(async () => {
  try {
    // Calculate cutoff timestamp for 3 days of inactivity
    const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    const { data: inactiveUsers, error } = await supabase
      .from('profiles')
      .select('id, email, last_active')
      .lt('last_active', cutoff);

    if (error) throw error;

    for (const user of inactiveUsers ?? []) {
      console.log(`Sending reminder to ${user.email}`);
      // TODO: integrate with your mail provider
      // await sendEmail(user.email, 'We miss you at CalCountAI! 🌟');
    }

    return new Response('Retention check completed', { status: 200 });
  } catch (err) {
    console.error('Error in cron-daily-check:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
});
