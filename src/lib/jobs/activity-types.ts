// ============================================================================
// Hardware Source: activity-types.ts
// Why: The activity log's kinds, levels and entry shape, with no server
//      imports, so the live feed (a client component) can use them.
// ============================================================================

export const ACTIVITY_KINDS = ["run", "ingest", "score", "documents", "status", "agent", "control"] as const
export type ActivityKind = (typeof ACTIVITY_KINDS)[number]

export const ACTIVITY_LEVELS = ["info", "warn", "error"] as const
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number]

export type ActivityEntry = {
    id: string
    level: ActivityLevel
    kind: ActivityKind
    message: string
    data: unknown
    createdAt: string
}

export function isActivityKind(value: unknown): value is ActivityKind {
    return typeof value === "string" && (ACTIVITY_KINDS as readonly string[]).includes(value)
}

export function isActivityLevel(value: unknown): value is ActivityLevel {
    return typeof value === "string" && (ACTIVITY_LEVELS as readonly string[]).includes(value)
}

/** Kind is stored in `path` as "jobs/<kind>"; anything else reads as "agent". */
export function kindFromPath(path: string | null): ActivityKind {
    const kind = path?.startsWith("jobs/") ? path.slice(5) : ""
    return isActivityKind(kind) ? kind : "agent"
}
