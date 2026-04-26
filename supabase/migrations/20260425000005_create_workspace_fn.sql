-- =============================================================================
-- Migration 005 — create_workspace RPC + workspace_members policy fix
--
-- Problema: a policy "workspace_members: admins can insert" permitia que qualquer
-- usuário autenticado se inserisse em qualquer workspace via `user_id = auth.uid()`.
-- Isso abre um vetor em que Bob se adiciona ao workspace da Alice.
--
-- Solução:
-- 1. Criar função create_workspace (SECURITY DEFINER) que encapsula a criação
--    atômica de workspace + membro admin, sem precisar de INSERT direto nas tabelas.
-- 2. Restringir workspace_members INSERT a admins do workspace (sem self-insert geral).
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1. Função create_workspace — usada pelo onboarding
-- ----------------------------------------------------------------------------

create or replace function public.create_workspace(p_name text, p_slug text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  v_id := gen_random_uuid();

  insert into public.workspaces (id, name, slug, plan, onboarding_completed_at)
  values (v_id, p_name, p_slug, 'free', now());

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_id, auth.uid(), 'admin');

  return v_id;
end;
$$;

-- Qualquer usuário autenticado pode chamar a função (RLS da tabela não se aplica
-- pois a função roda como SECURITY DEFINER / postgres).
grant execute on function public.create_workspace(text, text) to authenticated;

-- ----------------------------------------------------------------------------
-- 2. Corrigir policy de INSERT em workspace_members
--    Antes: admins OU self-insert (= qualquer user se adiciona a qualquer ws)
--    Depois: somente admins do workspace podem adicionar membros
-- ----------------------------------------------------------------------------

drop policy if exists "workspace_members: admins can insert" on public.workspace_members;

create policy "workspace_members: admins can insert"
  on public.workspace_members
  for insert
  with check (public.is_workspace_admin(workspace_id));
