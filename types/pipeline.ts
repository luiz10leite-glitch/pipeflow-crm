export type DealStage =
  | 'new_lead'
  | 'contacted'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'

export interface Deal {
  id: string
  title: string
  value: number
  stage: DealStage
  leadId: string
  leadName: string
  responsible: string
  dueDate: string | null
  createdAt: string
}

export interface StageConfig {
  id: DealStage
  label: string
  color: string
  textColor: string
  borderColor: string
  shadowColor: string
}
