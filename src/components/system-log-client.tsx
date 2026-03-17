'use client'

import { useEffect } from 'react'
import { logClientError } from '@/lib/ui-log'

export default function SystemLogClient() {
    useEffect(() => {
        const onError = (event: ErrorEvent) => {
            logClientError(event.message || 'Window error', {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
            })
        }

        const onRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason
            logClientError('Unhandled promise rejection', {
                reason: typeof reason === 'string' ? reason : JSON.stringify(reason),
                stack: reason?.stack,
            })
        }

        window.addEventListener('error', onError)
        window.addEventListener('unhandledrejection', onRejection)

        return () => {
            window.removeEventListener('error', onError)
            window.removeEventListener('unhandledrejection', onRejection)
        }
    }, [])

    return null
}
