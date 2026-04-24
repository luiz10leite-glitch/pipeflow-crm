'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'

export function MarketingNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-brand-600">
            <Zap className="size-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-tight">PipeFlow</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#funcionalidades"
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Funcionalidades
          </a>
          <a
            href="#precos"
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Preços
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-md px-3.5 py-2 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
          >
            Começar grátis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-neutral-400 transition-colors hover:text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-white/5 bg-neutral-900 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <a
              href="#funcionalidades"
              className="text-sm text-neutral-400"
              onClick={() => setOpen(false)}
            >
              Funcionalidades
            </a>
            <a
              href="#precos"
              className="text-sm text-neutral-400"
              onClick={() => setOpen(false)}
            >
              Preços
            </a>
            <div className="mt-2 flex flex-col gap-2 border-t border-white/5 pt-4">
              <Link
                href="/login"
                className="rounded-md border border-white/10 px-4 py-2.5 text-center text-sm text-neutral-300"
                onClick={() => setOpen(false)}
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-brand-600 px-4 py-2.5 text-center text-sm font-medium text-white"
                onClick={() => setOpen(false)}
              >
                Começar grátis
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
