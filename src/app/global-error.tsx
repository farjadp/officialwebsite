'use client'

// Replaces the root layout when the root layout itself fails, so it brings
// its own <html> and <body>.

import { ErrorFallback } from '@/components/error-fallback'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <html lang="en">
            <body>
                <ErrorFallback error={error} reset={reset} />
            </body>
        </html>
    )
}
