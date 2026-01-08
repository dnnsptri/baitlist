'use client'

import { useState } from 'react'
import ExitSurvey from './ExitSurvey'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentSignups?: number
  signupLimit?: number
  onFeedbackSent?: () => void
}

export default function UpgradeModal({
  isOpen,
  onClose,
  currentSignups = 0,
  signupLimit = 100,
  onFeedbackSent,
}: UpgradeModalProps) {
  const [showSurvey, setShowSurvey] = useState(false)
  const [startingCheckout, setStartingCheckout] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleUpgrade = async () => {
    setCheckoutError(null)
    setStartingCheckout(true)
    try {
      const res = await fetch('/api/create-checkout', { method: 'POST' })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to start checkout')
      }

      if (!data?.url) {
        throw new Error('No checkout URL returned')
      }

      // Use a hard redirect so Stripe opens reliably in the same tab.
      window.location.href = data.url
    } catch (e: unknown) {
      console.error('Checkout error:', e)
      const errorMessage = e instanceof Error ? e.message : 'Failed to start checkout'
      setCheckoutError(errorMessage)
      setStartingCheckout(false)
    }
  }

  const handleMaybeLater = () => {
    setShowSurvey(true)
  }

  const handleSurveySubmit = () => {
    setShowSurvey(false)
    onClose()
  }

  const handleFeedbackSent = () => {
    if (onFeedbackSent) {
      onFeedbackSent()
    }
  }

  const handleSurveyClose = () => {
    setShowSurvey(false)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          {showSurvey ? (
            <div className="p-6">
              <ExitSurvey
                onClose={handleSurveyClose}
                onSubmit={handleSurveySubmit}
                onFeedbackSent={handleFeedbackSent}
              />
            </div>
          ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
              <div className="text-4xl mb-3">🎣</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                You&apos;ve reached your limit
              </h2>
              <p className="text-blue-100">
                {currentSignups} / {signupLimit} signups used
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upgrade to Pro
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-gray-900">€29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  for 1,000 signups per month
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Your plan upgrades automatically after payment.
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {[
                  '1,000 signups per month',
                  'Advanced lead scoring',
                  'Export to CSV',
                  'Priority support',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Buttons */}
              <div className="space-y-3">
                {checkoutError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {checkoutError}
                  </div>
                )}
                <button
                  onClick={handleUpgrade}
                  disabled={startingCheckout}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {startingCheckout ? 'Starting checkout…' : 'Upgrade Now'}
                </button>
                <button
                  onClick={handleMaybeLater}
                  disabled={startingCheckout}
                  className="w-full py-3 px-4 text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  )
}
