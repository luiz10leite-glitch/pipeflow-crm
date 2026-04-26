import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export async function getActiveWorkspace(
  supabase: SupabaseClient<Database>
): Promise<{ id: string; name: string; slug: string; plan: 'free' | 'pro' } | null> {
  const cookieStore = await cookies()
  const savedId = cookieStore.get('active-workspace')?.value

  if (savedId) {
    const { data } = await supabase
      .from('workspaces')
      .select('id, name, slug, plan')
      .eq('id', savedId)
      .single()
    if (data) return data as { id: string; name: string; slug: string; plan: 'free' | 'pro' }
  }

  const { data } = await supabase
    .from('workspaces')
    .select('id, name, slug, plan')
    .order('created_at')
    .limit(1)
    .single()

  return data
    ? (data as { id: string; name: string; slug: string; plan: 'free' | 'pro' })
    : null
}

export async function getActiveWorkspaceId(workspaceIds: string[]): Promise<string> {
  if (workspaceIds.length === 0) return ''
  const cookieStore = await cookies()
  const saved = cookieStore.get('active-workspace')?.value
  return saved && workspaceIds.includes(saved) ? saved : workspaceIds[0]
}
