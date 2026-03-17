CREATE TABLE IF NOT EXISTS "SystemLog" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "source" TEXT,
    "path" TEXT,
    "method" TEXT,
    "status" INTEGER,
    "ip" TEXT,
    "userAgent" TEXT,
    "userId" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SystemLog_createdAt_idx" ON "SystemLog" ("createdAt");
CREATE INDEX IF NOT EXISTS "SystemLog_level_idx" ON "SystemLog" ("level");
