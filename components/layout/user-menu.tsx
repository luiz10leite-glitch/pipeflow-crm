'use client'

import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react'
import { MOCK_USER } from '@/lib/mock-data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm',
          'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          'outline-none transition-colors cursor-pointer'
        )}
      >
        <Avatar size="sm">
          <AvatarFallback>{MOCK_USER.initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <span className="w-full truncate text-sm font-medium">{MOCK_USER.name}</span>
          <span className="w-full truncate text-xs text-muted-foreground">{MOCK_USER.email}</span>
        </div>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" sideOffset={6}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuItem>
            <User className="size-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="size-4" />
            Configurações
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut className="size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
