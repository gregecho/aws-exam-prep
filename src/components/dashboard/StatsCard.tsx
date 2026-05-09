interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}

export default function StatsCard({ label, value, sub, highlight }: StatsCardProps) {
  return (
    <div
      className="rounded-xl p-5 space-y-1"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p
        className="text-3xl font-bold"
        style={{
          fontFamily: 'var(--font-mono)',
          color: highlight ? 'var(--accent-green)' : 'var(--foreground)',
        }}
      >
        {value}
      </p>
      {sub && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
  );
}
