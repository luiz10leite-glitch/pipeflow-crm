import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { KanbanBoard } from '@/components/pipeline/kanban-board'
import type { DealWithLead } from '@/types/pipeline'

export default async function PipelinePage() {
  const supabase = await getSupabaseServerClient()

  const workspace = await getActiveWorkspace(supabase)
  if (!workspace) redirect('/onboarding')

  const [dealsResult, leadsResult, { data: { user } }] = await Promise.all([
    supabase
      .from('deals')
      .select('*, lead:leads(id, name, company)')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('leads')
      .select('id, name, company, job_title')
      .eq('workspace_id', workspace.id)
      .order('name'),
    supabase.auth.getUser(),
  ])

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? ''
  const userName = fullName || user?.email?.split('@')[0] || 'Usuário'

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Pipeline</h2>
        <p className="text-sm text-muted-foreground">
          Arraste os deals entre os estágios para atualizar o pipeline.
        </p>
      </div>
      <KanbanBoard
        initialDeals={(dealsResult.data ?? []) as unknown as DealWithLead[]}
        leads={leadsResult.data ?? []}
        userName={userName}
      />
    </div>
  )
}
