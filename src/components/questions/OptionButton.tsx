'use client';

interface OptionButtonProps {
  optionKey: string;
  text: string;
  selected: boolean;
  correct?: boolean;
  incorrect?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function OptionButton({
  optionKey,
  text,
  selected,
  correct,
  incorrect,
  disabled,
  onClick,
}: OptionButtonProps) {
  let className =
    'w-full flex items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ';

  if (incorrect) {
    className += 'border-red-400 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-950 dark:text-red-100';
  } else if (correct) {
    className += 'border-green-400 bg-green-50 text-green-900 dark:border-green-600 dark:bg-green-950 dark:text-green-100';
  } else if (selected) {
    className += 'border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-100';
  } else {
    className +=
      'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500';
  }

  if (disabled) className += ' cursor-default';

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      <span className="font-semibold shrink-0">{optionKey}.</span>
      <span>{text}</span>
    </button>
  );
}
