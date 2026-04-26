import { Check, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const PRO_FEATURES = [
  'Membros ilimitados',
  'Leads ilimitados',
  'Convites por e-mail',
  'Dashboard avançado',
  'Suporte prioritário',
]

const FREE_FEATURES = ['2 membros', 'Até 50 leads', '1 workspace', 'Pipeline Kanban']

interface BillingCardProps {
  plan: 'free' | 'pro'
}

export function BillingCard({ plan }: BillingCardProps) {
  const isPro = plan === 'pro'

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Plano atual */}
      <Card className={isPro ? 'border-brand-500/50 ring-1 ring-brand-500/30' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {isPro ? 'Pro' : 'Free'}
            </CardTitle>
            <Badge variant={isPro ? 'default' : 'secondary'}>
              {isPro ? 'Plano atual' : 'Plano atual'}
            </Badge>
          </div>
          <CardDescription>
            {isPro ? 'R$ 49/mês por workspace' : 'Gratuito, sem cartão'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ul className="space-y-2">
            {(isPro ? PRO_FEATURES : FREE_FEATURES).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="size-4 shrink-0 text-green-500" />
                {f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Upgrade card (só aparece no Free) */}
      {!isPro && (
        <Card className="border-brand-500/30 bg-brand-600/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pro</CardTitle>
              <Badge className="bg-brand-600">Recomendado</Badge>
            </div>
            <CardDescription>R$ 49/mês por workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 shrink-0 text-brand-500" />
                  {f}
                </li>
              ))}
            </ul>
            <Separator />
            <Button className="w-full gap-2 bg-brand-600 hover:bg-brand-700">
              <Zap className="size-4" />
              Fazer upgrade para Pro
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Cancele quando quiser. Sem multa.
            </p>
          </CardContent>
        </Card>
      )}

      {isPro && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Assinatura</CardTitle>
            <CardDescription>Gerencie seu plano e pagamentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Gerenciar assinatura
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
