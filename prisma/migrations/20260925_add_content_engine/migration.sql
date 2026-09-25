-- Content engine: sources, signals and jobs, plus the locale/provenance columns
-- on Post. Spec: CONTENT_ENGINE.md
--
-- Purely additive. Idempotent and transactional: re-running it is a no-op.
--
-- Apply with the UNPOOLED connection, which is the one that accepts DDL:
--   DATABASE_URL="$DATABASE_URL_UNPOOLED" npx prisma db execute \
--     --file prisma/migrations/20260925_add_content_engine/migration.sql
--   npx prisma generate
--
-- NEVER `prisma migrate dev` / `migrate deploy` in this repo. The migration
-- history is divergent from the live database: a diff taken on 25 Sep 2026 also
-- wanted to DROP TABLE "MentorshipApplication" (a real table absent from
-- schema.prisma) and drop a default on "PerkOffer"."markets". Neither belongs to
-- this change, and both are deliberately excluded here.

BEGIN;

-- ─── Sources ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "ContentSource" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "fileUrl" TEXT,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "isReference" BOOLEAN NOT NULL DEFAULT false,
    "lastFetchedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentSource_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ContentSource_kind_enabled_idx"
    ON "ContentSource" ("kind", "enabled");

-- ─── Signals ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "ContentSignal" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "summary" TEXT,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "engagement" INTEGER NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clusterKey" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentSignal_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ContentSignal_fingerprint_key"
    ON "ContentSignal" ("fingerprint");
CREATE INDEX IF NOT EXISTS "ContentSignal_used_score_idx"
    ON "ContentSignal" ("used", "score");
CREATE INDEX IF NOT EXISTS "ContentSignal_clusterKey_idx"
    ON "ContentSignal" ("clusterKey");

-- Postgres has no ADD CONSTRAINT IF NOT EXISTS.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ContentSignal_sourceId_fkey'
    ) THEN
        ALTER TABLE "ContentSignal"
            ADD CONSTRAINT "ContentSignal_sourceId_fkey"
            FOREIGN KEY ("sourceId") REFERENCES "ContentSource"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- ─── Jobs ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "ContentJob" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'SCOUTED',
    "signalIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "brief" JSONB,
    "enPostId" TEXT,
    "faPostId" TEXT,
    "iteration" INTEGER NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "seoScore" INTEGER,
    "reviewScore" INTEGER,
    "faScore" INTEGER,
    "costCents" INTEGER NOT NULL DEFAULT 0,
    "trace" JSONB NOT NULL DEFAULT '[]',
    "error" TEXT,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentJob_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ContentJob_state_lockedAt_idx"
    ON "ContentJob" ("state", "lockedAt");

-- ─── Post: locale, translation pairing, dedupe vector, provenance ───────────
-- Every existing post is English, so the NOT NULL default backfills them.

ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "locale" TEXT NOT NULL DEFAULT 'en';
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "translationGroupId" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "embedding" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[];
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "contentJobId" TEXT;

CREATE INDEX IF NOT EXISTS "Post_locale_status_idx" ON "Post" ("locale", "status");
CREATE INDEX IF NOT EXISTS "Post_translationGroupId_idx" ON "Post" ("translationGroupId");

COMMIT;
