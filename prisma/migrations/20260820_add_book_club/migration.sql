CREATE TABLE IF NOT EXISTS "BookClubSession" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "googleEventId" TEXT,
    "meetLink" TEXT,
    "summary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookClubSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "BookClubSession_sessionDate_idx" ON "BookClubSession" ("sessionDate");

CREATE TABLE IF NOT EXISTS "BookClubBook" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "description" TEXT,
    "link" TEXT,
    "coverUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookClubBook_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BookClubMember" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookClubMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BookClubMember_email_key" ON "BookClubMember" ("email");
