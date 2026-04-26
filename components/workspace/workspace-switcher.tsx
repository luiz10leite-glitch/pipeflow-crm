'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronsUpDown, Check, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { setActiveWorkspace } from '@/app/actions/collaboration'
import { cn } from '@/lib/utils'

export interface WorkspaceInfo {
  id: string
  name: string
  slug: string
  plan: 'free' | 'pro'
}

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceInfo[]
  activeWorkspaceId: string
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function WorkspaceSwitcher({ workspaces, activeWorkspaceId }: WorkspaceSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const active = workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0]

  if (!active) return null

  function handleSwitch(workspaceId: string) {
    if (workspaceId === active?.id) return
    startTransition(async () => {
      await setActiveWorkspace(workspaceId)
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm',
          'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          'outline-none transition-colors cursor-pointer',
          isPending && 'opacity-70'
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
          {getInitials(active.name)}
        </span>
        <span className="flex-1 truncate text-left font-medium">{active.name}</span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" sideOffset={6}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          {workspaces.map((ws) => (
            <DropdownMenuItem key={ws.id} onClick={() => handleSwitch(ws.id)}>
              <span className="flex size-5 shrink-0 items-center justify-center rounded bg-brand-600/20 text-[10px] font-bold text-brand-400">
                {getInitials(ws.name)}
              </span>
              <span className="flex-1 truncate">{ws.name}</span>
              {ws.plan === 'pro' && (
                <span className="rounded-full bg-brand-600/20 px-1.5 py-0.5 text-[10px] font-semibold text-brand-400">
                  Pro
                </span>
              )}
              {ws.id === active.id && <Check className="size-3.5 text-brand-500" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="size-4" />
          Criar workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
