import { createClientBrowser } from '@/lib/supabase-client'

export interface LimitCheckResult {
  limitReached: boolean
  showUpgrade: boolean
  currentUsage: number
  limit: number
  planTier: string
  error?: string
}

// Client-side version for use in client components
export async function checkSignupLimitClient(userId: string): Promise<LimitCheckResult> {
  const supabase = createClientBrowser()
  
  // Get user's profile with plan details
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('plan_tier, signups_used_this_month, signup_limit')
    .eq('id', userId)
    .single()

  console.log('[checkSignupLimitClient] Query result:', { profile, error, userId })

  if (error) {
    console.error('Error fetching user profile:', error)
    return {
      limitReached: false,
      showUpgrade: false,
      currentUsage: 0,
      limit: 100,
      planTier: 'free',
      error: error.message,
    }
  }

  if (!profile) {
    console.log('[checkSignupLimitClient] No profile found for userId:', userId)
    return {
      limitReached: false,
      showUpgrade: false,
      currentUsage: 0,
      limit: 100,
      planTier: 'free',
    }
  }

  const currentUsage = profile.signups_used_this_month ?? 0
  const limit = profile.signup_limit ?? 100
  const planTier = profile.plan_tier ?? 'free'
  const limitReached = currentUsage >= limit

  console.log('[checkSignupLimitClient] Check result:', {
    planTier,
    currentUsage,
    limit,
    limitReached,
  })

  return {
    limitReached,
    showUpgrade: limitReached,
    currentUsage,
    limit,
    planTier,
  }
}
