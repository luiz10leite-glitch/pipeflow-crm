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
import { createDeal, updateDeal, deleteDeal } from '@/app/actions/deals'
import { STAGE_CONFIG, PIPELINE_STAGES } from '@/lib/constants'
import type { Lead, DealStage } from '@/types/supabase'
import type { DealWithLead } from '@/types/pipeline'

const schema = z.object({
  title:    z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  value:    z.number().min(0, 'Valor inválido'),
  stage:    z.enum(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']),
  lead_id:  z.string().optional(),
  due_date: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface DealFormProps {
  deal?: DealWithLead
  defaultStage?: DealStage
  leads: Pick<Lead, 'id' | 'name' | 'company'>[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SELECT_CLASSES =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function DealForm({ deal, defaultStage, leads, open, onOpenChange }: DealFormProps) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const isEditing = !!deal

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (open) {
      reset(
        deal
          ? {
              title:    deal.title,
              value:    deal.value,
              stage:    deal.stage,
              lead_id:  deal.lead_id ?? '',
              due_date: deal.due_date ?? '',
            }
          : {
              title:    '',
              value:    0,
              stage:    defaultStage ?? 'lead',
              lead_id:  '',
              due_date: '',
            }
      )
      setConfirmDelete(false)
    }
  }, [open, deal, defaultStage, reset])

  function onSubmit(data: FormData) {
    startTransition(async () => {
      const payload = {
        title:    data.title,
        value:    data.value,
        stage:    data.stage,
        lead_id:  data.lead_id || null,
        due_date: data.due_date || null,
      }

      if (isEditing && deal) {
        await updateDeal(deal.id, payload)
      } else {
        await createDeal(payload)
      }
      router.refresh()
      onOpenChange(false)
    })
  }

  function handleDeleteClick() {
    if (!deal) return
    if (!confirmDelete) { setConfirmDelete(true); return }
    startTransition(async () => {
      await deleteDeal(deal.id)
      router.refresh()
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Deal' : 'Novo Deal'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="df-title">Título *</Label>
              <Input
                id="df-title"
                placeholder="Ex: Plano Pro — Empresa X"
                aria-invalid={!!errors.title}
                {...register('title')}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="df-value">Valor (R$)</Label>
              <Input
                id="df-value"
                type="number"
                min="0"
                step="1"
                placeholder="5880"
                {...register('value', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="df-stage">Estágio</Label>
              <select id="df-stage" className={SELECT_CLASSES} {...register('stage')}>
                {PIPELINE_STAGES.map(s => (
                  <option key={s} value={s} className="bg-popover text-popover-foreground">
                    {STAGE_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="df-lead">Lead Vinculado</Label>
              <select id="df-lead" className={SELECT_CLASSES} {...register('lead_id')}>
                <option value="" className="bg-popover text-popover-foreground">Nenhum lead vinculado</option>
                {leads.map(l => (
                  <option key={l.id} value={l.id} className="bg-popover text-popover-foreground">
                    {l.name}{l.company ? ` — ${l.company}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="df-due">Prazo</Label>
              <Input id="df-due" type="date" {...register('due_date')} />
            </div>
          </div>

          <div className={`flex items-center gap-2 border-t pt-4 ${isEditing ? 'justify-between' : 'justify-end'}`}>
            {isEditing && (
              <Button type="button" variant="destructive" size="sm" onClick={handleDeleteClick} disabled={isPending}>
                {confirmDelete ? 'Confirmar exclusão' : 'Excluir Deal'}
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isEditing ? 'Salvar' : 'Criar Deal'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
