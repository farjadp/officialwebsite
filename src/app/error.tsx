'use client'

// A segment error boundary renders inside the root layout, so it must not
// render <html> or <body> of its own — that is global-error.tsx's job.

import { ErrorFallback } from '@/components/error-fallback'

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
    return <ErrorFallback error={error} reset={reset} />
}
