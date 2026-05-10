'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

const PLANS = [
  { period: 'month', label: '1 Month', price: '$9.99' },
  { period: 'quarter', label: '3 Months', price: '$24.99' },
  { period: 'year', label: '1 Year', price: '$79.99' },
];

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function handleAction(action: string, period?: string) {
    setLoading(action + (period ?? ''));
    setMessage('');
    const res = await fetch('/api/admin/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, period }),
    });
    const data = await res.json();
    setLoading(null);
    if (data.ok) {
      setMessage('Done! Refreshing…');
      setTimeout(() => router.refresh(), 800);
    } else {
      setMessage(data.error ?? 'Something went wrong.');
    }
  }

  return (
    <div className="flex flex-col flex-1" style={{ background: 'var(--bg-primary)', color: 'var(--foreground)' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto w-full px-4 py-16 space-y-10">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Plans</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Unlock exam simulation and unlimited practice.
          </p>
        </div>

        {/* Tier comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Free */}
          <div
            className="rounded-xl p-5 space-y-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div>
              <p className="font-semibold">Free Trial</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>3 days</p>
            </div>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>✓ Practice mode</li>
              <li>✓ Progress tracking</li>
              <li>✓ Bookmarks &amp; notes</li>
              <li style={{ color: 'var(--text-muted)' }}>✗ Exam simulation</li>
            </ul>
          </div>
          {/* Paid */}
          <div
            className="rounded-xl p-5 space-y-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-teal)' }}
          >
            <div>
              <p className="font-semibold" style={{ color: 'var(--accent-teal)' }}>Paid</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Monthly / Quarterly / Yearly</p>
            </div>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>✓ Everything in Free</li>
              <li>✓ Exam simulation</li>
              <li>✓ Up to 3 exams/day</li>
              <li>✓ Exam history &amp; analytics</li>
            </ul>
          </div>
        </div>

        {/* Mock upgrade buttons */}
        <div
          className="rounded-xl p-5 space-y-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">Upgrade (mock)</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Payment integration coming soon. Use these buttons to test tier access.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PLANS.map(({ period, label, price }) => (
              <button
                key={period}
                onClick={() => handleAction('upgrade', period)}
                disabled={!!loading}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              >
                {loading === 'upgrade' + period ? 'Upgrading…' : `${label} — ${price}`}
              </button>
            ))}
          </div>
        </div>

        {/* Dev tools */}
        <div
          className="rounded-xl p-5 space-y-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <p className="text-sm font-semibold">Test controls</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAction('expire_trial')}
              disabled={!!loading}
              className="px-4 py-2 rounded-lg text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              {loading === 'expire_trial' ? 'Working…' : 'Expire trial'}
            </button>
            <button
              onClick={() => handleAction('downgrade')}
              disabled={!!loading}
              className="px-4 py-2 rounded-lg text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              {loading === 'downgrade' ? 'Working…' : 'Downgrade to free'}
            </button>
            <button
              onClick={() => handleAction('reset')}
              disabled={!!loading}
              className="px-4 py-2 rounded-lg text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ border: '1px solid rgba(239,68,68,0.4)', color: 'var(--accent-red)' }}
            >
              {loading === 'reset' ? 'Working…' : 'Reset (fresh trial)'}
            </button>
          </div>
          {message && (
            <p className="text-xs" style={{ color: 'var(--accent-green)' }}>{message}</p>
          )}
        </div>

        <Link href="/dashboard" className="text-sm" style={{ color: 'var(--text-muted)' }}>
          ← Back to dashboard
        </Link>
      </main>
    </div>
  );
}
