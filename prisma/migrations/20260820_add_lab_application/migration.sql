CREATE TABLE IF NOT EXISTS "LabApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "social" TEXT,
    "stage" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "why" TEXT NOT NULL,
    "deckUrl" TEXT,
    "deckName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "telegramOk" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "LabApplication_createdAt_idx" ON "LabApplication" ("createdAt");
