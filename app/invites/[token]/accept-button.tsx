'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { acceptInvite } from '@/app/actions/collaboration'

interface AcceptInviteButtonProps {
  token: string
  userEmail: string
}

export function AcceptInviteButton({ token, userEmail: _ }: AcceptInviteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleAccept() {
    startTransition(async () => {
      const result = await acceptInvite(token)
      if (result.error) {
        alert(result.error)
        return
      }
      router.push('/dashboard')
    })
  }

  return (
    <Button
      className="w-full gap-2 bg-brand-600 hover:bg-brand-700"
      onClick={handleAccept}
      disabled={isPending}
    >
      <CheckCircle2 className="size-4" />
      {isPending ? 'Aceitando…' : 'Aceitar convite'}
    </Button>
  )
}
