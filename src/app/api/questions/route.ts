import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);

  const supabase = createServerClient();
  let query = supabase.from('questions').select('*').limit(limit);
  if (domain) query = query.eq('domain', domain);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ questions: data });
}
