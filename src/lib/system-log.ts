import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export type SystemLogLevel = 'info' | 'warn' | 'error'

export type SystemLogInput = {
    level: SystemLogLevel
    message: string
    source?: string
    data?: unknown
    status?: number
    userId?: string
    req?: NextRequest
}

export async function writeSystemLog(input: SystemLogInput) {
    const { level, message, source, data, status, userId, req } = input

    const path = req?.nextUrl?.pathname
    const method = req?.method
    const userAgent = req?.headers.get('user-agent') || undefined
    const ip = req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip') || undefined

    try {
        await prisma.systemLog.create({
            data: {
                level,
                message,
                source,
                data: data ?? undefined,
                status,
                userId,
                path,
                method,
                userAgent,
                ip,
            },
        })
    } catch (err) {
        // Avoid cascading failures if logging fails
        console.error('[SystemLog] Failed to write log:', err)
    }
}
