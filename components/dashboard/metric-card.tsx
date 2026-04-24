import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  change: number // percentage, positive = up, negative = down
  icon: LucideIcon
  iconColor?: string
}

export function MetricCard({ label, value, change, icon: Icon, iconColor = 'text-brand' }: MetricCardProps) {
  const isPositive = change > 0
  const isNeutral = change === 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={cn('rounded-lg bg-muted p-2', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1 text-sm">
          {isNeutral ? (
            <Minus className="h-4 w-4 text-muted-foreground" />
          ) : isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={cn(
              'font-medium',
              isNeutral ? 'text-muted-foreground' : isPositive ? 'text-green-600' : 'text-red-500'
            )}
          >
            {isNeutral ? '0%' : `${isPositive ? '+' : ''}${change}%`}
          </span>
          <span className="text-muted-foreground">vs mês anterior</span>
        </div>
      </CardContent>
    </Card>
  )
}
