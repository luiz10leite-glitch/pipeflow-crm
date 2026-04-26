-- =============================================================================
-- Migration 007 — workspace_invites + profiles + accept_workspace_invite RPC
-- =============================================================================

-- ----------------------------------------------------------------------------
-- profiles — espelho de auth.users para leitura cross-workspace
-- ----------------------------------------------------------------------------
create table public.profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  email      text        not null,
  full_name  text        not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Popula perfis de usuários existentes
insert into public.profiles (id, email, full_name)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', '')
from auth.users
on conflict (id) do nothing;

-- Trigger: cria perfil automaticamente ao criar usuário
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS — profiles
alter table public.profiles enable row level security;

create policy "profiles: members can view co-members"
  on public.profiles for select
  using (
    exists (
      select 1 from public.workspace_members wm1
      join public.workspace_members wm2 on wm1.workspace_id = wm2.workspace_id
      where wm1.user_id = auth.uid()
        and wm2.user_id = public.profiles.id
    )
  );

create policy "profiles: own profile always visible"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: own profile can update"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ----------------------------------------------------------------------------
-- workspace_invites — convites por token (substituição da tabela invites)
-- ----------------------------------------------------------------------------
create table public.workspace_invites (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references public.workspaces(id) on delete cascade,
  email        text        not null,
  role         text        not null default 'member'
                 check (role in ('admin', 'member')),
  invited_by   uuid        references auth.users(id) on delete set null,
  token        text        not null unique default encode(gen_random_bytes(32), 'hex'),
  expires_at   timestamptz not null default (now() + interval '7 days'),
  accepted_at  timestamptz,
  created_at   timestamptz not null default now(),
  unique (workspace_id, email)
);

create index on public.workspace_invites (workspace_id);
create index on public.workspace_invites (token);

-- RLS — workspace_invites
alter table public.workspace_invites enable row level security;

create policy "workspace_invites: members can select"
  on public.workspace_invites for select
  using (public.is_workspace_member(workspace_id));

create policy "workspace_invites: admins can insert"
  on public.workspace_invites for insert
  with check (public.is_workspace_admin(workspace_id));

create policy "workspace_invites: admins can update"
  on public.workspace_invites for update
  using (public.is_workspace_admin(workspace_id))
  with check (public.is_workspace_admin(workspace_id));

create policy "workspace_invites: admins can delete"
  on public.workspace_invites for delete
  using (public.is_workspace_admin(workspace_id));

-- ----------------------------------------------------------------------------
-- get_workspace_invite — consulta pública por token (SECURITY DEFINER)
-- Permite que a página /invites/[token] mostre info do convite sem auth.
-- ----------------------------------------------------------------------------
create or replace function public.get_workspace_invite(p_token text)
returns table (
  id             uuid,
  workspace_id   uuid,
  workspace_name text,
  email          text,
  role           text,
  expires_at     timestamptz,
  accepted_at    timestamptz
)
language sql
security definer
stable
set search_path = ''
as $$
  select
    wi.id,
    wi.workspace_id,
    w.name  as workspace_name,
    wi.email,
    wi.role,
    wi.expires_at,
    wi.accepted_at
  from public.workspace_invites wi
  join public.workspaces w on w.id = wi.workspace_id
  where wi.token = p_token
  limit 1;
$$;

grant execute on function public.get_workspace_invite(text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- accept_workspace_invite — aceita convite e adiciona ao workspace
-- ----------------------------------------------------------------------------
create or replace function public.accept_workspace_invite(p_token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invite public.workspace_invites%rowtype;
  v_count  int;
begin
  select * into v_invite
  from public.workspace_invites
  where token = p_token
    and accepted_at is null
    and expires_at > now();

  if not found then
    raise exception 'Convite inválido ou expirado.';
  end if;

  select count(*) into v_count
  from public.workspace_members
  where workspace_id = v_invite.workspace_id
    and user_id = auth.uid();

  if v_count = 0 then
    insert into public.workspace_members (workspace_id, user_id, role)
    values (v_invite.workspace_id, auth.uid(), v_invite.role);
  end if;

  update public.workspace_invites
  set accepted_at = now()
  where id = v_invite.id;

  return v_invite.workspace_id;
end;
$$;

grant execute on function public.accept_workspace_invite(text) to authenticated;
