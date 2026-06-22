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
    .select('id, correct, domain, question_number, question')
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

  const incorrectByDomain: Record<string, { id: string; question_number: number | null }[]> = {};
  for (const q of questions ?? []) {
    if (answers[q.id] && !isAnswerCorrect(answers[q.id], q.correct)) {
      if (!incorrectByDomain[q.domain]) incorrectByDomain[q.domain] = [];
      incorrectByDomain[q.domain].push({ id: q.id, question_number: q.question_number });
    }
  }
  const incorrectDomains = DOMAINS.filter((d) => incorrectByDomain[d]?.length > 0);

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

        {incorrectDomains.length > 0 && (
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h2
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              Incorrect ({incorrectDomains.reduce((n, d) => n + incorrectByDomain[d].length, 0)})
            </h2>
            <div className="space-y-5">
              {incorrectDomains.map((domain) => (
                <div key={domain} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-red)' }}>
                    {domain}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {incorrectByDomain[domain]
                      .sort((a, b) => (a.question_number ?? 0) - (b.question_number ?? 0))
                      .map((q) => (
                        <Link
                          key={q.id}
                          href={`/practice/${encodeURIComponent(domain)}?q=${q.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold px-2.5 py-1 rounded-md transition-opacity hover:opacity-80"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            background: 'rgba(14,165,233,0.12)',
                            color: 'var(--accent-teal)',
                            border: '1px solid rgba(14,165,233,0.3)',
                          }}
                        >
                          Q{q.question_number}
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
