import Navbar from "@/components/layout/Navbar";
import StatsCard from "@/components/dashboard/StatsCard";
import DomainProgressBar from "@/components/dashboard/DomainProgressBar";
import { createServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { DOMAINS } from "@/constants/domains";
import { DomainStats } from "@/types";

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
    const domain = (row.questions as unknown as { domain: string } | null)
      ?.domain;
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
  const { domainStats, totalAnswered, totalCorrect, sessions } = await getStats(
    userId!,
  );
  const overallPct =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="max-w-4xl mx-auto w-full px-4 py-10 space-y-8">
        <h1 className="text-2xl font-bold text-white">
          Dashboard
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatsCard label="Questions answered" value={totalAnswered} />
          <StatsCard label="Correct answers" value={totalCorrect} />
          <StatsCard label="Overall accuracy" value={`${overallPct}%`} />
        </div>

        <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6 space-y-4">
          <h2 className="font-semibold text-white">
            Progress by domain
          </h2>
          <div className="space-y-4">
            {domainStats.map((s) => (
              <DomainProgressBar key={s.domain} stats={s} />
            ))}
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6 space-y-3">
            <h2 className="font-semibold text-white">
              Recent exams
            </h2>
            <div className="divide-y divide-[#2a2a4a]">
              {sessions.map((s, i) => {
                const pct =
                  s.total > 0 ? Math.round((s.score / s.total) * 100) : 0;
                return (
                  <div key={i} className="flex justify-between py-2 text-sm">
                    <span className="text-zinc-400">
                      {new Date(s.completed_at).toLocaleDateString()}
                    </span>
                    <span
                      className={`font-semibold ${pct >= 72 ? "text-green-400" : "text-red-400"}`}
                    >
                      {s.score}/{s.total} ({pct}%)
                    </span>
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
