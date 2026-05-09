'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/practice', label: 'Practice' },
  { href: '/exam', label: 'Exam' },
  { href: '/bookmarks', label: 'Bookmarks' },
];

export default function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  return (
    <nav style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{
              background: 'var(--highlight)',
              color: '#000',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em',
            }}
          >
            AWS
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            SAA-C03
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {isSignedIn ? (
            <>
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    className="px-3 py-1.5 rounded-md text-sm transition-colors"
                    style={{
                      color: active ? 'var(--foreground)' : 'var(--text-secondary)',
                      background: active ? 'var(--border)' : 'transparent',
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
              <div className="ml-2">
                <UserButton />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-3 py-1.5 rounded-md text-sm transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="ml-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
