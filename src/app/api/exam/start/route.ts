import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { EXAM_QUESTION_COUNT } from '@/constants/domains';
import { getSubscriptionStatus, MAX_EXAMS_PER_DAY } from '@/lib/subscription';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();

  const status = await getSubscriptionStatus(userId, supabase);

  if (status.access !== 'paid') {
    return NextResponse.json(
      { error: 'Exam access requires a paid subscription.' },
      { status: 403 }
    );
  }

  if (status.examsToday >= MAX_EXAMS_PER_DAY) {
    return NextResponse.json(
      { error: `Daily exam limit reached (${MAX_EXAMS_PER_DAY}/day). Try again tomorrow.` },
      { status: 429 }
    );
  }

  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('id');

  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });

  const questionIds = shuffle(questions.map((q) => q.id)).slice(0, EXAM_QUESTION_COUNT);

  const { data: session, error: sErr } = await supabase
    .from('exam_sessions')
    .insert({ user_id: userId, total: questionIds.length, answers: {} })
    .select()
    .single();

  if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 });

  return NextResponse.json({ sessionId: session.id, questionIds });
}
