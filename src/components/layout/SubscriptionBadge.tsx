'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SubscriptionStatus } from '@/types';

export default function SubscriptionBadge() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    fetch('/api/subscription/status')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => data && setStatus(data))
      .catch(() => {});
  }, []);

  if (!status) return null;

  if (status.access === 'trial') {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
        style={{
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid rgba(245,158,11,0.3)',
          color: 'var(--highlight)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.02em',
        }}
      >
        Trial · {status.daysLeft}d
      </span>
    );
  }

  if (status.access === 'paid') {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
        style={{
          background: 'rgba(14,165,233,0.1)',
          border: '1px solid rgba(14,165,233,0.35)',
          color: 'var(--accent-teal)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.02em',
          boxShadow: '0 0 8px rgba(14,165,233,0.15)',
        }}
      >
        Pro
      </span>
    );
  }

  // expired
  return (
    <Link
      href="/upgrade"
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
      style={{
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: 'var(--accent-red)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.02em',
      }}
    >
      Expired
    </Link>
  );
}
