import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Webhook precisa do body cru — desabilita o body parser do Next.js
export const dynamic = 'force-dynamic'

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

async function activatePro(
  supabase: ReturnType<typeof getAdminClient>,
  workspaceId: string,
  customerId: string,
  subscriptionId: string
) {
  await supabase
    .from('workspaces')
    .update({
      plan: 'pro',
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
    })
    .eq('id', workspaceId)
}

async function deactivatePro(
  supabase: ReturnType<typeof getAdminClient>,
  subscriptionId: string
) {
  await supabase
    .from('workspaces')
    .update({
      plan: 'free',
      stripe_subscription_id: null,
    })
    .eq('stripe_subscription_id', subscriptionId)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const workspaceId = session.metadata?.workspace_id
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      if (!workspaceId) break

      await activatePro(supabase, workspaceId, customerId, subscriptionId)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const workspaceId = sub.metadata?.workspace_id

      if (!workspaceId) break

      // Sincroniza status: active/trialing = pro, qualquer outro = free
      const isActive = sub.status === 'active' || sub.status === 'trialing'

      if (isActive) {
        await activatePro(supabase, workspaceId, sub.customer as string, sub.id)
      } else {
        await deactivatePro(supabase, sub.id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await deactivatePro(supabase, sub.id)
      break
    }

    default:
      // Evento não tratado — ignora silenciosamente
      break
  }

  return NextResponse.json({ received: true })
}
