import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { DOMAINS } from '@/constants/domains';
import { DomainStats } from '@/types';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();

  const [{ data: progress, error }, { data: allQuestions }] = await Promise.all([
    supabase
      .from('user_progress')
      .select('is_correct, question_id, questions(domain)')
      .eq('user_id', userId),
    supabase.from('questions').select('id, domain'),
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const statsMap: Record<string, { total: number; correct: number }> = {};
  const practicedSets: Record<string, Set<string>> = {};
  for (const domain of DOMAINS) {
    statsMap[domain] = { total: 0, correct: 0 };
    practicedSets[domain] = new Set();
  }

  for (const row of progress ?? []) {
    const domain = (row.questions as unknown as { domain: string } | null)?.domain;
    if (domain && statsMap[domain]) {
      statsMap[domain].total++;
      if (row.is_correct) statsMap[domain].correct++;
      practicedSets[domain].add(row.question_id);
    }
  }

  const bankCountMap: Record<string, number> = {};
  for (const domain of DOMAINS) bankCountMap[domain] = 0;
  for (const q of allQuestions ?? []) {
    if (bankCountMap[q.domain] !== undefined) bankCountMap[q.domain]++;
  }

  const stats: DomainStats[] = DOMAINS.map((domain) => ({
    domain,
    total: statsMap[domain].total,
    correct: statsMap[domain].correct,
    percentage:
      statsMap[domain].total > 0
        ? Math.round((statsMap[domain].correct / statsMap[domain].total) * 100)
        : 0,
    bankCount: bankCountMap[domain],
    practicedCount: practicedSets[domain].size,
  }));

  const totalAnswered = stats.reduce((s, d) => s + d.total, 0);
  const totalCorrect = stats.reduce((s, d) => s + d.correct, 0);

  return NextResponse.json({ stats, totalAnswered, totalCorrect });
}
