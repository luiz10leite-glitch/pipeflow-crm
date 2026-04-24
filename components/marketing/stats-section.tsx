const stats = [
  { value: '+47%', label: 'taxa de conversão' },
  { value: '3.2×', label: 'leads qualificados' },
  { value: '−62%', label: 'ciclo de vendas' },
  { value: '1200+', label: 'times ativos' },
]

export function StatsSection() {
  return (
    <section className="border-y border-white/5 bg-white/[0.015]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-extrabold tabular-nums text-brand-400 sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1.5 text-sm text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
