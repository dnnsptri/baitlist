import { createClient } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import SignupsTable from '@/components/SignupsTable'
import CopyUrlButton from './CopyUrlButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WaitlistDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch waitlist data
  const { data: waitlist, error: waitlistError } = await supabase
    .from('waitlists')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single()

  if (waitlistError || !waitlist) {
    notFound()
  }

  // Fetch signups for this waitlist
  const { data: signups } = await supabase
    .from('signups')
    .select('*')
    .eq('waitlist_id', id)
    .order('position', { ascending: true, nullsFirst: false })

  // Get base URL for signup link
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const signupUrl = `${baseUrl}/w/${waitlist.id}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <div className="text-2xl font-bold text-gray-900">
              🎣 BaitList
            </div>
          </div>
          <nav className="flex space-x-6 items-center">
            <span className="text-sm text-gray-600">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Waitlist Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {waitlist.name}
            </h1>
            {waitlist.description && (
              <p className="text-gray-600 mb-4">{waitlist.description}</p>
            )}
            
            {/* Signup URL */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share this URL to collect signups:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={signupUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
                />
                <CopyUrlButton url={signupUrl} />
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 flex gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{signups?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Signups</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {signups?.filter(s => s.status === 'approved').length || 0}
                </p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {signups?.filter(s => s.status === 'pending').length || 0}
                </p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {signups?.filter(s => s.status === 'waitlist').length || 0}
                </p>
                <p className="text-sm text-gray-600">In Waitlist</p>
              </div>
            </div>
          </div>

          {/* Signups Table */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Signups</h2>
            <SignupsTable signups={signups || []} waitlistName={waitlist.name} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} BaitList — only the best bites.
        </p>
      </footer>
    </div>
  )
}
