'use client';

import { useState, useCallback } from 'react';
import QuestionCard from '@/components/questions/QuestionCard';
import { Question } from '@/types';

interface BookmarksClientProps {
  initialQuestions: Question[];
}

export default function BookmarksClient({ initialQuestions }: BookmarksClientProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(initialQuestions.map((q) => q.id)));

  const handleBookmarkToggle = useCallback(async (questionId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    await fetch('/api/bookmarks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId }),
    });
  }, []);

  if (!questions.length) {
    return <p className="text-zinc-500">No bookmarks remaining.</p>;
  }

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          mode="practice"
          questionNumber={i + 1}
          totalQuestions={questions.length}
          isBookmarked={bookmarks.has(q.id)}
          onBookmarkToggle={handleBookmarkToggle}
        />
      ))}
    </div>
  );
}
