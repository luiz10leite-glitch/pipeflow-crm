'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const schema = z
  .object({
    name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
    email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
    password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setServerError(null)
    const supabase = getSupabaseBrowserClient()
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.name },
      },
    })
    if (error) {
      setServerError(error.message)
      return
    }
    if (!authData.session) {
      setEmailSent(true)
      return
    }
    router.push('/onboarding')
    router.refresh()
  }

  if (emailSent) {
    return (
      <Card className="border-neutral-800 bg-neutral-900">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="font-medium text-white">Confirme seu e-mail</p>
            <p className="text-sm text-neutral-400">
              Enviamos um link de confirmação. Clique nele para ativar sua conta e
              continuar o cadastro.
            </p>
            <Link href="/login" className="mt-2 text-sm text-brand-400 hover:text-brand-300">
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
        <CardTitle className="text-xl text-white">Criar conta</CardTitle>
        <CardDescription className="text-neutral-400">
          Comece grátis, sem cartão de crédito
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {serverError && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {serverError}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-neutral-200">
              Nome completo
            </Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Ana Silva"
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-brand-500"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-danger-500">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-neutral-200">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-brand-500"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-danger-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-neutral-200">
              Confirmar senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repita a senha"
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-brand-500"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-danger-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white"
          >
            {isSubmitting ? 'Criando conta…' : 'Criar conta'}
          </Button>

          <p className="text-center text-sm text-neutral-400">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300">
              Entrar
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
