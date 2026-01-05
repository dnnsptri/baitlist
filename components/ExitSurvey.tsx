'use client'

import { useState, useEffect } from 'react'
import { createClientBrowser } from '@/lib/supabase-client'

interface ExitSurveyProps {
  onClose: () => void
  onSubmit: () => void
  onFeedbackSent?: () => void
}

const surveyOptions = [
  { value: 'too_expensive', label: 'Too expensive' },
  { value: 'dont_need', label: "Don't need that many signups" },
  { value: 'just_testing', label: 'Just testing' },
  { value: 'upgrade_later', label: 'Will upgrade later' },
  { value: 'missing_features', label: 'Missing features' },
]

export default function ExitSurvey({ onClose, onSubmit, onFeedbackSent }: ExitSurveyProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError('Please select a reason')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const supabase = createClientBrowser()
      const { data: { user } } = await supabase.auth.getUser()

      const { error: insertError } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id,
          reason: selectedReason,
          feedback_text: feedback.trim() || null,
          type: 'upgrade_declined',
        })

      if (insertError) {
        console.error('Failed to save feedback:', insertError)
        setError('Failed to save feedback')
        setSubmitting(false)
        return
      }

      // Reset form fields
      setSelectedReason('')
      setFeedback('')

      // Trigger toast notification callback
      if (onFeedbackSent) {
        onFeedbackSent()
      }

      onSubmit()
    } catch (err) {
      console.error('Error submitting survey:', err)
      setError('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Help us improve
        </h3>
        <p className="text-sm text-gray-600">
          Why are you not upgrading today?
        </p>
      </div>

      <div className="space-y-3">
        {surveyOptions.map((option) => (
          <label
            key={option.value}
            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedReason === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="reason"
              value={option.value}
              checked={selectedReason === option.value}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Any other feedback? (optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us more..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-[#2a2a2a]"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}
