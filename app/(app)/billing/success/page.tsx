import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BillingSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <CheckCircle2 className="size-16 text-green-500" />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Plano Pro ativado!</h1>
        <p className="text-sm text-muted-foreground">
          Seu workspace agora tem acesso a todos os recursos Pro.
          <br />
          O plano pode levar alguns segundos para ser refletido.
        </p>
      </div>
      <Button render={<Link href="/settings?tab=billing" />} nativeButton={false}>
        Ver meu plano
      </Button>
    </div>
  )
}
