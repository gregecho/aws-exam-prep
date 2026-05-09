import Navbar from "@/components/layout/Navbar";
import StatsCard from "@/components/dashboard/StatsCard";
import DomainProgressBar from "@/components/dashboard/DomainProgressBar";
import { createServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { DOMAINS } from "@/constants/domains";
import { DomainStats } from "@/types";
import Link from "next/link";

async function getStats(userId: string) {
  const supabase = createServerClient();

  const { data: progress } = await supabase
    .from("user_progress")
    .select("is_correct, questions(domain)")
    .eq("user_id", userId);

  const { data: sessions } = await supabase
    .from("exam_sessions")
    .select("score, total, completed_at")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(5);

  const statsMap: Record<string, { total: number; correct: number }> = {};
  for (const domain of DOMAINS) statsMap[domain] = { total: 0, correct: 0 };

  for (const row of progress ?? []) {
    const domain = (row.questions as unknown as { domain: string } | null)?.domain;
    if (domain && statsMap[domain]) {
      statsMap[domain].total++;
      if (row.is_correct) statsMap[domain].correct++;
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
  }));

  const totalAnswered = domainStats.reduce((s, d) => s + d.total, 0);
  const totalCorrect = domainStats.reduce((s, d) => s + d.correct, 0);

  return { domainStats, totalAnswered, totalCorrect, sessions: sessions ?? [] };
}

export default async function DashboardPage() {
  const { userId } = await auth();
  const { domainStats, totalAnswered, totalCorrect, sessions } = await getStats(userId!);
  const overallPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="flex flex-col flex-1" style={{ background: 'var(--bg-primary)', color: 'var(--foreground)' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto w-full px-4 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Link
            href="/practice"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          >
            Practice →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatsCard label="Answered" value={totalAnswered} />
          <StatsCard label="Correct" value={totalCorrect} />
          <StatsCard label="Accuracy" value={`${overallPct}%`} highlight={overallPct >= 72} />
        </div>

        <div
          className="rounded-xl p-6 space-y-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            By domain
          </h2>
          <div className="space-y-5">
            {domainStats.map((s) => (
              <DomainProgressBar key={s.domain} stats={s} />
            ))}
          </div>
        </div>

        {sessions.length > 0 && (
          <div
            className="rounded-xl p-6 space-y-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Recent exams
            </h2>
            <div className="space-y-1">
              {sessions.map((s, i) => {
                const pct = s.total > 0 ? Math.round((s.score / s.total) * 100) : 0;
                const passed = pct >= 72;
                return (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2.5 px-3 rounded-lg"
                    style={{ background: 'var(--bg-option)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(s.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {s.score}/{s.total}
                      </span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          background: passed ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                          color: passed ? 'var(--accent-green)' : 'var(--accent-red)',
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
