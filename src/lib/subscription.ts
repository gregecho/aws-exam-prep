import { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionStatus } from '@/types';

const TRIAL_DAYS = 3;
const MAX_EXAMS_PER_DAY = 3;

export async function getSubscriptionStatus(
  userId: string,
  supabase: SupabaseClient
): Promise<SubscriptionStatus> {
  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('tier, trial_started_at, paid_until')
    .eq('user_id', userId)
    .single();

  if (!sub) {
    // Lazy-create a free trial row
    await supabase
      .from('user_subscriptions')
      .insert({ user_id: userId });
    return { access: 'trial', daysLeft: TRIAL_DAYS };
  }

  if (sub.tier === 'paid') {
    if (!sub.paid_until || new Date(sub.paid_until) <= new Date()) {
      return { access: 'expired' };
    }
    // Count completed exams today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from('exam_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .gte('completed_at', todayStart.toISOString());
    return { access: 'paid', examsToday: count ?? 0 };
  }

  // Free tier — check trial
  const trialStart = new Date(sub.trial_started_at);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysElapsed = Math.floor((now.getTime() - trialStart.getTime()) / msPerDay);
  const daysLeft = TRIAL_DAYS - daysElapsed;

  if (daysLeft > 0) {
    return { access: 'trial', daysLeft };
  }
  return { access: 'expired' };
}

export { MAX_EXAMS_PER_DAY };
