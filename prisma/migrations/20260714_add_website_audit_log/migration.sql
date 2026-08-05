CREATE TABLE IF NOT EXISTS "WebsiteAuditLog" (
    "id" TEXT NOT NULL,
    "requestedUrl" TEXT NOT NULL,
    "finalUrl" TEXT,
    "hostname" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "overallScore" INTEGER,
    "grade" TEXT,
    "accessScore" INTEGER,
    "metadataScore" INTEGER,
    "agentScore" INTEGER,
    "citabilityScore" INTEGER,
    "durationMs" INTEGER NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebsiteAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "WebsiteAuditLog_createdAt_idx" ON "WebsiteAuditLog" ("createdAt");
CREATE INDEX IF NOT EXISTS "WebsiteAuditLog_hostname_idx" ON "WebsiteAuditLog" ("hostname");
CREATE INDEX IF NOT EXISTS "WebsiteAuditLog_status_idx" ON "WebsiteAuditLog" ("status");
