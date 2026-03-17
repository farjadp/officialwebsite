'use client'

import { useEffect } from 'react'
import { logClientError } from '@/lib/ui-log'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        logClientError('App error boundary', {
            message: error.message,
            stack: error.stack,
        })
    }, [error])

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="max-w-md text-center space-y-4">
                        <h2 className="text-2xl font-bold">Something went wrong</h2>
                        <p className="text-sm text-muted-foreground">An unexpected error occurred. Try again.</p>
                        <button
                            className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white"
                            onClick={() => reset()}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
