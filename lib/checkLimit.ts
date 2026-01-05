import { createClient } from '@/lib/supabase'

export interface LimitCheckResult {
  limitReached: boolean
  showUpgrade: boolean
  currentUsage: number
  limit: number
  planTier: string
  error?: string
}

// Server-side version for use in Server Components and API routes
export async function checkSignupLimit(userId: string): Promise<LimitCheckResult> {
  const supabase = await createClient()

  // Get user's profile with plan details
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('plan_tier, signups_used_this_month, signup_limit')
    .eq('user_id', userId)
    .single()

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
    // No profile found - assume free tier defaults
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

  return {
    limitReached,
    showUpgrade: limitReached,
    currentUsage,
    limit,
    planTier,
  }
}
