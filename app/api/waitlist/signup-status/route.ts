import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const signupId = searchParams.get('id')

    if (!signupId) {
      return NextResponse.json(
        { error: 'Missing signup ID' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Fetch signup with score and status
    const { data: signup, error } = await supabase
      .from('signups')
      .select('llm_score, status, scoring_metadata')
      .eq('id', signupId)
      .single()

    if (error || !signup) {
      return NextResponse.json(
        { error: 'Signup not found' },
        { status: 404 }
      )
    }

    // Determine status based on score
    let status: 'instant' | 'priority' | 'waitlist' | null = null
    if (signup.llm_score !== null && signup.llm_score !== undefined) {
      if (signup.llm_score >= 92) {
        status = 'instant'
      } else if (signup.llm_score >= 80) {
        status = 'priority'
      } else {
        status = 'waitlist'
      }
    }

    return NextResponse.json({
      score: signup.llm_score,
      status: status || 'waitlist',
      rawStatus: signup.status
    })
  } catch (error: unknown) {
    console.error('Error fetching signup status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
