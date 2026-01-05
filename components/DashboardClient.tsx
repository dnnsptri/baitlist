'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClientBrowser } from '@/lib/supabase-client'
import CreateWaitlistButton from './CreateWaitlistButton'
import WaitlistCard from './WaitlistCard'
import { useRouter, useSearchParams } from 'next/navigation'

interface Waitlist {
  id: string
  name: string
  description: string | null
  created_at: string
  owner_id: string
  signups?: { count: number }[]
}

interface DashboardClientProps {
  userId: string
  initialWaitlists: Waitlist[]
}

export default function DashboardClient({
  userId,
  initialWaitlists,
}: DashboardClientProps) {
  const [waitlists, setWaitlists] = useState<Waitlist[]>(initialWaitlists)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = useMemo(() => searchParams.get('success'), [searchParams])

  useEffect(() => {
    if (success === 'true') {
      setToast('Payment received — your plan is now Pro.')

      // Remove the query param so it doesn't show again on refresh
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      router.replace(url.pathname + (url.search ? url.search : ''))

      // Refresh the page after a short delay to ensure fresh data is loaded
      const refreshTimeout = window.setTimeout(() => {
        router.refresh()
      }, 1000)

      const t = window.setTimeout(() => {
        setToast(null)
      }, 5000)
      return () => {
        window.clearTimeout(t)
        window.clearTimeout(refreshTimeout)
      }
    }
  }, [router, success])

  const refreshWaitlists = async () => {
    setLoading(true)
    try {
      const supabase = createClientBrowser()
      const { data, error } = await supabase
        .from('waitlists')
        .select('*, signups(count)')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching waitlists:', error)
        return
      }

      setWaitlists(data || [])
    } catch (err) {
      console.error('Error refreshing waitlists:', err)
    } finally {
      setLoading(false)
    }
  }

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

      <CreateWaitlistButton userId={userId} onWaitlistCreated={refreshWaitlists} />

      {waitlists.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 text-center py-12">
            No waitlists yet. Create your first one to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {waitlists.map((waitlist) => (
            <WaitlistCard
              key={waitlist.id}
              waitlist={waitlist}
              signupCount={waitlist.signups?.[0]?.count || 0}
            />
          ))}
        </div>
      )}
    </>
  )
}
