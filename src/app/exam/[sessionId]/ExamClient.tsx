'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import QuestionCard from '@/components/questions/QuestionCard';
import ExamTimer from '@/components/exam/ExamTimer';
import QuestionNavigator from '@/components/exam/QuestionNavigator';
import { Question } from '@/types';
import { EXAM_DURATION_MINUTES } from '@/constants/domains';

interface ExamClientProps {
  sessionId: string;
}

export default function ExamClient({ sessionId }: ExamClientProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const ids: string[] = JSON.parse(sessionStorage.getItem(`exam_${sessionId}`) ?? '[]');
    if (!ids.length) { router.replace('/exam'); return; }
    setQuestionIds(ids);

    const params = ids.map((id) => `id=eq.${id}`).join('&');
    fetch(`/api/questions?${params}&limit=${ids.length}`)
      .then((r) => r.json())
      .then((d) => {
        const qMap: Record<string, Question> = {};
        for (const q of d.questions ?? []) qMap[q.id] = q;
        setQuestions(ids.map((id) => qMap[id]).filter(Boolean));
        setLoading(false);
      });
  }, [sessionId, router]);

  const handleAnswer = useCallback((questionId: string, selected: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selected }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    const res = await fetch('/api/exam/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, answers }),
    });
    if (res.ok) {
      sessionStorage.removeItem(`exam_${sessionId}`);
      router.push(`/exam/results/${sessionId}`);
    } else {
      setSubmitting(false);
    }
  }, [submitting, sessionId, answers, router]);

  if (loading) return (
    <div className="flex flex-1 items-center justify-center" style={{ color: 'var(--text-muted)' }}>
      Loading exam…
    </div>
  );

  const question = questions[index];

  return (
    <div className="flex flex-col flex-1" style={{ background: 'var(--bg-primary)', color: 'var(--foreground)' }}>
      <Navbar />
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {index + 1} / {questions.length}
          </span>
          <ExamTimer durationMinutes={EXAM_DURATION_MINUTES} onExpire={handleSubmit} />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 max-w-5xl mx-auto w-full px-4 py-6 gap-6">
        <main className="flex-1 space-y-4">
          {question && (
            <QuestionCard
              key={question.id}
              question={question}
              mode="exam"
              selectedAnswer={answers[question.id]}
              onAnswer={handleAnswer}
              questionNumber={index + 1}
              totalQuestions={questions.length}
            />
          )}
          <div className="flex justify-between">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-30"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              ← Previous
            </button>
            <button
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
              disabled={index === questions.length - 1}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-30"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              Next →
            </button>
          </div>
        </main>

        <aside className="w-44 shrink-0 hidden lg:block">
          <QuestionNavigator
            total={questions.length}
            current={index}
            answers={answers}
            questionIds={questionIds}
            onNavigate={setIndex}
          />
        </aside>
      </div>
    </div>
  );
}
