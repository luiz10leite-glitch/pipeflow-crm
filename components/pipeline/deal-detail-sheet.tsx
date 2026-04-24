'use client'

import { CalendarDays, DollarSign, Pencil, Building2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { STAGE_CONFIG } from '@/lib/mock-data'
import type { Deal } from '@/types/pipeline'

interface DealDetailSheetProps {
  deal: Deal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (deal: Deal) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function getDaysUntil(dueDate: string): number {
  return Math.ceil((new Date(dueDate + 'T12:00:00').getTime() - Date.now()) / 86400000)
}

export function DealDetailSheet({ deal, open, onOpenChange, onEdit }: DealDetailSheetProps) {
  if (!deal) return null
  const stage = STAGE_CONFIG[deal.stage]
  const daysUntil = deal.dueDate ? getDaysUntil(deal.dueDate) : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[420px]">
        {/* Stage top bar */}
        <div
          className="h-1 w-full shrink-0"
          style={{ background: `linear-gradient(90deg, ${stage.shadowColor}, ${stage.shadowColor}50)` }}
        />

        {/* Header */}
        <SheetHeader className="border-b px-6 py-5">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="space-y-2">
              <div
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                style={{
                  background: `${stage.shadowColor}12`,
                  borderColor: `${stage.shadowColor}30`,
                  color: stage.shadowColor,
                }}
              >
                {stage.label}
              </div>
              <SheetTitle className="text-[15px] font-semibold leading-snug">{deal.title}</SheetTitle>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" onClick={() => onEdit(deal)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Editar
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          {/* Value hero */}
          <div
            className="rounded-xl p-4"
            style={{ background: `${stage.shadowColor}08`, border: `1px solid ${stage.shadowColor}20` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${stage.shadowColor}15` }}
              >
                <DollarSign className="h-5 w-5" style={{ color: stage.shadowColor }} />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Valor do negócio
                </p>
                <p className="text-2xl font-bold tabular-nums" style={{ color: stage.shadowColor }}>
                  {formatCurrency(deal.value)}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Detalhes
            </h4>

            <div className="space-y-3">
              {/* Lead */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Lead vinculado</p>
                  <p className="text-sm font-medium">{deal.leadName}</p>
                </div>
              </div>

              {/* Responsible */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    background: `${stage.shadowColor}18`,
                    color: stage.shadowColor,
                    border: `1px solid ${stage.shadowColor}30`,
                  }}
                >
                  {getInitials(deal.responsible)}
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Responsável</p>
                  <p className="text-sm font-medium">{deal.responsible}</p>
                </div>
              </div>

              {/* Due date */}
              {deal.dueDate && (
                <div className="flex items-center gap-3">
                  <div className={[
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    daysUntil !== null && daysUntil < 0 ? 'bg-red-500/15' :
                    daysUntil !== null && daysUntil <= 3 ? 'bg-orange-500/15' : 'bg-muted',
                  ].join(' ')}>
                    <CalendarDays className={[
                      'h-4 w-4',
                      daysUntil !== null && daysUntil < 0 ? 'text-red-400' :
                      daysUntil !== null && daysUntil <= 3 ? 'text-orange-400' : 'text-muted-foreground',
                    ].join(' ')} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      Prazo
                      {daysUntil !== null && (
                        <span className={[
                          'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                          daysUntil < 0 ? 'bg-red-500/15 text-red-400' :
                          daysUntil <= 3 ? 'bg-orange-500/15 text-orange-400' :
                          daysUntil <= 7 ? 'bg-amber-500/15 text-amber-400' :
                          'bg-muted text-muted-foreground',
                        ].join(' ')}>
                          {daysUntil < 0 ? `${Math.abs(daysUntil)}d atrasado` :
                           daysUntil === 0 ? 'Hoje' :
                           `em ${daysUntil}d`}
                        </span>
                      )}
                    </p>
                    <p className="text-sm font-medium capitalize">{formatDate(deal.dueDate)}</p>
                  </div>
                </div>
              )}

              {/* Created at */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Criado em</p>
                  <p className="text-sm font-medium capitalize">{formatDate(deal.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stage progress */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Progresso no pipeline
            </h4>
            <div className="flex gap-1">
              {(['new_lead', 'contacted', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'] as const).map((s, i) => {
                const cfg = STAGE_CONFIG[s]
                const isActive = s === deal.stage
                const isBefore = ['new_lead', 'contacted', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'].indexOf(deal.stage) > i && deal.stage !== 'closed_lost'
                return (
                  <div
                    key={s}
                    className="h-1.5 flex-1 rounded-full transition-all"
                    style={{
                      background: isActive
                        ? cfg.shadowColor
                        : isBefore && deal.stage !== 'closed_lost'
                        ? `${cfg.shadowColor}50`
                        : undefined,
                      backgroundColor: !isActive && !isBefore ? 'hsl(var(--muted))' : undefined,
                    }}
                    title={cfg.label}
                  />
                )
              })}
            </div>
            <p className="text-[11px] text-muted-foreground">{stage.label}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
