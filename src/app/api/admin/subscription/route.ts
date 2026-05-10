import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, period } = await request.json();
  const supabase = createServerClient();

  if (action === 'upgrade') {
    const months = period === 'year' ? 12 : period === 'quarter' ? 3 : 1;
    const paidUntil = new Date();
    paidUntil.setMonth(paidUntil.getMonth() + months);

    await supabase
      .from('user_subscriptions')
      .upsert(
        { user_id: userId, tier: 'paid', paid_until: paidUntil.toISOString(), updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
    return NextResponse.json({ ok: true, tier: 'paid', paid_until: paidUntil });
  }

  if (action === 'downgrade') {
    await supabase
      .from('user_subscriptions')
      .upsert(
        { user_id: userId, tier: 'free', paid_until: null, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
    return NextResponse.json({ ok: true, tier: 'free' });
  }

  if (action === 'expire_trial') {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 4);
    await supabase
      .from('user_subscriptions')
      .upsert(
        { user_id: userId, tier: 'free', trial_started_at: expiredDate.toISOString(), paid_until: null, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
    return NextResponse.json({ ok: true, action: 'trial_expired' });
  }

  if (action === 'reset') {
    await supabase
      .from('user_subscriptions')
      .delete()
      .eq('user_id', userId);
    return NextResponse.json({ ok: true, action: 'reset' });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
