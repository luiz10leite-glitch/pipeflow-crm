'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { canAddMember } from '@/lib/limits'
import { resend, buildInviteEmailHtml } from '@/lib/resend'

// ---------------------------------------------------------------------------
// Workspace switcher — persiste a seleção em cookie httpOnly
// ---------------------------------------------------------------------------
export async function setActiveWorkspace(workspaceId: string) {
  const cookieStore = await cookies()
  cookieStore.set('active-workspace', workspaceId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: 'lax',
  })
}

// ---------------------------------------------------------------------------
// Update workspace name / slug
// ---------------------------------------------------------------------------
export async function updateWorkspace(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = ((formData.get('name') as string) ?? '').trim()
  const slug = ((formData.get('slug') as string) ?? '').trim()

  if (name.length < 2) return { error: 'Nome deve ter ao menos 2 caracteres.' }
  if (!/^[a-z0-9-]+$/.test(slug))
    return { error: 'Slug inválido: use apenas letras minúsculas, números e hífens.' }

  const workspace = await getActiveWorkspace(supabase)
  if (!workspace) return { error: 'Workspace não encontrado.' }

  const { error } = await supabase
    .from('workspaces')
    .update({ name, slug })
    .eq('id', workspace.id)

  if (error) return { error: error.message }

  revalidatePath('/settings')
  return { success: true }
}

// ---------------------------------------------------------------------------
// Invite member — respeita limite Free (máx 2 membros)
// ---------------------------------------------------------------------------
export async function inviteMember(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const email = ((formData.get('email') as string) ?? '').trim().toLowerCase()
  const role = ((formData.get('role') as string) ?? 'member') as 'admin' | 'member'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: 'E-mail inválido.' }

  const workspace = await getActiveWorkspace(supabase)
  if (!workspace) return { error: 'Workspace não encontrado.' }

  const workspaceId = workspace.id

  const { allowed } = await canAddMember(supabase, workspaceId, workspace.plan)
  if (!allowed) {
    return {
      error: 'Plano Free permite no máximo 2 membros. Faça upgrade para Pro para adicionar mais.',
    }
  }

  // Verifica se o e-mail já é membro
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (profile) {
    const { data: alreadyMember } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('user_id', profile.id)
      .maybeSingle()
    if (alreadyMember) return { error: 'Esse usuário já é membro do workspace.' }
  }

  // Gera token explícito para idempotência no upsert
  const newToken = [crypto.randomUUID(), crypto.randomUUID()].join('').replace(/-/g, '')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: invite, error: inviteError } = await supabase
    .from('workspace_invites')
    .upsert(
      {
        workspace_id: workspaceId,
        email,
        role,
        invited_by: user.id,
        token: newToken,
        expires_at: expiresAt,
        accepted_at: null,
      },
      { onConflict: 'workspace_id,email' }
    )
    .select('token')
    .single()

  if (inviteError) return { error: inviteError.message }

  // Envia e-mail via Resend
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invites/${invite.token}`
  const inviterName =
    (user.user_metadata?.full_name as string | undefined) || user.email || 'Alguém'

  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    to: email,
    subject: `${inviterName} convidou você para ${workspace.name}`,
    html: buildInviteEmailHtml({ workspaceName: workspace.name, inviterName, inviteUrl }),
  })

  if (emailError) {
    return { error: `Convite criado, mas falha ao enviar e-mail: ${emailError.message}` }
  }

  revalidatePath('/settings')
  return { success: true }
}

// ---------------------------------------------------------------------------
// Resend invite — regenera token e reenvia e-mail
// ---------------------------------------------------------------------------
export async function resendInvite(
  inviteId: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const newToken = [crypto.randomUUID(), crypto.randomUUID()].join('').replace(/-/g, '')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: invite, error } = await supabase
    .from('workspace_invites')
    .update({ token: newToken, expires_at: expiresAt, accepted_at: null })
    .eq('id', inviteId)
    .select('token, email, workspace_id')
    .single()

  if (error) return { error: error.message }

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('name')
    .eq('id', invite.workspace_id)
    .single()

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invites/${invite.token}`
  const inviterName =
    (user.user_metadata?.full_name as string | undefined) || user.email || 'Alguém'

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    to: invite.email,
    subject: `${inviterName} convidou você para ${workspace?.name ?? 'PipeFlow'}`,
    html: buildInviteEmailHtml({
      workspaceName: workspace?.name ?? 'PipeFlow',
      inviterName,
      inviteUrl,
    }),
  })

  revalidatePath('/settings')
  return { success: true }
}

// ---------------------------------------------------------------------------
// Revoke invite
// ---------------------------------------------------------------------------
export async function revokeInvite(inviteId: string): Promise<{ error?: string }> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('workspace_invites').delete().eq('id', inviteId)

  if (error) return { error: error.message }
  revalidatePath('/settings')
  return {}
}

// ---------------------------------------------------------------------------
// Remove member
// ---------------------------------------------------------------------------
export async function removeMember(memberId: string): Promise<{ error?: string }> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('workspace_members')
    .select('user_id')
    .eq('id', memberId)
    .single()

  if (!member) return { error: 'Membro não encontrado.' }
  if (member.user_id === user.id) return { error: 'Você não pode remover a si mesmo.' }

  const { error } = await supabase.from('workspace_members').delete().eq('id', memberId)

  if (error) return { error: error.message }
  revalidatePath('/settings')
  return {}
}

// ---------------------------------------------------------------------------
// Update member role
// ---------------------------------------------------------------------------
export async function updateMemberRole(
  memberId: string,
  role: 'admin' | 'member'
): Promise<{ error?: string }> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('workspace_members')
    .select('user_id')
    .eq('id', memberId)
    .single()

  if (member?.user_id === user.id)
    return { error: 'Você não pode alterar seu próprio papel.' }

  const { error } = await supabase
    .from('workspace_members')
    .update({ role })
    .eq('id', memberId)

  if (error) return { error: error.message }
  revalidatePath('/settings')
  return {}
}

// ---------------------------------------------------------------------------
// Accept workspace invite (chamada pela página /invites/[token])
// ---------------------------------------------------------------------------
export async function acceptInvite(token: string): Promise<{ error?: string; workspaceId?: string }> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/invites/${token}`)

  const { data, error } = await supabase.rpc('accept_workspace_invite', { p_token: token })

  if (error) return { error: error.message }

  // Troca para o workspace recém-aceito
  if (data) {
    const cookieStore = await cookies()
    cookieStore.set('active-workspace', data as string, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
    })
  }

  return { workspaceId: data as string }
}
