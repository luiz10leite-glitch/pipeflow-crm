-- =============================================================================
-- Migration 003 — Indexes
-- Cobre as colunas de join e filtro mais frequentes nas queries do CRM.
-- =============================================================================

-- workspace_members
create index idx_workspace_members_workspace_id on workspace_members (workspace_id);
create index idx_workspace_members_user_id      on workspace_members (user_id);

-- leads
create index idx_leads_workspace_id on leads (workspace_id);
create index idx_leads_owner_id     on leads (owner_id);
create index idx_leads_status       on leads (status);
create index idx_leads_created_at   on leads (created_at desc);

-- deals
create index idx_deals_workspace_id on deals (workspace_id);
create index idx_deals_lead_id      on deals (lead_id);
create index idx_deals_owner_id     on deals (owner_id);
create index idx_deals_stage        on deals (stage);
create index idx_deals_due_date     on deals (due_date);

-- activities
create index idx_activities_workspace_id on activities (workspace_id);
create index idx_activities_lead_id      on activities (lead_id);
create index idx_activities_user_id      on activities (user_id);
create index idx_activities_created_at   on activities (created_at desc);

-- invites
create index idx_invites_workspace_id on invites (workspace_id);
create index idx_invites_email        on invites (email);
create index idx_invites_token        on invites (token);
