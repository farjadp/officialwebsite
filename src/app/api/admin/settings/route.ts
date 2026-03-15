import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/settings
// Fetch all generic app settings as a key-value pair object
export async function GET() {
    try {
        const settingsRaw = await prisma.appSetting.findMany()
        
        // Convert [{key: 'A', value: 'B'}, ...] -> {A: 'B', ...}
        const settingsMap: Record<string, string> = {}
        settingsRaw.forEach(s => {
            settingsMap[s.key] = s.value
        })

        return NextResponse.json({ success: true, settings: settingsMap })
    } catch (error) {
        console.error('[Settings API Error]', error)
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

// POST /api/admin/settings
// Bulk update generic app settings
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const updates: Record<string, string> = body.settings

        if (!updates || typeof updates !== 'object') {
            return NextResponse.json({ error: 'Invalid payload expected { settings: { ... } }' }, { status: 400 })
        }

        // Upsert each key
        const promises = Object.entries(updates).map(([key, value]) => {
            // If value is explicitly null or empty, delete the key? 
            // We'll just store empty strings if they clear it.
            return prisma.appSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            })
        })

        await Promise.all(promises)

        return NextResponse.json({ success: true, message: 'Settings saved successfully' })
    } catch (error) {
        console.error('[Settings API Error]', error)
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }
}
