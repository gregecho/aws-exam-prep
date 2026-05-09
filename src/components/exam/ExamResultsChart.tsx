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
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <p className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">{pct}%</p>
        <p className="text-sm text-zinc-500">
          {score} / {total} correct
        </p>
        <span
          className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${
            passed
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {passed ? 'PASS' : 'FAIL'} (passing score: 72%)
        </span>
      </div>

      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.domain} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-xs">{s.domain}</span>
              <span className="text-zinc-500 shrink-0 ml-2">
                {s.correct}/{s.total} ({s.percentage}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  s.percentage >= 72 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${s.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
