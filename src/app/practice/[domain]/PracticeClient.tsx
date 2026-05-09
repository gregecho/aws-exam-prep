'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import QuestionCard from '@/components/questions/QuestionCard';
import { Question, QuestionStats, UserNote } from '@/types';

interface PracticeClientProps {
  domain: string;
}

type FilterState = 'all' | 'none' | 'correct' | 'mixed' | 'wrong' | 'bookmarked';

function getTileState(stats: QuestionStats | undefined): 'none' | 'correct' | 'mixed' | 'wrong' {
  if (!stats || stats.times_practiced === 0) return 'none';
  if (stats.times_correct === stats.times_practiced) return 'correct';
  if (stats.times_correct === 0) return 'wrong';
  return 'mixed';
}

const STATUS_LABELS: Record<string, string> = {
  none: 'Not tried',
  correct: 'All correct',
  mixed: 'Partial',
  wrong: 'All wrong',
};

const STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  none:    { color: 'var(--text-muted)',    bg: 'transparent',              border: 'var(--border)' },
  correct: { color: 'var(--accent-green)', bg: 'rgba(34,197,94,0.12)',     border: 'rgba(34,197,94,0.3)' },
  mixed:   { color: 'var(--accent-teal)',  bg: 'rgba(14,165,233,0.12)',    border: 'rgba(14,165,233,0.3)' },
  wrong:   { color: 'var(--accent-red)',   bg: 'rgba(239,68,68,0.12)',     border: 'rgba(239,68,68,0.3)' },
};

const FILTERS: { key: FilterState; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'none', label: 'Not tried' },
  { key: 'correct', label: 'Correct' },
  { key: 'mixed', label: 'Partial' },
  { key: 'wrong', label: 'Wrong' },
  { key: 'bookmarked', label: 'Bookmarked' },
];

export default function PracticeClient({ domain }: PracticeClientProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [statsMap, setStatsMap] = useState<Record<string, QuestionStats>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'browser' | 'practice'>('browser');
  const [filter, setFilter] = useState<FilterState>('all');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`/api/questions?domain=${encodeURIComponent(domain)}&limit=500`).then((r) => r.json()),
      fetch('/api/bookmarks').then((r) => r.json()),
      fetch('/api/question-stats').then((r) => r.json()),
      fetch('/api/notes').then((r) => r.json()),
    ]).then(([qData, bData, sData, nData]) => {
      setQuestions(qData.questions ?? []);
      const ids = (bData.bookmarks ?? []).map((b: { question_id: string }) => b.question_id);
      setBookmarks(new Set(ids));
      const sMap: Record<string, QuestionStats> = {};
      for (const s of sData.stats ?? []) sMap[s.question_id] = s;
      setStatsMap(sMap);
      const nMap: Record<string, string> = {};
      for (const n of (nData.notes ?? []) as UserNote[]) nMap[n.question_id] = n.note;
      setNotesMap(nMap);
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

  const handleNoteChange = useCallback(async (questionId: string, note: string) => {
    setNotesMap((prev) => ({ ...prev, [questionId]: note }));
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, note }),
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
        note={notesMap[question.id] ?? ''}
        onNoteChange={handleNoteChange}
        onNext={handleNext}
        onPrev={index > 0 ? () => setIndex((i) => i - 1) : undefined}
      />
    );
  }

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (filter === 'all') return true;
    if (filter === 'bookmarked') return bookmarks.has(q.id);
    return getTileState(statsMap[q.id]) === filter;
  });

  const practiced = questions.filter((q) => (statsMap[q.id]?.times_practiced ?? 0) > 0).length;
  const mastered = questions.filter((q) => getTileState(statsMap[q.id]) === 'correct').length;

  return (
    <div className="flex flex-col flex-1 min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--foreground)' }}>
      <Navbar />
      <main className="max-w-3xl mx-auto w-full px-4 py-10 space-y-6">
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
            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{mastered}</span> mastered
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(({ key, label }) => {
            const count = key === 'all'
              ? questions.length
              : key === 'bookmarked'
              ? questions.filter((q) => bookmarks.has(q.id)).length
              : questions.filter((q) => getTileState(statsMap[q.id]) === key).length;
            const active = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: active ? 'var(--accent)' : 'var(--bg-card)',
                  color: active ? 'var(--accent-fg)' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
                }}
              >
                {label} <span style={{ opacity: 0.7 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Question list */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          {filteredQuestions.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              No questions match this filter.
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const state = getTileState(statsMap[q.id]);
              const sc = STATUS_COLORS[state];
              const hasNote = !!(notesMap[q.id]?.trim());
              const isBookmarked = bookmarks.has(q.id);
              const originalIndex = questions.indexOf(q);
              return (
                <button
                  key={q.id}
                  onClick={() => startFrom(originalIndex)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors hover:opacity-80"
                  style={{
                    background: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {/* Question number */}
                  <span
                    className="shrink-0 text-xs font-semibold w-10 text-right"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                  >
                    Q{q.question_number ?? originalIndex + 1}
                  </span>

                  {/* Question text */}
                  <span
                    className="flex-1 text-sm truncate"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {q.question.length > 100 ? q.question.slice(0, 100) + '…' : q.question}
                  </span>

                  {/* Indicators */}
                  <div className="flex items-center gap-2 shrink-0">
                    {hasNote && (
                      <span className="text-xs" style={{ color: 'var(--accent-teal)' }} title="Has note">✎</span>
                    )}
                    {isBookmarked && (
                      <span className="text-xs" style={{ color: '#f59e0b' }} title="Bookmarked">★</span>
                    )}
                    {statsMap[q.id]?.times_practiced > 0 && (
                      <span
                        className="text-xs"
                        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                      >
                        {statsMap[q.id].times_practiced}×
                      </span>
                    )}
                    {/* Status badge */}
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        color: sc.color,
                        background: sc.bg,
                        border: `1px solid ${sc.border}`,
                        fontFamily: 'var(--font-mono)',
                        minWidth: '5rem',
                        textAlign: 'center',
                      }}
                    >
                      {STATUS_LABELS[state]}
                    </span>
                  </div>
                </button>
              );
            })
          )}
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
