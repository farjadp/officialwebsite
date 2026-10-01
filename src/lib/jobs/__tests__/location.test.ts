import { describe, it, expect } from "vitest"
import { classifyLocation } from "../location"

describe("classifyLocation", () => {
    it("reads a Canadian city and province", () => {
        expect(classifyLocation("Toronto, ON")).toEqual({ country: "CA", remote: false })
        expect(classifyLocation("Vancouver, British Columbia, Canada").country).toBe("CA")
    })

    it("reads ', CA' as California, not Canada", () => {
        expect(classifyLocation("San Francisco, CA").country).toBe("US")
        expect(classifyLocation("Irvine, CA").country).toBe("US")
    })

    it("keeps London, ON in Canada and London alone abroad", () => {
        expect(classifyLocation("London, ON").country).toBe("CA")
        expect(classifyLocation("London").country).toBe("OTHER")
    })

    it("reads bare country codes on remote postings", () => {
        expect(classifyLocation("Remote - US")).toEqual({ country: "US", remote: true })
        expect(classifyLocation("Remote (CA)")).toEqual({ country: "CA", remote: true })
    })

    it("calls a posting open to both countries NA", () => {
        expect(classifyLocation("Remote, North America").country).toBe("NA")
        expect(classifyLocation("Toronto; New York").country).toBe("NA")
    })

    it("says null, not OTHER, when no place is named", () => {
        expect(classifyLocation("Remote")).toEqual({ country: null, remote: true })
        expect(classifyLocation(null)).toEqual({ country: null, remote: false })
        expect(classifyLocation("", true)).toEqual({ country: null, remote: true })
    })

    it("rejects places outside both countries", () => {
        expect(classifyLocation("Dublin").country).toBe("OTHER")
        expect(classifyLocation("Remote - EMEA")).toEqual({ country: "OTHER", remote: true })
        expect(classifyLocation("Zagreb").country).toBe("OTHER")
    })

    it("reads the compound forms real boards write", () => {
        expect(classifyLocation("US-SEA, US-SF, US-NYC, US-Remote")).toEqual({ country: "US", remote: true })
        expect(classifyLocation("Remote in the US, Remote in Canada")).toEqual({ country: "NA", remote: true })
        expect(classifyLocation("Seattle, SF, NYC, Remote in the US").country).toBe("US")
        expect(classifyLocation("Korea", true)).toEqual({ country: "OTHER", remote: true })
        expect(classifyLocation("Worldwide")).toEqual({ country: null, remote: true })
    })

    it("takes the board's own remote flag", () => {
        expect(classifyLocation("Toronto", true)).toEqual({ country: "CA", remote: true })
    })
})
