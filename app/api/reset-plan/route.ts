import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(_req: NextRequest) {
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

    // Use admin client to update user profile
    const adminSupabase = createAdminClient()

    const { error } = await adminSupabase
      .from('user_profiles')
      .update({
        plan_tier: 'free',
        signup_limit: 100,
        stripe_customer_id: null,
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      console.error('[reset-plan] Failed to reset plan:', error)
      return NextResponse.json(
        { error: 'Failed to reset plan', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Plan reset to free',
      userId: user.id,
    })
  } catch (err: unknown) {
    console.error('[reset-plan] Error:', err)
    const errorMessage = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}
