import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase'

// Lazy initialization to avoid build-time errors when env vars aren't set
function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(stripeSecretKey, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  })
}

export async function POST(req: NextRequest) {
  try {
    // Get current user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate price ID
    const priceId = process.env.STRIPE_PRICE_ID_PRO
    if (!priceId) {
      console.error('STRIPE_PRICE_ID_PRO is not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Get the base URL for redirects
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    // Create Stripe checkout session
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard`,
      metadata: {
        user_id: user.id,
        email: user.email || '',
      },
      customer_email: user.email || undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    console.error('Error creating checkout session:', error)
    
    // Handle Stripe-specific errors
    const stripeError = error as { type?: string; message?: string }
    if (stripeError.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Invalid request to payment provider' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
