-- =============================================================================
-- Migration 001 — Initial Schema
-- PipeFlow CRM: workspaces, workspace_members, leads, deals, activities, invites
-- =============================================================================

-- ----------------------------------------------------------------------------
-- Helper: auto-update updated_at on every row change
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- workspaces
-- ----------------------------------------------------------------------------
create table workspaces (
  id                      uuid        primary key default gen_random_uuid(),
  name                    text        not null,
  slug                    text        not null unique,
  plan                    text        not null default 'free'
                            check (plan in ('free', 'pro')),
  stripe_customer_id      text,
  stripe_subscription_id  text,
  onboarding_completed_at timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger workspaces_updated_at
  before update on workspaces
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- workspace_members
-- ----------------------------------------------------------------------------
create table workspace_members (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references workspaces(id) on delete cascade,
  user_id      uuid        not null references auth.users(id) on delete cascade,
  role         text        not null default 'member'
                 check (role in ('admin', 'member')),
  created_at   timestamptz not null default now(),
  unique (workspace_id, user_id)
);

-- ----------------------------------------------------------------------------
-- leads
-- ----------------------------------------------------------------------------
create table leads (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references workspaces(id) on delete cascade,
  name         text        not null,
  email        text,
  phone        text,
  company      text,
  job_title    text,
  status       text        not null default 'new'
                 check (status in ('new', 'contacted', 'qualified', 'unqualified', 'converted')),
  owner_id     uuid        references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- deals
-- ----------------------------------------------------------------------------
create table deals (
  id           uuid         primary key default gen_random_uuid(),
  workspace_id uuid         not null references workspaces(id) on delete cascade,
  lead_id      uuid         references leads(id) on delete set null,
  title        text         not null,
  value        numeric(12,2) not null default 0,
  stage        text         not null default 'lead'
                 check (stage in ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  owner_id     uuid         references auth.users(id) on delete set null,
  due_date     date,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

create trigger deals_updated_at
  before update on deals
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- activities
-- ----------------------------------------------------------------------------
create table activities (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references workspaces(id) on delete cascade,
  lead_id      uuid        references leads(id) on delete cascade,
  user_id      uuid        references auth.users(id) on delete set null,
  type         text        not null
                 check (type in ('call', 'email', 'meeting', 'note')),
  description  text        not null,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- invites
-- ----------------------------------------------------------------------------
create table invites (
  id           uuid        primary key default gen_random_uuid(),
  workspace_id uuid        not null references workspaces(id) on delete cascade,
  email        text        not null,
  role         text        not null default 'member'
                 check (role in ('admin', 'member')),
  token        text        not null unique default encode(gen_random_bytes(32), 'hex'),
  expires_at   timestamptz not null default (now() + interval '7 days'),
  accepted_at  timestamptz,
  created_at   timestamptz not null default now()
);
