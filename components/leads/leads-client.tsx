'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, LayoutGrid, Table2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LeadStatusBadge, STATUS_CONFIG } from './lead-status-badge'
import { LeadCard } from './lead-card'
import { LeadForm, type LeadFormData } from './lead-form'
import { MOCK_LEADS, MOCK_USER } from '@/lib/mock-data'
import type { Lead, LeadStatus } from '@/types/lead'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

type ViewMode = 'table' | 'grid'
type StatusFilter = LeadStatus | 'todos'

export function LeadsClient() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [view, setView] = useState<ViewMode>('table')
  const [formOpen, setFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | undefined>()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return leads.filter(lead => {
      const matchesSearch =
        q === '' ||
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [leads, search, statusFilter])

  function handleSave(data: LeadFormData) {
    if (data.id) {
      setLeads(prev =>
        prev.map(l =>
          l.id === data.id
            ? { ...l, name: data.name, email: data.email, phone: data.phone, company: data.company, role: data.role, status: data.status }
            : l
        )
      )
    } else {
      const newLead: Lead = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        role: data.role,
        status: data.status,
        owner: MOCK_USER.name,
        createdAt: new Date().toISOString().split('T')[0],
        activities: [],
      }
      setLeads(prev => [newLead, ...prev])
    }
  }

  function handleDelete(id: string) {
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  function handleEdit(lead: Lead) {
    setEditingLead(lead)
    setFormOpen(true)
  }

  function handleNewLead() {
    setEditingLead(undefined)
    setFormOpen(true)
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open)
    if (!open) setEditingLead(undefined)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Leads</h2>
          <p className="text-sm text-muted-foreground">
            {leads.length} contato{leads.length !== 1 ? 's' : ''} no workspace
          </p>
        </div>
        <Button onClick={handleNewLead}>
          <Plus className="size-4" />
          Novo Lead
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por nome ou empresa…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusFilter)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        >
          <option value="todos" className="bg-popover">Todos os status</option>
          {(Object.entries(STATUS_CONFIG) as [LeadStatus, { label: string }][]).map(([value, { label }]) => (
            <option key={value} value={value} className="bg-popover">{label}</option>
          ))}
        </select>

        <div className="flex rounded-lg border border-input overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-none border-0 ${view === 'table' ? 'bg-muted' : ''}`}
            onClick={() => setView('table')}
            title="Visualização em tabela"
          >
            <Table2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-none border-0 ${view === 'grid' ? 'bg-muted' : ''}`}
            onClick={() => setView('grid')}
            title="Visualização em grade"
          >
            <LayoutGrid className="size-4" />
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-border py-16 text-center">
          <p className="text-sm font-medium">Nenhum lead encontrado</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {search || statusFilter !== 'todos'
              ? 'Tente ajustar os filtros de busca.'
              : 'Crie o primeiro lead clicando em "Novo Lead".'}
          </p>
        </div>
      )}

      {/* Table view */}
      {view === 'table' && filtered.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden sm:table-cell">Empresa</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden md:table-cell">Responsável</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground hidden lg:table-cell">Criado em</th>
                <th className="px-4 py-2.5 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr
                  key={lead.id}
                  onClick={() => router.push(`/leads/${lead.id}`)}
                  className="group border-b border-border/50 last:border-0 cursor-pointer transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{lead.name}</p>
                        <p className="text-xs text-muted-foreground truncate sm:hidden">{lead.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {lead.company}
                  </td>
                  <td className="px-4 py-3">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {lead.owner}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={e => { e.stopPropagation(); handleEdit(lead) }}
                    >
                      <Pencil className="size-3.5" />
                      <span className="sr-only">Editar {lead.name}</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid view */}
      {view === 'grid' && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(lead => (
            <LeadCard key={lead.id} lead={lead} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Form dialog */}
      <LeadForm
        lead={editingLead}
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
