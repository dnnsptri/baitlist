import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'

// Required for Stripe webhooks - prevents body parsing
export const runtime = 'nodejs'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Log at module load time to verify the route is registered
console.log('[stripe-webhook] Route module loaded', {
  hasStripeKey: !!stripeSecretKey,
  hasWebhookSecret: !!webhookSecret,
  timestamp: new Date().toISOString(),
})

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

export async function POST(req: NextRequest) {
  // FIRST LOG - should appear for ANY request to this endpoint
  console.log('[stripe-webhook] ====== WEBHOOK RECEIVED ======')
  console.log('[stripe-webhook] Request URL:', req.url)
  console.log('[stripe-webhook] Request method:', req.method)
  console.log('[stripe-webhook] Timestamp:', new Date().toISOString())

  if (!webhookSecret) {
    console.error('[stripe-webhook] Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const sig = req.headers.get('stripe-signature')
  console.log('[stripe-webhook] Stripe signature present:', !!sig)
  
  if (!sig) {
    console.error('[stripe-webhook] Missing stripe-signature header')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  let rawBody: string

  try {
    rawBody = await req.text()
    console.log('[stripe-webhook] Raw body length:', rawBody.length)
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
    console.log('[stripe-webhook] Event verified successfully, type:', event.type)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('[stripe-webhook] Signature verification failed:', errorMessage)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('[stripe-webhook] Processing event type:', event.type)

  if (event.type !== 'checkout.session.completed') {
    console.log('[stripe-webhook] Ignoring event type:', event.type)
    return NextResponse.json({ received: true })
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('[stripe-webhook] Session ID:', session.id)
    console.log('[stripe-webhook] Session metadata:', JSON.stringify(session.metadata))

    const userId = session.metadata?.user_id
    if (!userId) {
      console.error('[stripe-webhook] Missing user_id in session metadata', {
        sessionId: session.id,
        metadata: session.metadata,
      })
      return NextResponse.json({ error: 'Missing user_id metadata' }, { status: 400 })
    }

    console.log('[stripe-webhook] User ID from metadata:', userId)

    const customerId =
      typeof session.customer === 'string' ? session.customer : session.customer?.id
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : (session.subscription as { id?: string } | null)?.id

    console.log('[stripe-webhook] Customer ID:', customerId)
    console.log('[stripe-webhook] Subscription ID:', subscriptionId)

    if (!customerId || !subscriptionId) {
      console.error('[stripe-webhook] Missing customer/subscription on session', {
        sessionId: session.id,
        customerId: !!customerId,
        subscriptionId: !!subscriptionId,
      })
      return NextResponse.json({ received: true })
    }

    console.log('[stripe-webhook] Creating Supabase admin client...')
    const supabase = createAdminClient()

    console.log('[stripe-webhook] Updating user_profiles where id =', userId)
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        plan_tier: 'pro',
        signup_limit: 1000,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('[stripe-webhook] Supabase update failed:', error)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }

    console.log('[stripe-webhook] Supabase update result:', JSON.stringify(data))
    console.log('[stripe-webhook] ====== SUCCESS: User upgraded to pro ======', {
      userId,
      customerId,
      subscriptionId,
      sessionId: session.id,
    })

    return NextResponse.json({ received: true })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('[stripe-webhook] Handler error:', errorMessage)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// GET handler for testing if the route is accessible
export async function GET() {
  console.log('[stripe-webhook] GET request received - route is accessible')
  return NextResponse.json({ 
    status: 'Webhook endpoint is accessible',
    hasWebhookSecret: !!webhookSecret,
    timestamp: new Date().toISOString(),
  })
}