import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { list, del } from '@vercel/blob'
import { writeSystemLog } from '@/lib/system-log'
import { withApiLogging } from '@/lib/api-logger'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getHandler(req: NextRequest) {
    const session = await auth()
    if (!session?.user || !['OWNER', 'EDITOR'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Fetch manifests from Vercel Blob
        const { blobs } = await list({
            prefix: 'backups/manifests/',
            limit: 60,
        })

        // Download and parse manifests
        const logs = []
        for (const blob of blobs) {
            try {
                // Fetch private blob securely using token
                const res = await fetch(blob.url, {
                    headers: {
                        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
                    }
                })
                if (res.ok) {
                    const manifest = await res.json()
                    // Attach the raw blob url for deletion reference later
                    manifest._blobUrl = blob.url
                    logs.push(manifest)
                } else {
                    console.error(`Status ${res.status} fetching manifest: ${blob.url}`)
                }
            } catch (err) {
                console.error(`Failed to parse manifest ${blob.url}:`, err)
            }
        }

        // Sort by date descending
        logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        return NextResponse.json({ success: true, data: logs })
    } catch (error) {
        console.error('Failed to fetch backup logs from blob:', error)
        await writeSystemLog({
            level: 'error',
            message: 'Failed to fetch backup logs',
            source: 'api',
            data: { error: error instanceof Error ? error.message : 'Unknown error' },
            req,
            status: 500,
        })
        return NextResponse.json({ error: 'Failed to retrieve backups' }, { status: 500 })
    }
}

async function postHandler(req: NextRequest) {
    const session = await auth()
    if (!session?.user || !['OWNER', 'EDITOR'].includes(session.user.role)) {
        return NextResponse.json({ error: 'NextAuth Unauthorized: Session invalid or not admin' }, { status: 401 })
    }

    try {
        const { type } = await req.json()
        const validTypes = ['full', 'db-only', 'code-only']
        if (!validTypes.includes(type)) {
            return NextResponse.json({ error: 'Invalid backup type' }, { status: 400 })
        }

        const pat = process.env.GITHUB_PAT
        if (!pat) {
            return NextResponse.json({ error: 'GITHUB_PAT environment variable not configured in Vercel' }, { status: 500 })
        }

        // Trigger GitHub Action via repository_dispatch
        const response = await fetch('https://api.github.com/repos/farjadp/officialwebsite/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${pat.trim()}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Vercel-Application'
            },
            body: JSON.stringify({
                event_type: 'trigger-backup',
                client_payload: { type }
            })
        })

        if (!response.ok) {
            const errBody = await response.text()
            console.error('GitHub API error:', response.status, errBody)
            await writeSystemLog({
                level: 'error',
                message: 'GitHub Action trigger failed',
                source: 'api',
                data: { status: response.status, body: errBody, type },
                req,
                status: response.status,
            })
            return NextResponse.json({ 
                error: `GitHub rejected PAT (Status ${response.status}): ${errBody}` 
            }, { status: 500 })
        }

        await writeSystemLog({
            level: 'info',
            message: 'Backup triggered via GitHub Actions',
            source: 'api',
            data: { type },
            req,
            status: 200,
        })
        return NextResponse.json({
            success: true,
            message: 'GitHub Cloud Backup Action triggered successfully'
        })

    } catch (error) {
        console.error('Failed to trigger backup Action:', error)
        await writeSystemLog({
            level: 'error',
            message: 'Failed to trigger backup Action',
            source: 'api',
            data: { error: error instanceof Error ? error.message : 'Unknown error' },
            req,
            status: 500,
        })
        return NextResponse.json({ error: 'Failed to start backup process' }, { status: 500 })
    }
}

async function deleteHandler(req: NextRequest) {
    const session = await auth()
    if (!session?.user || !['OWNER', 'EDITOR'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const manifestUrl = searchParams.get('manifestUrl')
        const dbUrl = searchParams.get('dbUrl')
        const codeUrl = searchParams.get('codeUrl')

        if (!manifestUrl) {
            return NextResponse.json({ error: 'Missing manifestUrl' }, { status: 400 })
        }

        // Collect all file URLs to physically delete from storage
        const urlsToDelete = [manifestUrl]
        if (dbUrl) urlsToDelete.push(dbUrl)
        if (codeUrl) urlsToDelete.push(codeUrl)

        // Delete from Vercel Blob storage
        await del(urlsToDelete)

        await writeSystemLog({
            level: 'info',
            message: 'Backup files deleted',
            source: 'api',
            data: { manifestUrl, dbUrl, codeUrl },
            req,
            status: 200,
        })
        return NextResponse.json({ success: true, message: 'Backup files permanently deleted.' })
    } catch (error) {
        console.error('Delete backup failed:', error)
        await writeSystemLog({
            level: 'error',
            message: 'Delete backup failed',
            source: 'api',
            data: { error: error instanceof Error ? error.message : 'Unknown error' },
            req,
            status: 500,
        })
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export const GET = withApiLogging('GET', getHandler)
export const POST = withApiLogging('POST', postHandler)
export const DELETE = withApiLogging('DELETE', deleteHandler)
