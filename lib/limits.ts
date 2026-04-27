import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export const FREE_LEAD_LIMIT = 50
export const FREE_MEMBER_LIMIT = 2

type Client = SupabaseClient<Database>

export async function canAddLead(
  supabase: Client,
  workspaceId: string,
  plan: 'free' | 'pro'
): Promise<{ allowed: boolean; count: number }> {
  if (plan === 'pro') return { allowed: true, count: 0 }

  const { count } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  const current = count ?? 0
  return { allowed: current < FREE_LEAD_LIMIT, count: current }
}

export async function canAddMember(
  supabase: Client,
  workspaceId: string,
  plan: 'free' | 'pro'
): Promise<{ allowed: boolean; count: number }> {
  if (plan === 'pro') return { allowed: true, count: 0 }

  const { count } = await supabase
    .from('workspace_members')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  const current = count ?? 0
  return { allowed: current < FREE_MEMBER_LIMIT, count: current }
}
