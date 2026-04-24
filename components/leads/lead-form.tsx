'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Lead, LeadStatus } from '@/types/lead'

const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'novo',        label: 'Novo' },
  { value: 'contato',     label: 'Contato' },
  { value: 'qualificado', label: 'Qualificado' },
  { value: 'proposta',    label: 'Proposta' },
  { value: 'negociacao',  label: 'Negociação' },
  { value: 'ganho',       label: 'Ganho' },
  { value: 'perdido',     label: 'Perdido' },
]

const schema = z.object({
  name:    z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email:   z.string().email('E-mail inválido'),
  phone:   z.string().min(1, 'Telefone obrigatório'),
  company: z.string().min(1, 'Empresa obrigatória'),
  role:    z.string(),
  status:  z.enum(['novo', 'contato', 'qualificado', 'proposta', 'negociacao', 'ganho', 'perdido']),
})

type FormData = z.infer<typeof schema>

export interface LeadFormData extends FormData {
  id?: string
}

interface LeadFormProps {
  lead?: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: LeadFormData) => void
  onDelete?: (id: string) => void
}

export function LeadForm({ lead, open, onOpenChange, onSave, onDelete }: LeadFormProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isEditing = !!lead

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (open) {
      reset(
        lead
          ? { name: lead.name, email: lead.email, phone: lead.phone, company: lead.company, role: lead.role, status: lead.status }
          : { name: '', email: '', phone: '', company: '', role: '', status: 'novo' }
      )
    }
  }, [open, lead, reset])

  function handleOpenChange(next: boolean) {
    if (!next) setConfirmDelete(false)
    onOpenChange(next)
  }

  function onSubmit(data: FormData) {
    onSave({ ...data, id: lead?.id })
    handleOpenChange(false)
  }

  function handleDeleteClick() {
    if (!lead || !onDelete) return
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete(lead.id)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="lf-name">Nome *</Label>
              <Input
                id="lf-name"
                placeholder="Nome completo"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lf-email">E-mail *</Label>
              <Input
                id="lf-email"
                type="email"
                placeholder="email@empresa.com"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lf-phone">Telefone</Label>
              <Input
                id="lf-phone"
                placeholder="(11) 99999-0000"
                {...register('phone')}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lf-company">Empresa *</Label>
              <Input
                id="lf-company"
                placeholder="Nome da empresa"
                aria-invalid={!!errors.company}
                {...register('company')}
              />
              {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lf-role">Cargo</Label>
              <Input
                id="lf-role"
                placeholder="Ex: Diretor Comercial"
                {...register('role')}
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="lf-status">Status</Label>
              <select
                id="lf-status"
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                {...register('status')}
              >
                {LEAD_STATUSES.map(s => (
                  <option key={s.value} value={s.value} className="bg-popover text-popover-foreground">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`flex items-center gap-2 border-t pt-4 ${isEditing ? 'justify-between' : 'justify-end'}`}>
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
              >
                {confirmDelete ? 'Confirmar exclusão' : 'Excluir Lead'}
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isEditing ? 'Salvar' : 'Criar Lead'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
