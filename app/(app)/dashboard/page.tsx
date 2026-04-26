import { redirect } from 'next/navigation'
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { MetricCard } from '@/components/dashboard/metric-card'
import { FunnelChart } from '@/components/dashboard/funnel-chart'
import { DealsTable } from '@/components/dashboard/deals-table'
import { STAGE_CONFIG, PIPELINE_STAGES } from '@/lib/constants'
import type { DealStage } from '@/types/supabase'

const STAGE_LABELS_PT: Record<DealStage, string> = {
  lead:        'Novo Lead',
  qualified:   'Qualificado',
  proposal:    'Proposta Enviada',
  negotiation: 'Negociação',
  closed_won:  'Fechado Ganho',
  closed_lost: 'Fechado Perdido',
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

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .limit(1)
    .single()

  if (!workspace) redirect('/onboarding')

  const [leadsResult, dealsResult] = await Promise.all([
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id),
    supabase
      .from('deals')
      .select('id, value, stage, due_date, title, lead_id, leads(name)')
      .eq('workspace_id', workspace.id),
  ])

  const totalLeads = leadsResult.count ?? 0
  const deals = dealsResult.data ?? []

  // Métricas
  const openDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
  const pipelineValue = openDeals.reduce((sum, d) => sum + (d.value ?? 0), 0)
  const wonDeals  = deals.filter(d => d.stage === 'closed_won').length
  const lostDeals = deals.filter(d => d.stage === 'closed_lost').length
  const conversionRate =
    wonDeals + lostDeals > 0
      ? (wonDeals / (wonDeals + lostDeals)) * 100
      : 0

  // Funil
  const funnelData = PIPELINE_STAGES.map(stage => {
    const stageDeals = deals.filter(d => d.stage === stage)
    return {
      stage,
      label: STAGE_LABELS_PT[stage],
      count: stageDeals.length,
      value: stageDeals.reduce((s, d) => s + (d.value ?? 0), 0),
      fill: STAGE_CONFIG[stage].shadowColor,
    }
  })

  // Deals com prazo próximo (próximos 7 dias + vencidos)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in7days = new Date(today)
  in7days.setDate(today.getDate() + 7)

  const upcomingDeals = deals
    .filter(d => {
      if (!d.due_date) return false
      if (d.stage === 'closed_won' || d.stage === 'closed_lost') return false
      const due = new Date(d.due_date + 'T00:00:00')
      return due <= in7days
    })
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .map(d => ({
      id:       d.id,
      title:    d.title,
      value:    d.value ?? 0,
      due_date: d.due_date!,
      leadName: (d.leads as unknown as { name: string } | null)?.name ?? '—',
    }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Visão geral do seu pipeline de vendas.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total de Leads"
          value={String(totalLeads)}
          icon={Users}
          iconColor="text-blue-500"
        />
        <MetricCard
          label="Negócios Abertos"
          value={String(openDeals.length)}
          icon={Briefcase}
          iconColor="text-purple-500"
        />
        <MetricCard
          label="Valor do Pipeline"
          value={formatBRL(pipelineValue)}
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <MetricCard
          label="Taxa de Conversão"
          value={formatPercent(conversionRate)}
          icon={TrendingUp}
          iconColor="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FunnelChart data={funnelData} />
        <DealsTable deals={upcomingDeals} today={today} />
      </div>
    </div>
  )
}
