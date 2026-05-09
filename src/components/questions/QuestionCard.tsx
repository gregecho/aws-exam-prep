'use client';

import { useState } from 'react';
import { Question } from '@/types';
import OptionButton from './OptionButton';
import ExplanationPanel from './ExplanationPanel';
import BookmarkButton from './BookmarkButton';

interface QuestionCardProps {
  question: Question;
  mode: 'practice' | 'exam';
  selectedAnswer?: string;
  onAnswer?: (questionId: string, selected: string) => void;
  questionNumber?: number;
  totalQuestions?: number;
  isBookmarked?: boolean;
  onBookmarkToggle?: (questionId: string) => void;
}

export default function QuestionCard({
  question,
  mode,
  selectedAnswer,
  onAnswer,
  questionNumber,
  totalQuestions,
  isBookmarked = false,
  onBookmarkToggle,
}: QuestionCardProps) {
  const [localSelected, setLocalSelected] = useState<string | undefined>(selectedAnswer);
  const [revealed, setRevealed] = useState(false);

  const selected = mode === 'exam' ? selectedAnswer : localSelected;
  const showFeedback = mode === 'practice' && revealed;

  function handleSelect(option: string) {
    if (mode === 'practice' && revealed) return;
    if (mode === 'exam') {
      onAnswer?.(question.id, option);
      return;
    }
    setLocalSelected(option);
    setRevealed(true);
    onAnswer?.(question.id, option);
  }

  const options: Array<{ key: 'A' | 'B' | 'C' | 'D'; text: string }> = [
    { key: 'A', text: question.option_a },
    { key: 'B', text: question.option_b },
    { key: 'C', text: question.option_c },
    { key: 'D', text: question.option_d },
  ];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {questionNumber !== undefined && totalQuestions !== undefined && (
            <p className="text-xs text-zinc-500">
              Question {questionNumber} of {totalQuestions}
            </p>
          )}
          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {question.domain}
          </span>
        </div>
        {onBookmarkToggle && (
          <BookmarkButton
            questionId={question.id}
            isBookmarked={isBookmarked}
            onToggle={onBookmarkToggle}
          />
        )}
      </div>

      <p className="text-zinc-900 dark:text-zinc-50 leading-relaxed">{question.question}</p>

      <div className="space-y-2">
        {options.map(({ key, text }) => (
          <OptionButton
            key={key}
            optionKey={key}
            text={text}
            selected={selected === key}
            correct={showFeedback ? question.correct === key : undefined}
            incorrect={showFeedback && selected === key && question.correct !== key ? true : undefined}
            disabled={mode === 'practice' && revealed}
            onClick={() => handleSelect(key)}
          />
        ))}
      </div>

      {showFeedback && (
        <ExplanationPanel
          isCorrect={selected === question.correct}
          correctAnswer={question.correct}
          explanation={question.explanation}
        />
      )}
    </div>
  );
}
