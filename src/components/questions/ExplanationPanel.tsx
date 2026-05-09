interface ExplanationPanelProps {
  isCorrect: boolean;
  correctKeys: string[];
  selectedKeys: string[];
  explanations: Record<string, string | null | undefined>;
}

export default function ExplanationPanel({ isCorrect, correctKeys, selectedKeys, explanations }: ExplanationPanelProps) {
  const allKeys = Object.keys(explanations).sort();

  return (
    <div
      className="rounded-xl p-4 space-y-4 text-sm"
      style={{ background: 'var(--bg-card)', border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}` }}
    >
      <p
        className="font-semibold"
        style={{ color: isCorrect ? 'var(--accent-green)' : 'var(--accent-red)' }}
      >
        {isCorrect ? '✓ Correct' : `✗ Incorrect — correct: ${correctKeys.join(', ')}`}
      </p>
      <div className="space-y-3">
        {allKeys.map((key) => {
          const explanation = explanations[key];
          if (!explanation) return null;
          const isCorrectKey = correctKeys.includes(key);
          const isSelectedKey = selectedKeys.includes(key);
          return (
            <div key={key} className="space-y-0.5">
              <span
                className="text-xs font-semibold"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: isCorrectKey ? 'var(--accent-green)' : isSelectedKey ? 'var(--accent-red)' : 'var(--text-muted)',
                }}
              >
                {key}.
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
