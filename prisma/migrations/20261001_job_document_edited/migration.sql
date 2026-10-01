-- Job search: the résumé editor records when a document was last edited.
-- Purely additive and idempotent. Apply with the UNPOOLED connection:
--   DATABASE_URL="$DATABASE_URL_UNPOOLED" npx prisma db execute \
--     --file prisma/migrations/20261001_job_document_edited/migration.sql
-- NEVER `prisma migrate dev` / `migrate deploy` in this repo.

ALTER TABLE "JobDocument" ADD COLUMN IF NOT EXISTS "editedAt" TIMESTAMP(3);
