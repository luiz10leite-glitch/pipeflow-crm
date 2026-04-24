import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="border-t border-white/5 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-16 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(29,78,216,0.35) 0%, rgba(37,99,235,0.15) 100%)',
            border: '1px solid rgba(59,130,246,0.2)',
          }}
        >
          {/* Dot grid overlay */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Pronto para transformar suas vendas?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-neutral-400">
            Junte-se a 1200+ times que já usam o PipeFlow para fechar mais negócios
            em menos tempo.
          </p>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-lg bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-500 hover:shadow-brand-500/30"
          >
            Criar conta grátis — sem cartão de crédito
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
