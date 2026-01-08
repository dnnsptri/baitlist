'use client'

import { useState, useEffect } from 'react'
import { createClientBrowser } from '@/lib/supabase-client'
import { useParams, useRouter } from 'next/navigation'

interface Waitlist {
  id: string
  name: string
  description: string | null
}

export default function PublicSignupPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [waitlist, setWaitlist] = useState<Waitlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [position, setPosition] = useState<number | null>(null)
  const [error, setError] = useState('')

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [answerProblem, setAnswerProblem] = useState('')
  const [answerWorkflow, setAnswerWorkflow] = useState('')
  const [answerAlternatives, setAnswerAlternatives] = useState('')
  const [answerSuccess, setAnswerSuccess] = useState('')
  const [answerSource, setAnswerSource] = useState('')

  useEffect(() => {
    const fetchWaitlist = async () => {
      const supabase = createClientBrowser()
      const { data, error } = await supabase
        .from('waitlists')
        .select('id, name, description')
        .eq('id', id)
        .single()

      if (error || !data) {
        setError('Waitlist not found')
      } else {
        setWaitlist(data)
      }
      setLoading(false)
    }

    fetchWaitlist()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/waitlist/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waitlistId: id,
          name,
          email,
          company: company || null,
          role: role || null,
          companySize: companySize || null,
          answerProblem,
          answerWorkflow,
          answerAlternatives,
          answerSuccess,
          answerSource,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to sign up')
        return
      }

      // Redirect to thank-you page with score and status
      if (data.score !== null && data.score !== undefined && data.status) {
        router.push(`/thank-you?score=${data.score}&status=${data.status}`)
      } else {
        // If score not ready, redirect with signupId for polling
        router.push(`/thank-you?signupId=${data.signupId}`)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }


  const shareOnTwitter = () => {
    const text = `I just joined the waitlist for ${waitlist?.name}! I'm #${position} in line. Check it out:`
    const url = window.location.href
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !waitlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Waitlist Not Found</h1>
          <p className="text-gray-600">This waitlist doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">You&apos;re on the list!</h1>
          
          {position !== null ? (
            <>
              <p className="text-6xl font-bold text-blue-600 my-6">#{position}</p>
              <p className="text-gray-600 mb-8">You&apos;re position #{position} in line</p>
            </>
          ) : (
            <>
              <div className="my-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
              <p className="text-gray-600 mb-8">Calculating your position...</p>
            </>
          )}

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-4">Move up the list by sharing:</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={shareOnTwitter}
                className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>
              <button
                onClick={copyReferralLink}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {waitlist?.name}
            </h1>
            {waitlist?.description && (
              <p className="text-gray-600">{waitlist.description}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#2a2a2a]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#2a2a2a]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#2a2a2a]"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role/Title
                </label>
                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#2a2a2a]"
                  placeholder="e.g. Product Manager"
                />
              </div>

              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select
                  id="companySize"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#2a2a2a]"
                >
                  <option value="">Select...</option>
                  <option value="1">Just me</option>
                  <option value="2-10">2-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-1000">201-1,000</option>
                  <option value="1000+">1,000+</option>
                </select>
              </div>
            </div>

            <hr className="my-8" />

            {/* Qualifying Questions */}
            <div>
              <label htmlFor="answerProblem" className="block text-sm font-medium text-gray-700 mb-1">
                What problem are you trying to solve? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="answerProblem"
                value={answerProblem}
                onChange={(e) => setAnswerProblem(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[#2a2a2a]"
                placeholder="Describe the challenge you're facing..."
              />
            </div>

            <div>
              <label htmlFor="answerWorkflow" className="block text-sm font-medium text-gray-700 mb-1">
                How would you use {waitlist?.name} in your workflow? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="answerWorkflow"
                value={answerWorkflow}
                onChange={(e) => setAnswerWorkflow(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[#2a2a2a]"
                placeholder="Describe how you'd integrate this into your work..."
              />
            </div>

            <div>
              <label htmlFor="answerAlternatives" className="block text-sm font-medium text-gray-700 mb-1">
                What alternatives have you tried, and what&apos;s missing? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="answerAlternatives"
                value={answerAlternatives}
                onChange={(e) => setAnswerAlternatives(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[#2a2a2a]"
                placeholder="Tell us about other solutions you've explored..."
              />
            </div>

            <div>
              <label htmlFor="answerSuccess" className="block text-sm font-medium text-gray-700 mb-1">
                What would success look like for you? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="answerSuccess"
                value={answerSuccess}
                onChange={(e) => setAnswerSuccess(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[#2a2a2a]"
                placeholder="Describe your ideal outcome..."
              />
            </div>

            <div>
              <label htmlFor="answerSource" className="block text-sm font-medium text-gray-700 mb-1">
                How did you hear about us? <span className="text-red-500">*</span>
              </label>
              <input
                id="answerSource"
                type="text"
                value={answerSource}
                onChange={(e) => setAnswerSource(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#2a2a2a]"
                placeholder="e.g. Twitter, friend, Product Hunt..."
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Powered by <span className="font-medium">🎣 BaitList</span>
        </p>
      </div>
    </div>
  )
}
