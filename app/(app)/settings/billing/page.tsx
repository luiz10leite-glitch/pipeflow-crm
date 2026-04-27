import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { BillingCard } from '@/components/settings/billing-card'

export default async function BillingPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace(supabase)
  if (!workspace) redirect('/onboarding')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Plano e cobrança</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie seu plano e dados de pagamento.
        </p>
      </div>

      <BillingCard plan={workspace.plan} />
    </div>
  )
}
