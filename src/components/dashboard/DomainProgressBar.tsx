import { DomainStats } from '@/types';

interface DomainProgressBarProps {
  stats: DomainStats;
}

const DOMAIN_CODES: Record<string, string> = {
  'Design Secure Architectures': 'SEC',
  'Design Resilient Architectures': 'RES',
  'Design High-Performing Architectures': 'PERF',
  'Design Cost-Optimized Architectures': 'COST',
};

export default function DomainProgressBar({ stats }: DomainProgressBarProps) {
  const code = DOMAIN_CODES[stats.domain] ?? stats.domain.slice(0, 4).toUpperCase();
  const pct = stats.percentage;
  const barColor = pct >= 72 ? 'var(--accent-green)' : pct >= 50 ? 'var(--accent)' : 'var(--accent-red)';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="text-xs font-semibold shrink-0"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--highlight)', width: '2.5rem' }}
          >
            {code}
          </span>
          <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
            {stats.domain}
          </span>
        </div>
        <span
          className="text-xs shrink-0"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
        >
          {stats.practicedCount}/{stats.bankCount} practiced
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
