'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  workspaceName: z
    .string()
    .min(2, 'Nome deve ter ao menos 2 caracteres')
    .max(50, 'Nome muito longo'),
})

type FormData = z.infer<typeof schema>

export default function OnboardingPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { workspaceName: '' },
  })

  async function onSubmit() {
    // Fake delay — será substituído pela criação real no M10
    await new Promise((r) => setTimeout(r, 800))
    router.push('/dashboard')
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
