// Auto-generated from migration 001_initial_schema.sql
// Re-generate after schema changes: supabase gen types typescript --project-id <ref> > types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ---------------------------------------------------------------------------
// Enums / union types that mirror CHECK constraints in the schema
// ---------------------------------------------------------------------------

export type WorkspacePlan = 'free' | 'pro'
export type MemberRole    = 'admin' | 'member'
export type LeadStatus    = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted'
export type DealStage     = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
export type ActivityType  = 'call' | 'email' | 'meeting' | 'note'

// ---------------------------------------------------------------------------
// Table row types
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      // -----------------------------------------------------------------------
      workspaces: {
        Relationships: []
        Row: {
          id:                      string
          name:                    string
          slug:                    string
          plan:                    WorkspacePlan
          stripe_customer_id:      string | null
          stripe_subscription_id:  string | null
          onboarding_completed_at: string | null
          created_at:              string
          updated_at:              string
        }
        Insert: {
          id?:                     string
          name:                    string
          slug:                    string
          plan?:                   WorkspacePlan
          stripe_customer_id?:     string | null
          stripe_subscription_id?: string | null
          onboarding_completed_at?: string | null
          created_at?:             string
          updated_at?:             string
        }
        Update: {
          id?:                     string
          name?:                   string
          slug?:                   string
          plan?:                   WorkspacePlan
          stripe_customer_id?:     string | null
          stripe_subscription_id?: string | null
          onboarding_completed_at?: string | null
          updated_at?:             string
        }
      }
      // -----------------------------------------------------------------------
      workspace_members: {
        Relationships: []
        Row: {
          id:           string
          workspace_id: string
          user_id:      string
          role:         MemberRole
          created_at:   string
        }
        Insert: {
          id?:          string
          workspace_id: string
          user_id:      string
          role?:        MemberRole
          created_at?:  string
        }
        Update: {
          role?: MemberRole
        }
      }
      // -----------------------------------------------------------------------
      leads: {
        Relationships: []
        Row: {
          id:           string
          workspace_id: string
          name:         string
          email:        string | null
          phone:        string | null
          company:      string | null
          job_title:    string | null
          status:       LeadStatus
          owner_id:     string | null
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:          string
          workspace_id: string
          name:         string
          email?:       string | null
          phone?:       string | null
          company?:     string | null
          job_title?:   string | null
          status?:      LeadStatus
          owner_id?:    string | null
          created_at?:  string
          updated_at?:  string
        }
        Update: {
          name?:      string
          email?:     string | null
          phone?:     string | null
          company?:   string | null
          job_title?: string | null
          status?:    LeadStatus
          owner_id?:  string | null
          updated_at?: string
        }
      }
      // -----------------------------------------------------------------------
      deals: {
        Relationships: []
        Row: {
          id:           string
          workspace_id: string
          lead_id:      string | null
          title:        string
          value:        number
          stage:        DealStage
          owner_id:     string | null
          due_date:     string | null
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:          string
          workspace_id: string
          lead_id?:     string | null
          title:        string
          value?:       number
          stage?:       DealStage
          owner_id?:    string | null
          due_date?:    string | null
          created_at?:  string
          updated_at?:  string
        }
        Update: {
          lead_id?:   string | null
          title?:     string
          value?:     number
          stage?:     DealStage
          owner_id?:  string | null
          due_date?:  string | null
          updated_at?: string
        }
      }
      // -----------------------------------------------------------------------
      activities: {
        Relationships: []
        Row: {
          id:           string
          workspace_id: string
          lead_id:      string | null
          user_id:      string | null
          type:         ActivityType
          description:  string
          created_at:   string
        }
        Insert: {
          id?:          string
          workspace_id: string
          lead_id?:     string | null
          user_id?:     string | null
          type:         ActivityType
          description:  string
          created_at?:  string
        }
        Update: never
      }
      // -----------------------------------------------------------------------
      invites: {
        Relationships: []
        Row: {
          id:           string
          workspace_id: string
          email:        string
          role:         MemberRole
          token:        string
          expires_at:   string
          accepted_at:  string | null
          created_at:   string
        }
        Insert: {
          id?:          string
          workspace_id: string
          email:        string
          role?:        MemberRole
          token?:       string
          expires_at?:  string
          accepted_at?: string | null
          created_at?:  string
        }
        Update: {
          role?:        MemberRole
          token?:       string
          expires_at?:  string
          accepted_at?: string | null
        }
      }
    }
    Views:   Record<string, never>
    Functions: {
      is_workspace_member: {
        Args:    { p_workspace_id: string }
        Returns: boolean
      }
      is_workspace_admin: {
        Args:    { p_workspace_id: string }
        Returns: boolean
      }
      create_workspace: {
        Args:    { p_name: string; p_slug: string }
        Returns: string
      }
    }
    Enums:     Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// ---------------------------------------------------------------------------
// Convenience aliases — use these in the rest of the app
// ---------------------------------------------------------------------------

type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Workspace        = Tables<'workspaces'>
export type WorkspaceMember  = Tables<'workspace_members'>
export type Lead             = Tables<'leads'>
export type Deal             = Tables<'deals'>
export type Activity         = Tables<'activities'>
export type Invite           = Tables<'invites'>

type InsertOf<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type WorkspaceInsert       = InsertOf<'workspaces'>
export type WorkspaceMemberInsert = InsertOf<'workspace_members'>
export type LeadInsert            = InsertOf<'leads'>
export type DealInsert            = InsertOf<'deals'>
export type ActivityInsert        = InsertOf<'activities'>
export type InviteInsert          = InsertOf<'invites'>

type UpdateOf<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type WorkspaceUpdate       = UpdateOf<'workspaces'>
export type WorkspaceMemberUpdate = UpdateOf<'workspace_members'>
export type LeadUpdate            = UpdateOf<'leads'>
export type DealUpdate            = UpdateOf<'deals'>
export type InviteUpdate          = UpdateOf<'invites'>
