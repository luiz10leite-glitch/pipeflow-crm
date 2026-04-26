'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { DealCard } from './deal-card'
import type { DealStage } from '@/types/supabase'
import type { DealWithLead } from '@/types/pipeline'
import type { StageConfig } from '@/lib/constants'

interface KanbanColumnProps {
  stage: DealStage
  config: StageConfig
  deals: DealWithLead[]
  userName: string
  index: number
  onAddDeal: (stage: DealStage) => void
  onOpenDetail: (deal: DealWithLead) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function KanbanColumn({
  stage,
  config,
  deals,
  userName,
  index,
  onAddDeal,
  onOpenDetail,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)

  return (
    <div
      className="kanban-col-enter flex w-[272px] shrink-0 flex-col"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="mb-2 overflow-hidden rounded-xl border border-border/60 bg-card">
        <div
          className="h-[3px] w-full"
          style={{ background: `linear-gradient(90deg, ${config.shadowColor}, ${config.shadowColor}60)` }}
        />

        <div className="px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-foreground">{config.label}</span>
              <span
                className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
                style={{
                  background: `${config.shadowColor}18`,
                  color: config.shadowColor,
                  border: `1px solid ${config.shadowColor}30`,
                }}
              >
                {deals.length}
              </span>
            </div>

            <button
              onClick={() => onAddDeal(stage)}
              className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
              title={`Novo deal em ${config.label}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="mt-1 text-lg font-bold tabular-nums tracking-tight text-foreground">
            {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={[
          'flex flex-1 flex-col gap-2 rounded-xl p-1.5 transition-colors duration-150',
          'min-h-[80px]',
          isOver
            ? 'border border-dashed ring-1'
            : 'border border-transparent',
        ].join(' ')}
        style={
          isOver
            ? {
                borderColor: `${config.shadowColor}50`,
                backgroundColor: `${config.shadowColor}06`,
                boxShadow: `0 0 0 1px ${config.shadowColor}25 inset`,
              }
            : undefined
        }
      >
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} userName={userName} onOpenDetail={onOpenDetail} />
          ))}
        </SortableContext>

        {deals.length === 0 && (
          <button
            onClick={() => onAddDeal(stage)}
            className={[
              'flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg py-6 transition-colors',
              isOver
                ? 'text-foreground/60'
                : 'text-muted-foreground/30 hover:text-muted-foreground/60 hover:bg-muted/30',
            ].join(' ')}
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">Adicionar deal</span>
          </button>
        )}
      </div>

      {deals.length > 0 && (
        <button
          onClick={() => onAddDeal(stage)}
          className="mt-1.5 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground/50 transition-colors hover:bg-muted/40 hover:text-muted-foreground"
        >
          <Plus className="h-3 w-3" />
          Novo deal
        </button>
      )}
    </div>
  )
}
