'use client';

import { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import QuestionCard from '@/components/questions/QuestionCard';
import { Question } from '@/types';

interface PracticeClientProps {
  domain: string;
}

export default function PracticeClient({ domain }: PracticeClientProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/questions?domain=${encodeURIComponent(domain)}&limit=20`)
      .then((r) => r.json())
      .then((d) => { setQuestions(d.questions ?? []); setLoading(false); });

    fetch('/api/bookmarks')
      .then((r) => r.json())
      .then((d) => {
        const ids = (d.bookmarks ?? []).map((b: { question_id: string }) => b.question_id);
        setBookmarks(new Set(ids));
      });
  }, [domain]);

  const handleBookmark = useCallback(async (questionId: string) => {
    const isBookmarked = bookmarks.has(questionId);
    setBookmarks((prev) => {
      const next = new Set(prev);
      isBookmarked ? next.delete(questionId) : next.add(questionId);
      return next;
    });
    await fetch('/api/bookmarks', {
      method: isBookmarked ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId }),
    });
  }, [bookmarks]);

  if (loading) return <div className="flex flex-1 items-center justify-center text-zinc-500">Loading questions…</div>;
  if (!questions.length) return <div className="flex flex-1 items-center justify-center text-zinc-500">No questions found for this domain.</div>;

  const question = questions[index];

  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="max-w-3xl mx-auto w-full px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 truncate">{domain}</h1>
          <span className="text-sm text-zinc-500">{index + 1} / {questions.length}</span>
        </div>

        <QuestionCard
          key={question.id}
          question={question}
          mode="practice"
          questionNumber={index + 1}
          totalQuestions={questions.length}
          isBookmarked={bookmarks.has(question.id)}
          onBookmarkToggle={handleBookmark}
        />

        <div className="flex justify-between">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Previous
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={index === questions.length - 1}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
