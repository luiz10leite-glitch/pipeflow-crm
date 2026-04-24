'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, Building2, GripVertical } from 'lucide-react'
import type { Deal } from '@/types/pipeline'
import { STAGE_CONFIG } from '@/lib/mock-data'

interface DealCardProps {
  deal: Deal
  onOpenDetail: (deal: Deal) => void
  isDragOverlay?: boolean
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function getDueUrgency(dueDate: string | null): 'overdue' | 'urgent' | 'soon' | null {
  if (!dueDate) return null
  const days = Math.ceil((new Date(dueDate + 'T12:00:00').getTime() - Date.now()) / 86400000)
  if (days < 0)  return 'overdue'
  if (days <= 3) return 'urgent'
  if (days <= 7) return 'soon'
  return null
}

function formatDueDate(dueDate: string) {
  return new Date(dueDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

export function DealCard({ deal, onOpenDetail, isDragOverlay = false }: DealCardProps) {
  const [hovered, setHovered] = useState(false)
  const stage = STAGE_CONFIG[deal.stage]
  const urgency = getDueUrgency(deal.dueDate)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: deal.id, data: { deal } })

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    borderLeftColor: stage.shadowColor,
    boxShadow: hovered && !isDragging
      ? `0 0 0 1px ${stage.shadowColor}30, 0 4px 24px ${stage.shadowColor}18, 0 1px 4px rgba(0,0,0,0.3)`
      : '0 1px 3px rgba(0,0,0,0.2)',
  }

  const urgencyStyle = {
    overdue: 'bg-red-500/12 text-red-400 border border-red-500/25',
    urgent:  'bg-orange-500/12 text-orange-400 border border-orange-500/25',
    soon:    'bg-amber-500/12 text-amber-400 border border-amber-500/25',
  }

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={[
        'group relative cursor-pointer select-none',
        'rounded-lg border border-border/60 bg-card',
        'border-l-[3px] overflow-hidden',
        'transition-[box-shadow,opacity] duration-200',
        isDragOverlay ? 'rotate-[1.5deg] scale-[1.03] shadow-2xl' : '',
      ].join(' ')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !isDragging && onOpenDetail(deal)}
    >
      {/* Subtle top shimmer on hover */}
      {hovered && !isDragging && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${stage.shadowColor}60, transparent)` }}
        />
      )}

      <div className="p-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <p className="flex-1 text-[13px] font-medium leading-snug text-foreground line-clamp-2">
            {deal.title}
          </p>
          <div
            {...attributes}
            {...listeners}
            className="mt-0.5 shrink-0 cursor-grab opacity-0 transition-opacity group-hover:opacity-30 active:cursor-grabbing active:opacity-60"
            onClick={e => e.stopPropagation()}
          >
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* Value — the hero number */}
        <p
          className="mt-2 text-base font-bold tabular-nums tracking-tight"
          style={{ color: hovered ? stage.shadowColor : undefined }}
        >
          {formatCurrency(deal.value)}
        </p>

        {/* Lead */}
        <div className="mt-2 flex items-center gap-1.5 overflow-hidden">
          <Building2 className="h-3 w-3 shrink-0 text-muted-foreground/60" />
          <span className="truncate text-[11px] text-muted-foreground/80">{deal.leadName}</span>
        </div>

        {/* Footer */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          {/* Avatar */}
          <div className="flex items-center gap-1.5">
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
              style={{
                background: `${stage.shadowColor}22`,
                color: stage.shadowColor,
                border: `1px solid ${stage.shadowColor}33`,
              }}
            >
              {getInitials(deal.responsible)}
            </div>
            <span className="text-[11px] text-muted-foreground/70">
              {deal.responsible.split(' ')[0]}
            </span>
          </div>

          {/* Due date */}
          {deal.dueDate && (
            <span className={[
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
              urgency ? urgencyStyle[urgency] : 'bg-muted/60 text-muted-foreground border border-border/60',
            ].join(' ')}>
              <CalendarDays className="h-2.5 w-2.5" />
              {formatDueDate(deal.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
