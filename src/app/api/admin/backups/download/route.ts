import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import archiver from 'archiver'

// Mark route as dynamic
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    // 1. Authenticate Admin
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 2. Fetch all database models to construct a complete JSON backup
        const dbDump: Record<string, any> = {}
        
        // List of all model names in Prisma Client (camelCase)
        const models = [
            'user', 'account', 'session', 'verificationToken', 'passwordResetToken', 'emailVerificationToken',
            'category', 'tag', 'post', 'page', 'newsletterSubscriber', 'contactMessage', 'lead', 'leadActivity',
            'series', 'topic', 'aITools', 'aIToolCategory', 'userToolInteraction', 'searchQuery', 'bookmarkedTool',
            'service', 'testimonial', 'fAQ', 'aIGeneratedContent', 'aIDecisionFactor', 'aIAnalysisResult',
            'aIPersonalizationProfile', 'aIGeneratedAsset', 'backupLog'
        ]

        // Fetch all data (this is safe for small to medium DBs in a serverless environment)
        for (const model of models) {
            try {
                // @ts-ignore - dynamic access to prisma client
                if (prisma[model] && typeof prisma[model].findMany === 'function') {
                    // @ts-ignore
                    dbDump[model] = await prisma[model].findMany()
                }
            } catch (err) {
                console.warn(`Could not dump model ${model}:`, err)
            }
        }

        // Convert bigints to strings for JSON serialization
        const dbJson = JSON.stringify(dbDump, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        , 2)

        // 3. Setup Archiver (Streaming ZIP)
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        })

        // Web streams trick to pipe archiver to NextResponse
        const stream = new ReadableStream({
            start(controller) {
                archive.on('data', (chunk) => controller.enqueue(chunk))
                archive.on('end', () => controller.close())
                archive.on('error', (err) => controller.error(err))
            }
        })

        // 4. Append files to ZIP
        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
        const filename = `backup-farjadp-${ts}.zip`

        // Add DB Dump JSON
        archive.append(dbJson, { name: 'database.json' })

        // Note: In Vercel serverless, the filesystem only contains bundled outputs (.next/server, etc.)
        // It does not contain raw `/src`. Therefore, this backup focuses primarily on the critical
        // runtime configs and the complete dynamic database. The source code is inherently backed up in GitHub.
        
        // Attempt to add some generic config files if they persist in the runtime root
        try {
            archive.glob('package.json', { cwd: process.cwd() })
            archive.glob('prisma/schema.prisma', { cwd: process.cwd() })
            archive.glob('*.md', { cwd: process.cwd() })
        } catch (err) {
            console.error('Filesystem globbing error:', err)
        }

        // Finalize the archive, which triggers the 'end' event on the stream
        archive.finalize()

        // 5. Return the stream as a downloadable file
        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-store, max-age=0'
            }
        })

    } catch (error) {
        console.error('Backup generation failed:', error)
        return NextResponse.json({ error: 'Failed to generate backup' }, { status: 500 })
    }
}
