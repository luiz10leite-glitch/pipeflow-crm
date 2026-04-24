import { Phone, Mail, CalendarDays, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Activity, ActivityType } from '@/types/lead'

const ACTIVITY_CONFIG: Record<ActivityType, {
  icon: React.ElementType
  label: string
  className: string
}> = {
  ligacao: { icon: Phone,        label: 'Ligação',  className: 'bg-blue-500/15 text-blue-400' },
  email:   { icon: Mail,         label: 'E-mail',   className: 'bg-violet-500/15 text-violet-400' },
  reuniao: { icon: CalendarDays, label: 'Reunião',  className: 'bg-amber-500/15 text-amber-400' },
  nota:    { icon: FileText,     label: 'Nota',     className: 'bg-neutral-500/15 text-neutral-400' },
}

function formatDateTime(isoStr: string) {
  return new Date(isoStr).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Nenhuma atividade registrada ainda.
      </div>
    )
  }

  const sorted = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div>
      {sorted.map((activity, i) => {
        const config = ACTIVITY_CONFIG[activity.type]
        const Icon = config.icon
        const isLast = i === sorted.length - 1

        return (
          <div key={activity.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', config.className)}>
                <Icon className="size-3.5" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border my-1" />}
            </div>
            <div className={cn('min-w-0 flex-1', !isLast && 'pb-5')}>
              <p className="text-sm leading-relaxed">{activity.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {config.label} &middot; {activity.createdBy} &middot; {formatDateTime(activity.createdAt)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
