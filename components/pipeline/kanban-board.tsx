'use client'

import { useState, useCallback } from 'react'
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
import { DealForm, type DealFormData } from './deal-form'
import { DealDetailSheet } from './deal-detail-sheet'
import { MOCK_DEALS, MOCK_LEADS, STAGE_CONFIG, PIPELINE_STAGES } from '@/lib/mock-data'
import type { Deal, DealStage } from '@/types/pipeline'

function generateId() {
  return `d${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function KanbanBoard() {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS)
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null)

  const [detailDeal, setDetailDeal] = useState<Deal | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [formDeal, setFormDeal] = useState<Deal | undefined>(undefined)
  const [formStage, setFormStage] = useState<DealStage>('new_lead')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Derived stats
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
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: targetStage } : d))
  }

  const handleOpenDetail = useCallback((deal: Deal) => {
    setDetailDeal(deal)
    setDetailOpen(true)
  }, [])

  function handleAddDeal(stage: DealStage) {
    setFormDeal(undefined)
    setFormStage(stage)
    setFormOpen(true)
  }

  function handleEditFromDetail(deal: Deal) {
    setDetailOpen(false)
    setFormDeal(deal)
    setFormStage(deal.stage)
    setFormOpen(true)
  }

  function handleSaveDeal(data: DealFormData) {
    const leadName =
      MOCK_LEADS.find(l => l.id === data.leadId)?.name ??
      deals.find(d => d.leadId === data.leadId)?.leadName ??
      data.leadId

    if (data.id) {
      setDeals(prev =>
        prev.map(d =>
          d.id === data.id
            ? { ...d, title: data.title, value: data.value, stage: data.stage, leadId: data.leadId, leadName, responsible: data.responsible, dueDate: data.dueDate ?? null }
            : d
        )
      )
    } else {
      setDeals(prev => [
        ...prev,
        {
          id: generateId(),
          title: data.title,
          value: data.value,
          stage: data.stage,
          leadId: data.leadId,
          leadName,
          responsible: data.responsible,
          dueDate: data.dueDate ?? null,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      ])
    }
  }

  function handleDeleteDeal(id: string) {
    setDeals(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Pipeline summary bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {/* Total active */}
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

        {/* Won */}
        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/15">
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-green-400/70">
              Ganhos
            </p>
            <p className="text-base font-bold tabular-nums text-green-400">
              {formatCurrency(wonValue)}
            </p>
          </div>
          <div className="ml-1 h-8 w-px bg-green-500/20" />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-green-400/70">
              Fechados
            </p>
            <p className="text-base font-bold tabular-nums text-green-400">{wonDeals.length}</p>
          </div>
        </div>

        {/* Stage mini-pills */}
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

        {/* Global add button */}
        <Button
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={() => handleAddDeal('new_lead')}
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
              index={index}
              onAddDeal={handleAddDeal}
              onOpenDetail={handleOpenDetail}
            />
          ))}

          {/* Spacer so last column has breathing room */}
          <div className="w-2 shrink-0" />
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDeal && (
            <DealCard deal={activeDeal} onOpenDetail={() => {}} isDragOverlay />
          )}
        </DragOverlay>
      </DndContext>

      <DealForm
        deal={formDeal}
        defaultStage={formStage}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveDeal}
        onDelete={handleDeleteDeal}
      />

      <DealDetailSheet
        deal={detailDeal}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEditFromDetail}
      />
    </div>
  )
}
