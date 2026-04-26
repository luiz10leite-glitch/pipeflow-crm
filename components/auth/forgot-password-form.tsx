'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
})

type FormData = z.infer<typeof schema>

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    })
    // Sempre mostra sucesso para não expor quais e-mails existem
    setSent(true)
  }

  if (sent) {
    return (
      <Card className="border-neutral-800 bg-neutral-900">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle className="h-10 w-10 text-success-500" />
            <p className="font-medium text-white">Instruções enviadas!</p>
            <p className="text-sm text-neutral-400">
              Se <span className="text-neutral-200">{getValues('email')}</span> estiver
              cadastrado, você receberá um link de redefinição em instantes.
            </p>
            <Link
              href="/login"
              className="mt-2 text-sm text-brand-400 hover:text-brand-300"
            >
              Voltar ao login
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-white">Redefinir senha</CardTitle>
        <CardDescription className="text-neutral-400">
          Informe seu e-mail e enviaremos as instruções
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-neutral-200">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="voce@empresa.com"
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-brand-500"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-danger-500">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white"
          >
            {isSubmitting ? 'Enviando…' : 'Enviar instruções'}
          </Button>

          <p className="text-center text-sm text-neutral-400">
            <Link href="/login" className="text-brand-400 hover:text-brand-300">
              Voltar ao login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
