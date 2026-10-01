import { describe, it, expect } from "vitest"
import { decodeEntities, htmlToText } from "../text"

describe("htmlToText", () => {
    it("turns blocks into lines and list items into dashes", () => {
        expect(htmlToText("<p>About us</p><ul><li>One</li><li>Two</li></ul>")).toBe("About us\n\n- One\n- Two")
    })

    it("drops scripts and decodes entities", () => {
        expect(htmlToText("<script>x()</script><p>R&amp;D &#8211; now</p>")).toBe("R&D – now")
    })

    it("reads Greenhouse's entity-escaped HTML after one decode", () => {
        const escaped = "&lt;p&gt;Lead the &lt;strong&gt;team&lt;/strong&gt;&lt;/p&gt;"
        expect(htmlToText(decodeEntities(escaped))).toBe("Lead the team")
    })
})
