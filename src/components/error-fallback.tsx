'use client'

// ============================================================================
// The body of every error boundary. Two things it does beyond showing a
// message:
// - logs the error to SystemLog, as before;
// - recovers from a stale tab after a deploy. A page opened before a deploy
//   asks for script chunks the new build no longer has ("Failed to load
//   chunk"), which crashed /reports and /fa/tools on 30 Sep. One automatic
//   reload fetches the new build; a sessionStorage flag stops a loop.
// ============================================================================

import { useEffect } from 'react'
import { logClientError } from '@/lib/ui-log'

const RELOAD_FLAG = 'chunk-reload-at'

export function isStaleChunk(error: Error): boolean {
    return /Failed to load chunk|ChunkLoadError|Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module/i.test(
        `${error.name} ${error.message}`,
    )
}

export function ErrorFallback({ error, reset, persian = false }: { error: Error; reset: () => void; persian?: boolean }) {
    useEffect(() => {
        if (isStaleChunk(error)) {
            try {
                const last = Number(sessionStorage.getItem(RELOAD_FLAG) ?? 0)
                if (Date.now() - last > 60_000) {
                    sessionStorage.setItem(RELOAD_FLAG, String(Date.now()))
                    window.location.reload()
                    return
                }
            } catch {
                // Storage blocked: fall through to the message rather than risk a loop.
            }
        }
        logClientError('App error boundary', { message: error.message, stack: error.stack })
    }, [error])

    return (
        <div dir={persian ? 'rtl' : 'ltr'} className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-md space-y-4 text-center">
                <h2 className="text-2xl font-bold">{persian ? 'مشکلی پیش آمد' : 'Something went wrong'}</h2>
                <p className="text-sm text-muted-foreground">
                    {persian ? 'خطای غیرمنتظره‌ای رخ داد. دوباره امتحان کنید.' : 'An unexpected error occurred. Try again.'}
                </p>
                <button
                    className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white"
                    onClick={() => reset()}
                >
                    {persian ? 'تلاش دوباره' : 'Try again'}
                </button>
            </div>
        </div>
    )
}
