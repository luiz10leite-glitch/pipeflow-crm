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
import { MOCK_LEADS, STAGE_CONFIG, PIPELINE_STAGES } from '@/lib/mock-data'
import type { Deal, DealStage } from '@/types/pipeline'

const schema = z.object({
  title:       z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  value:       z.number().min(0, 'Valor inválido'),
  stage:       z.enum(['new_lead', 'contacted', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost']),
  leadId:      z.string().min(1, 'Selecione um lead'),
  responsible: z.string().min(1, 'Responsável obrigatório'),
  dueDate:     z.string().optional(),
})

type FormData = z.infer<typeof schema>

export interface DealFormData extends FormData {
  id?: string
}

interface DealFormProps {
  deal?: Deal
  defaultStage?: DealStage
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: DealFormData) => void
  onDelete?: (id: string) => void
}

const SELECT_CLASSES =
  'h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

export function DealForm({ deal, defaultStage, open, onOpenChange, onSave, onDelete }: DealFormProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isEditing = !!deal

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (open) {
      reset(
        deal
          ? {
              title:       deal.title,
              value:       deal.value,
              stage:       deal.stage,
              leadId:      deal.leadId,
              responsible: deal.responsible,
              dueDate:     deal.dueDate ?? '',
            }
          : {
              title:       '',
              value:       0,
              stage:       defaultStage ?? 'new_lead',
              leadId:      '',
              responsible: 'Lucas Mendes',
              dueDate:     '',
            }
      )
    }
  }, [open, deal, defaultStage, reset])

  function handleOpenChange(next: boolean) {
    if (!next) setConfirmDelete(false)
    onOpenChange(next)
  }

  function onSubmit(data: FormData) {
    onSave({ ...data, id: deal?.id, dueDate: data.dueDate || undefined })
    handleOpenChange(false)
  }

  function handleDeleteClick() {
    if (!deal || !onDelete) return
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete(deal.id)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Deal' : 'Novo Deal'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            {/* Title */}
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

            {/* Value */}
            <div className="space-y-1.5">
              <Label htmlFor="df-value">Valor (R$) *</Label>
              <Input
                id="df-value"
                type="number"
                min="0"
                step="1"
                placeholder="5880"
                aria-invalid={!!errors.value}
                {...register('value', { valueAsNumber: true })}
              />
              {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
            </div>

            {/* Stage */}
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

            {/* Lead */}
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="df-lead">Lead Vinculado *</Label>
              <select id="df-lead" className={SELECT_CLASSES} aria-invalid={!!errors.leadId} {...register('leadId')}>
                <option value="" className="bg-popover text-popover-foreground">Selecione um lead...</option>
                {MOCK_LEADS.map(l => (
                  <option key={l.id} value={l.id} className="bg-popover text-popover-foreground">
                    {l.name} — {l.company}
                  </option>
                ))}
              </select>
              {errors.leadId && <p className="text-xs text-destructive">{errors.leadId.message}</p>}
            </div>

            {/* Responsible */}
            <div className="space-y-1.5">
              <Label htmlFor="df-responsible">Responsável</Label>
              <Input
                id="df-responsible"
                placeholder="Nome do responsável"
                {...register('responsible')}
              />
            </div>

            {/* Due date */}
            <div className="space-y-1.5">
              <Label htmlFor="df-due">Prazo</Label>
              <Input
                id="df-due"
                type="date"
                {...register('dueDate')}
              />
            </div>
          </div>

          <div className={`flex items-center gap-2 border-t pt-4 ${isEditing ? 'justify-between' : 'justify-end'}`}>
            {isEditing && onDelete && (
              <Button type="button" variant="destructive" size="sm" onClick={handleDeleteClick}>
                {confirmDelete ? 'Confirmar exclusão' : 'Excluir Deal'}
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isEditing ? 'Salvar' : 'Criar Deal'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
