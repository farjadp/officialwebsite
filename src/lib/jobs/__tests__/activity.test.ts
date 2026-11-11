import { describe, expect, it } from "vitest"
import { isActivityKind, isActivityLevel, kindFromPath } from "../activity-types"

describe("activity kinds", () => {
    it("reads the kind back from the stored path", () => {
        expect(kindFromPath("jobs/run")).toBe("run")
        expect(kindFromPath("jobs/documents")).toBe("documents")
    })

    it("treats an unknown or missing path as an agent line", () => {
        expect(kindFromPath(null)).toBe("agent")
        expect(kindFromPath("jobs/nonsense")).toBe("agent")
        expect(kindFromPath("/admin/jobs")).toBe("agent")
    })

    it("accepts only the known kinds and levels", () => {
        expect(isActivityKind("score")).toBe(true)
        expect(isActivityKind("delete")).toBe(false)
        expect(isActivityKind(undefined)).toBe(false)
        expect(isActivityLevel("warn")).toBe(true)
        expect(isActivityLevel("debug")).toBe(false)
    })
})
