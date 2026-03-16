# BackupLog SQL

The BackupLog table was created directly via SQL since db push was cancelled.

```sql
CREATE TABLE IF NOT EXISTS "BackupLog" (
  id TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  "dbFile" TEXT,
  "codeFile" TEXT,
  "dbSizeBytes" BIGINT,
  "codeSizeBytes" BIGINT,
  "durationMs" INT,
  error TEXT,
  notes TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
