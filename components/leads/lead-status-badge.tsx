import { cn } from '@/lib/utils'
import type { LeadStatus } from '@/types/supabase'

export const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  new:         { label: 'Novo',           className: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  contacted:   { label: 'Contato',        className: 'bg-violet-500/15 text-violet-400 border-violet-500/25' },
  qualified:   { label: 'Qualificado',    className: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  unqualified: { label: 'Desqualificado', className: 'bg-red-500/15 text-red-400 border-red-500/25' },
  converted:   { label: 'Convertido',     className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
}

interface LeadStatusBadgeProps {
  status: LeadStatus
  className?: string
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG['new']
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center rounded-full border px-2 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
