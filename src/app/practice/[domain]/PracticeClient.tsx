'use client';

import { useEffect, useState, useCallback } from 'react';
import QuestionCard from '@/components/questions/QuestionCard';
import { Question, QuestionStats } from '@/types';

interface PracticeClientProps {
  domain: string;
}

export default function PracticeClient({ domain }: PracticeClientProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [statsMap, setStatsMap] = useState<Record<string, QuestionStats>>({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`/api/questions?domain=${encodeURIComponent(domain)}&limit=20`).then((r) => r.json()),
      fetch('/api/bookmarks').then((r) => r.json()),
      fetch('/api/question-stats').then((r) => r.json()),
    ]).then(([qData, bData, sData]) => {
      setQuestions(qData.questions ?? []);
      const ids = (bData.bookmarks ?? []).map((b: { question_id: string }) => b.question_id);
      setBookmarks(new Set(ids));
      const map: Record<string, QuestionStats> = {};
      for (const s of sData.stats ?? []) map[s.question_id] = s;
      setStatsMap(map);
      setLoading(false);
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

  const handleAnswer = useCallback(async (questionId: string, selected: string) => {
    const res = await fetch('/api/practice/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, selected }),
    });
    const { is_correct } = await res.json() as { is_correct: boolean };

    if (is_correct) setScore((s) => s + 1);

    setStatsMap((prev) => {
      const existing = prev[questionId] ?? { question_id: questionId, times_practiced: 0, times_correct: 0, accuracy: 0 };
      const times_practiced = existing.times_practiced + 1;
      const times_correct = existing.times_correct + (is_correct ? 1 : 0);
      return {
        ...prev,
        [questionId]: {
          question_id: questionId,
          times_practiced,
          times_correct,
          accuracy: Math.round((times_correct / times_practiced) * 100),
        },
      };
    });
  }, []);

  if (loading) return (
    <div className="flex flex-1 items-center justify-center min-h-screen bg-[#0f0f1a] text-zinc-500">
      Loading questions…
    </div>
  );
  if (!questions.length) return (
    <div className="flex flex-1 items-center justify-center min-h-screen bg-[#0f0f1a] text-zinc-500">
      No questions found for this domain.
    </div>
  );

  const question = questions[index];
  const stats = statsMap[question.id] ?? { question_id: question.id, times_practiced: 0, times_correct: 0, accuracy: 0 };

  return (
    <QuestionCard
      key={question.id}
      question={question}
      mode="practice"
      layout="fullscreen"
      questionNumber={index + 1}
      totalQuestions={questions.length}
      isBookmarked={bookmarks.has(question.id)}
      onBookmarkToggle={handleBookmark}
      onAnswer={handleAnswer}
      stats={stats}
      score={score}
      onNext={index < questions.length - 1 ? () => setIndex((i) => i + 1) : undefined}
      onPrev={index > 0 ? () => setIndex((i) => i - 1) : undefined}
    />
  );
}
