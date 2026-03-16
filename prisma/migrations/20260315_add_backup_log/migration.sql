model BackupLog {
  id          String   @id @default(cuid())
  date        DateTime @default(now())
  status      String   // "success" | "failed" | "running"
  type        String   // "full" | "db-only" | "code-only"
  dbFile      String?  // local path to DB dump file
  codeFile    String?  // local path to code zip file
  dbSizeBytes BigInt?
  codeSizeBytes BigInt?
  durationMs  Int?
  error       String?
  notes       String?
  createdAt   DateTime @default(now())
}
