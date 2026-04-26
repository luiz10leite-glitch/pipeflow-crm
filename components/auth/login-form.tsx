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

const schema = z.object({
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type FormData = z.infer<typeof schema>

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setServerError(null)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setServerError(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou senha inválidos.'
          : error.message
      )
      return
    }
    const destination = next && next.startsWith('/') ? next : '/dashboard'
    router.push(destination)
    router.refresh()
  }

  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-white">Entrar</CardTitle>
        <CardDescription className="text-neutral-400">
          Acesse sua conta PipeFlow
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-neutral-200">
                Senha
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-brand-400 hover:text-brand-300"
              >
                Esqueci minha senha
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-brand-500"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-danger-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white"
          >
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>

          <p className="text-center text-sm text-neutral-400">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-brand-400 hover:text-brand-300">
              Criar conta
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
