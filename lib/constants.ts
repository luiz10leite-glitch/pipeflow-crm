import type { DealStage } from '@/types/supabase'

export interface StageConfig {
  label: string
  color: string
  textColor: string
  borderColor: string
  shadowColor: string
}

export const STAGE_CONFIG: Record<DealStage, StageConfig> = {
  lead:        { label: 'New Lead',      color: 'bg-blue-500/15',   textColor: 'text-blue-400',   borderColor: 'border-blue-500/30',   shadowColor: '#3B82F6' },
  qualified:   { label: 'Qualified',     color: 'bg-cyan-500/15',   textColor: 'text-cyan-400',   borderColor: 'border-cyan-500/30',   shadowColor: '#06B6D4' },
  proposal:    { label: 'Proposal Sent', color: 'bg-amber-500/15',  textColor: 'text-amber-400',  borderColor: 'border-amber-500/30',  shadowColor: '#F59E0B' },
  negotiation: { label: 'Negotiation',   color: 'bg-orange-500/15', textColor: 'text-orange-400', borderColor: 'border-orange-500/30', shadowColor: '#F97316' },
  closed_won:  { label: 'Closed Won',    color: 'bg-green-500/15',  textColor: 'text-green-400',  borderColor: 'border-green-500/30',  shadowColor: '#22C55E' },
  closed_lost: { label: 'Closed Lost',   color: 'bg-red-500/15',    textColor: 'text-red-400',    borderColor: 'border-red-500/30',    shadowColor: '#EF4444' },
}

export const PIPELINE_STAGES: DealStage[] = [
  'lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost',
]
