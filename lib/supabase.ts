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
        get(name: string) {
          // #region agent log
          try { const val = cookieStore.get(name)?.value; fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:get',message:'cookie get called',data:{name,hasValue:!!val},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H2'})}).catch(()=>{}); return val; } catch(e:unknown) { const errorMessage = e instanceof Error ? e.message : String(e); fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase.ts:get:error',message:'cookie get error',data:{name,error:errorMessage},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{}); throw e; }
          // #endregion
        },
        set(name: string, value: string, options: { maxAge?: number; domain?: string; path?: string; sameSite?: string; secure?: boolean }) {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // Ignore errors in Server Components
          }
        },
        remove(name: string, options: { maxAge?: number; domain?: string; path?: string; sameSite?: string; secure?: boolean }) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch {
            // Ignore errors in Server Components
          }
        },
      },
    }
  )
}
