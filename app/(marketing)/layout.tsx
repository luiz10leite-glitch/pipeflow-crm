import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PipeFlow CRM — Feche mais deals, perca menos tempo',
  description:
    'CRM para times de vendas brasileiros. Pipeline visual, multiempresa e relatórios em tempo real.',
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
