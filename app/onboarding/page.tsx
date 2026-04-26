'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createWorkspace } from '@/app/actions/workspace'

const schema = z.object({
  workspaceName: z
    .string()
    .min(2, 'Nome deve ter ao menos 2 caracteres')
    .max(50, 'Nome muito longo'),
})

type FormData = z.infer<typeof schema>

export default function OnboardingPage() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { workspaceName: '' },
  })

  async function onSubmit({ workspaceName }: FormData) {
    setServerError(null)
    const fd = new FormData()
    fd.set('workspaceName', workspaceName)
    const result = await createWorkspace(fd)
    if (result?.error) setServerError(result.error)
  }

  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader className="space-y-1">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
          <Building2 className="h-5 w-5 text-brand-400" />
        </div>
        <CardTitle className="text-xl text-white">Crie seu workspace</CardTitle>
        <CardDescription className="text-neutral-400">
          Dê um nome para o seu espaço de trabalho. Você pode alterar isso depois.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {serverError && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {serverError}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="workspaceName" className="text-neutral-200">
              Nome do workspace
            </Label>
            <Input
              id="workspaceName"
              type="text"
              autoFocus
              placeholder="Ex: Agência Nova Era, Consultoria Leite & Co…"
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-brand-500"
              {...register('workspaceName')}
            />
            {errors.workspaceName && (
              <p className="text-xs text-danger-500">{errors.workspaceName.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white"
          >
            {isSubmitting ? 'Criando workspace…' : 'Continuar para o dashboard'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
