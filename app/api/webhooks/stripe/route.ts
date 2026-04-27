import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function POST(request: Request) {
  // Body raw — Stripe rejeita qualquer parser antes de constructEvent
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
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
      if (!workspaceId) break

      await supabase
        .from('workspaces')
        .update({
          plan: 'pro',
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq('id', workspaceId)

      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const workspaceId = sub.metadata?.workspace_id
      if (!workspaceId) break

      await supabase
        .from('workspaces')
        .update({
          plan: 'free',
          stripe_subscription_id: null,
        })
        .eq('id', workspaceId)

      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      // invoice.subscription_details.metadata tem workspace_id quando a sub foi criada com metadata
      const workspaceId =
        (invoice as unknown as { subscription_details?: { metadata?: { workspace_id?: string } } })
          .subscription_details?.metadata?.workspace_id

      if (!workspaceId) break

      // WorkspacePlan só tem 'free' | 'pro' — para bloquear acesso em falha de pagamento,
      // adicione 'past_due' ao enum no banco e regenere os tipos com supabase gen types.
      // Por ora apenas loga o evento sem alterar o plano.
      console.warn('[stripe] invoice.payment_failed workspace:', workspaceId)

      break
    }
  }

  return NextResponse.json({ received: true })
}
