'use client';

import { useEffect, useState } from 'react';

interface ExamTimerProps {
  durationMinutes: number;
  onExpire: () => void;
}

export default function ExamTimer({ durationMinutes, onExpire }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isWarning = secondsLeft <= 600;

  return (
    <div
      className="text-base font-semibold tabular-nums"
      style={{
        fontFamily: 'var(--font-mono)',
        color: isWarning ? 'var(--accent-red)' : 'var(--text-secondary)',
      }}
      aria-live="polite"
      aria-label={`Time remaining: ${minutes} minutes ${seconds} seconds`}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
