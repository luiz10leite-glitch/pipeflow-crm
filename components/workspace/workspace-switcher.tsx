'use client'

import { useState } from 'react'
import { ChevronsUpDown, Check, Plus } from 'lucide-react'
import { MOCK_WORKSPACES, MOCK_ACTIVE_WORKSPACE_ID } from '@/lib/mock-data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function WorkspaceSwitcher() {
  const [activeId, setActiveId] = useState(MOCK_ACTIVE_WORKSPACE_ID)
  const active = MOCK_WORKSPACES.find((w) => w.id === activeId) ?? MOCK_WORKSPACES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm',
          'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          'outline-none transition-colors cursor-pointer'
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
          {active.initials}
        </span>
        <span className="flex-1 truncate text-left font-medium">{active.name}</span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" sideOffset={6}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          {MOCK_WORKSPACES.map((ws) => (
            <DropdownMenuItem key={ws.id} onClick={() => setActiveId(ws.id)}>
              <span className="flex size-5 shrink-0 items-center justify-center rounded bg-brand-600/20 text-[10px] font-bold text-brand-400">
                {ws.initials}
              </span>
              <span className="flex-1 truncate">{ws.name}</span>
              {ws.plan === 'pro' && (
                <span className="rounded-full bg-brand-600/20 px-1.5 py-0.5 text-[10px] font-semibold text-brand-400">
                  Pro
                </span>
              )}
              {ws.id === activeId && <Check className="size-3.5 text-brand-500" />}
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
