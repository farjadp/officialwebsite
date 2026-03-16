#!/usr/bin/env node
// ============================================================================
// scripts/backup-drive.mjs
// Serverless-compatible backup script: DB dump + code zip -> Google Drive
// Run manually: node scripts/backup-drive.mjs [full|db-only|code-only]
// Scheduled by: GitHub Actions (.github/workflows/backup.yml)
// ============================================================================

import { spawn } from 'child_process'
import { createWriteStream, existsSync, mkdirSync, statSync, createReadStream } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { google } from 'googleapis'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')

try {
    const { config } = await import('dotenv')
    config({ path: join(PROJECT_ROOT, '.env') })
} catch { /* dotenv optional in CI */ }

const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
const pool = new pg.Pool({
    connectionString: dbUrl,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ...(dbUrl && (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) ? {} : { ssl: { rejectUnauthorized: false } })
})
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

// ─── Config ────────────────────────────────────────────────────────────────────────────
const BACKUP_DIR = '/tmp' // Ephemeral storage in GitHub Actions/Vercel
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10)
const FOLDER_ID = process.env.GDRIVE_FOLDER_ID
const CRED_PATH = process.env.GDRIVE_CREDENTIALS_PATH

if (!FOLDER_ID) throw new Error("GDRIVE_FOLDER_ID environment variable is missing!")
if (!CRED_PATH) throw new Error("GDRIVE_CREDENTIALS_PATH environment variable is missing!")

const auth = new google.auth.GoogleAuth({
    keyFile: CRED_PATH,
    scopes: ['https://www.googleapis.com/auth/drive'],
})
const drive = google.drive({ version: 'v3', auth })

function formatTimestamp(d = new Date()) {
    return d.toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

function fileSize(p) {
    try { return statSync(p).size } catch { return 0 }
}

function log(msg) {
    console.log(`[${new Date().toISOString()}] ${msg}`)
}

// ─── DB Dump ─────────────────────────────────────────────────────────────────────────────
async function dumpDatabase(outPath) {
    const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
    if (!dbUrl) throw new Error('DATABASE_URL not set')

    log(`Dumping DB → ${outPath}`)

    return new Promise((resolve, reject) => {
        const pgDump = spawn('pg_dump', [
            '--no-password',
            '--format=custom',
            '--compress=9',
            dbUrl,
        ], { stdio: ['ignore', 'pipe', 'pipe'] })

        const out = createWriteStream(outPath)
        pgDump.stdout.pipe(out)

        let stderr = ''
        pgDump.stderr.on('data', d => { stderr += d.toString() })

        pgDump.on('close', code => {
            if (code === 0) {
                log(`DB dump complete: ${fileSize(outPath)} bytes`)
                resolve()
            } else {
                reject(new Error(`pg_dump exited ${code}: ${stderr}`))
            }
        })

        pgDump.on('error', err => reject(new Error(`pg_dump error: ${err.message}`)))
    })
}

// ─── Code Zip ───────────────────────────────────────────────────────────────────────────
async function zipCodebase(outPath) {
    log(`Zipping codebase → ${outPath}`)
    const parentDir = dirname(PROJECT_ROOT)
    const projectName = PROJECT_ROOT.split('/').pop()

    return new Promise((resolve, reject) => {
        const tar = spawn('tar', [
            '-czf', outPath,
            '--exclude=node_modules',
            '--exclude=.next',
            '--exclude=.git',
            '--exclude=*.log',
            '-C', parentDir,
            projectName,
        ], { stdio: ['ignore', 'pipe', 'pipe'] })

        let stderr = ''
        tar.stderr.on('data', d => { stderr += d.toString() })

        tar.on('close', code => {
            if (code === 0 || code === 1) {
                log(`Code zip complete: ${fileSize(outPath)} bytes`)
                resolve()
            } else {
                reject(new Error(`tar exited ${code}: ${stderr}`))
            }
        })
        tar.on('error', err => reject(new Error(`tar error: ${err.message}`)))
    })
}

// ─── Drive Upload ───────────────────────────────────────────────────────────────────────
async function uploadToDrive(filePath, fileName, mimeType) {
    log(`Uploading to Google Drive: ${fileName}...`)
    try {
        const response = await drive.files.create({
            supportsAllDrives: true,
            requestBody: {
                name: fileName,
                parents: [FOLDER_ID],
            },
            media: {
                mimeType: mimeType,
                body: createReadStream(filePath),
            },
            fields: 'id',
        })
        log(`Upload successful! File ID: ${response.data.id}`)
        return response.data.id
    } catch (err) {
        throw new Error(`Google Drive API Error: ${err.message}`)
    }
}

// ─── Main ───────────────────────────────────────────────────────────────────────────────
async function main() {
    const startTime = Date.now()
    const ts = formatTimestamp()
    const backupType = process.argv[2] || 'full'

    const dbFile = join(BACKUP_DIR, `db-${ts}.dump`)
    const codeFile = join(BACKUP_DIR, `code-${ts}.tar.gz`)

    log(`─── Drive Backup started [${backupType}] ───`)

    const logEntry = await prisma.backupLog.create({
        data: { status: 'running', type: backupType },
    })

    let dbSizeBytes = BigInt(0)
    let codeSizeBytes = BigInt(0)

    try {
        if (backupType === 'full' || backupType === 'db-only') {
            await dumpDatabase(dbFile)
            dbSizeBytes = BigInt(fileSize(dbFile))
            await uploadToDrive(dbFile, `db-${ts}.dump`, 'application/octet-stream')
        }

        if (backupType === 'full' || backupType === 'code-only') {
            await zipCodebase(codeFile)
            codeSizeBytes = BigInt(fileSize(codeFile))
            await uploadToDrive(codeFile, `code-${ts}.tar.gz`, 'application/gzip')
        }

        const duration = Date.now() - startTime
        log(`─── Backup complete in ${duration}ms ───`)

        await prisma.backupLog.update({
            where: { id: logEntry.id },
            data: {
                status: 'success',
                dbSizeBytes,
                codeSizeBytes,
                durationMs: duration,
            },
        })
    } catch (err) {
        log(`ERROR: ${err.message}`)
        await prisma.backupLog.update({
            where: { id: logEntry.id },
            data: {
                status: 'failed',
                error: err.message,
                durationMs: Date.now() - startTime,
            },
        })
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
