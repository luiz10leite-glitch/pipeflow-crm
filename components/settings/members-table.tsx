'use client'

import { useTransition } from 'react'
import { MoreHorizontal, Crown, RefreshCw, Trash2, Mail } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { removeMember, updateMemberRole, resendInvite, revokeInvite } from '@/app/actions/collaboration'
import type { MemberRole } from '@/types/supabase'

export interface MemberRow {
  id: string
  userId: string
  name: string
  email: string
  role: MemberRole
  isCurrentUser: boolean
}

export interface InviteRow {
  id: string
  email: string
  role: MemberRole
  expiresAt: string
  accepted: boolean
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase()
}

function RoleBadge({ role }: { role: MemberRole }) {
  return role === 'admin' ? (
    <Badge variant="secondary" className="gap-1 text-amber-600">
      <Crown className="size-3" />
      Admin
    </Badge>
  ) : (
    <Badge variant="outline">Membro</Badge>
  )
}

function MemberActions({
  member,
  isFree,
  memberCount,
}: {
  member: MemberRow
  isFree: boolean
  memberCount: number
}) {
  const [isPending, startTransition] = useTransition()

  if (member.isCurrentUser) {
    return <span className="text-xs text-muted-foreground">Você</span>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" disabled={isPending} />}>
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Ações</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            startTransition(async () => {
              await updateMemberRole(member.id, member.role === 'admin' ? 'member' : 'admin')
            })
          }
        >
          <Crown className="size-4" />
          {member.role === 'admin' ? 'Rebaixar para Membro' : 'Promover para Admin'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() =>
            startTransition(async () => {
              await removeMember(member.id)
            })
          }
        >
          <Trash2 className="size-4" />
          Remover do workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function InviteActions({ invite }: { invite: InviteRow }) {
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8" disabled={isPending} />}>
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Ações do convite</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            startTransition(async () => {
              await resendInvite(invite.id)
            })
          }
        >
          <RefreshCw className="size-4" />
          Reenviar convite
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() =>
            startTransition(async () => {
              await revokeInvite(invite.id)
            })
          }
        >
          <Trash2 className="size-4" />
          Revogar convite
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface MembersTableProps {
  members: MemberRow[]
  invites: InviteRow[]
  isFree: boolean
}

export function MembersTable({ members, invites, isFree }: MembersTableProps) {
  const pendingInvites = invites.filter((i) => !i.accepted)

  return (
    <div className="space-y-1">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50"
        >
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-none">
              {member.name}
              {member.isCurrentUser && (
                <span className="ml-1.5 text-xs text-muted-foreground">(você)</span>
              )}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{member.email}</p>
          </div>
          <RoleBadge role={member.role} />
          <MemberActions member={member} isFree={isFree} memberCount={members.length} />
        </div>
      ))}

      {pendingInvites.length > 0 && (
        <>
          <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Convites pendentes
          </p>
          {pendingInvites.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Mail className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-none">{invite.email}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Expira em{' '}
                  {new Date(invite.expiresAt).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Pendente
              </Badge>
              <RoleBadge role={invite.role} />
              <InviteActions invite={invite} />
            </div>
          ))}
        </>
      )}

      {members.length === 0 && pendingInvites.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum membro encontrado.
        </p>
      )}
    </div>
  )
}
