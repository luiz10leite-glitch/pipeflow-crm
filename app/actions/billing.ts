'use server'

import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getActiveWorkspace } from '@/lib/workspace'
import { stripe, STRIPE_PRO_PRICE_ID } from '@/lib/stripe'

async function getWorkspaceForBilling(supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>) {
  const base = await getActiveWorkspace(supabase)
  if (!base) return null

  const { data } = await supabase
    .from('workspaces')
    .select('id, plan, stripe_customer_id, stripe_subscription_id')
    .eq('id', base.id)
    .single()

  return data
}

export async function createCheckoutSession() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getWorkspaceForBilling(supabase)
  if (!workspace) redirect('/onboarding')

  if (workspace.plan === 'pro') redirect('/settings?tab=billing')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: STRIPE_PRO_PRICE_ID, quantity: 1 }],
    customer: workspace.stripe_customer_id ?? undefined,
    customer_email: workspace.stripe_customer_id ? undefined : user.email,
    metadata: { workspace_id: workspace.id },
    subscription_data: { metadata: { workspace_id: workspace.id } },
    success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/settings?tab=billing`,
  })

  redirect(session.url!)
}

export async function createBillingPortalSession() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const workspace = await getWorkspaceForBilling(supabase)
  if (!workspace) redirect('/onboarding')

  if (!workspace.stripe_customer_id) redirect('/settings?tab=billing')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: workspace.stripe_customer_id,
    return_url: `${appUrl}/settings?tab=billing`,
  })

  redirect(portalSession.url)
}
