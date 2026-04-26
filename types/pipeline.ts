// Fonte de verdade: types/supabase.ts (gerado do schema do banco)
export type { DealStage, Deal, DealInsert, DealUpdate } from './supabase'

import type { Deal } from './supabase'

// Tipo estendido com lead joinado — usado nos componentes do Kanban
export interface DealWithLead extends Deal {
  lead: { id: string; name: string; company: string | null } | null
}
