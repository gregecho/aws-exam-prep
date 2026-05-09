'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import QuestionCard from '@/components/questions/QuestionCard';
import { Question, QuestionStats } from '@/types';

interface PracticeClientProps {
  domain: string;
}

function getTileState(stats: QuestionStats | undefined): 'none' | 'correct' | 'mixed' | 'wrong' {
  if (!stats || stats.times_practiced === 0) return 'none';
  if (stats.times_correct === stats.times_practiced) return 'correct';
  if (stats.times_correct === 0) return 'wrong';
  return 'mixed';
}

const TILE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  none:    { bg: 'var(--bg-option)',              color: 'var(--text-muted)',    border: 'var(--border)' },
  correct: { bg: 'rgba(34,197,94,0.15)',          color: 'var(--accent-green)', border: 'rgba(34,197,94,0.4)' },
  mixed:   { bg: 'rgba(14,165,233,0.15)',         color: 'var(--accent-teal)',  border: 'rgba(14,165,233,0.4)' },
  wrong:   { bg: 'rgba(239,68,68,0.15)',          color: 'var(--accent-red)',   border: 'rgba(239,68,68,0.4)' },
};

export default function PracticeClient({ domain }: PracticeClientProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [statsMap, setStatsMap] = useState<Record<string, QuestionStats>>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'browser' | 'practice'>('browser');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`/api/questions?domain=${encodeURIComponent(domain)}&limit=500`).then((r) => r.json()),
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

  function startFrom(i: number) {
    setIndex(i);
    setScore(0);
    setView('practice');
  }

  function handleNext() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setView('browser');
    }
  }

  if (loading) return (
    <div className="flex flex-1 items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
      Loading questions…
    </div>
  );

  if (!questions.length) return (
    <div className="flex flex-1 items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
      No questions found for this domain.
    </div>
  );

  if (view === 'practice') {
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
        onNext={handleNext}
        onPrev={index > 0 ? () => setIndex((i) => i - 1) : undefined}
      />
    );
  }

  const practiced = questions.filter((q) => (statsMap[q.id]?.times_practiced ?? 0) > 0).length;
  const correct = questions.filter((q) => getTileState(statsMap[q.id]) === 'correct').length;

  return (
    <div className="flex flex-col flex-1 min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--foreground)' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto w-full px-4 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Link href="/practice" style={{ color: 'var(--text-muted)' }}>Practice</Link>
            <span>›</span>
            <span>{domain}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">{domain}</h1>
        </div>

        {/* Summary stats */}
        <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>
            <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{questions.length}</span> questions
          </span>
          <span>
            <span style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>{practiced}</span> practiced
          </span>
          <span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{correct}</span> mastered
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          {(['none', 'correct', 'mixed', 'wrong'] as const).map((state) => (
            <span key={state} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ background: TILE_STYLES[state].bg, border: `1px solid ${TILE_STYLES[state].border}` }}
              />
              {state === 'none' ? 'Not tried' : state === 'correct' ? 'All correct' : state === 'mixed' ? 'Partial' : 'All wrong'}
            </span>
          ))}
        </div>

        {/* Tile grid */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => {
              const state = getTileState(statsMap[q.id]);
              const style = TILE_STYLES[state];
              return (
                <button
                  key={q.id}
                  onClick={() => startFrom(i)}
                  className="w-10 h-10 rounded-lg text-xs font-semibold transition-all hover:scale-105 hover:opacity-90"
                  style={{
                    background: style.bg,
                    color: style.color,
                    border: `1px solid ${style.border}`,
                    fontFamily: 'var(--font-mono)',
                  }}
                  title={`Q${i + 1} — click to start from here`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start from beginning */}
        <button
          onClick={() => startFrom(0)}
          className="w-full rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
        >
          Start from Q1 →
        </button>
      </main>
    </div>
  );
}
