'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'

function toSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove combining diacritics (ã → a, é → e …)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 40)
  return base || 'workspace'
}

export async function createWorkspace(
  formData: FormData
): Promise<{ error: string } | undefined> {
  const name = (formData.get('workspaceName') as string | null)?.trim()

  if (!name || name.length < 2) {
    return { error: 'Nome deve ter ao menos 2 caracteres.' }
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Idempotência: se o usuário já tem workspace, vai direto ao dashboard
  const { count } = await supabase
    .from('workspace_members')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (count && count > 0) redirect('/dashboard')

  const slug = `${toSlug(name)}-${Math.random().toString(36).slice(2, 6)}`

  // create_workspace é SECURITY DEFINER — cria workspace + membro admin atomicamente
  // sem depender de INSERT direto nas tabelas (evita conflito de RLS com return=representation)
  const { error: rpcError } = await supabase.rpc('create_workspace', {
    p_name: name,
    p_slug: slug,
  })

  if (rpcError) {
    const isSlugConflict = rpcError?.code === '23505'
    return {
      error: isSlugConflict
        ? 'Erro interno ao gerar URL do workspace. Tente novamente.'
        : (rpcError?.message ?? 'Erro ao criar workspace.'),
    }
  }

  redirect('/dashboard')
}
