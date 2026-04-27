'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { canAddLead } from '@/lib/limits'
import type { LeadStatus } from '@/types/supabase'

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

export async function getLeads() {
  const supabase = await getSupabaseServerClient()
  const workspaceId = await getWorkspaceId(supabase)

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getLead(id: string) {
  const supabase = await getSupabaseServerClient()

  const [leadResult, activitiesResult] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).single(),
    supabase
      .from('activities')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (leadResult.error) throw leadResult.error

  return {
    lead: leadResult.data,
    activities: activitiesResult.data ?? [],
  }
}

export async function createLead(data: {
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  job_title?: string | null
  status?: LeadStatus
}): Promise<{ error: string } | { id: string; [key: string]: unknown }> {
  const supabase = await getSupabaseServerClient()
  const [workspace, { data: { user } }] = await Promise.all([
    getActiveWorkspace(supabase),
    supabase.auth.getUser(),
  ])

  if (!workspace) return { error: 'Workspace não encontrado.' }

  const { allowed } = await canAddLead(supabase, workspace.id, workspace.plan)
  if (!allowed) {
    return {
      error: 'Limite de 50 leads atingido no plano Free. Faça upgrade para Pro para adicionar mais.',
    }
  }

  const workspaceId = workspace.id

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      workspace_id: workspaceId,
      owner_id: user?.id ?? null,
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      company: data.company ?? null,
      job_title: data.job_title ?? null,
      status: data.status ?? 'new',
    })
    .select()
    .single()

  if (error) throw error
  revalidatePath('/leads')
  revalidatePath('/dashboard')
  return lead
}

export async function updateLead(
  id: string,
  data: {
    name?: string
    email?: string | null
    phone?: string | null
    company?: string | null
    job_title?: string | null
    status?: LeadStatus
  }
) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from('leads')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/leads')
  revalidatePath('/dashboard')
}

export async function deleteLead(id: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error

  revalidatePath('/leads')
  revalidatePath('/dashboard')
}
