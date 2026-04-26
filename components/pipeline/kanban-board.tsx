'use client'

import { useState, useCallback, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { TrendingUp, Kanban, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KanbanColumn } from './kanban-column'
import { DealCard } from './deal-card'
import { DealForm } from './deal-form'
import { DealDetailSheet } from './deal-detail-sheet'
import { updateDeal } from '@/app/actions/deals'
import { STAGE_CONFIG, PIPELINE_STAGES } from '@/lib/constants'
import type { Lead, DealStage } from '@/types/supabase'
import type { DealWithLead } from '@/types/pipeline'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

interface KanbanBoardProps {
  initialDeals: DealWithLead[]
  leads: Pick<Lead, 'id' | 'name' | 'company' | 'job_title'>[]
  userName: string
}

export function KanbanBoard({ initialDeals, leads, userName }: KanbanBoardProps) {
  const router = useRouter()
  const [deals, setDeals] = useState<DealWithLead[]>(initialDeals)
  const [activeDeal, setActiveDeal] = useState<DealWithLead | null>(null)
  const [, startTransition] = useTransition()

  const [detailDeal, setDetailDeal] = useState<DealWithLead | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [formDeal, setFormDeal] = useState<DealWithLead | undefined>(undefined)
  const [formStage, setFormStage] = useState<DealStage>('lead')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Sincroniza estado local quando o Server Component re-renderiza com dados frescos
  useEffect(() => {
    setDeals(initialDeals)
  }, [initialDeals])

  const activeDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
  const totalPipelineValue = activeDeals.reduce((s, d) => s + d.value, 0)
  const wonDeals = deals.filter(d => d.stage === 'closed_won')
  const wonValue = wonDeals.reduce((s, d) => s + d.value, 0)

  function handleDragStart(event: DragStartEvent) {
    const deal = deals.find(d => d.id === event.active.id)
    setActiveDeal(deal ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDeal(null)
    if (!over) return

    const dealId = active.id as string
    const overId = over.id as string

    const targetStage = (PIPELINE_STAGES as string[]).includes(overId)
      ? (overId as DealStage)
      : deals.find(d => d.id === overId)?.stage

    if (!targetStage) return

    const currentStage = deals.find(d => d.id === dealId)?.stage
    if (currentStage === targetStage) return

    // Optimistic update
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: targetStage } : d))

    // Persist in background
    startTransition(async () => {
      await updateDeal(dealId, { stage: targetStage })
      router.refresh()
    })
  }

  const handleOpenDetail = useCallback((deal: DealWithLead) => {
    setDetailDeal(deal)
    setDetailOpen(true)
  }, [])

  function handleAddDeal(stage: DealStage) {
    setFormDeal(undefined)
    setFormStage(stage)
    setFormOpen(true)
  }

  function handleEditFromDetail(deal: DealWithLead) {
    setDetailOpen(false)
    setFormDeal(deal)
    setFormStage(deal.stage)
    setFormOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Kanban className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Pipeline ativo
            </p>
            <p className="text-base font-bold tabular-nums">{formatCurrency(totalPipelineValue)}</p>
          </div>
          <div className="ml-1 h-8 w-px bg-border/60" />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Deals
            </p>
            <p className="text-base font-bold tabular-nums">{activeDeals.length}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/15">
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-green-400/70">Ganhos</p>
            <p className="text-base font-bold tabular-nums text-green-400">{formatCurrency(wonValue)}</p>
          </div>
          <div className="ml-1 h-8 w-px bg-green-500/20" />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-green-400/70">Fechados</p>
            <p className="text-base font-bold tabular-nums text-green-400">{wonDeals.length}</p>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {PIPELINE_STAGES.map(s => {
            const count = deals.filter(d => d.stage === s).length
            const cfg = STAGE_CONFIG[s]
            return (
              <div
                key={s}
                className="flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium"
                style={{
                  borderColor: `${cfg.shadowColor}30`,
                  background: `${cfg.shadowColor}10`,
                  color: cfg.shadowColor,
                }}
              >
                <span className="font-bold">{count}</span>
                <span className="hidden opacity-70 sm:inline">{cfg.label}</span>
              </div>
            )
          })}
        </div>

        <Button
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => handleAddDeal('lead')}
        >
          <Plus className="h-4 w-4" />
          Novo Deal
        </Button>
      </div>

      {/* Board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div
          className="flex gap-3 overflow-x-auto pb-6"
          style={{ minHeight: 'calc(100vh - 16rem)' }}
        >
          {PIPELINE_STAGES.map((stage, index) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              config={STAGE_CONFIG[stage]}
              deals={deals.filter(d => d.stage === stage)}
              userName={userName}
              index={index}
              onAddDeal={handleAddDeal}
              onOpenDetail={handleOpenDetail}
            />
          ))}
          <div className="w-2 shrink-0" />
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDeal && (
            <DealCard deal={activeDeal} userName={userName} onOpenDetail={() => {}} isDragOverlay />
          )}
        </DragOverlay>
      </DndContext>

      <DealForm
        deal={formDeal}
        defaultStage={formStage}
        leads={leads}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <DealDetailSheet
        deal={detailDeal}
        userName={userName}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEditFromDetail}
      />
    </div>
  )
}
