'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { DealStage } from '@/types/supabase'
import type { DealWithLead } from '@/types/pipeline'

type Client = Awaited<ReturnType<typeof getSupabaseServerClient>>

async function getWorkspaceId(supabase: Client): Promise<string> {
  const { data, error } = await supabase
    .from('workspaces')
    .select('id')
    .limit(1)
    .single()
  if (error || !data) throw new Error('Workspace não encontrado')
  return data.id
}

export async function getDeals(): Promise<DealWithLead[]> {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getWorkspaceId(supabase)

  const { data, error } = await supabase
    .from('deals')
    .select('*, lead:leads(id, name, company)')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as DealWithLead[]
}

export async function createDeal(data: {
  title: string
  value?: number
  stage?: DealStage
  lead_id?: string | null
  due_date?: string | null
}): Promise<DealWithLead> {
  const supabase = await getSupabaseServerClient()
  const [workspaceId, { data: { user } }] = await Promise.all([
    getWorkspaceId(supabase),
    supabase.auth.getUser(),
  ])

  const { data: deal, error } = await supabase
    .from('deals')
    .insert({
      workspace_id: workspaceId,
      owner_id: user?.id ?? null,
      title: data.title,
      value: data.value ?? 0,
      stage: data.stage ?? 'lead',
      lead_id: data.lead_id ?? null,
      due_date: data.due_date ?? null,
    })
    .select('*, lead:leads(id, name, company)')
    .single()

  if (error) throw error
  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return deal as unknown as DealWithLead
}

export async function updateDeal(
  id: string,
  data: {
    title?: string
    value?: number
    stage?: DealStage
    lead_id?: string | null
    due_date?: string | null
  }
) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from('deals')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
}

export async function deleteDeal(id: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from('deals').delete().eq('id', id)
  if (error) throw error

  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
}
