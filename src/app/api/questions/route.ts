import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);

  const supabase = createServerClient();
  let query = supabase
    .from('questions')
    .select('id, domain, question, question_type, options_json, correct, explanations_json, created_at')
    .limit(limit);
  if (domain) query = query.eq('domain', domain);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const questions = (data ?? []).map((row) => ({
    id: row.id,
    domain: row.domain,
    question: row.question,
    question_type: row.question_type ?? 'single',
    options: row.options_json ?? [],
    correct: row.correct,
    explanations: row.explanations_json ?? {},
    created_at: row.created_at,
  }));

  return NextResponse.json({ questions });
}
