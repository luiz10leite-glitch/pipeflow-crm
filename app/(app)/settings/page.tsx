import { redirect } from 'next/navigation'
import { Users, Building2, CreditCard } from 'lucide-react'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WorkspaceForm } from '@/components/settings/workspace-form'
import { MembersTable, type MemberRow, type InviteRow } from '@/components/settings/members-table'
import { InviteDialog } from '@/components/settings/invite-dialog'
import { BillingCard } from '@/components/settings/billing-card'
import type { MemberRole } from '@/types/supabase'

export default async function SettingsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getActiveWorkspace(supabase)
  if (!workspace) redirect('/onboarding')

  // Membros do workspace (com dados de profile)
  const { data: rawMembers } = await supabase
    .from('workspace_members')
    .select('id, user_id, role')
    .eq('workspace_id', workspace.id)

  const memberUserIds = (rawMembers ?? []).map((m) => m.user_id)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('id', memberUserIds.length > 0 ? memberUserIds : ['00000000-0000-0000-0000-000000000000'])

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  const members: MemberRow[] = (rawMembers ?? []).map((m) => {
    const profile = profileMap.get(m.user_id)
    return {
      id: m.id,
      userId: m.user_id,
      name: profile?.full_name || profile?.email?.split('@')[0] || 'Usuário',
      email: profile?.email ?? '—',
      role: m.role as MemberRole,
      isCurrentUser: m.user_id === user.id,
    }
  })

  // Convites pendentes
  const { data: rawInvites } = await supabase
    .from('workspace_invites')
    .select('id, email, role, expires_at, accepted_at')
    .eq('workspace_id', workspace.id)
    .order('created_at', { ascending: false })

  const invites: InviteRow[] = (rawInvites ?? []).map((i) => ({
    id: i.id,
    email: i.email,
    role: i.role as MemberRole,
    expiresAt: i.expires_at,
    accepted: i.accepted_at !== null,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Configurações</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie seu workspace, membros e assinatura.
        </p>
      </div>

      <Tabs defaultValue="workspace">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="workspace" className="gap-2">
            <Building2 className="size-4" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="size-4" />
            Membros
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {members.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="size-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* TAB: Workspace */}
        <TabsContent value="workspace" className="mt-6 max-w-xl">
          <WorkspaceForm name={workspace.name} slug={workspace.slug} />
        </TabsContent>

        {/* TAB: Membros */}
        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">Membros do workspace</CardTitle>
                {workspace.plan === 'free' && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Plano Free: {members.length}/2 membros
                  </p>
                )}
              </div>
              <InviteDialog
                isFree={workspace.plan === 'free'}
                memberCount={members.length}
              />
            </CardHeader>
            <CardContent className="pt-2">
              <MembersTable
                members={members}
                invites={invites}
                isFree={workspace.plan === 'free'}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Billing */}
        <TabsContent value="billing" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold">Plano e cobrança</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie seu plano e dados de pagamento.
              </p>
            </div>
            <BillingCard plan={workspace.plan} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
