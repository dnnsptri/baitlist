'use client'

import { useState, useEffect } from 'react'
import { checkSignupLimitClient } from '@/lib/checkLimit-client'
import { createClientBrowser } from '@/lib/supabase-client'
import UpgradeModal from './UpgradeModal'

interface CreateWaitlistButtonProps {
  userId: string
  onWaitlistCreated?: () => void
}

export default function CreateWaitlistButton({
  userId,
  onWaitlistCreated,
}: CreateWaitlistButtonProps) {
  const [showForm, setShowForm] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [limitInfo, setLimitInfo] = useState<{
    currentUsage: number
    limit: number
  } | null>(null)

  const handleCreateClick = async () => {
    setError('')
    
    try {
      const limitResult = await checkSignupLimitClient(userId)

      setLimitInfo({
        currentUsage: limitResult.currentUsage,
        limit: limitResult.limit,
      })

      if (limitResult.limitReached) {
        setShowUpgradeModal(true)
      } else {
        setShowForm(true)
      }
    } catch (err: unknown) {
      console.error('Error checking limit:', err)
      setError('Failed to check limit. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Please enter a waitlist name')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const supabase = createClientBrowser()
      
      const { data, error: insertError } = await supabase
        .from('waitlists')
        .insert({
          owner_id: userId,
          name: name.trim(),
          description: description.trim() || null,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating waitlist:', insertError)
        setError('Failed to create waitlist. Please try again.')
        return
      }

      // Reset form
      setName('')
      setDescription('')
      setShowForm(false)
      
      // Notify parent to refresh waitlists
      if (onWaitlistCreated) {
        onWaitlistCreated()
      }
    } catch (err: unknown) {
      console.error('Error creating waitlist:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setName('')
    setDescription('')
    setError('')
  }

  const handleFeedbackSent = () => {
    setToast('Feedback sent (we keep you updated?)')
  }

  useEffect(() => {
    if (toast) {
      const t = window.setTimeout(() => setToast(null), 5000)
      return () => window.clearTimeout(t)
    }
  }, [toast])

  return (
    <>
      {toast && (
        <div className="fixed top-5 right-5 z-[9999]">
          <div className="max-w-sm rounded-lg border border-green-200 bg-green-50 px-4 py-3 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-green-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.172 7.707 8.879a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-sm text-[#2a2a2a]">{toast}</div>
              <button
                onClick={() => setToast(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
                aria-label="Dismiss"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm ? (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Create New Waitlist
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Product"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#2a2a2a]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people what they're signing up for..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[#2a2a2a]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Waitlist'}
            </button>
          </div>
        </form>
      </div>
      ) : (
      <>
      <button
        onClick={handleCreateClick}
        className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        + Create Waitlist
      </button>

      {showUpgradeModal && limitInfo && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentSignups={limitInfo.currentUsage}
          signupLimit={limitInfo.limit}
          onFeedbackSent={handleFeedbackSent}
        />
      )}
      </>
      )}
    </>
  )
}
