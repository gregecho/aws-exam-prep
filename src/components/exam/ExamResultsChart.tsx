import { DomainStats } from '@/types';

interface ExamResultsChartProps {
  stats: DomainStats[];
  score: number;
  total: number;
}

export default function ExamResultsChart({ stats, score, total }: ExamResultsChartProps) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 72;

  return (
    <div
      className="rounded-xl p-6 space-y-6"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="text-center space-y-2">
        <p className="text-7xl font-black tracking-tight" style={{ color: 'var(--foreground)' }}>
          {pct}%
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {score} / {total} correct
        </p>
        <span
          className="inline-block text-sm font-semibold px-3 py-1 rounded-full"
          style={{
            background: passed ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
            color: passed ? 'var(--accent-green)' : 'var(--accent-red)',
          }}
        >
          {passed ? 'PASS' : 'FAIL'} — passing score: 72%
        </span>
      </div>

      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.domain} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="truncate max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                {s.domain}
              </span>
              <span className="shrink-0 ml-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {s.correct}/{s.total} ({s.percentage}%)
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${s.percentage}%`,
                  background: s.percentage >= 72 ? 'var(--accent-green)' : 'var(--accent-red)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
