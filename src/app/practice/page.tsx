import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { DOMAINS } from "@/constants/domains";

export default function PracticePage() {
  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="max-w-4xl mx-auto w-full px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Practice</h1>
          <p className="text-zinc-500 mt-1">Choose a domain to practice. You'll get immediate feedback after each answer.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {DOMAINS.map((domain) => (
            <Link
              key={domain}
              href={`/practice/${encodeURIComponent(domain)}`}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-blue-400 hover:shadow-sm transition-all space-y-2"
            >
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">{domain}</h2>
              <p className="text-sm text-zinc-500">Practice questions for this domain</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
