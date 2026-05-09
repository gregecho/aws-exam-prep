'use client';

import { useState, useRef } from 'react';
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
      <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            {questionNumber !== undefined && totalQuestions !== undefined && (
              <p className="text-xs text-zinc-500">Question {questionNumber} of {totalQuestions}</p>
            )}
            <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-sky-900 text-sky-300">
              {question.domain}
            </span>
          </div>
          {onBookmarkToggle && (
            <BookmarkButton questionId={question.id} isBookmarked={isBookmarked} onToggle={onBookmarkToggle} />
          )}
        </div>
        <p className="text-white leading-relaxed">{question.question}</p>
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
    <div className="flex flex-col min-h-screen bg-[#0f0f1a]">
      {/* Top bar */}
      <div className="bg-[#1a1a2e] px-4 pt-4 pb-2 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Practice Mode</span>
          <span className="text-green-400 font-medium">✓ {score}</span>
          <span className="text-zinc-300">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#2a2a4a] rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Domain + type badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-900 text-sky-300 border border-sky-700">
              {question.domain}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#2a2a4a] text-zinc-300">
              {isMultiple ? `Multiple (select ${correctKeys.length})` : 'Single'}
            </span>
            {stats && stats.times_practiced > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                stats.accuracy >= 70 ? 'bg-green-900 text-green-300' :
                stats.accuracy >= 40 ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {stats.accuracy}% ({stats.times_practiced}×)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onBookmarkToggle && (
              <BookmarkButton questionId={question.id} isBookmarked={isBookmarked} onToggle={onBookmarkToggle} />
            )}
            <button className="text-zinc-500 hover:text-zinc-300 text-lg px-1" aria-label="More options">
              ···
            </button>
          </div>
        </div>

        {/* Question text */}
        <p className="text-white text-base leading-relaxed">{question.question}</p>

        {/* Options */}
        <div className="space-y-2.5">
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

        {/* Check answer button for multi-select */}
        {isMultiple && !revealed && localSelected.length > 0 && (
          <button
            onClick={handleCheck}
            className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition-colors"
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

        {/* Bottom padding so content clears the fixed bottom bar */}
        <div className="h-20" />
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-[#2a2a4a] px-4 py-3 flex items-center justify-between gap-3">
        <button
          onClick={() => dialogRef.current?.showModal()}
          className="flex items-center gap-1.5 rounded-xl border border-[#2a2a4a] px-4 py-2.5 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
        >
          <span>+</span> Ask AI
        </button>
        <div className="flex gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="rounded-xl border border-[#2a2a4a] px-4 py-2.5 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
            >
              ← Prev
            </button>
          )}
          <button
            onClick={onNext}
            disabled={!onNext}
            className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-40 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Ask AI dialog */}
      <dialog
        ref={dialogRef}
        className="rounded-xl bg-[#1a1a2e] border border-[#2a2a4a] text-white p-6 max-w-sm w-full backdrop:bg-black/60"
        onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}
      >
        <h2 className="text-base font-semibold mb-2">AI Assistant</h2>
        <p className="text-zinc-400 text-sm">AI assistant coming soon. You&apos;ll be able to ask questions about this topic here.</p>
        <button
          onClick={() => dialogRef.current?.close()}
          className="mt-4 w-full rounded-lg bg-[#2a2a4a] py-2 text-sm text-zinc-300 hover:bg-[#3a3a5a] transition-colors"
        >
          Close
        </button>
      </dialog>
    </div>
  );
}
