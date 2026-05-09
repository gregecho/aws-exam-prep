import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { isAnswerCorrect } from '@/lib/answers';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { questionId, selected } = await request.json() as { questionId: string; selected: string };

  const supabase = createServerClient();

  const { data: question, error: qErr } = await supabase
    .from('questions')
    .select('correct')
    .eq('id', questionId)
    .single();

  if (qErr || !question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

  const is_correct = isAnswerCorrect(selected, question.correct);

  const { error } = await supabase.from('user_progress').insert({
    user_id: userId,
    question_id: questionId,
    is_correct,
    selected,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ is_correct });
}
