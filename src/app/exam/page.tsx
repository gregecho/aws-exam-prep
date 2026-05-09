import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { EXAM_QUESTION_COUNT, EXAM_DURATION_MINUTES } from '@/constants/domains';

const DETAILS = [
  { label: 'Questions', value: String(EXAM_QUESTION_COUNT) },
  { label: 'Time limit', value: `${EXAM_DURATION_MINUTES} min` },
  { label: 'Passing score', value: '72%' },
  { label: 'Format', value: 'Multiple choice' },
];

export default function ExamStartPage() {
  return (
    <div className="flex flex-col flex-1" style={{ background: 'var(--bg-primary)', color: 'var(--foreground)' }}>
      <Navbar />
      <main className="max-w-xl mx-auto w-full px-4 py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Exam Simulation</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Simulate the real AWS SAA-C03 exam experience.
          </p>
        </div>

        <div
          className="grid grid-cols-2 rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          {DETAILS.map((item, i) => (
            <div
              key={item.label}
              className="p-5"
              style={{
                background: 'var(--bg-card)',
                borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
              }}
            >
              <p
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--foreground)' }}
              >
                {item.value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-4 text-sm space-y-2"
          style={{
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <p className="font-medium" style={{ color: 'var(--highlight)' }}>Before you begin</p>
          <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <li>· Timer starts immediately when you click Start</li>
            <li>· Navigate between questions freely</li>
            <li>· Answers are not revealed until you submit</li>
            <li>· Exam auto-submits when time expires</li>
          </ul>
        </div>

        <Link
          href="/exam/new"
          className="block w-full text-center rounded-xl py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
        >
          Start exam
        </Link>
      </main>
    </div>
  );
}
