'use client'

import { useRouter } from 'next/navigation'
import { Pencil, Building2, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LeadStatusBadge } from './lead-status-badge'
import type { Lead } from '@/types/lead'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface LeadCardProps {
  lead: Lead
  onEdit: (lead: Lead) => void
}

export function LeadCard({ lead, onEdit }: LeadCardProps) {
  const router = useRouter()

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation()
    onEdit(lead)
  }

  return (
    <Card
      className="cursor-pointer transition-all hover:ring-foreground/20"
      onClick={() => router.push(`/leads/${lead.id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar>
              <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate">{lead.name}</CardTitle>
              <CardDescription className="truncate">{lead.role || lead.company}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={handleEdit}
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Editar</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="size-3.5 shrink-0" />
            <span className="truncate">{lead.company}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="size-3.5 shrink-0" />
            <span>{lead.phone}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <LeadStatusBadge status={lead.status} />
          <span className="text-xs text-muted-foreground">{formatDate(lead.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
