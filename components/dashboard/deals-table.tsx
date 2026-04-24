import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Deal } from '@/types/pipeline'

interface DealsTableProps {
  deals: Deal[]
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function urgencyBadge(dueDate: string, today: Date) {
  const due = new Date(dueDate + 'T00:00:00')
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86400000)

  if (diffDays < 0) return <Badge variant="destructive">Vencido</Badge>
  if (diffDays === 0) return <Badge variant="destructive">Hoje</Badge>
  if (diffDays <= 2) return <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/15">Em {diffDays}d</Badge>
  return <Badge variant="secondary">Em {diffDays}d</Badge>
}

export function DealsTable({ deals }: DealsTableProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Negócios com Prazo Próximo</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        {deals.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum negócio com prazo nos próximos 7 dias.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Negócio</TableHead>
                <TableHead className="hidden sm:table-cell">Lead</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Prazo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium max-w-[160px] truncate">{deal.title}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{deal.leadName}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatBRL(deal.value)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">{formatDate(deal.dueDate!)}</span>
                      {urgencyBadge(deal.dueDate!, today)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
