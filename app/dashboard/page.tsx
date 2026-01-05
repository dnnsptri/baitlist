import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'

export default async function Dashboard() {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:entry',message:'Dashboard component started',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H5'})}).catch(()=>{});
  // #endregion

  let supabase;
  try {
    supabase = await createClient()
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:afterCreateClient',message:'Supabase client created successfully',data:{hasAuth:!!supabase?.auth},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
  } catch (e: any) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:createClientError',message:'createClient threw error',data:{error:e?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
    throw e;
  }

  const { data: { user } } = await supabase.auth.getUser()

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:afterGetUser',message:'getUser completed',data:{hasUser:!!user,email:user?.email?.substring(0,5)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H5'})}).catch(()=>{});
  // #endregion

  if (!user) {
    redirect('/login')
  }

  // Fetch user's waitlists with signup counts
  const { data: waitlists } = await supabase
    .from('waitlists')
    .select('*, signups(count)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">
            🎣 BaitList
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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Your Waitlists
          </h1>

          <DashboardClient userId={user.id} initialWaitlists={waitlists || []} />
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
