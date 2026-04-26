'use client'

import { useRef, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateWorkspace } from '@/app/actions/collaboration'

interface WorkspaceFormProps {
  name: string
  slug: string
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 40)
}

export function WorkspaceForm({ name, slug }: WorkspaceFormProps) {
  const [slugValue, setSlugValue] = useState(slug)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugValue(toSlug(e.target.value))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const data = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateWorkspace(data)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Workspace</CardTitle>
        <CardDescription>Nome e URL únicos do seu workspace no PipeFlow.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ws-name">Nome</Label>
            <Input
              id="ws-name"
              name="name"
              defaultValue={name}
              onChange={handleNameChange}
              placeholder="Minha Empresa"
              required
              minLength={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ws-slug">Slug (URL)</Label>
            <div className="flex items-center gap-0 overflow-hidden rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <span className="shrink-0 border-r border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                pipeflow.app/
              </span>
              <Input
                id="ws-slug"
                name="slug"
                value={slugValue}
                onChange={(e) => setSlugValue(e.target.value)}
                className="rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="minha-empresa"
                required
                pattern="[a-z0-9-]+"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Somente letras minúsculas, números e hífens.
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">Workspace atualizado com sucesso!</p>}

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
