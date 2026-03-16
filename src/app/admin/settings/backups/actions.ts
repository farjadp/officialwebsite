'use server'

import { auth } from '@/auth'

export async function triggerBackupAction(type: 'full' | 'db-only' | 'code-only') {
    const session = await auth()
    if (!session?.user || !['OWNER', 'EDITOR'].includes(session.user.role)) {
        return { success: false, error: 'NextAuth Unauthorized: Session invalid or not admin' }
    }

    try {
        const validTypes = ['full', 'db-only', 'code-only']
        if (!validTypes.includes(type)) {
            return { success: false, error: 'Invalid backup type' }
        }

        const pat = process.env.GITHUB_PAT
        if (!pat) {
            return { success: false, error: 'GITHUB_PAT environment variable not configured in Vercel' }
        }

        // Trigger GitHub Action via repository_dispatch
        const response = await fetch('https://api.github.com/repos/farjadp/officialwebsite/dispatches', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${pat.trim()}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Vercel-Server-Action'
            },
            body: JSON.stringify({
                event_type: 'trigger-backup',
                client_payload: { type }
            })
        })

        if (!response.ok) {
            const errBody = await response.text()
            console.error('GitHub API error:', response.status, errBody)
            return { success: false, error: `GitHub rejected PAT (Status ${response.status}): ${errBody}` }
        }

        return { success: true, message: 'GitHub Cloud Backup Action triggered successfully' }
    } catch (error) {
        console.error('Failed to trigger backup Action:', error)
        return { success: false, error: 'Failed to start backup process' }
    }
}
