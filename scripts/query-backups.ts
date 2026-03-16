import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

config({ path: '.env.production.local' })
const pool = new pg.Pool({ connectionString: process.env.POSTGRES_URL_NON_POOLING, ssl: { rejectUnauthorized: false } })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

async function main() {
    const logs = await prisma.backupLog.findMany({ orderBy: { date: 'desc' }, take: 2 })
    const serialized = logs.map(l => ({
        ...l,
        dbSizeBytes: l.dbSizeBytes ? l.dbSizeBytes.toString() : null,
        codeSizeBytes: l.codeSizeBytes ? l.codeSizeBytes.toString() : null,
    }))
    console.log(JSON.stringify(serialized, null, 2))
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) });
