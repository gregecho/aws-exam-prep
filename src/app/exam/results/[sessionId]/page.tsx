import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import ExamResultsChart from '@/components/exam/ExamResultsChart';
import { createServerClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { DOMAINS } from '@/constants/domains';
import { DomainStats } from '@/types';
import { notFound } from 'next/navigation';
import { isAnswerCorrect } from '@/lib/answers';

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function ExamResultsPage({ params }: Props) {
  const { sessionId } = await params;
  const { userId } = await auth();

  const supabase = createServerClient();

  const { data: session } = await supabase
    .from('exam_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId!)
    .single();

  if (!session || !session.completed_at) notFound();

  const answers: Record<string, string> = session.answers ?? {};
  const questionIds = Object.keys(answers);

  const { data: questions } = await supabase
    .from('questions')
    .select('id, correct, domain')
    .in('id', questionIds);

  const statsMap: Record<string, { total: number; correct: number }> = {};
  for (const domain of DOMAINS) statsMap[domain] = { total: 0, correct: 0 };

  for (const q of questions ?? []) {
    if (statsMap[q.domain]) {
      statsMap[q.domain].total++;
      if (answers[q.id] && isAnswerCorrect(answers[q.id], q.correct)) statsMap[q.domain].correct++;
    }
  }

  const domainStats: DomainStats[] = DOMAINS.map((domain) => ({
    domain,
    total: statsMap[domain].total,
    correct: statsMap[domain].correct,
    percentage:
      statsMap[domain].total > 0
        ? Math.round((statsMap[domain].correct / statsMap[domain].total) * 100)
        : 0,
    bankCount: 0,
    practicedCount: 0,
  }));

  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="max-w-2xl mx-auto w-full px-4 py-10 space-y-8">
        <h1 className="text-2xl font-bold text-white">Exam Results</h1>
        <ExamResultsChart
          stats={domainStats}
          score={session.score ?? 0}
          total={session.total}
        />
        <div className="flex gap-3">
          <Link
            href="/exam"
            className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition-colors"
          >
            Take another exam
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-[#2a2a4a] px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
