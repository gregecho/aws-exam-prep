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
  let borderColor = 'var(--border)';
  let bgColor = 'var(--bg-option)';
  let textColor = 'var(--text-secondary)';
  let indicatorBg = 'transparent';
  let indicatorBorder = 'var(--border)';
  let indicatorColor = 'var(--text-muted)';
  let indicatorContent: string = optionKey;

  if (incorrect) {
    borderColor = 'var(--accent-red)';
    bgColor = 'rgba(244,63,94,0.08)';
    textColor = 'var(--foreground)';
    indicatorBg = 'var(--accent-red)';
    indicatorBorder = 'var(--accent-red)';
    indicatorColor = '#fff';
    indicatorContent = '✕';
  } else if (correct) {
    borderColor = 'var(--accent-green)';
    bgColor = 'rgba(16,185,129,0.08)';
    textColor = 'var(--foreground)';
    indicatorBg = 'var(--accent-green)';
    indicatorBorder = 'var(--accent-green)';
    indicatorColor = '#fff';
    indicatorContent = '✓';
  } else if (selected) {
    borderColor = 'var(--accent)';
    bgColor = 'rgba(245,158,11,0.08)';
    textColor = 'var(--foreground)';
    indicatorBg = 'var(--accent)';
    indicatorBorder = 'var(--accent)';
    indicatorColor = '#000';
  }

  const indicatorRadius = multiSelect ? '4px' : '50%';

  return (
    <button
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm transition-all"
      style={{
        border: `1px solid ${borderColor}`,
        background: bgColor,
        color: textColor,
        cursor: disabled ? 'default' : 'pointer',
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className="shrink-0 w-7 h-7 flex items-center justify-center text-xs font-bold border-2 transition-all"
        style={{
          borderRadius: indicatorRadius,
          background: indicatorBg,
          borderColor: indicatorBorder,
          color: indicatorColor,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {indicatorContent}
      </span>
      <span className="flex-1 leading-relaxed">{text}</span>
    </button>
  );
}
