'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const score = searchParams.get('score')
  const status = searchParams.get('status') // 'instant', 'priority', 'waitlist'
  const [polling, setPolling] = useState(false)

  // If score is not in URL, try to get signupId and poll for it
  const signupId = searchParams.get('signupId')
  
  useEffect(() => {
    if (!score && signupId) {
      // Poll for score if not available yet
      setPolling(true)
      const pollForScore = async () => {
        let attempts = 0
        const maxAttempts = 30 // 30 seconds max

        const poll = async () => {
          try {
            const response = await fetch(`/api/waitlist/signup-status?id=${signupId}`)
            const data = await response.json()
            
            if (data.score !== null && data.score !== undefined) {
              // Update URL with score and status
              const newStatus = data.score >= 92 ? 'instant' : data.score >= 80 ? 'priority' : 'waitlist'
              router.replace(`/thank-you?score=${data.score}&status=${newStatus}`)
              setPolling(false)
              return
            }

            attempts++
            if (attempts < maxAttempts) {
              setTimeout(poll, 1000)
            } else {
              setPolling(false)
            }
          } catch (err) {
            console.error('Error polling for score:', err)
            setPolling(false)
          }
        }

        poll()
      }

      pollForScore()
    }
  }, [score, signupId, router])

  const getStatusMessage = () => {
    switch (status) {
      case 'instant':
        return {
          emoji: '🎉',
          title: "You're in!",
          message: "Check your email for instant access.",
          subMessage: "We sent a magic link to get started.",
        }
      case 'priority':
        return {
          emoji: '👀',
          title: "You're on our priority list.",
          message: "We'll review your application and get back to you within 24 hours.",
          subMessage: "Keep an eye on your inbox!",
        }
      case 'waitlist':
      default:
        return {
          emoji: '📋',
          title: "You're on the waitlist.",
          message: "We'll notify you when spots open up. Stay tuned!",
          subMessage: "Thanks for your interest!",
        }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">{statusInfo.emoji}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{statusInfo.title}</h1>
        
        {score && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Score</p>
            <p className="text-5xl font-bold text-blue-600">{score}/100</p>
          </div>
        )}

        {polling ? (
          <>
            <div className="my-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
            <p className="text-gray-600 mb-4">Calculating your score...</p>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-700 mb-2">{statusInfo.message}</p>
            <p className="text-gray-600 mb-6">{statusInfo.subMessage}</p>
          </>
        )}

        {status === 'instant' && !polling && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              💌 Check your email inbox for the magic link to get started right away!
            </p>
          </div>
        )}

        {status === 'priority' && !polling && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              ⏰ We&apos;ll prioritize your application and get back to you within 24 hours.
            </p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-4">
            {status === 'instant' 
              ? 'Want to help others get access?'
              : 'Want to move up faster?'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                const text = `I just joined the waitlist! Check it out:`
                const url = window.location.origin
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
              }}
              className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ThankYou() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}