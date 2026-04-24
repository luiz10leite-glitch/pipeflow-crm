import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-24 pt-36 sm:pb-32 sm:pt-44">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Blue radial glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(37,99,235,0.28), transparent)',
        }}
      />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div
            className="mb-8 inline-flex animate-[slideInUp_0.5s_ease-out_both] items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400"
            style={{ animationDelay: '0ms' }}
          >
            <span className="size-1.5 animate-pulse rounded-full bg-brand-500" />
            CRM para times de vendas brasileiros
          </div>

          {/* Headline */}
          <h1
            className="mb-6 animate-[slideInUp_0.6s_ease-out_both] text-5xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ animationDelay: '80ms' }}
          >
            Feche mais deals.
            <br />
            <span className="text-brand-500">Perca menos tempo.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="mx-auto mb-10 max-w-2xl animate-[slideInUp_0.6s_ease-out_both] text-lg text-neutral-400 sm:text-xl"
            style={{ animationDelay: '160ms' }}
          >
            O CRM que a sua equipe de vendas vai realmente usar. Pipeline visual,
            multiempresa e relatórios em tempo real — do lead à assinatura.
          </p>

          {/* CTAs */}
          <div
            className="flex animate-[slideInUp_0.6s_ease-out_both] flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500 hover:shadow-brand-500/30"
            >
              Começar grátis — sem cartão
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#funcionalidades"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-neutral-300 transition-colors hover:border-white/20 hover:text-white"
            >
              Ver funcionalidades
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
