import { DomainStats } from '@/types';

interface DomainProgressBarProps {
  stats: DomainStats;
}

export default function DomainProgressBar({ stats }: DomainProgressBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-zinc-300 truncate">{stats.domain}</span>
        <span className="text-zinc-500 shrink-0 ml-2">
          {stats.correct}/{stats.total} ({stats.percentage}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#2a2a4a] overflow-hidden">
        <div
          className="h-full rounded-full bg-sky-500 transition-all"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>
    </div>
  );
}
