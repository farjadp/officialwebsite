-- Job search: a ledger of model calls for the usage page.
-- Purely additive and idempotent. Apply with the UNPOOLED connection:
--   DATABASE_URL="$DATABASE_URL_UNPOOLED" npx prisma db execute \
--     --file prisma/migrations/20261001_job_usage/migration.sql
-- NEVER `prisma migrate dev` / `migrate deploy` in this repo.

BEGIN;

CREATE TABLE IF NOT EXISTS "JobUsage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agent" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "costCents" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "JobUsage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "JobUsage_createdAt_idx" ON "JobUsage" ("createdAt");

COMMIT;
