import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('user_notes')
    .select('question_id, note')
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ notes: data ?? [] });
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { questionId, note } = await request.json();
  if (!questionId) return NextResponse.json({ error: 'questionId required' }, { status: 400 });

  const supabase = createServerClient();
  const { error } = await supabase
    .from('user_notes')
    .upsert(
      { user_id: userId, question_id: questionId, note: note ?? '', updated_at: new Date().toISOString() },
      { onConflict: 'user_id,question_id' }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { questionId } = await request.json();
  if (!questionId) return NextResponse.json({ error: 'questionId required' }, { status: 400 });

  const supabase = createServerClient();
  const { error } = await supabase
    .from('user_notes')
    .delete()
    .eq('user_id', userId)
    .eq('question_id', questionId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
