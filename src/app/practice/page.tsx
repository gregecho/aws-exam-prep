import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { DOMAINS, DOMAIN_WEIGHTS } from "@/constants/domains";
import { createServerClient } from "@/lib/supabase/server";

const DOMAIN_CODES: Record<string, string> = {
  'Design Secure Architectures': 'SEC',
  'Design Resilient Architectures': 'RES',
  'Design High-Performing Architectures': 'PERF',
  'Design Cost-Optimized Architectures': 'COST',
};

export default async function PracticePage() {
  const supabase = createServerClient();
  const { data: allQuestions } = await supabase.from("questions").select("domain");

  const bankCountMap: Record<string, number> = {};
  for (const domain of DOMAINS) bankCountMap[domain] = 0;
  for (const q of allQuestions ?? []) {
    if (bankCountMap[q.domain] !== undefined) bankCountMap[q.domain]++;
  }

  return (
    <div className="flex flex-col flex-1" style={{ background: 'var(--bg-primary)', color: 'var(--foreground)' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto w-full px-4 py-12 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Practice</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Choose a domain. You&apos;ll get immediate feedback after each answer.
          </p>
        </div>

        <div className="space-y-2">
          {DOMAINS.map((domain) => (
            <Link
              key={domain}
              href={`/practice/${encodeURIComponent(domain)}`}
              className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all group"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <span
                className="text-xs font-semibold w-12 shrink-0 text-center py-1 rounded"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--bg-option)',
                  color: 'var(--highlight)',
                  border: '1px solid var(--border)',
                }}
              >
                {DOMAIN_CODES[domain]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{domain}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className="text-xs"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                >
                  {bankCountMap[domain]} questions
                </span>
                <span
                  className="text-xs"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                >
                  {DOMAIN_WEIGHTS[domain]}%
                </span>
                <span style={{ color: 'var(--text-muted)' }}>→</span>
              </div>
            </Link>
          ))}
        </div>

        <div
          className="flex items-center justify-between px-5 py-4 rounded-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div>
            <p className="text-sm font-medium">Full exam simulation</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              65 questions · 130 minutes · timed
            </p>
          </div>
          <Link
            href="/exam"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          >
            Start exam
          </Link>
        </div>
      </main>
    </div>
  );
}
