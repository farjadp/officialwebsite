// ============================================================================
// File Path: scripts/indexnow.ts
// Version: 1.0.0 — 2026-09-27
// Why: Tell Bing (and Yandex, Seznam, Naver — every IndexNow participant)
//      that a page is new or changed, instead of waiting to be crawled.
//      Google does NOT participate in IndexNow and ignores these submissions;
//      for Google the only routes are the sitemap and the manual "Request
//      indexing" button in Search Console.
//
//      Submitting a URL is a request to crawl a page that is already public
//      and already in sitemap.xml. It publishes nothing new.
//
// Usage:
//   npx tsx scripts/indexnow.ts https://www.farjadp.info/fa/intro [more URLs…]
//   npx tsx scripts/indexnow.ts --sitemap        # every URL in sitemap.xml
//
// The key file must be live at KEY_LOCATION before submitting, or the whole
// batch is rejected with 403. Deploy first, then run this.
// ============================================================================

const SITE_URL = "https://www.farjadp.info"
const HOST = new URL(SITE_URL).host
const KEY = "6e0884b34c7d399fc417776d38c17937"
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`
const ENDPOINT = "https://api.indexnow.org/indexnow"

/** IndexNow accepts at most 10,000 URLs per request. */
const MAX_BATCH = 10_000

async function sitemapUrls(): Promise<string[]> {
    const response = await fetch(`${SITE_URL}/sitemap.xml`)
    if (!response.ok) throw new Error(`sitemap.xml returned ${response.status}`)
    const xml = await response.text()
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

/**
 * The key file is what proves we own the host. Checking it first turns the
 * confusing 403 "key not found" into a clear message before anything is sent.
 */
async function assertKeyIsLive(): Promise<void> {
    const response = await fetch(KEY_LOCATION)
    if (!response.ok) {
        throw new Error(`Key file is not live at ${KEY_LOCATION} (HTTP ${response.status}). Deploy first.`)
    }
    const body = (await response.text()).trim()
    if (body !== KEY) {
        throw new Error(`Key file at ${KEY_LOCATION} contains "${body.slice(0, 40)}", expected "${KEY}".`)
    }
}

async function main() {
    const args = process.argv.slice(2)
    if (args.length === 0) {
        console.error("Usage: npx tsx scripts/indexnow.ts <url…> | --sitemap")
        process.exit(1)
    }

    const urlList = args[0] === "--sitemap" ? await sitemapUrls() : args

    const foreign = urlList.filter((u) => {
        try {
            return new URL(u).host !== HOST
        } catch {
            return true
        }
    })
    if (foreign.length) {
        // IndexNow rejects the whole batch if any URL is off-host, so fail
        // loudly rather than have the submission silently do nothing.
        console.error(`Not this host (or not a URL): ${foreign.join(", ")}`)
        process.exit(1)
    }
    if (urlList.length > MAX_BATCH) {
        console.error(`${urlList.length} URLs exceeds the ${MAX_BATCH} per-request limit.`)
        process.exit(1)
    }

    await assertKeyIsLive()

    const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    })

    const body = await response.text()
    // 200 = accepted, 202 = accepted but the key is still being verified.
    // Neither means "indexed": the engines decide that themselves.
    console.log(`HTTP ${response.status} ${response.statusText}`)
    if (body.trim()) console.log(body.trim())
    console.log(`Submitted ${urlList.length} URL(s):`)
    for (const url of urlList) console.log(`  ${url}`)

    if (response.status !== 200 && response.status !== 202) process.exit(1)
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
})
