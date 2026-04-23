'use client'

import { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SidebarContent } from '@/components/layout/sidebar-content'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/pipeline': 'Pipeline',
  '/settings': 'Configurações',
}

function usePageTitle() {
  const pathname = usePathname()
  const segment = '/' + (pathname.split('/')[1] ?? '')
  return PAGE_TITLES[segment] ?? 'PipeFlow'
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pageTitle = usePageTitle()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
          {/* Mobile: Sheet trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden">
              <MenuIcon className="size-5" />
              <span className="sr-only">Abrir menu</span>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-60! sm:max-w-60! p-0 bg-sidebar border-r border-sidebar-border"
              showCloseButton={false}
            >
              <SheetHeader>
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              </SheetHeader>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Page title */}
          <h1 className="text-sm font-semibold text-foreground">{pageTitle}</h1>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
