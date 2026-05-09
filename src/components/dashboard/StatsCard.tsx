interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export default function StatsCard({ label, value, sub }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-5 space-y-1">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-sm text-zinc-500">{sub}</p>}
    </div>
  );
}
