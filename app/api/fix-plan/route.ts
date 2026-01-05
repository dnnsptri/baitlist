import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Direct fix endpoint - bypasses auth check
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({ 
      error: 'Missing env vars',
      hasUrl: !!url,
      hasServiceKey: !!serviceKey,
    }, { status: 500 })
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  // First, check current state
  const { data: before, error: readError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  console.log('[fix-plan] Before:', before, readError)

  if (readError) {
    return NextResponse.json({ error: 'User not found', details: readError }, { status: 404 })
  }

  // Update to pro
  const { data: after, error: updateError } = await supabase
    .from('user_profiles')
    .update({
      plan_tier: 'pro',
      signup_limit: 1000,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()

  console.log('[fix-plan] After:', after, updateError)

  if (updateError) {
    return NextResponse.json({ 
      error: 'Update failed', 
      details: updateError,
      before 
    }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    before,
    after,
  })
}
