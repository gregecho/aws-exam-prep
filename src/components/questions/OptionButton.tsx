'use client';

interface OptionButtonProps {
  optionKey: string;
  text: string;
  selected: boolean;
  correct?: boolean;
  incorrect?: boolean;
  disabled?: boolean;
  multiSelect?: boolean;
  onClick: () => void;
}

export default function OptionButton({
  optionKey,
  text,
  selected,
  correct,
  incorrect,
  disabled,
  multiSelect,
  onClick,
}: OptionButtonProps) {
  let wrapperClass = 'w-full flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all ';
  let indicatorClass = 'shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border-2 transition-all ';

  if (incorrect) {
    wrapperClass += 'border-red-500 bg-[#2a0f0f] text-white';
    indicatorClass += 'border-red-500 bg-red-500 text-white';
  } else if (correct) {
    wrapperClass += 'border-green-500 bg-[#0f2a1a] text-white';
    indicatorClass += 'border-green-500 bg-green-500 text-white';
  } else if (selected) {
    wrapperClass += 'border-sky-400 bg-[#1e2d4a] text-white';
    indicatorClass += 'border-sky-400 bg-sky-400 text-white';
  } else {
    wrapperClass += 'border-[#2a2a4a] bg-[#16213e] text-zinc-300 hover:border-zinc-500 hover:bg-[#1e2a40]';
    indicatorClass += 'border-[#3a3a5a] bg-transparent text-zinc-400';
  }

  if (multiSelect) {
    indicatorClass = indicatorClass.replace('rounded-full', 'rounded-md');
  }

  if (disabled) wrapperClass += ' cursor-default';

  function renderIndicator() {
    if (incorrect) return <span>✕</span>;
    if (correct) return <span>✓</span>;
    return <span>{optionKey}</span>;
  }

  return (
    <button className={wrapperClass} onClick={onClick} disabled={disabled}>
      <span className={indicatorClass}>{renderIndicator()}</span>
      <span className="flex-1 leading-relaxed">{text}</span>
    </button>
  );
}
