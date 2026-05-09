'use client';

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn } = useUser();

  return (
    <main className="flex flex-col flex-1 items-center justify-center px-4 py-24 text-center">
      <div className="max-w-2xl space-y-6">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-sky-400">
          AWS SAA-C03
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Ace the Solutions Architect Associate exam
        </h1>
        <p className="text-lg text-zinc-400">
          Practice with realistic questions, track your progress by domain, and simulate the real exam experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition-colors"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-up"
                className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition-colors"
              >
                Get started free
              </Link>
              <Link
                href="/sign-in"
                className="rounded-lg border border-[#2a2a4a] px-6 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 text-left">
          {[
            { label: 'Domains', value: '4' },
            { label: 'Questions', value: '65' },
            { label: 'Exam time', value: '130 min' },
            { label: 'Passing score', value: '72%' },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-4">
              <p className="text-2xl font-bold text-white">{item.value}</p>
              <p className="text-sm text-zinc-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
