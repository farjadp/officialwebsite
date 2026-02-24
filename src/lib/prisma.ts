// ============================================================================
// Hardware Source: prisma.ts
// Version: 1.0.0 — 2026-02-24
// Why: Core utility / logic function
// Env / Identity: Shared Library
// ============================================================================

import { PrismaClient } from "@prisma/client"
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres" // Fallback to avoid build crash if env missing

const pool = new Pool({
    connectionString,
    ...(connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? {} : { ssl: { rejectUnauthorized: false } })
})
const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
