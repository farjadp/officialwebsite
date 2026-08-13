-- Link StartupIntake to authenticated users (one intake per user).
-- Keep inviteId optional for legacy records.

ALTER TABLE "StartupIntake" ADD COLUMN "userId" TEXT;

CREATE UNIQUE INDEX "StartupIntake_userId_key" ON "StartupIntake"("userId");

ALTER TABLE "StartupIntake" ADD CONSTRAINT "StartupIntake_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL;

ALTER TABLE "StartupIntake" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
