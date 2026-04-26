import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/app-shell'
import type { WorkspaceInfo } from '@/components/workspace/workspace-switcher'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, name, slug, plan')
    .order('created_at')

  const typedWorkspaces = (workspaces ?? []) as WorkspaceInfo[]

  if (typedWorkspaces.length === 0) redirect('/onboarding')

  const fullName = (user.user_metadata?.full_name as string | undefined) ?? ''
  const displayName = fullName || (user.email?.split('@')[0] ?? 'Usuário')
  const initials = fullName
    ? fullName
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : (user.email?.[0] ?? 'U').toUpperCase()

  return (
    <AppShell
      user={{ name: displayName, email: user.email ?? '', initials }}
      workspaces={typedWorkspaces}
    >
      {children}
    </AppShell>
  )
}
