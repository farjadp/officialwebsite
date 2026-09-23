-- Astaneh perk partners (/fa/lab/perks). Idempotent: apply with `prisma db execute`.
BEGIN;

CREATE TABLE IF NOT EXISTS "PerkOffer" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telegram" TEXT,
    "country" TEXT NOT NULL,
    "perkType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "valueEstimate" TEXT,
    "markets" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "validity" TEXT,
    "consent" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "emailOk" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerkOffer_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PerkOffer_createdAt_idx" ON "PerkOffer" ("createdAt");

COMMIT;
