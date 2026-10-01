-- Job search, phase 2: tailored résumés and cover letters.
-- Spec: docs/superpowers/specs/2026-10-01-job-search-design.md
--
-- Purely additive. Idempotent and transactional: re-running it is a no-op.
--
-- Apply with the UNPOOLED connection, which is the one that accepts DDL:
--   DATABASE_URL="$DATABASE_URL_UNPOOLED" npx prisma db execute \
--     --file prisma/migrations/20261001_add_job_documents/migration.sql
--   npx prisma generate
--
-- NEVER `prisma migrate dev` / `migrate deploy` in this repo.

BEGIN;

CREATE TABLE IF NOT EXISTS "JobDocument" (
    "id" TEXT NOT NULL,
    "postingId" TEXT NOT NULL,
    "resume" JSONB NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "notes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "model" TEXT NOT NULL,
    "costCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobDocument_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "JobDocument_postingId_createdAt_idx" ON "JobDocument" ("postingId", "createdAt");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'JobDocument_postingId_fkey') THEN
        ALTER TABLE "JobDocument"
            ADD CONSTRAINT "JobDocument_postingId_fkey"
            FOREIGN KEY ("postingId") REFERENCES "JobPosting" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

COMMIT;
