export type LeadStatus =
  | 'novo'
  | 'contato'
  | 'qualificado'
  | 'proposta'
  | 'negociacao'
  | 'ganho'
  | 'perdido'

export type ActivityType = 'ligacao' | 'email' | 'reuniao' | 'nota'

export interface Activity {
  id: string
  leadId: string
  type: ActivityType
  description: string
  createdAt: string
  createdBy: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: LeadStatus
  owner: string
  createdAt: string
  activities: Activity[]
}
