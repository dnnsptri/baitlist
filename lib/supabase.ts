import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:createClient',message:'createClient called',data:{envUrl:!!process.env.NEXT_PUBLIC_SUPABASE_URL,envKey:!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H3'})}).catch(()=>{});
  // #endregion

  const cookieStore = await cookies()

  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:afterCookies',message:'cookies() result type after await',data:{type:typeof cookieStore,isPromise:cookieStore instanceof Promise,hasGet:typeof cookieStore?.get,hasGetAll:typeof cookieStore?.getAll},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignore errors in Server Components
          }
        },
      },
    }
  )
}
