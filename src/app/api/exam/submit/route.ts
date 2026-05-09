import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAnswerCorrect } from '@/lib/answers';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId, answers } = await request.json() as {
    sessionId: string;
    answers: Record<string, string>;
  };

  const supabase = createServerClient();

  const { data: session, error: sErr } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (sErr || !session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const questionIds = Object.keys(answers);
  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('id, correct, domain')
    .in('id', questionIds);

  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });

  let score = 0;
  const progressRows = questions.map((q) => {
    const selected = answers[q.id];
    const isCorrect = isAnswerCorrect(selected, q.correct);
    if (isCorrect) score++;
    return { user_id: userId, question_id: q.id, is_correct: isCorrect, selected };
  });

  const { error: pErr } = await supabase.from('user_progress').insert(progressRows);
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  const { error: uErr } = await supabase
    .from('exam_sessions')
    .update({ completed_at: new Date().toISOString(), score, answers })
    .eq('id', sessionId);

  if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });

  return NextResponse.json({ score, total: questions.length });
}
