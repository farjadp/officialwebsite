import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import { put } from '@vercel/blob'
import crypto from 'crypto'

const execAsync = promisify(exec)

async function main() {
    console.log('--- Starting Hardware-Grade Cloud Backup ---')
    
    const dbUrl = process.env.PROD_DATABASE_URL
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    const backupType = process.env.type || 'full'
    
    if (!dbUrl) throw new Error('PROD_DATABASE_URL not set in Action Secrets')
    if (!blobToken) throw new Error('BLOB_READ_WRITE_TOKEN not set in Action Secrets')

    const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const backupId = crypto.randomUUID()
    const tmpDir = path.join(process.cwd(), 'backup-tmp')
    
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

    console.log(`Backup Type: ${backupType}, ID: ${backupId}`)

    let dbFileUrl = null
    let dbSizeBytes = 0
    let codeFileUrl = null
    let codeSizeBytes = 0
    
    const startTime = Date.now()
    
    try {
        // 1. Database Full SQL Dump
        if (backupType === 'full' || backupType === 'db-only') {
            const dbFilePath = path.join(tmpDir, `database-${dateStr}.sql`)
            console.log(`Executing pg_dump to ${dbFilePath}...`)
            
            // Neon connection requires specifying no-password prompt since we pass it in the URI
            await execAsync(`pg_dump "${dbUrl}" --no-password -F p -f "${dbFilePath}"`)
            console.log('SQL dump successful.')
            
            // Upload to Vercel Blob
            console.log('Uploading SQL to Blob Storage...')
            const dbStats = fs.statSync(dbFilePath)
            dbSizeBytes = dbStats.size
            const fileStream = fs.createReadStream(dbFilePath)
            
            const dbBlob = await put(`backups/database-${dateStr}.sql`, fileStream, {
                access: 'public',
                token: blobToken,
                addRandomSuffix: false
            })
            
            dbFileUrl = dbBlob.url
            console.log(`Database uploaded: ${dbFileUrl}`)
        }

        // 2. Codebase Tar Compression
        if (backupType === 'full' || backupType === 'code-only') {
            const codeFilePath = path.join(tmpDir, `codebase-${dateStr}.tar.gz`)
            console.log(`Executing tar to ${codeFilePath}...`)
            
            await execAsync(`tar -czf "${codeFilePath}" --exclude="node_modules" --exclude=".next" --exclude=".git" --exclude="backup-tmp" .`)
            console.log('Code archiving successful.')

            // Upload to Vercel Blob
            console.log('Uploading Code Archive to Blob Storage...')
            const codeStats = fs.statSync(codeFilePath)
            codeSizeBytes = codeStats.size
            const fileStream = fs.createReadStream(codeFilePath)

            const codeBlob = await put(`backups/codebase-${dateStr}.tar.gz`, fileStream, {
                access: 'public',
                token: blobToken,
                addRandomSuffix: false
            })

            codeFileUrl = codeBlob.url
            console.log(`Codebase uploaded: ${codeFileUrl}`)
        }
        
        // 3. Register Manifest info to trace execution logs
        const durationMs = Date.now() - startTime
        const manifestFilePath = path.join(tmpDir, `manifest-${dateStr}.json`)
        const manifest = {
            id: backupId,
            date: new Date().toISOString(),
            status: 'success',
            type: backupType,
            dbFile: dbFileUrl,
            codeFile: codeFileUrl,
            dbSizeBytes,
            codeSizeBytes,
            durationMs,
            error: null
        }
        
        fs.writeFileSync(manifestFilePath, JSON.stringify(manifest))
        const manifestStream = fs.createReadStream(manifestFilePath)
        
        await put(`backups/manifests/manifest-${dateStr}.json`, manifestStream, {
            access: 'public',
            token: blobToken,
            addRandomSuffix: false
        })

        console.log('Backup Process Complete.')
    } catch (err) {
        console.error('Backup Process Failed:', err)
        
        // Try uploading a failure manifest
        try {
            const durationMs = Date.now() - startTime
            const manifestFilePath = path.join(tmpDir, `manifest-${dateStr}-failed.json`)
            const manifest = {
                id: backupId,
                date: new Date().toISOString(),
                status: 'failed',
                type: backupType,
                dbFile: null,
                codeFile: null,
                dbSizeBytes: 0,
                codeSizeBytes: 0,
                durationMs,
                error: err.message || String(err)
            }
            fs.writeFileSync(manifestFilePath, JSON.stringify(manifest))
            const manifestStream = fs.createReadStream(manifestFilePath)
            await put(`backups/manifests/manifest-${dateStr}-failed.json`, manifestStream, {
                access: 'public',
                token: blobToken,
                addRandomSuffix: false
            })
        } catch (e) {
            console.error('Even saving the failure manifest failed.', e)
        }
        
        // Exit with error code so GitHub Action registers failure
        process.exit(1)
    }
}

main()
