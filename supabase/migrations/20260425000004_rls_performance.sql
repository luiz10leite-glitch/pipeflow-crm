-- =============================================================================
-- Migration 004 — RLS Performance & Security Hardening
--
-- Aplica três best practices do guia Supabase Postgres:
--
-- 1. (select auth.uid()) nos helpers → PostgreSQL avalia auth.uid() uma
--    única vez por query e reutiliza o resultado em todas as linhas,
--    eliminando chamadas repetidas por row (100x mais rápido em tabelas grandes).
--
-- 2. set search_path = '' nas funções security definer → impede que um
--    atacante redirecione chamadas via search_path injection.
--
-- 3. force row level security → garante que até o dono da tabela (role
--    postgres / supabase_admin) seja sujeito às policies. Defesa em
--    profundidade para evitar bypass acidental.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1. Recriar helpers com (select auth.uid()) + search_path seguro
-- ----------------------------------------------------------------------------

create or replace function public.is_workspace_member(p_workspace_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from   public.workspace_members wm
    where  wm.workspace_id = p_workspace_id
      and  wm.user_id      = (select auth.uid())
  )
$$;

create or replace function public.is_workspace_admin(p_workspace_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from   public.workspace_members wm
    where  wm.workspace_id = p_workspace_id
      and  wm.user_id      = (select auth.uid())
      and  wm.role         = 'admin'
  )
$$;

-- ----------------------------------------------------------------------------
-- 2. Force RLS em todas as tabelas (dono da tabela também fica sujeito)
-- ----------------------------------------------------------------------------

alter table public.workspaces        force row level security;
alter table public.workspace_members force row level security;
alter table public.leads             force row level security;
alter table public.deals             force row level security;
alter table public.activities        force row level security;
alter table public.invites           force row level security;

-- ----------------------------------------------------------------------------
-- 3. Índice parcial para lookup rápido "usuário é admin de workspace X?"
--    Queries das policies is_workspace_admin usam workspace_id + user_id + role.
--    O índice composto da migration 003 cobre workspace_id e user_id, mas
--    um índice parcial em role = 'admin' reduz o tamanho da árvore e
--    acelera verificações de permissão.
-- ----------------------------------------------------------------------------

create index if not exists idx_workspace_members_admin
  on public.workspace_members (workspace_id, user_id)
  where role = 'admin';
