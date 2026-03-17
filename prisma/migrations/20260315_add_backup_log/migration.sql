CREATE TABLE IF NOT EXISTS "BackupLog" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dbFile" TEXT,
    "codeFile" TEXT,
    "dbSizeBytes" BIGINT,
    "codeSizeBytes" BIGINT,
    "durationMs" INTEGER,
    "error" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BackupLog_pkey" PRIMARY KEY ("id")
);
