'use client';

interface QuestionNavigatorProps {
  total: number;
  current: number;
  answers: Record<string, string>;
  questionIds: string[];
  onNavigate: (index: number) => void;
}

export default function QuestionNavigator({
  total,
  current,
  answers,
  questionIds,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Questions</p>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: total }, (_, i) => {
          const qId = questionIds[i];
          const answered = qId ? !!answers[qId] : false;
          const isCurrent = i === current;

          let cls =
            'h-8 w-8 rounded text-xs font-medium transition-colors ';
          if (isCurrent) {
            cls += 'bg-blue-600 text-white';
          } else if (answered) {
            cls += 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
          } else {
            cls += 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700';
          }

          return (
            <button key={i} className={cls} onClick={() => onNavigate(i)} aria-label={`Go to question ${i + 1}`}>
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-zinc-500">
        {Object.keys(answers).length} / {total} answered
      </p>
    </div>
  );
}
