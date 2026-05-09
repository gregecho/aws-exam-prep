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
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Questions
        </p>
        <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          {answeredCount}/{total}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: total }, (_, i) => {
          const qId = questionIds[i];
          const answered = qId ? !!answers[qId] : false;
          const isCurrent = i === current;

          return (
            <button
              key={i}
              className="h-8 w-8 rounded text-xs font-medium transition-all"
              style={{
                fontFamily: 'var(--font-mono)',
                background: isCurrent
                  ? 'var(--accent)'
                  : answered
                  ? 'rgba(16,185,129,0.15)'
                  : 'var(--bg-option)',
                color: isCurrent
                  ? '#000'
                  : answered
                  ? 'var(--accent-green)'
                  : 'var(--text-muted)',
                border: isCurrent
                  ? '1px solid var(--accent)'
                  : answered
                  ? '1px solid rgba(16,185,129,0.3)'
                  : '1px solid var(--border)',
              }}
              onClick={() => onNavigate(i)}
              aria-label={`Go to question ${i + 1}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
