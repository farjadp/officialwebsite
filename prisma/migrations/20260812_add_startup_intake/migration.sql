CREATE TABLE IF NOT EXISTS "IntakeInvite" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntakeInvite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "IntakeInvite_code_key" ON "IntakeInvite" ("code");

CREATE TABLE IF NOT EXISTS "StartupIntake" (
    "id" TEXT NOT NULL,
    "inviteId" TEXT,
    "startupName" TEXT NOT NULL,
    "website" TEXT,
    "country" TEXT NOT NULL,
    "founders" JSONB NOT NULL,
    "answers" JSONB NOT NULL,
    "files" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupIntake_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "StartupIntake_createdAt_idx" ON "StartupIntake" ("createdAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'StartupIntake_inviteId_fkey'
    ) THEN
        ALTER TABLE "StartupIntake"
            ADD CONSTRAINT "StartupIntake_inviteId_fkey"
            FOREIGN KEY ("inviteId") REFERENCES "IntakeInvite" ("id")
            ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
