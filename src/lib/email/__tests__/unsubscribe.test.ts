import { describe, expect, it } from "vitest"
import { confirmPage, donePage, escapeHtml, maskEmail, postResponseKind } from "../unsubscribe"

describe("postResponseKind", () => {
    it("answers our confirmation form with a page", () => {
        expect(postResponseKind(new URLSearchParams("confirm=1"))).toBe("page")
    })
    it("answers an RFC 8058 one-click request silently", () => {
        expect(postResponseKind(new URLSearchParams("List-Unsubscribe=One-Click"))).toBe("json")
    })
    it("answers an empty or unreadable body silently", () => {
        expect(postResponseKind(new URLSearchParams(""))).toBe("json")
        expect(postResponseKind(null)).toBe("json")
    })
})

describe("maskEmail", () => {
    it("keeps the first two letters and the domain", () => {
        expect(maskEmail("info@example.ca")).toBe("in**@example.ca")
    })
    it("handles very short local parts and junk", () => {
        expect(maskEmail("a@x.com")).toBe("a*@x.com")
        expect(maskEmail("not-an-email")).toBe("***")
    })
})

describe("pages", () => {
    it("the confirmation page posts back with confirm=1 and does not show the full address", () => {
        const p = confirmPage("info@example.ca", "https://site/e/u/tok", "https://site/e/p/tok")
        expect(p.body).toContain('method="post"')
        expect(p.body).toContain('action="https://site/e/u/tok"')
        expect(p.body).toContain('name="confirm" value="1"')
        expect(p.body).not.toContain("info@example.ca")
    })
    it("escapes what it prints", () => {
        expect(escapeHtml(`<a href="x">'&`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;")
        expect(donePage("<x>@evil.com", "/p").body).not.toContain("<x>")
    })
})
