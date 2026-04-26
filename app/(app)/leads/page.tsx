import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { LeadsClient } from '@/components/leads/leads-client'

export default async function LeadsPage() {
  const supabase = await getSupabaseServerClient()

  const workspace = await getActiveWorkspace(supabase)
  if (!workspace) redirect('/onboarding')

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: false })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? ''
  const userName = fullName || user?.email?.split('@')[0] || 'Usuário'

  return <LeadsClient initialLeads={leads ?? []} userName={userName} />
}
