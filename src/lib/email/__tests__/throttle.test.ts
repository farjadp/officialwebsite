import { describe, expect, it } from "vitest"
import { hourlyAllowance } from "../provider"

describe("hourlyAllowance", () => {
    it("allows up to the hourly number", () => {
        expect(hourlyAllowance(3, 0)).toBe(3)
        expect(hourlyAllowance(3, 2)).toBe(1)
    })

    it("stops once the hour's quota is used", () => {
        expect(hourlyAllowance(1, 1)).toBe(0)
        expect(hourlyAllowance(3, 5)).toBe(0)
    })

    it("treats zero or missing as no hourly limit", () => {
        expect(hourlyAllowance(0, 40)).toBe(Number.MAX_SAFE_INTEGER)
    })

    it("one per hour caps a day at 24 sends", () => {
        let sent = 0
        for (let hour = 0; hour < 24; hour++) {
            // six cron ticks an hour; only the first in each hour may send
            let thisHour = 0
            for (let tick = 0; tick < 6; tick++) {
                const n = Math.min(100, hourlyAllowance(1, thisHour))
                thisHour += n
                sent += n
            }
        }
        expect(sent).toBe(24)
    })
})
