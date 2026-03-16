#!/usr/bin/env node
// ============================================================================
// scripts/backup.mjs
// Local backup script: DB dump + code zip, rolling 30-day retention
// Run manually: node scripts/backup.mjs
// Scheduled by: launchd (macOS) via scripts/setup-cron.sh
// ============================================================================

import { execSync, spawn } from 'child_process'
import { createWriteStream, existsSync, mkdirSync, statSync, readdirSync, unlinkSync } from 'fs'
import { resolve, join } from 'path'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { createReadStream } from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { PrismaClient } from '@prisma/client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')

// ─── Config ──────────────────────────────────────────────────────────────────
const BACKUP_DIR = process.env.BACKUP_DIR || join(process.env.HOME || '~', 'Backups', 'officialwebsite')
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10)
const DB_URL = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL

// ─── Load .env if running standalone ─────────────────────────────────────────
if (!process.env.DATABASE_URL) {
    try {
        const { config } = await import('dotenv')
        config({ path: join(PROJECT_ROOT, '.env') })
    } catch { /* dotenv optional */ }
}

const prisma = new PrismaClient()

// ─── Utilities ────────────────────────────────────────────────────────────────
function formatDate(d = new Date()) {
    return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

function formatTimestamp(d = new Date()) {
    return d.toISOString().replace(/[:.]/g, '-').slice(0, 19) // YYYY-MM-DDTHH-MM-SS
}

function fileSize(path) {
    try { return statSync(path).size } catch { return 0 }
}

function ensureDir(dir) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function log(msg) {
    const ts = new Date().toISOString()
    console.log(`[${ts}] ${msg}`)
}

// ─── DB Dump ──────────────────────────────────────────────────────────────────
async function dumpDatabase(outPath) {
    return new Promise((resolve, reject) => {
        const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
        if (!dbUrl) return reject(new Error('DATABASE_URL not set'))

        log(`Dumping DB → ${outPath}`)

        const pgDump = spawn('pg_dump', ['--no-password', '--format=custom', '--compress=9', dbUrl], {
            stdio: ['ignore', 'pipe', 'pipe']
        })

        const outStream = createWriteStream(outPath)
        pgDump.stdout.pipe(outStream)

        let stderr = ''
        pgDump.stderr.on('data', d => stderr += d.toString())

        pgDump.on('close', code => {
            if (code === 0) {
                log(`DB dump complete: ${fileSize(outPath)} bytes`)
                resolve()
            } else {
                reject(new Error(`pg_dump exited ${code}: ${stderr}`))
            }
        })

        pgDump.on('error', err => {
            reject(new Error(`pg_dump not found — install postgresql: ${err.message}`))
        })
    })
}

// ─── Code Zip ─────────────────────────────────────────────────────────────────
async function zipCodebase(outPath) {
    log(`Zipping codebase → ${outPath}`)

    // Exclude heavy dirs
    const excludes = [
        '--exclude=node_modules',
        '--exclude=.next',
        '--exclude=.git',
        '--exclude=*.log',
        '--exclude=scripts/backups',
    ]

    return new Promise((resolve, reject) => {
        const tar = spawn('tar', [
            '-czf', outPath,
            ...excludes,
            '-C', dirname(PROJECT_ROOT),
            PROJECT_ROOT.split('/').pop()
        ], { stdio: ['ignore', 'pipe', 'pipe'] })

        let stderr = ''
        tar.stderr.on('data', d => stderr += d.toString())

        tar.on('close', code => {
            if (code === 0 || code === 1) { // code 1 = warnings (ok)
                log(`Code zip complete: ${fileSize(outPath)} bytes`)
                resolve()
            } else {
                reject(new Error(`tar exited ${code}: ${stderr}`))
            }
        })

        tar.on('error', err => reject(new Error(`tar error: ${err.message}`)))
    })
}

// ─── Rolling Retention ────────────────────────────────────────────────────────
async function pruneOldBackups(dir) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS)

    const files = readdirSync(dir).map(name => ({
        name,
        path: join(dir, name),
        mtime: statSync(join(dir, name)).mtime
    }))

    const toDelete = files.filter(f => f.mtime < cutoff)
    for (const f of toDelete) {
        unlinkSync(f.path)
        log(`Pruned old backup: ${f.name}`)
    }

    // Also prune DB entries older than retention
    const deletedLogs = await prisma.backupLog.deleteMany({
        where: { date: { lt: cutoff } }
    })
    if (deletedLogs.count > 0) {
        log(`Pruned ${deletedLogs.count} old backup log entries`)
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const startTime = Date.now()
    const ts = formatTimestamp()
    const backupType = process.argv[2] || 'full' // full | db-only | code-only

    ensureDir(BACKUP_DIR)

    const dbFile = join(BACKUP_DIR, `db-${ts}.dump`)
    const codeFile = join(BACKUP_DIR, `code-${ts}.tar.gz`)

    log(`─── Backup started [${backupType}] ───`)
    log(`Destination: ${BACKUP_DIR}`)

    // Create initial "running" log entry
    const logEntry = await prisma.backupLog.create({
        data: {
            status: 'running',
            type: backupType,
        }
    })

    let dbSizeBytes = BigInt(0)
    let codeSizeBytes = BigInt(0)
    let errorMsg = null

    try {
        if (backupType === 'full' || backupType === 'db-only') {
            await dumpDatabase(dbFile)
            dbSizeBytes = BigInt(fileSize(dbFile))
        }

        if (backupType === 'full' || backupType === 'code-only') {
            await zipCodebase(codeFile)
            codeSizeBytes = BigInt(fileSize(codeFile))
        }

        await pruneOldBackups(BACKUP_DIR)

        const duration = Date.now() - startTime
        log(`─── Backup complete in ${duration}ms ───`)

        // Update log entry to success
        await prisma.backupLog.update({
            where: { id: logEntry.id },
            data: {
                status: 'success',
                dbFile: backupType !== 'code-only' ? dbFile : null,
                codeFile: backupType !== 'db-only' ? codeFile : null,
                dbSizeBytes,
                codeSizeBytes,
                durationMs: duration,
            }
        })

    } catch (err) {
        errorMsg = err.message
        log(`ERROR: ${errorMsg}`)

        await prisma.backupLog.update({
            where: { id: logEntry.id },
            data: {
                status: 'failed',
                error: errorMsg,
                durationMs: Date.now() - startTime,
            }
        })

        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
