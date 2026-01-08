import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url)
    const origin = requestUrl.origin
    const code = requestUrl.searchParams.get('code')
    const tokenHash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')
    
    // Check for hash fragment errors (Supabase sometimes uses hash fragments)
    const hash = requestUrl.hash
    const hashParams = new URLSearchParams(hash.replace('#', '?'))

    console.log('[auth-callback] Code:', code ? 'present' : 'missing', 'Token hash:', tokenHash ? 'present' : 'missing', 'Hash:', hash || 'none')

    // Check for errors in hash fragments
    const hashError = hashParams.get('error')
    const hashErrorCode = hashParams.get('error_code')
    const hashErrorDesc = hashParams.get('error_description')
    
    if (hashError || hashErrorCode) {
      console.error('[auth-callback] Hash fragment error detected:', { hashError, hashErrorCode, hashErrorDesc })
      // Redirect to login with a user-friendly message
      const errorMessage = hashErrorDesc || hashErrorCode || hashError || 'Link expired or invalid'
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorMessage)}`, origin))
    }

    const supabase = await createClient()
    
    // Handle magic link with token_hash
    if (tokenHash && type === 'magiclink') {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'magiclink'
      })
      
      if (error) {
        console.error('[auth-callback] Magic link verification error:', error)
        // Handle specific error codes
        if (error.message.includes('expired') || error.message.includes('invalid')) {
          return NextResponse.redirect(new URL('/login?error=link_expired', origin))
        }
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, origin))
      }

      if (!data?.user) {
        console.error('[auth-callback] No user data after magic link verification')
        return NextResponse.redirect(new URL('/login?error=no_user', origin))
      }

      // Extract custom metadata from magic link
      const userMetadata = data.user.user_metadata || {}
      const score = userMetadata.score
      const template = userMetadata.template
      const signupId = userMetadata.signupId
      const waitlistId = userMetadata.waitlistId

      console.log('[auth-callback] Success! User:', data.user.email)
      console.log('[auth-callback] Metadata:', { score, template, signupId, waitlistId })

      return NextResponse.redirect(new URL('/dashboard', origin))
    }

    // Handle OAuth/code flow (also handles magic links from signInWithOtp)
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[auth-callback] Exchange error:', error)
        // Handle specific error codes
        if (error.message.includes('expired') || error.message.includes('invalid') || error.message.includes('already been used')) {
          return NextResponse.redirect(new URL('/login?error=link_expired', origin))
        }
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, origin))
      }

      if (!data?.user) {
        console.error('[auth-callback] No user data after exchange')
        return NextResponse.redirect(new URL('/login?error=no_user', origin))
      }

      // Extract custom metadata from magic link (score, template, signupId, etc.)
      const userMetadata = data.user.user_metadata || {}
      const score = userMetadata.score
      const template = userMetadata.template
      const signupId = userMetadata.signupId
      const waitlistId = userMetadata.waitlistId

      console.log('[auth-callback] Success! User:', data.user.email)
      console.log('[auth-callback] Metadata:', { score, template, signupId, waitlistId })

      return NextResponse.redirect(new URL('/dashboard', origin))
    }

    // No code or token_hash provided
    console.error('[auth-callback] No code or token_hash parameter provided')
    return NextResponse.redirect(new URL('/login?error=missing_code', origin))
  } catch (error) {
    console.error('[auth-callback] Unexpected error:', error)
    const requestUrl = new URL(req.url)
    return NextResponse.redirect(new URL('/login?error=callback_failed', requestUrl.origin))
  }
}