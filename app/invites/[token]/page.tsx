import { redirect } from 'next/navigation'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { AcceptInviteButton } from './accept-button'

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params
  const supabase = await getSupabaseServerClient()

  // Carrega dados do convite via função pública (SECURITY DEFINER)
  const { data: rows, error } = await supabase.rpc('get_workspace_invite', { p_token: token })
  const invite = rows?.[0] ?? null

  // Token inválido
  if (error || !invite) {
    return (
      <InviteLayout>
        <div className="flex flex-col items-center gap-3 text-center">
          <XCircle className="size-12 text-destructive" />
          <h1 className="text-xl font-semibold">Convite não encontrado</h1>
          <p className="text-sm text-muted-foreground">
            Este link é inválido ou já foi utilizado.
          </p>
          <a href="/login" className="text-sm text-brand-500 hover:underline">
            Ir para o login
          </a>
        </div>
      </InviteLayout>
    )
  }

  const now = new Date()
  const expired = new Date(invite.expires_at) < now
  const accepted = invite.accepted_at !== null

  if (expired || accepted) {
    return (
      <InviteLayout>
        <div className="flex flex-col items-center gap-3 text-center">
          {accepted ? (
            <CheckCircle2 className="size-12 text-green-500" />
          ) : (
            <Clock className="size-12 text-amber-500" />
          )}
          <h1 className="text-xl font-semibold">
            {accepted ? 'Convite já aceito' : 'Convite expirado'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {accepted
              ? 'Este convite já foi utilizado. Faça login para acessar o workspace.'
              : 'Este convite expirou. Peça ao administrador para reenviar o convite.'}
          </p>
          <a href="/login" className="text-sm text-brand-500 hover:underline">
            Ir para o login
          </a>
        </div>
      </InviteLayout>
    )
  }

  // Verifica sessão do usuário
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/invites/${token}`)
  }

  const roleLabel = invite.role === 'admin' ? 'Admin' : 'Membro'

  return (
    <InviteLayout>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-600/10 text-2xl font-bold text-brand-600">
          {invite.workspace_name[0]?.toUpperCase() ?? 'W'}
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">
            Você foi convidado para{' '}
            <span className="text-brand-600">{invite.workspace_name}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Você entrará como <strong>{roleLabel}</strong>.
          </p>
        </div>

        <AcceptInviteButton token={token} userEmail={user.email ?? ''} />

        <p className="text-xs text-muted-foreground">
          Logado como <strong>{user.email}</strong>.{' '}
          <a href="/login" className="hover:underline">
            Trocar conta
          </a>
        </p>
      </div>
    </InviteLayout>
  )
}

function InviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 text-center">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-brand-400">Pipe</span>
            <span className="text-foreground">Flow</span>
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
