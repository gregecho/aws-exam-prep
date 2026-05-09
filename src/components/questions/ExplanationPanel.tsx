interface ExplanationPanelProps {
  isCorrect: boolean;
  correctKeys: string[];
  selectedKeys: string[];
  explanations: Record<string, string | null | undefined>;
}

export default function ExplanationPanel({ isCorrect, correctKeys, selectedKeys, explanations }: ExplanationPanelProps) {
  const allKeys = Array.from(new Set([...selectedKeys, ...correctKeys])).sort();

  return (
    <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 text-sm space-y-3">
      <p className={`font-semibold text-base ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
        {isCorrect ? '✓ Correct!' : `✗ Incorrect — correct: ${correctKeys.join(', ')}`}
      </p>
      <div className="space-y-3">
        {allKeys.map((key) => {
          const isCorrectKey = correctKeys.includes(key);
          const isSelectedKey = selectedKeys.includes(key);
          const explanation = explanations[key];
          return (
            <div key={key} className="flex gap-3">
              <span className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mt-0.5 ${
                isCorrectKey ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {key}
              </span>
              <div className="space-y-0.5">
                <p className={`text-xs font-medium ${isCorrectKey ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrectKey ? 'Correct' : isSelectedKey ? 'Incorrect' : 'Also incorrect'}
                </p>
                <p className="text-zinc-300 leading-relaxed">
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
