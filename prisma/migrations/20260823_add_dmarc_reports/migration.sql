-- DMARC aggregate report storage. Additive only.

BEGIN;

-- CreateTable
CREATE TABLE IF NOT EXISTS "DmarcReport" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "orgEmail" TEXT,
    "domain" TEXT NOT NULL,
    "rangeBegin" TIMESTAMP(3) NOT NULL,
    "rangeEnd" TIMESTAMP(3) NOT NULL,
    "policyP" TEXT NOT NULL,
    "policySp" TEXT,
    "policyPct" INTEGER,
    "adkim" TEXT,
    "aspf" TEXT,
    "totalMessages" INTEGER NOT NULL DEFAULT 0,
    "passCount" INTEGER NOT NULL DEFAULT 0,
    "failCount" INTEGER NOT NULL DEFAULT 0,
    "sourceFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DmarcReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "DmarcRecord" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "sourceIp" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "disposition" TEXT NOT NULL,
    "dkimPolicy" TEXT NOT NULL,
    "spfPolicy" TEXT NOT NULL,
    "headerFrom" TEXT,
    "dkimDomain" TEXT,
    "dkimSelector" TEXT,
    "dkimResult" TEXT,
    "spfDomain" TEXT,
    "spfResult" TEXT,

    CONSTRAINT "DmarcRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DmarcReport_rangeBegin_idx" ON "DmarcReport"("rangeBegin");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "DmarcReport_orgName_reportId_key" ON "DmarcReport"("orgName", "reportId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DmarcRecord_reportId_idx" ON "DmarcRecord"("reportId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DmarcRecord_sourceIp_idx" ON "DmarcRecord"("sourceIp");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "DmarcRecord" ADD CONSTRAINT "DmarcRecord_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "DmarcReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMIT;
