module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function createClient() {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location: 'lib/supabase.ts:createClient',
            message: 'createClient called',
            data: {
                envUrl: !!("TURBOPACK compile-time value", "https://uxgguxippmbjrwkjilqy.supabase.co"),
                envKey: !!("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Z2d1eGlwcG1ianJ3a2ppbHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzExNDUsImV4cCI6MjA4MjUwNzE0NX0.iKqxZgYmwbB6LBRyzA7qp5i1w_bYfNqfPLpKUdOTAt8")
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'post-fix',
            hypothesisId: 'H3'
        })
    }).catch(()=>{});
    // #endregion
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location: 'lib/supabase.ts:afterCookies',
            message: 'cookies() result type after await',
            data: {
                type: typeof cookieStore,
                isPromise: cookieStore instanceof Promise,
                hasGet: typeof cookieStore?.get,
                hasGetAll: typeof cookieStore?.getAll
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'post-fix',
            hypothesisId: 'H1'
        })
    }).catch(()=>{});
    // #endregion
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://uxgguxippmbjrwkjilqy.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Z2d1eGlwcG1ianJ3a2ppbHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MzExNDUsImV4cCI6MjA4MjUwNzE0NX0.iKqxZgYmwbB6LBRyzA7qp5i1w_bYfNqfPLpKUdOTAt8"), {
        cookies: {
            get (name) {
                // #region agent log
                try {
                    const val = cookieStore.get(name)?.value;
                    fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            location: 'lib/supabase.ts:get',
                            message: 'cookie get called',
                            data: {
                                name,
                                hasValue: !!val
                            },
                            timestamp: Date.now(),
                            sessionId: 'debug-session',
                            runId: 'post-fix',
                            hypothesisId: 'H2'
                        })
                    }).catch(()=>{});
                    return val;
                } catch (e) {
                    fetch('http://127.0.0.1:7244/ingest/382c8fcb-0fa3-42bd-87b1-6fecf8b7a1fb', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            location: 'lib/supabase.ts:get:error',
                            message: 'cookie get error',
                            data: {
                                name,
                                error: e?.message
                            },
                            timestamp: Date.now(),
                            sessionId: 'debug-session',
                            runId: 'post-fix',
                            hypothesisId: 'H1'
                        })
                    }).catch(()=>{});
                    throw e;
                }
            // #endregion
            },
            set (name, value, options) {
                try {
                    cookieStore.set(name, value, options);
                } catch  {
                // Ignore errors in Server Components
                }
            },
            remove (name, options) {
                try {
                    cookieStore.set(name, '', {
                        ...options,
                        maxAge: 0
                    });
                } catch  {
                // Ignore errors in Server Components
                }
            }
        }
    });
}
}),
"[project]/app/auth/callback/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-route] (ecmascript)");
;
;
async function GET(req) {
    try {
        const requestUrl = new URL(req.url);
        const code = requestUrl.searchParams.get('code');
        console.log('[auth-callback] Code:', code ? 'present' : 'missing');
        if (code) {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
                console.error('[auth-callback] Exchange error:', error);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(`/login?error=${error.message}`, req.url));
            }
            console.log('[auth-callback] Success! User:', data.user?.email);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/dashboard', req.url));
    } catch (error) {
        console.error('[auth-callback] Unexpected error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login?error=callback_failed', req.url));
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fc2cc048._.js.map