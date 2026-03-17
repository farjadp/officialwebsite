import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { writeSystemLog } from '@/lib/system-log'
import { withApiLogging } from '@/lib/api-logger'

export const dynamic = 'force-dynamic'

async function getHandler(req: NextRequest) {
    const session = await auth()
    if (!session?.user || !['OWNER', 'EDITOR'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const blobUrl = searchParams.get('url')
    
    if (!blobUrl || !blobUrl.includes('.vercel-storage.com')) {
        return NextResponse.json({ error: 'Invalid or missing blob URL' }, { status: 400 })
    }

    try {
        const res = await fetch(blobUrl, {
            headers: {
                Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
            }
        })

        if (!res.ok) {
            console.error(`Status ${res.status} proxying blob: ${blobUrl}`)
            return NextResponse.json({ error: `Failed to fetch blob from Vercel: ${res.statusText}` }, { status: res.status })
        }

        const filename = blobUrl.split('/').pop() || 'download'
        
        // Forward headers to force download
        const headers = new Headers()
        headers.set('Content-Type', res.headers.get('Content-Type') || 'application/octet-stream')
        headers.set('Content-Disposition', `attachment; filename="${filename}"`)

        await writeSystemLog({
            level: 'info',
            message: 'Backup file downloaded',
            source: 'api',
            data: { filename, url: blobUrl },
            req,
            status: 200,
        })

        return new NextResponse(res.body, {
            status: 200,
            headers,
        })
    } catch (error) {
        console.error('Download proxy failed:', error)
        await writeSystemLog({
            level: 'error',
            message: 'Backup file download failed',
            source: 'api',
            data: { error: error instanceof Error ? error.message : 'Unknown error', url: blobUrl },
            req,
            status: 500,
        })
        return NextResponse.json({ error: 'Failed to proxy download' }, { status: 500 })
    }
}

export const GET = withApiLogging('GET', getHandler)
