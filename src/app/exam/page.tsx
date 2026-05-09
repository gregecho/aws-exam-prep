import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { EXAM_QUESTION_COUNT, EXAM_DURATION_MINUTES } from '@/constants/domains';

export default function ExamStartPage() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="max-w-2xl mx-auto w-full px-4 py-16 space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Exam Simulation</h1>
          <p className="text-zinc-500">Simulate the real AWS SAA-C03 exam experience.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
          {[
            { label: 'Questions', value: String(EXAM_QUESTION_COUNT) },
            { label: 'Time limit', value: `${EXAM_DURATION_MINUTES} minutes` },
            { label: 'Passing score', value: '72%' },
            { label: 'Question type', value: 'Multiple choice' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{item.value}</p>
              <p className="text-sm text-zinc-500">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 p-4 text-sm text-amber-800 dark:text-amber-200 text-left space-y-1">
          <p className="font-semibold">Before you begin:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>The timer starts immediately when you click Start.</li>
            <li>You can navigate between questions freely.</li>
            <li>Answers are not revealed until you submit.</li>
            <li>The exam auto-submits when time expires.</li>
          </ul>
        </div>

        <Link
          href="/exam/new"
          className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Start exam
        </Link>
      </main>
    </div>
  );
}
