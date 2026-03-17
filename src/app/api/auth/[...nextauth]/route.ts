// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-02-24
// Why: API Route Handler
// Env / Identity: Server Route Handlers
// ============================================================================

import { handlers } from "@/auth"
import { withApiLogging } from "@/lib/api-logger"

export const GET = withApiLogging("GET", handlers.GET as any)
export const POST = withApiLogging("POST", handlers.POST as any)
