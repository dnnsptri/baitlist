import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url)
    const origin = requestUrl.origin
    const code = requestUrl.searchParams.get('code')

    console.log('[auth-callback] Code:', code ? 'present' : 'missing')

    if (!code) {
      console.error('[auth-callback] No code parameter provided')
      return NextResponse.redirect(new URL('/login?error=missing_code', origin))
    }

    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('[auth-callback] Exchange error:', error)
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, origin))
    }

    if (!data?.user) {
      console.error('[auth-callback] No user data after exchange')
      return NextResponse.redirect(new URL('/login?error=no_user', origin))
    }

    console.log('[auth-callback] Success! User:', data.user.email)
    return NextResponse.redirect(new URL('/dashboard', origin))
  } catch (error) {
    console.error('[auth-callback] Unexpected error:', error)
    const requestUrl = new URL(req.url)
    return NextResponse.redirect(new URL('/login?error=callback_failed', requestUrl.origin))
  }
}