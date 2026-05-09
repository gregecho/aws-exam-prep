import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('user_progress')
    .select('question_id, is_correct')
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const map: Record<string, { times_practiced: number; times_correct: number }> = {};
  for (const row of data ?? []) {
    if (!map[row.question_id]) map[row.question_id] = { times_practiced: 0, times_correct: 0 };
    map[row.question_id].times_practiced++;
    if (row.is_correct) map[row.question_id].times_correct++;
  }

  const stats = Object.entries(map).map(([question_id, s]) => ({
    question_id,
    times_practiced: s.times_practiced,
    times_correct: s.times_correct,
    accuracy: Math.round((s.times_correct / s.times_practiced) * 100),
  }));

  return NextResponse.json({ stats });
}
