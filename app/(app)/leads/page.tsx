import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { FREE_LEAD_LIMIT } from '@/lib/limits'
import { LeadsClient } from '@/components/leads/leads-client'

export default async function LeadsPage() {
  const supabase = await getSupabaseServerClient()

  const workspace = await getActiveWorkspace(supabase)
  if (!workspace) redirect('/onboarding')

  const [leadsResult, userResult] = await Promise.all([
    supabase
      .from('leads')
      .select('*')
      .eq('workspace_id', workspace.id)
      .order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  const leads = leadsResult.data ?? []
  const user = userResult.data.user

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? ''
  const userName = fullName || user?.email?.split('@')[0] || 'Usuário'

  return (
    <LeadsClient
      initialLeads={leads}
      userName={userName}
      plan={workspace.plan}
      leadLimit={FREE_LEAD_LIMIT}
    />
  )
}
