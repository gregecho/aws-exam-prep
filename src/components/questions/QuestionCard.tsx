'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Question, QuestionStats } from '@/types';
import OptionButton from './OptionButton';
import ExplanationPanel from './ExplanationPanel';
import BookmarkButton from './BookmarkButton';
import { normalizeAnswer, getCorrectKeys } from '@/lib/answers';

interface QuestionCardProps {
  question: Question;
  mode: 'practice' | 'exam';
  layout?: 'fullscreen' | 'card';
  selectedAnswer?: string;
  onAnswer?: (questionId: string, selected: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  questionNumber?: number;
  totalQuestions?: number;
  isBookmarked?: boolean;
  onBookmarkToggle?: (questionId: string) => void;
  stats?: QuestionStats;
  score?: number;
}

export default function QuestionCard({
  question,
  mode,
  layout = 'card',
  selectedAnswer,
  onAnswer,
  onNext,
  onPrev,
  questionNumber,
  totalQuestions,
  isBookmarked = false,
  onBookmarkToggle,
  stats,
  score = 0,
}: QuestionCardProps) {
  const [localSelected, setLocalSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const isMultiple = question.question_type === 'multiple';
  const correctKeys = getCorrectKeys(question.correct);

  const selectedKeys: string[] =
    mode === 'exam'
      ? selectedAnswer ? selectedAnswer.split(',').map((s) => s.trim()) : []
      : localSelected;

  const showFeedback = mode === 'practice' && revealed;

  function handleSelect(key: string) {
    if (mode === 'practice' && revealed) return;
    if (mode === 'exam') {
      if (isMultiple) {
        const current = selectedAnswer ? selectedAnswer.split(',').map((s) => s.trim()) : [];
        const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
        onAnswer?.(question.id, normalizeAnswer(next.join(',')));
      } else {
        onAnswer?.(question.id, key);
      }
      return;
    }
    if (isMultiple) {
      setLocalSelected((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    } else {
      setLocalSelected([key]);
      setRevealed(true);
      onAnswer?.(question.id, key);
    }
  }

  function handleCheck() {
    if (localSelected.length === 0) return;
    setRevealed(true);
    onAnswer?.(question.id, normalizeAnswer(localSelected.join(',')));
  }

  const isFullscreen = layout === 'fullscreen';
  const progress = questionNumber && totalQuestions ? (questionNumber / totalQuestions) * 100 : 0;

  if (!isFullscreen) {
    return (
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            {questionNumber !== undefined && totalQuestions !== undefined && (
              <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {questionNumber} / {totalQuestions}
              </p>
            )}
            <span
              className="inline-block text-xs font-medium px-2 py-0.5 rounded"
              style={{ background: 'var(--bg-option)', color: 'var(--highlight)', border: '1px solid var(--border)' }}
            >
              {question.domain}
            </span>
          </div>
          {onBookmarkToggle && (
            <BookmarkButton questionId={question.id} isBookmarked={isBookmarked} onToggle={onBookmarkToggle} />
          )}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>{question.question}</p>
        <div className="space-y-2">
          {question.options.map(({ key, text }) => (
            <OptionButton
              key={key}
              optionKey={key}
              text={text}
              selected={selectedKeys.includes(key)}
              correct={showFeedback ? correctKeys.includes(key) : undefined}
              incorrect={showFeedback && selectedKeys.includes(key) && !correctKeys.includes(key) ? true : undefined}
              disabled={mode === 'practice' && revealed}
              multiSelect={isMultiple}
              onClick={() => handleSelect(key)}
            />
          ))}
        </div>
        {showFeedback && (
          <ExplanationPanel
            isCorrect={normalizeAnswer(selectedKeys.join(',')) === normalizeAnswer(question.correct)}
            correctKeys={correctKeys}
            selectedKeys={selectedKeys}
            explanations={question.explanations}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: 'var(--bg-primary)', color: 'var(--foreground)' }}
    >
      {/* Top bar — replaces navbar in practice mode */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div className="px-4 pt-3 pb-2 space-y-2">
          <div className="flex items-center justify-between">
            <Link
              href="/practice"
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <span>←</span>
              <span>Exit</span>
            </Link>
            <div className="flex items-center gap-4">
              <span
                className="text-xs"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}
              >
                ✓ {score}
              </span>
              <span
                className="text-xs"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
              >
                {questionNumber} / {totalQuestions}
              </span>
              {onBookmarkToggle && (
                <BookmarkButton questionId={question.id} isBookmarked={isBookmarked} onToggle={onBookmarkToggle} />
              )}
            </div>
          </div>
          {/* Progress bar */}
          <div
            className="w-full h-0.5 rounded-full overflow-hidden"
            style={{ background: 'var(--border)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'var(--highlight)' }}
            />
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 max-w-2xl mx-auto w-full">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded"
            style={{
              background: 'var(--bg-option)',
              color: 'var(--highlight)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {question.domain.split(' ').map(w => w[0]).join('')}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: 'var(--bg-option)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            {isMultiple ? `Multi · pick ${correctKeys.length}` : 'Single'}
          </span>
          {stats && stats.times_practiced > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'var(--bg-option)',
                border: '1px solid var(--border)',
                color: stats.accuracy >= 70
                  ? 'var(--accent-green)'
                  : stats.accuracy >= 40
                  ? '#f59e0b'
                  : 'var(--accent-red)',
              }}
            >
              {stats.accuracy}% · {stats.times_practiced}×
            </span>
          )}
        </div>

        {/* Question text */}
        <p className="text-base leading-relaxed" style={{ color: 'var(--foreground)' }}>
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {question.options.map(({ key, text }) => (
            <OptionButton
              key={key}
              optionKey={key}
              text={text}
              selected={selectedKeys.includes(key)}
              correct={showFeedback ? correctKeys.includes(key) : undefined}
              incorrect={showFeedback && selectedKeys.includes(key) && !correctKeys.includes(key) ? true : undefined}
              disabled={mode === 'practice' && revealed}
              multiSelect={isMultiple}
              onClick={() => handleSelect(key)}
            />
          ))}
        </div>

        {/* Check answer for multi-select */}
        {isMultiple && !revealed && localSelected.length > 0 && (
          <button
            onClick={handleCheck}
            className="w-full rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          >
            Check Answer
          </button>
        )}

        {/* Explanation */}
        {showFeedback && (
          <ExplanationPanel
            isCorrect={normalizeAnswer(selectedKeys.join(',')) === normalizeAnswer(question.correct)}
            correctKeys={correctKeys}
            selectedKeys={selectedKeys}
            explanations={question.explanations}
          />
        )}

        <div className="h-20" />
      </div>

      {/* Bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between gap-3"
        style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}
      >
        <button
          onClick={() => dialogRef.current?.showModal()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors"
          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          Ask AI
        </button>
        <div className="flex gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              ← Prev
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!onNext}
            className="px-6 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-30"
            style={{ background: 'var(--accent-green)', color: '#fff' }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Ask AI dialog */}
      <dialog
        ref={dialogRef}
        className="rounded-xl p-6 max-w-sm w-full"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
        }}
        onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}
      >
        <h2 className="text-base font-semibold mb-2">AI Assistant</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          AI assistant coming soon. You&apos;ll be able to ask questions about this topic here.
        </p>
        <button
          onClick={() => dialogRef.current?.close()}
          className="mt-4 w-full rounded-lg py-2 text-sm transition-colors"
          style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          Close
        </button>
      </dialog>
    </div>
  );
}
