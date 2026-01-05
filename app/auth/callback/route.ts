import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url)
    const code = requestUrl.searchParams.get('code')

    console.log('[auth-callback] Code:', code ? 'present' : 'missing')

    if (code) {
      const supabase = await createClient()
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[auth-callback] Exchange error:', error)
        return NextResponse.redirect(new URL(`/login?error=${error.message}`, req.url))
      }

      console.log('[auth-callback] Success! User:', data.user?.email)
    }

    return NextResponse.redirect(new URL('/dashboard', req.url))
  } catch (error) {
    console.error('[auth-callback] Unexpected error:', error)
    return NextResponse.redirect(new URL('/login?error=callback_failed', req.url))
  }
}