import {
  LayoutGrid,
  Building2,
  BarChart2,
  MessageSquare,
  Gift,
  ShieldCheck,
} from 'lucide-react'

const features = [
  {
    Icon: LayoutGrid,
    title: 'Pipeline Kanban',
    description:
      'Arraste e solte deals entre etapas. Visualize o funil inteiro de um relance e nunca perca um negócio de vista.',
  },
  {
    Icon: Building2,
    title: 'Multiempresa',
    description:
      'Gerencie múltiplos workspaces com times, permissões e dados completamente isolados por empresa.',
  },
  {
    Icon: BarChart2,
    title: 'Dashboard em tempo real',
    description:
      'Métricas de conversão, valor do pipeline e taxa de fechamento atualizadas automaticamente.',
  },
  {
    Icon: MessageSquare,
    title: 'Timeline de atividades',
    description:
      'Histórico completo de e-mails, ligações, reuniões e notas por lead. Nunca perca o contexto de uma negociação.',
  },
  {
    Icon: Gift,
    title: 'Plano gratuito generoso',
    description:
      'Comece sem cartão de crédito. 50 leads, 2 membros e pipeline completo incluídos no plano Free.',
  },
  {
    Icon: ShieldCheck,
    title: 'Segurança empresarial',
    description:
      'Row-level security, dados isolados por workspace e autenticação robusta em toda a plataforma.',
  },
]

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-500">
            Funcionalidades
          </div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tudo que um time de vendas precisa
          </h2>
          <p className="mx-auto max-w-xl text-lg text-neutral-400">
            Construído do zero para equipes que querem mais resultados com menos ferramentas.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-brand-500/25 hover:bg-white/[0.04]"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(ellipse at top left, rgba(59,130,246,0.07), transparent 65%)',
                }}
              />

              <div className="relative">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-brand-500/10">
                  <Icon className="size-5 text-brand-400" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-neutral-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
