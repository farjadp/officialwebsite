-- Sender display name: correct the default and the rows already carrying it.
-- Campaigns where a name was chosen deliberately are left alone.

BEGIN;

ALTER TABLE "Campaign" ALTER COLUMN "fromName" SET DEFAULT 'Farjad PMD';

UPDATE "Campaign" SET "fromName" = 'Farjad PMD' WHERE "fromName" = 'Farjad Pezeshk';

COMMIT;
