export type UiLogLevel = 'info' | 'warn' | 'error'

export async function logUiEvent(message: string, data?: Record<string, unknown>) {
    try {
        await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                level: 'info',
                message,
                source: 'ui',
                data,
                path: typeof window !== 'undefined' ? window.location.pathname : undefined,
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            }),
        })
    } catch {
        // avoid UI impact
    }
}

export async function logClientError(message: string, data?: Record<string, unknown>) {
    try {
        await fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                level: 'error',
                message,
                source: 'client',
                data,
                path: typeof window !== 'undefined' ? window.location.pathname : undefined,
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            }),
        })
    } catch {
        // avoid UI impact
    }
}
