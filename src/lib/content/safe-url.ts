// ============================================================================
// Hardware Source: safe-url.ts
// Version: 1.0.0 — 2026-09-25
// Why: Every address the content engine fetches was typed into the admin by a
//      person. Without a guard, a mistyped or malicious source — localhost, a
//      private range, the cloud metadata address — turns the scout into a way
//      to read this server's own network. This refuses those addresses before
//      the request is made, and on every redirect hop.
// Env / Identity: Pure check plus one fetch wrapper. Server only.
//
// Limit, stated plainly: the check is on the hostname as written. A public
// hostname whose DNS answers with a private address (DNS rebinding) is not
// caught here; that needs resolution-time pinning, which Node's fetch does not
// expose. The realistic risk this closes is an admin-entered private address.
// ============================================================================

import { isIP } from "node:net"

export class UnsafeUrl extends Error {
    constructor(message: string) {
        super(message)
        this.name = "UnsafeUrl"
    }
}

function ipv4Parts(address: string): number[] | null {
    const parts = address.split(".").map(Number)
    return parts.length === 4 && parts.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)
        ? parts
        : null
}

function isPrivateIPv4(address: string): boolean {
    const p = ipv4Parts(address)
    if (!p) return false
    const [a, b] = p
    return (
        a === 0 || // "this network", incl. 0.0.0.0
        a === 10 ||
        a === 127 || // loopback
        (a === 169 && b === 254) || // link-local, incl. cloud metadata
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168) ||
        (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
        a >= 224 // multicast and reserved
    )
}

function isPrivateIPv6(address: string): boolean {
    const lower = address.toLowerCase()
    if (lower === "::" || lower === "::1") return true
    // IPv4-mapped, e.g. ::ffff:127.0.0.1 — judge the embedded v4 address.
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
    if (mapped) return isPrivateIPv4(mapped[1])
    // URL parsing normalises ::ffff:127.0.0.1 to ::ffff:7f00:1.
    const mappedHex = lower.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/)
    if (mappedHex) {
        const hi = parseInt(mappedHex[1], 16)
        const lo = parseInt(mappedHex[2], 16)
        return isPrivateIPv4(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`)
    }
    return (
        /^f[cd][0-9a-f]{2}:/.test(lower) || // unique local fc00::/7
        /^fe[89ab][0-9a-f]:/.test(lower) // link-local fe80::/10
    )
}

/** Throws `UnsafeUrl` unless `raw` is an http(s) address on a public host. */
export function assertPublicUrl(raw: string): URL {
    let url: URL
    try {
        url = new URL(raw)
    } catch {
        throw new UnsafeUrl(`Invalid URL: ${raw}`)
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new UnsafeUrl(`Refusing ${url.protocol} protocol — only http and https are fetched`)
    }

    const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "")

    if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
        throw new UnsafeUrl(`Refusing local host ${host}`)
    }

    const version = isIP(host)
    if ((version === 4 && isPrivateIPv4(host)) || (version === 6 && isPrivateIPv6(host))) {
        throw new UnsafeUrl(`Refusing private address ${host}`)
    }

    return url
}

const MAX_REDIRECTS = 5

/**
 * `fetch`, but every hop — the first request and each redirect — must pass
 * `assertPublicUrl`. Following redirects automatically would let a public URL
 * bounce the request onto an internal one after the check had passed.
 */
export async function safeFetch(raw: string, init: RequestInit = {}): Promise<Response> {
    let current = assertPublicUrl(raw).toString()

    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
        const response = await fetch(current, { ...init, redirect: "manual" })

        if (response.status < 300 || response.status >= 400) return response

        const location = response.headers.get("location")
        if (!location) return response

        current = assertPublicUrl(new URL(location, current).toString()).toString()
    }

    throw new UnsafeUrl(`More than ${MAX_REDIRECTS} redirects from ${raw}`)
}
