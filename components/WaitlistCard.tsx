'use client'

import { useRouter } from 'next/navigation'

interface WaitlistCardProps {
  waitlist: {
    id: string
    name: string
    description: string | null
    created_at: string
  }
  signupCount: number
}

export default function WaitlistCard({ waitlist, signupCount }: WaitlistCardProps) {
  const router = useRouter()

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => router.push(`/dashboard/waitlist/${waitlist.id}`)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {waitlist.name}
          </h3>
          {waitlist.description && (
            <p className="text-gray-600 text-sm mb-3">
              {waitlist.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {signupCount} signup{signupCount !== 1 ? 's' : ''}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">
              Created {new Date(waitlist.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="ml-4">
          <button
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/dashboard/waitlist/${waitlist.id}`)
            }}
          >
            View →
          </button>
        </div>
      </div>
    </div>
  )
}
