-- =============================================================================
-- Migration 002 — Row Level Security
-- Regra central: cada usuário acessa APENAS dados do workspace onde é membro.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- Helper functions (security definer = executam como dono da função, não
-- como o usuário que chamou — evita recursão infinita nas policies de
-- workspace_members).
-- ----------------------------------------------------------------------------
create or replace function is_workspace_member(p_workspace_id uuid)
returns boolean as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = p_workspace_id
      and user_id = auth.uid()
  )
$$ language sql security definer stable;

create or replace function is_workspace_admin(p_workspace_id uuid)
returns boolean as $$
  select exists (
    select 1 from workspace_members
    where workspace_id = p_workspace_id
      and user_id = auth.uid()
      and role = 'admin'
  )
$$ language sql security definer stable;

-- ----------------------------------------------------------------------------
-- workspaces
-- ----------------------------------------------------------------------------
alter table workspaces enable row level security;

-- Membros do workspace podem ver o workspace
create policy "workspaces: members can select"
  on workspaces for select
  using (is_workspace_member(id));

-- Qualquer usuário autenticado pode criar um workspace
create policy "workspaces: authenticated can insert"
  on workspaces for insert
  with check (auth.uid() is not null);

-- Apenas admins podem atualizar o workspace
create policy "workspaces: admins can update"
  on workspaces for update
  using (is_workspace_admin(id))
  with check (is_workspace_admin(id));

-- Apenas admins podem deletar o workspace
create policy "workspaces: admins can delete"
  on workspaces for delete
  using (is_workspace_admin(id));

-- ----------------------------------------------------------------------------
-- workspace_members
-- ----------------------------------------------------------------------------
alter table workspace_members enable row level security;

-- Membros podem ver todos os membros do mesmo workspace
create policy "workspace_members: members can select"
  on workspace_members for select
  using (is_workspace_member(workspace_id));

-- Admins podem adicionar membros; ou o próprio usuário aceita um convite
create policy "workspace_members: admins can insert"
  on workspace_members for insert
  with check (
    is_workspace_admin(workspace_id)
    or user_id = auth.uid()
  );

-- Admins podem alterar papéis
create policy "workspace_members: admins can update"
  on workspace_members for update
  using (is_workspace_admin(workspace_id))
  with check (is_workspace_admin(workspace_id));

-- Admins podem remover membros; membro pode sair sozinho
create policy "workspace_members: admins can delete"
  on workspace_members for delete
  using (
    is_workspace_admin(workspace_id)
    or user_id = auth.uid()
  );

-- ----------------------------------------------------------------------------
-- leads
-- ----------------------------------------------------------------------------
alter table leads enable row level security;

create policy "leads: members can select"
  on leads for select
  using (is_workspace_member(workspace_id));

create policy "leads: members can insert"
  on leads for insert
  with check (is_workspace_member(workspace_id));

create policy "leads: members can update"
  on leads for update
  using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

create policy "leads: members can delete"
  on leads for delete
  using (is_workspace_member(workspace_id));

-- ----------------------------------------------------------------------------
-- deals
-- ----------------------------------------------------------------------------
alter table deals enable row level security;

create policy "deals: members can select"
  on deals for select
  using (is_workspace_member(workspace_id));

create policy "deals: members can insert"
  on deals for insert
  with check (is_workspace_member(workspace_id));

create policy "deals: members can update"
  on deals for update
  using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

create policy "deals: members can delete"
  on deals for delete
  using (is_workspace_member(workspace_id));

-- ----------------------------------------------------------------------------
-- activities
-- ----------------------------------------------------------------------------
alter table activities enable row level security;

create policy "activities: members can select"
  on activities for select
  using (is_workspace_member(workspace_id));

create policy "activities: members can insert"
  on activities for insert
  with check (is_workspace_member(workspace_id));

-- Atividades são imutáveis — sem update
-- Apenas o autor ou um admin pode deletar
create policy "activities: author or admin can delete"
  on activities for delete
  using (
    user_id = auth.uid()
    or is_workspace_admin(workspace_id)
  );

-- ----------------------------------------------------------------------------
-- invites
-- ----------------------------------------------------------------------------
alter table invites enable row level security;

-- Membros veem convites do workspace deles
create policy "invites: members can select"
  on invites for select
  using (is_workspace_member(workspace_id));

-- Acesso público por token (rota /invites/[token] sem auth)
create policy "invites: public select by token"
  on invites for select
  using (accepted_at is null and expires_at > now());

-- Apenas admins criam convites
create policy "invites: admins can insert"
  on invites for insert
  with check (is_workspace_admin(workspace_id));

-- Admins podem atualizar (ex: reenviar = regenerar token)
create policy "invites: admins can update"
  on invites for update
  using (is_workspace_admin(workspace_id))
  with check (is_workspace_admin(workspace_id));

-- Admins podem revogar convites
create policy "invites: admins can delete"
  on invites for delete
  using (is_workspace_admin(workspace_id));
