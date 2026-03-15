#!/usr/bin/env node
// ============================================================================
// scripts/backup.mjs
// Local backup script: DB dump + code zip, rolling 30-day retention
// Run manually: node scripts/backup.mjs [full|db-only|code-only]
// Scheduled by: launchd (macOS) via scripts/setup-cron.sh
// ============================================================================

import { spawn } from 'child_process'
import { createWriteStream, existsSync, mkdirSync, statSync, readdirSync, unlinkSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = resolve(__dirname, '..')

// ─── Load .env before Prisma initialises ───────────────────────────────────────────
try {
    const { config } = await import('dotenv')
    config({ path: join(PROJECT_ROOT, '.env') })
} catch { /* dotenv optional in CI */ }

const prisma = new PrismaClient()

// ─── Config ────────────────────────────────────────────────────────────────────────────
const BACKUP_DIR = process.env.BACKUP_DIR || join(process.env.HOME || '/tmp', 'Backups', 'officialwebsite')
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10)

function formatTimestamp(d = new Date()) {
    return d.toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

function fileSize(p) {
    try { return statSync(p).size } catch { return 0 }
}

function ensureDir(dir) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
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

        pgDump.on('error', err =>
            reject(new Error(`pg_dump not found. Install: brew install libpq. Error: ${err.message}`))
        )
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
            if (code === 0 || code === 1) {  // 1 = non-fatal warnings
                log(`Code zip complete: ${fileSize(outPath)} bytes`)
                resolve()
            } else {
                reject(new Error(`tar exited ${code}: ${stderr}`))
            }
        })

        tar.on('error', err => reject(new Error(`tar error: ${err.message}`)))
    })
}

// ─── Rolling Retention ────────────────────────────────────────────────────────────────
async function pruneOldBackups(dir) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS)

    const files = readdirSync(dir)
        .filter(n => n.endsWith('.dump') || n.endsWith('.tar.gz'))
        .map(name => ({
            name,
            path: join(dir, name),
            mtime: statSync(join(dir, name)).mtime,
        }))

    for (const f of files.filter(f => f.mtime < cutoff)) {
        unlinkSync(f.path)
        log(`Pruned old backup: ${f.name}`)
    }

    const deleted = await prisma.backupLog.deleteMany({
        where: { date: { lt: cutoff } },
    })
    if (deleted.count > 0) log(`Pruned ${deleted.count} old log entries`)
}

// ─── Main ───────────────────────────────────────────────────────────────────────────────
async function main() {
    const startTime = Date.now()
    const ts = formatTimestamp()
    const backupType = process.argv[2] || 'full'

    ensureDir(BACKUP_DIR)

    const dbFile = join(BACKUP_DIR, `db-${ts}.dump`)
    const codeFile = join(BACKUP_DIR, `code-${ts}.tar.gz`)

    log(`─── Backup started [${backupType}] ───`)
    log(`Destination: ${BACKUP_DIR}`)

    const logEntry = await prisma.backupLog.create({
        data: { status: 'running', type: backupType },
    })

    let dbSizeBytes = BigInt(0)
    let codeSizeBytes = BigInt(0)

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

        await prisma.backupLog.update({
            where: { id: logEntry.id },
            data: {
                status: 'success',
                dbFile: backupType !== 'code-only' ? dbFile : null,
                codeFile: backupType !== 'db-only' ? codeFile : null,
                dbSizeBytes,
                codeSizeBytes,
                durationMs: duration,
            },
        })
    } catch (err) {
        const errorMsg = err.message
        log(`ERROR: ${errorMsg}`)

        await prisma.backupLog.update({
            where: { id: logEntry.id },
            data: {
                status: 'failed',
                error: errorMsg,
                durationMs: Date.now() - startTime,
            },
        })

        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
