import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/metric-card'
import { FunnelChart } from '@/components/dashboard/funnel-chart'
import { DealsTable } from '@/components/dashboard/deals-table'
import { MOCK_LEADS, MOCK_DEALS, STAGE_CONFIG } from '@/lib/mock-data'
import type { DealStage } from '@/types/pipeline'

// Stage order for the funnel (excluding closed)
const FUNNEL_STAGES: DealStage[] = ['new_lead', 'contacted', 'proposal_sent', 'negotiation']

// Bar fill colours that complement the existing palette
const STAGE_FILLS: Record<DealStage, string> = {
  new_lead:      '#3B82F6',
  contacted:     '#06B6D4',
  proposal_sent: '#F59E0B',
  negotiation:   '#A855F7',
  closed_won:    '#22C55E',
  closed_lost:   '#EF4444',
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

export default function DashboardPage() {
  // ── Métricas ──────────────────────────────────────────────────────────────
  const totalLeads = MOCK_LEADS.length

  const openDeals = MOCK_DEALS.filter(
    (d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost'
  )

  const pipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0)

  const wonDeals  = MOCK_DEALS.filter((d) => d.stage === 'closed_won').length
  const lostDeals = MOCK_DEALS.filter((d) => d.stage === 'closed_lost').length
  const conversionRate =
    wonDeals + lostDeals > 0
      ? (wonDeals / (wonDeals + lostDeals)) * 100
      : 0

  // ── Funil ─────────────────────────────────────────────────────────────────
  const funnelData = FUNNEL_STAGES.map((stage) => {
    const stageDeals = MOCK_DEALS.filter((d) => d.stage === stage)
    return {
      stage,
      label: STAGE_CONFIG[stage].label,
      count: stageDeals.length,
      value: stageDeals.reduce((s, d) => s + d.value, 0),
      fill: STAGE_FILLS[stage],
    }
  })

  // ── Deals com prazo próximo (próximos 7 dias, inclusive vencidos) ─────────
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in7days = new Date(today)
  in7days.setDate(today.getDate() + 7)

  const upcomingDeals = MOCK_DEALS.filter((d) => {
    if (!d.dueDate) return false
    if (d.stage === 'closed_won' || d.stage === 'closed_lost') return false
    const due = new Date(d.dueDate + 'T00:00:00')
    return due <= in7days
  }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Visão geral do seu pipeline de vendas.</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total de Leads"
          value={String(totalLeads)}
          change={8}
          icon={Users}
          iconColor="text-blue-500"
        />
        <MetricCard
          label="Negócios Abertos"
          value={String(openDeals.length)}
          change={12}
          icon={Briefcase}
          iconColor="text-purple-500"
        />
        <MetricCard
          label="Valor do Pipeline"
          value={formatBRL(pipelineValue)}
          change={-4}
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <MetricCard
          label="Taxa de Conversão"
          value={formatPercent(conversionRate)}
          change={3}
          icon={TrendingUp}
          iconColor="text-amber-500"
        />
      </div>

      {/* Funnel + Upcoming deals */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FunnelChart data={funnelData} />
        <DealsTable deals={upcomingDeals} />
      </div>
    </div>
  )
}
