interface ExplanationPanelProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

export default function ExplanationPanel({ isCorrect, correctAnswer, explanation }: ExplanationPanelProps) {
  return (
    <div
      className={`rounded-lg border p-4 text-sm space-y-2 ${
        isCorrect
          ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950'
          : 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950'
      }`}
    >
      <p className={`font-semibold ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
        {isCorrect ? 'Correct!' : `Incorrect — correct answer: ${correctAnswer}`}
      </p>
      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{explanation}</p>
    </div>
  );
}
