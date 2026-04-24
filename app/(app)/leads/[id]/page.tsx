import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Building2, Mail, Phone, User, CalendarDays } from 'lucide-react'
import { MOCK_LEADS } from '@/lib/mock-data'
import { LeadStatusBadge } from '@/components/leads/lead-status-badge'
import { ActivityTimeline } from '@/components/leads/activity-timeline'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = MOCK_LEADS.find(l => l.id === id)

  if (!lead) notFound()

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/leads"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para Leads
      </Link>

      {/* Lead header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {[lead.role, lead.company].filter(Boolean).join(' · ')}
          </p>
        </div>
        <LeadStatusBadge status={lead.status} className="self-start" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="activities">
            Atividades
            {lead.activities.length > 0 && (
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {lead.activities.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={Mail}  label="E-mail"   value={lead.email} />
                <InfoRow icon={Phone} label="Telefone" value={lead.phone} />
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={Building2} label="Empresa" value={lead.company} />
                <InfoRow icon={User}      label="Cargo"   value={lead.role} />
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>CRM</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={User}         label="Responsável" value={lead.owner} />
                <InfoRow icon={CalendarDays} label="Criado em"   value={formatDate(lead.createdAt)} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Atividades */}
        <TabsContent value="activities" className="mt-4">
          <Card>
            <CardContent className="pt-5">
              <ActivityTimeline activities={lead.activities} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
