'use client';

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/layout/Navbar";

const STATS = [
  { label: 'Domains', value: '4' },
  { label: 'Questions', value: '65+' },
  { label: 'Exam time', value: '130m' },
  { label: 'Pass score', value: '72%' },
];

const DOMAINS = [
  { short: 'SEC', label: 'Secure Architectures', weight: '30%' },
  { short: 'RES', label: 'Resilient Architectures', weight: '26%' },
  { short: 'PER', label: 'High-Performing Architectures', weight: '24%' },
  { short: 'COST', label: 'Cost-Optimized Architectures', weight: '20%' },
];

export default function HomePage() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col flex-1" style={{ background: 'var(--bg-primary)', color: 'var(--foreground)' }}>
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl space-y-10">
          {/* Hero */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold px-2 py-1 rounded"
                style={{ background: 'var(--highlight)', color: '#000', fontFamily: 'var(--font-mono)' }}
              >
                SAA-C03
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Solutions Architect Associate
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              Pass the AWS exam.<br />
              <span style={{ color: 'var(--highlight)' }}>No fluff.</span>
            </h1>
            <p className="text-base leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              Targeted practice by domain, per-question accuracy tracking, and a full timed exam simulation.
            </p>
            <div className="flex gap-3 pt-1">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                >
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                    style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                  >
                    Start for free
                  </Link>
                  <Link
                    href="/sign-in"
                    className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-4 rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="p-4 text-center"
                style={{ borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <p
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--foreground)' }}
                >
                  {s.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Domain breakdown */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Exam domains
            </p>
            <div className="space-y-1.5">
              {DOMAINS.map((d) => (
                <div
                  key={d.short}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                >
                  <span
                    className="text-xs font-semibold w-10 shrink-0"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--highlight)' }}
                  >
                    {d.short}
                  </span>
                  <span className="flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
                  <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {d.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
