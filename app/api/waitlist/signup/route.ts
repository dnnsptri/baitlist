import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { 
      waitlistId, 
      email, 
      name, 
      company, 
      role, 
      companySize,
      answerProblem, 
      answerWorkflow, 
      answerAlternatives, 
      answerSuccess, 
      answerSource
    } = await req.json()

    // 1. Validate required fields
    if (!waitlistId || !email || !name || !answerProblem || !answerWorkflow || 
        !answerAlternatives || !answerSuccess || !answerSource) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS for public signups
    const supabase = createAdminClient()

    // 2. Check if waitlist exists
    const { data: waitlist, error: waitlistError } = await supabase
      .from('waitlists')
      .select('id, name')
      .eq('id', waitlistId)
      .single()

    if (waitlistError || !waitlist) {
      return NextResponse.json(
        { error: 'Waitlist not found' }, 
        { status: 404 }
      )
    }

    // 3. Check if email already signed up to this waitlist
    const { data: existing } = await supabase
      .from('signups')
      .select('id')
      .eq('waitlist_id', waitlistId)
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered for this waitlist' }, 
        { status: 400 }
      )
    }

    // 4. Create signup with pending status
    const { data: signup, error: insertError } = await supabase
      .from('signups')
      .insert({
        waitlist_id: waitlistId,
        email: email,
        name: name,
        company: company || null,
        role: role || null,
        company_size: companySize || null,
        answer_problem: answerProblem,
        answer_workflow: answerWorkflow,
        answer_alternatives: answerAlternatives,
        answer_success: answerSuccess,
        answer_source: answerSource,
        status: 'pending',
        llm_score: null,
        position: null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Signup creation error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create signup' }, 
        { status: 500 }
      )
    }

    // 5. Score the signup synchronously (wait for scoring to complete)
    // Use the request URL to construct the internal API URL
    const requestUrl = new URL(req.url)
    const baseUrl = requestUrl.origin
    
    try {
      const scoringResponse = await fetch(`${baseUrl}/api/score-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signupId: signup.id,
          waitlistId: waitlistId,
          waitlistName: waitlist.name,
          answers: {
            problem: answerProblem,
            workflow: answerWorkflow,
            alternatives: answerAlternatives,
            success: answerSuccess,
            source: answerSource
          }
        })
      })

      const scoringData = await scoringResponse.json()

      if (scoringResponse.ok && scoringData.score !== undefined) {
        // Determine status for thank-you page
        let status: 'instant' | 'priority' | 'waitlist'
        if (scoringData.score >= 92) {
          status = 'instant'
        } else if (scoringData.score >= 80) {
          status = 'priority'
        } else {
          status = 'waitlist'
        }

        // 6. Return success with score and status
        return NextResponse.json({
          success: true,
          signupId: signup.id,
          score: scoringData.score,
          status: status,
          position: scoringData.position,
          message: 'Processing your submission...'
        })
      }
    } catch (err) {
      console.error('Error scoring signup:', err)
      // Continue to return response even if scoring fails
    }

    // Fallback: Return success without score (scoring may still happen async)
    return NextResponse.json({
      success: true,
      signupId: signup.id,
      score: null,
      status: 'waitlist',
      message: 'Processing your submission...'
    })

  } catch (error: unknown) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
