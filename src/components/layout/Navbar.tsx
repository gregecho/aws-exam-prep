'use client';

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b border-[#2a2a4a] bg-[#1a1a2e]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-white">
          AWS SAA-C03
        </Link>
        <div className="flex items-center gap-6 text-sm">
          {isSignedIn ? (
            <>
              <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/practice" className="text-zinc-400 hover:text-white transition-colors">
                Practice
              </Link>
              <Link href="/exam" className="text-zinc-400 hover:text-white transition-colors">
                Exam
              </Link>
              <Link href="/bookmarks" className="text-zinc-400 hover:text-white transition-colors">
                Bookmarks
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-zinc-400 hover:text-white transition-colors">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-md bg-sky-500 px-3 py-1.5 text-white hover:bg-sky-400 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
