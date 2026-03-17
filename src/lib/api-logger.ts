import { NextRequest, NextResponse } from 'next/server'
import { writeSystemLog } from '@/lib/system-log'

export function withApiLogging(
    method: string,
    handler: (req: NextRequest, ctx?: unknown) => Promise<NextResponse>
) {
    return async (req: NextRequest, ctx?: unknown) => {
        const start = Date.now()
        try {
            const res = await handler(req, ctx)
            const durationMs = Date.now() - start
            await writeSystemLog({
                level: 'info',
                message: 'API request',
                source: 'api',
                data: { method, path: req.nextUrl.pathname, durationMs },
                status: res.status,
                req,
            })
            return res
        } catch (err) {
            const durationMs = Date.now() - start
            await writeSystemLog({
                level: 'error',
                message: 'API error',
                source: 'api',
                data: {
                    method,
                    path: req.nextUrl.pathname,
                    durationMs,
                    error: err instanceof Error ? err.message : String(err),
                },
                status: 500,
                req,
            })
            throw err
        }
    }
}
