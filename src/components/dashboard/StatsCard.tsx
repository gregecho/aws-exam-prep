interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export default function StatsCard({ label, value, sub }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-1">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{value}</p>
      {sub && <p className="text-sm text-zinc-500">{sub}</p>}
    </div>
  );
}
