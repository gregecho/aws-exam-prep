'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewExamPage() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/exam/start', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => {
        if (d.sessionId) {
          sessionStorage.setItem(`exam_${d.sessionId}`, JSON.stringify(d.questionIds));
          router.replace(`/exam/${d.sessionId}`);
        }
      });
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center text-zinc-500">
      Starting exam…
    </div>
  );
}
