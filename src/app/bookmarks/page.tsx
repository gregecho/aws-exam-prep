import Navbar from '@/components/layout/Navbar';
import { createServerClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import BookmarksClient from './BookmarksClient';
import { Question } from '@/types';

export default async function BookmarksPage() {
  const { userId } = await auth();
  const supabase = createServerClient();

  const { data } = await supabase
    .from('user_bookmarks')
    .select('question_id, questions(*)')
    .eq('user_id', userId!)
    .order('created_at', { ascending: false });

  const questions = (data ?? []).map((b) => b.questions as unknown as Question).filter(Boolean);

  return (
    <div className="flex flex-col flex-1">
      <Navbar />
      <main className="max-w-3xl mx-auto w-full px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Bookmarks</h1>
          <p className="text-zinc-500 mt-1">{questions.length} bookmarked question{questions.length !== 1 ? 's' : ''}</p>
        </div>
        {questions.length === 0 ? (
          <p className="text-zinc-500">No bookmarks yet. Bookmark questions while practicing to review them here.</p>
        ) : (
          <BookmarksClient initialQuestions={questions} />
        )}
      </main>
    </div>
  );
}
