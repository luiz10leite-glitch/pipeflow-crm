import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: '/mês',
    description: 'Para começar sem riscos.',
    cta: 'Criar conta grátis',
    href: '/register',
    featured: false,
    features: [
      '2 membros',
      '50 leads',
      'Pipeline Kanban completo',
      'Dashboard de métricas',
      'Timeline de atividades',
      'Suporte por e-mail',
    ],
  },
  {
    name: 'Pro',
    price: 'R$ 49',
    period: '/mês',
    description: 'Para times que querem crescer.',
    cta: 'Assinar plano Pro',
    href: '/register',
    featured: true,
    features: [
      'Membros ilimitados',
      'Leads ilimitados',
      'Tudo do plano Grátis',
      'Múltiplos workspaces',
      'Convites por e-mail',
      'Relatórios avançados',
      'Suporte prioritário',
    ],
  },
]

export function PricingSection() {
  return (
    <section id="precos" className="border-t border-white/5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-500">
            Preços
          </div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Simples e transparente
          </h2>
          <p className="text-lg text-neutral-400">
            Comece grátis. Faça upgrade quando precisar de mais.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.featured
                  ? 'border-2 border-brand-500 bg-brand-500/5'
                  : 'border border-white/5 bg-white/[0.02]'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    Recomendado
                  </span>
                </div>
              )}

              {/* Plan info */}
              <div className="mb-6">
                <div className="mb-1 text-sm font-medium text-neutral-400">{plan.name}</div>
                <div className="mb-2 flex items-end gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="mb-1 text-sm text-neutral-400">{plan.period}</span>
                </div>
                <p className="text-sm text-neutral-400">{plan.description}</p>
              </div>

              {/* Features list */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check
                      className={`size-4 shrink-0 ${plan.featured ? 'text-brand-400' : 'text-neutral-500'}`}
                    />
                    <span className="text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block w-full rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                  plan.featured
                    ? 'bg-brand-600 text-white hover:bg-brand-500'
                    : 'border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
