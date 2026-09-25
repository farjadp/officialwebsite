// ============================================================================
// Hardware Source: _env.ts
// Version: 1.0.0 — 2026-09-25
// Why: `src/lib/prisma.ts` reads DATABASE_URL at module load and falls back to
//      a localhost connection when it is unset. ES module imports are hoisted,
//      so a script that calls dotenv's config() in its body has already
//      imported Prisma against that fallback — and on a machine with a local
//      Postgres running, the script then talks to the WRONG DATABASE and
//      reports "table does not exist" instead of failing to connect.
//
//      Importing this module first, for its side effect, loads the environment
//      before anything else is imported.
//
//        import "./_env"              // must be the first import
//        import { prisma } from "../src/lib/prisma"
//
// Env / Identity: Local scripts only. Loads .env.local (keys) then .env.
// ============================================================================

import { config } from "dotenv"

config({ path: ".env.local", quiet: true })
config({ quiet: true })

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is unset — refusing to run against the localhost fallback")
}
