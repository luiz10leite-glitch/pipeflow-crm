'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
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
import { createLead, updateLead, deleteLead } from '@/app/actions/leads'
import type { Lead, LeadStatus } from '@/types/supabase'

const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new',         label: 'Novo' },
  { value: 'contacted',   label: 'Contato' },
  { value: 'qualified',   label: 'Qualificado' },
  { value: 'unqualified', label: 'Desqualificado' },
  { value: 'converted',   label: 'Convertido' },
]

const schema = z.object({
  name:      z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email:     z.string().email('E-mail inválido').or(z.literal('')),
  phone:     z.string().optional(),
  company:   z.string().optional(),
  job_title: z.string().optional(),
  status:    z.enum(['new', 'contacted', 'qualified', 'unqualified', 'converted']),
})

type FormData = z.infer<typeof schema>

export interface LeadFormData extends FormData {
  id?: string
}

interface LeadFormProps {
  lead?: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadForm({ lead, open, onOpenChange }: LeadFormProps) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const isEditing = !!lead

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset(
        lead
          ? {
              name:      lead.name,
              email:     lead.email ?? '',
              phone:     lead.phone ?? '',
              company:   lead.company ?? '',
              job_title: lead.job_title ?? '',
              status:    lead.status,
            }
          : { name: '', email: '', phone: '', company: '', job_title: '', status: 'new' }
      )
      setConfirmDelete(false)
    }
  }, [open, lead, reset])

  function handleOpenChange(next: boolean) {
    if (!next) setServerError(null)
    onOpenChange(next)
  }

  function onSubmit(data: FormData) {
    setServerError(null)
    startTransition(async () => {
      if (isEditing && lead) {
        await updateLead(lead.id, {
          name:      data.name,
          email:     data.email || null,
          phone:     data.phone || null,
          company:   data.company || null,
          job_title: data.job_title || null,
          status:    data.status,
        })
        router.refresh()
        handleOpenChange(false)
      } else {
        const result = await createLead({
          name:      data.name,
          email:     data.email || null,
          phone:     data.phone || null,
          company:   data.company || null,
          job_title: data.job_title || null,
          status:    data.status,
        })
        if ('error' in result && result.error) {
          setServerError(String(result.error))
          return
        }
        router.refresh()
        handleOpenChange(false)
      }
    })
  }

  function handleDeleteClick() {
    if (!lead) return
    if (!confirmDelete) { setConfirmDelete(true); return }
    startTransition(async () => {
      await deleteLead(lead.id)
      router.refresh()
      handleOpenChange(false)
    })
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
              <Label htmlFor="lf-email">E-mail</Label>
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
              <Input id="lf-phone" placeholder="(11) 99999-0000" {...register('phone')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lf-company">Empresa</Label>
              <Input id="lf-company" placeholder="Nome da empresa" {...register('company')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lf-job_title">Cargo</Label>
              <Input id="lf-job_title" placeholder="Ex: Diretor Comercial" {...register('job_title')} />
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

          {serverError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <div className={`flex items-center gap-2 border-t pt-4 ${isEditing ? 'justify-between' : 'justify-end'}`}>
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
                disabled={isPending}
              >
                {confirmDelete ? 'Confirmar exclusão' : 'Excluir Lead'}
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isEditing ? 'Salvar' : 'Criar Lead'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
