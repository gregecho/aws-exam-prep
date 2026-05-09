interface ExplanationPanelProps {
  isCorrect: boolean;
  correctKeys: string[];
  selectedKeys: string[];
  explanations: Record<string, string | null | undefined>;
  allOptionKeys: string[];
}

export default function ExplanationPanel({ isCorrect, correctKeys, selectedKeys, explanations, allOptionKeys }: ExplanationPanelProps) {
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
      <div className="space-y-4">
        {allOptionKeys.map((key) => {
          const isCorrectKey = correctKeys.includes(key);
          const isSelectedKey = selectedKeys.includes(key);
          const explanation = explanations[key];
          return (
            <div key={key} className="flex gap-3">
              <span
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded text-xs font-bold mt-0.5"
                style={{
                  background: isCorrectKey ? 'var(--accent-green)' : 'var(--accent-red)',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {key}
              </span>
              <div className="space-y-1">
                <p
                  className="text-xs font-medium"
                  style={{ color: isCorrectKey ? 'var(--accent-green)' : 'var(--accent-red)' }}
                >
                  {isCorrectKey ? 'Correct' : isSelectedKey ? 'Incorrect' : 'Incorrect'}
                </p>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {explanation ?? 'No explanation available.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
