'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Kanban, Settings } from 'lucide-react'
import { WorkspaceSwitcher, type WorkspaceInfo } from '@/components/workspace/workspace-switcher'
import { UserMenu } from '@/components/layout/user-menu'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Leads', href: '/leads', icon: Users },
  { label: 'Pipeline', href: '/pipeline', icon: Kanban },
  { label: 'Configurações', href: '/settings', icon: Settings },
]

interface UserInfo {
  name: string
  email: string
  initials: string
}

interface SidebarContentProps {
  onNavigate?: () => void
  user: UserInfo
  workspaces: WorkspaceInfo[]
  activeWorkspaceId: string
}

export function SidebarContent({ onNavigate, user, workspaces, activeWorkspaceId }: SidebarContentProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center px-4">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-brand-400">Pipe</span>
          <span className="text-foreground">Flow</span>
        </span>
      </div>

      <Separator />

      {/* Workspace switcher */}
      <div className="p-2">
        <WorkspaceSwitcher workspaces={workspaces} activeWorkspaceId={activeWorkspaceId} />
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Navegação
        </p>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* User menu */}
      <div className="p-2">
        <UserMenu name={user.name} email={user.email} initials={user.initials} />
      </div>
    </div>
  )
}
