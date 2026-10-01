-- Job search: boards and postings.
-- Spec: docs/superpowers/specs/2026-10-01-job-search-design.md
--
-- Purely additive. Idempotent and transactional: re-running it is a no-op.
--
-- Apply with the UNPOOLED connection, which is the one that accepts DDL:
--   DATABASE_URL="$DATABASE_URL_UNPOOLED" npx prisma db execute \
--     --file prisma/migrations/20261001_add_job_search/migration.sql
--   npx prisma generate
--
-- NEVER `prisma migrate dev` / `migrate deploy` in this repo.

BEGIN;

CREATE TABLE IF NOT EXISTS "JobBoard" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastFetchedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "lastCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobBoard_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "JobBoard_kind_token_key" ON "JobBoard" ("kind", "token");

CREATE TABLE IF NOT EXISTS "JobPosting" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "country" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "department" TEXT,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "postedAt" TIMESTAMP(3),
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "missedRuns" INTEGER NOT NULL DEFAULT 0,
    "closedAt" TIMESTAMP(3),
    "prefilter" TEXT NOT NULL DEFAULT 'REJECT',
    "prefilterReason" TEXT,
    "lane" TEXT,
    "score" INTEGER,
    "scoreNotes" JSONB,
    "scoredAt" TIMESTAMP(3),
    "scoreAttempts" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "appliedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "JobPosting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "JobPosting_fingerprint_key" ON "JobPosting" ("fingerprint");
CREATE INDEX IF NOT EXISTS "JobPosting_prefilter_status_score_idx" ON "JobPosting" ("prefilter", "status", "score");
CREATE INDEX IF NOT EXISTS "JobPosting_boardId_closedAt_idx" ON "JobPosting" ("boardId", "closedAt");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'JobPosting_boardId_fkey') THEN
        ALTER TABLE "JobPosting"
            ADD CONSTRAINT "JobPosting_boardId_fkey"
            FOREIGN KEY ("boardId") REFERENCES "JobBoard" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

COMMIT;
