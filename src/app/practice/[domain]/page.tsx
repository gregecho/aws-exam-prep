import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import PracticeClient from './PracticeClient';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { getSubscriptionStatus } from '@/lib/subscription';

interface Props {
  params: Promise<{ domain: string }>;
}

export default async function PracticeDomainPage({ params }: Props) {
  const { domain } = await params;
  const { userId } = await auth();
  const supabase = createServerClient();
  const status = await getSubscriptionStatus(userId!, supabase);

  if (status.access === 'expired') {
    return (
      <div className="flex flex-col flex-1" style={{ background: 'var(--bg-primary)', color: 'var(--foreground)' }}>
        <Navbar />
        <main className="max-w-xl mx-auto w-full px-4 py-16">
          <div
            className="rounded-xl p-6 space-y-4 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div className="text-2xl">🔒</div>
            <div className="space-y-1">
              <p className="font-semibold">Free trial ended</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Your 3-day trial has expired. Upgrade to continue practicing.
              </p>
            </div>
            <Link
              href="/upgrade"
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            >
              View plans →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return <PracticeClient domain={decodeURIComponent(domain)} />;
}
