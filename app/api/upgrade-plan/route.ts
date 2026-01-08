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

    console.log('[upgrade-plan] Upgrading user:', user.id)

    // Use admin client to update user profile
    const adminSupabase = createAdminClient()

    const { data, error } = await adminSupabase
      .from('user_profiles')
      .update({
        plan_tier: 'pro',
        signup_limit: 1000,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()

    if (error) {
      console.error('[upgrade-plan] Failed to upgrade plan:', error)
      return NextResponse.json(
        { error: 'Failed to upgrade plan', details: error.message },
        { status: 500 }
      )
    }

    console.log('[upgrade-plan] Success:', data)

    return NextResponse.json({
      success: true,
      message: 'Plan upgraded to pro',
      userId: user.id,
      profile: data,
    })
  } catch (err: unknown) {
    console.error('[upgrade-plan] Error:', err)
    const errorMessage = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}
