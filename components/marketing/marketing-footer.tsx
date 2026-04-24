import { Zap } from 'lucide-react'

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded bg-brand-600">
            <Zap className="size-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">PipeFlow</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-neutral-500">
          <a href="#" className="transition-colors hover:text-neutral-300">
            Privacidade
          </a>
          <a href="#" className="transition-colors hover:text-neutral-300">
            Termos
          </a>
          <a href="#" className="transition-colors hover:text-neutral-300">
            GitHub
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-neutral-600">
          © {new Date().getFullYear()} PipeFlow. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
