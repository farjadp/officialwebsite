import { isIP } from "node:net";
import { resolve4, resolve6 } from "node:dns/promises";

export type CheckStatus = "passing" | "attention" | "missing" | "info" | "na";

export type ReadinessCheck = {
  id: string;
  title: string;
  detail: string;
  status: CheckStatus;
  recommendation?: string;
  scored: boolean;
};

export type ReadinessCategory = {
  id: "access" | "metadata" | "agent-readiness" | "content-citability" | "ai-visibility";
  name: string;
  score: number | null;
  checks: ReadinessCheck[];
};

export type WebsiteReadinessReport = {
  url: string;
  finalUrl: string;
  scannedAt: string;
  overallScore: number;
  grade: string;
  summary: string;
  categories: ReadinessCategory[];
};

type FetchResult = {
  url: string;
  status: number;
  contentType: string;
  text: string;
};

const MAX_BYTES = 2_000_000;
const USER_AGENT = "Ashavid-AI-Readiness-Audit/1.0 (+https://ashavid.com/tools)";

function isPrivateIp(address: string) {
  if (
    address === "::1" ||
    address === "::" ||
    address.startsWith("fe80:") ||
    address.startsWith("fc") ||
    address.startsWith("fd")
  )
    return true;
  if (address.startsWith("::ffff:")) return isPrivateIp(address.slice(7));
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) return false;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

async function assertPublicUrl(url: URL) {
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Only HTTP and HTTPS URLs can be scanned.");
  if (url.username || url.password)
    throw new Error("URLs containing credentials are not supported.");
  if (url.port && !["80", "443"].includes(url.port))
    throw new Error("Only standard web ports can be scanned.");
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".internal"))
    throw new Error("Local and private websites cannot be scanned.");
  const literal = isIP(hostname)
    ? [hostname]
    : [
        ...(await resolve4(hostname).catch(() => [])),
        ...(await resolve6(hostname).catch(() => [])),
      ];
  if (!literal.length) throw new Error("The website hostname could not be resolved.");
  if (literal.some(isPrivateIp)) throw new Error("Local and private websites cannot be scanned.");
}

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Enter a website URL.");
  return new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
}

async function safeFetch(input: URL, init: RequestInit = {}, redirects = 0): Promise<FetchResult> {
  if (redirects > 4) throw new Error("The website redirected too many times.");
  await assertPublicUrl(input);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(input, {
      ...init,
      redirect: "manual",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml,text/plain,*/*",
        ...init.headers,
      },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("The website returned an invalid redirect.");
      return safeFetch(new URL(location, input), init, redirects + 1);
    }
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_BYTES)
      throw new Error("The website response is too large to scan safely.");
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES)
      throw new Error("The website response is too large to scan safely.");
    return {
      url: response.url || input.toString(),
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      text: new TextDecoder().decode(buffer),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError")
      throw new Error("The website took too long to respond.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function tryFetch(url: URL, init?: RequestInit) {
  try {
    return await safeFetch(url, init);
  } catch {
    return null;
  }
}

function getMeta(html: string, key: string, property = false) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const attr = property ? "property" : "name";
  const tag = tags.find((item) => new RegExp(`${attr}=["']${key}["']`, "i").test(item));
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() || "";
}

function getTitle(html: string) {
  return (
    html
      .match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
      ?.replace(/\s+/g, " ")
      .trim() || ""
  );
}
function getCanonical(html: string) {
  return (
    (html.match(/<link\b[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/i)?.[0] || "").match(
      /href=["']([^"']+)/i
    )?.[1] || ""
  );
}
function hasSameOrigin(value: string, base: URL) {
  try {
    return new URL(value, base).origin === base.origin;
  } catch {
    return false;
  }
}
function stripHtml(html: string) {
  return html
    .replace(/<(script|style|noscript|svg|template)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function robotsAllows(robots: string, agent: string) {
  if (!robots.trim()) return false;
  const lines = robots
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
  let active = false;
  let matched = false;
  for (const line of lines) {
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      active = value === "*" || value.toLowerCase() === agent.toLowerCase();
      matched ||= active;
    } else if (active && key === "disallow" && (value === "/" || value === "/*")) return false;
  }
  return matched;
}

function extractJsonLd(html: string) {
  const blocks = [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];
  const nodes: Record<string, unknown>[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (value && typeof value === "object") {
      const object = value as Record<string, unknown>;
      nodes.push(object);
      if (object["@graph"]) visit(object["@graph"]);
    }
  };
  for (const block of blocks) {
    try {
      visit(JSON.parse(block[1]));
    } catch {
      /* invalid JSON-LD is reported through missing nodes */
    }
  }
  return nodes;
}

function check(
  id: string,
  title: string,
  detail: string,
  status: CheckStatus,
  recommendation?: string,
  scored = true
): ReadinessCheck {
  return { id, title, detail, status, recommendation, scored };
}

function scoreChecks(checks: ReadinessCheck[]) {
  const scored = checks.filter((item) => item.scored && item.status !== "na");
  if (!scored.length) return 0;
  const points = scored.reduce(
    (total, item) =>
      total + (item.status === "passing" ? 1 : item.status === "attention" ? 0.5 : 0),
    0
  );
  return Math.round((points / scored.length) * 100);
}

function parseSitemap(xml: string) {
  return [...xml.matchAll(/<url>\s*([\s\S]*?)<\/url>/gi)]
    .map((match) => ({
      loc: match[1].match(/<loc>\s*([^<]+)\s*<\/loc>/i)?.[1]?.trim() || "",
      lastmod: match[1].match(/<lastmod>\s*([^<]+)\s*<\/lastmod>/i)?.[1]?.trim() || "",
    }))
    .filter((entry) => entry.loc);
}

function sitemapLinks(xml: string) {
  return [...xml.matchAll(/<sitemap>[\s\S]*?<loc>\s*([^<]+)\s*<\/loc>[\s\S]*?<\/sitemap>/gi)].map(
    (match) => match[1].trim()
  );
}

export async function analyzeWebsite(input: string): Promise<WebsiteReadinessReport> {
  const requestedUrl = normalizeUrl(input);
  const homepage = await safeFetch(requestedUrl);
  if (!homepage.contentType.includes("text/html"))
    throw new Error("The URL did not return an HTML page.");
  const finalUrl = new URL(homepage.url);
  const origin = finalUrl.origin;
  const html = homepage.text;
  const text = stripHtml(html);
  const robotsUrl = new URL("/robots.txt", origin);
  const robots = await tryFetch(robotsUrl);
  const robotsOk = !!robots && robots.status === 200 && /user-agent\s*:/i.test(robots.text);
  const declaredSitemap = robots?.text.match(/^\s*sitemap:\s*(\S+)/im)?.[1];

  const [botPage, llms, llmsFull, agents, ucp, catalog] = await Promise.all([
    tryFetch(finalUrl, { headers: { "user-agent": "GPTBot/1.0" } }),
    tryFetch(new URL("/llms.txt", origin)),
    tryFetch(new URL("/llms-full.txt", origin)),
    tryFetch(new URL("/agents.md", origin)),
    tryFetch(new URL("/.well-known/ucp", origin)),
    tryFetch(new URL("/ai-catalog.json", origin)),
  ]);

  let sitemapUrl: URL | null = null;
  let sitemapResponse: FetchResult | null = null;
  for (const candidate of [
    declaredSitemap,
    `${origin}/sitemap.xml`,
    `${origin}/sitemap_index.xml`,
  ].filter(Boolean) as string[]) {
    try {
      const candidateUrl = new URL(candidate, origin);
      const result = await tryFetch(candidateUrl);
      if (result?.status === 200 && /<(urlset|sitemapindex)\b/i.test(result.text)) {
        sitemapUrl = candidateUrl;
        sitemapResponse = result;
        break;
      }
    } catch {
      /* continue with conventional sitemap locations */
    }
  }
  let sitemapEntries = sitemapResponse ? parseSitemap(sitemapResponse.text) : [];
  if (!sitemapEntries.length && sitemapResponse) {
    const children = sitemapLinks(sitemapResponse.text).slice(0, 3);
    const childResults = await Promise.all(
      children.map((url) => {
        try {
          return tryFetch(new URL(url, origin));
        } catch {
          return null;
        }
      })
    );
    sitemapEntries = childResults.flatMap((result) => (result ? parseSitemap(result.text) : []));
  }
  const sampleEntries = sitemapEntries.slice(0, 5);
  const sampleResults = await Promise.all(
    sampleEntries.map((entry) => {
      try {
        return tryFetch(new URL(entry.loc));
      } catch {
        return null;
      }
    })
  );
  const healthySamples = sampleResults.filter(
    (result) =>
      result?.status === 200 &&
      !/<meta\b[^>]*(?:name=["']robots["'][^>]*content=["'][^"']*noindex|content=["'][^"']*noindex[^>]*name=["']robots["'])/i.test(
        result.text
      )
  ).length;

  const title = getTitle(html);
  const description = getMeta(html, "description");
  const canonical = getCanonical(html);
  const ogFields = ["og:title", "og:description", "og:image", "og:url"];
  const missingOg = ogFields.filter((field) => !getMeta(html, field, true));
  const ogImage = getMeta(html, "og:image", true);
  let ogImageResult: FetchResult | null = null;
  if (ogImage) {
    try {
      ogImageResult = await tryFetch(new URL(ogImage, finalUrl));
    } catch {
      /* invalid image URL */
    }
  }
  const jsonLd = extractJsonLd(html);
  const business = jsonLd.find((node) => {
    const type = node["@type"];
    const values = Array.isArray(type) ? type : [type];
    return values.some(
      (value) =>
        typeof value === "string" &&
        /(Organization|Corporation|LocalBusiness|ProfessionalService|Store|Restaurant)/i.test(value)
    );
  });
  const businessMissing = business
    ? ([!business.address && "address", !business.telephone && "telephone"].filter(
        Boolean
      ) as string[])
    : [];
  const schemaTypes = jsonLd.flatMap((node) =>
    Array.isArray(node["@type"]) ? (node["@type"] as string[]) : [String(node["@type"] || "")]
  );
  const htmlLang = html.match(/<html\b[^>]*lang=["']([^"']+)/i)?.[1];
  const hreflang = /<link\b[^>]*hreflang=/i.test(html);
  const textRatio = html.length ? (text.length / html.length) * 100 : 0;
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);
  const hasFaq =
    /<(h[1-6]|strong)[^>]*>[^<]{3,120}\?\s*<\/\1>/i.test(html) || schemaTypes.includes("FAQPage");
  const hasPrice = /(?:[$€£]|USD|EUR|CAD|CHF)\s?\d|\d[\d,.]*\s?(?:[$€£]|USD|EUR|CAD|CHF)/i.test(
    text
  );
  const currentYear = new Date().getFullYear();
  const years = [...text.matchAll(/\b(20\d{2})\b/g)].map((match) => Number(match[1]));
  const newestYear = years.length ? Math.max(...years) : null;
  const concreteSignals = [
    ...text.matchAll(
      /\b\d+(?:[.,]\d+)?(?:%|\s+(?:years?|customers?|clients?|countries|projects?|locations?|members?))\b/gi
    ),
  ].length;
  const businessName =
    typeof business?.name === "string" ? business.name : getMeta(html, "og:site_name", true);
  const hasGoogleBusiness =
    /https?:\/\/(?:www\.)?(?:google\.[^/]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(html);

  const accessChecks = [
    check(
      "1.1",
      "Homepage availability",
      homepage.status === 200
        ? `The homepage responded HTTP 200 over ${finalUrl.protocol === "https:" ? "HTTPS" : "HTTP"}.`
        : `The homepage responded HTTP ${homepage.status}.`,
      homepage.status === 200 && finalUrl.protocol === "https:" ? "passing" : "attention",
      "Serve the canonical homepage over HTTPS with a 200 response."
    ),
    check(
      "1.2",
      "robots.txt",
      robotsOk
        ? "robots.txt is present and contains valid User-agent directives."
        : "robots.txt is missing or does not contain a valid User-agent directive.",
      robotsOk ? "passing" : "missing",
      "Publish a plain-text /robots.txt file with explicit crawler rules."
    ),
    check(
      "1.3",
      "AI crawler access",
      robotsOk &&
        ["OAI-SearchBot", "PerplexityBot"].every((agent) => robotsAllows(robots!.text, agent))
        ? "OpenAI and Perplexity search crawlers are allowed by robots.txt."
        : "One or more AI search crawlers are not allowed by robots.txt.",
      robotsOk &&
        ["OAI-SearchBot", "PerplexityBot"].every((agent) => robotsAllows(robots!.text, agent))
        ? "passing"
        : "attention",
      "Allow OAI-SearchBot and PerplexityBot unless your publishing policy requires blocking them."
    ),
    check(
      "1.4",
      "Bot/visitor parity",
      botPage?.status === 200 &&
        Math.abs(botPage.text.length - html.length) / Math.max(html.length, 1) < 0.05
        ? `GPTBot received substantially the same HTML as a normal visitor (${botPage.text.length.toLocaleString()} vs. ${html.length.toLocaleString()} characters).`
        : "GPTBot did not receive substantially the same HTML as a normal visitor.",
      botPage?.status === 200 &&
        Math.abs(botPage.text.length - html.length) / Math.max(html.length, 1) < 0.05
        ? "passing"
        : "attention",
      "Avoid serving AI crawlers an error, challenge, or materially different page."
    ),
    check(
      "1.5",
      "XML sitemap",
      sitemapResponse
        ? `Sitemap found at ${sitemapUrl?.toString()} (${sitemapEntries.length.toLocaleString()} discovered URLs).`
        : "No valid XML sitemap was found.",
      sitemapResponse ? "passing" : "missing",
      "Publish a sitemap.xml and declare it in robots.txt."
    ),
    check(
      "1.6",
      "Sitemap URL health",
      sampleEntries.length
        ? `${healthySamples}/${sampleEntries.length} sampled sitemap URLs returned HTTP 200 without noindex.`
        : "No sitemap URLs were available to sample.",
      sampleEntries.length && healthySamples === sampleEntries.length
        ? "passing"
        : sampleEntries.length
          ? "attention"
          : "na",
      "Remove broken or noindex URLs from the sitemap."
    ),
    check(
      "1.7",
      "Sitemap freshness",
      sitemapEntries.length
        ? `lastmod is present on ${sitemapEntries.filter((entry) => entry.lastmod).length}/${sitemapEntries.length} discovered entries.`
        : "No sitemap entries were available to inspect.",
      sitemapEntries.length && sitemapEntries.every((entry) => entry.lastmod)
        ? "passing"
        : sitemapEntries.length
          ? "attention"
          : "na",
      "Add accurate lastmod values to sitemap entries."
    ),
    check(
      "1.8",
      "Challenge-free access",
      /captcha|cf-chl-|challenge-platform|verify you are human/i.test(html)
        ? "A challenge or CAPTCHA page may be blocking the homepage."
        : "No challenge or CAPTCHA page was detected on the homepage.",
      /captcha|cf-chl-|challenge-platform|verify you are human/i.test(html)
        ? "attention"
        : "passing",
      "Let legitimate crawlers access public content without interactive challenges."
    ),
  ];

  const metadataChecks = [
    check(
      "2.1",
      "Title and description",
      title && description
        ? "The homepage has both a title and meta description."
        : `Missing ${[!title && "title", !description && "meta description"].filter(Boolean).join(" and ")}.`,
      title && description ? "passing" : "missing",
      "Add a unique, descriptive title and meta description."
    ),
    check(
      "2.2",
      "Canonical URL",
      canonical ? `Canonical URL is set to ${canonical}.` : "The homepage has no canonical URL.",
      canonical && hasSameOrigin(canonical, finalUrl)
        ? "passing"
        : canonical
          ? "attention"
          : "missing",
      "Add a self-referencing canonical URL on the homepage."
    ),
    check(
      "2.3",
      "Open Graph metadata",
      missingOg.length
        ? `Missing Open Graph fields: ${missingOg.join(", ")}.`
        : "All four core Open Graph tags are present.",
      missingOg.length ? "attention" : "passing",
      "Add og:title, og:description, og:image, and og:url to the raw HTML."
    ),
    check(
      "2.4",
      "Social image",
      ogImageResult?.status === 200 && ogImageResult.contentType.startsWith("image/")
        ? `og:image loads successfully (${ogImageResult.contentType.split(";")[0]}).`
        : ogImage
          ? "The configured og:image did not return a valid image."
          : "No og:image was found.",
      ogImageResult?.status === 200 && ogImageResult.contentType.startsWith("image/")
        ? "passing"
        : "attention",
      "Use an absolute, crawlable 1200×630 social image URL."
    ),
    check(
      "2.5",
      "Twitter card",
      getMeta(html, "twitter:card")
        ? `twitter:card is present (${getMeta(html, "twitter:card")}).`
        : "twitter:card is not present.",
      getMeta(html, "twitter:card") ? "info" : "attention",
      "Add twitter:card for richer link previews.",
      false
    ),
    check(
      "2.6",
      "Business structured data",
      business
        ? businessMissing.length
          ? `A business node was found but is missing: ${businessMissing.join(", ")}.`
          : "A complete business/organization JSON-LD node was found."
        : "No business or organization JSON-LD node was found.",
      business && !businessMissing.length ? "passing" : business ? "attention" : "missing",
      "Add Organization or LocalBusiness JSON-LD with name, URL, address, and telephone."
    ),
    check(
      "2.7",
      "Service and product schema",
      schemaTypes.some((type) => ["Service", "Product", "FAQPage"].includes(type))
        ? "Service, Product, or FAQPage schema was found."
        : "No Service, Product, or FAQPage schema was found.",
      schemaTypes.some((type) => ["Service", "Product", "FAQPage"].includes(type))
        ? "info"
        : "attention",
      "Add schema only for services, products, and FAQs that are visible on the page.",
      false
    ),
    check(
      "2.8",
      "Language annotations",
      htmlLang
        ? `html lang="${htmlLang}" is set${hreflang ? " and hreflang annotations are present" : ""}.`
        : "The html lang attribute is missing.",
      htmlLang ? "passing" : "missing",
      "Set html lang and add hreflang links for alternate language versions."
    ),
  ];

  const agentChecks = [
    check(
      "3.1",
      "llms.txt",
      llms?.status === 200
        ? "llms.txt is available at the site root."
        : "llms.txt is missing from the site root.",
      llms?.status === 200 ? "passing" : "missing",
      "Publish /llms.txt with a concise description and links to authoritative pages."
    ),
    check(
      "3.2",
      "Extended agent files",
      llmsFull?.status === 200 || agents?.status === 200
        ? `${[llmsFull?.status === 200 && "llms-full.txt", agents?.status === 200 && "agents.md"].filter(Boolean).join(" and ")} found.`
        : "llms-full.txt and agents.md are both missing (informational).",
      llmsFull?.status === 200 || agents?.status === 200 ? "info" : "attention",
      "Consider an extended machine-readable guide for complex sites.",
      false
    ),
    check(
      "3.3",
      "Server-readable content",
      text.length >= 300
        ? `${text.length.toLocaleString()} characters of visible text were found in the initial HTML.`
        : `Only ${text.length.toLocaleString()} characters of visible text were found in the initial HTML.`,
      text.length >= 300 ? "passing" : "attention",
      "Render the core page copy in HTML instead of requiring JavaScript."
    ),
    check(
      "3.4",
      "Primary heading",
      h1s.length
        ? `A clear H1 was found: “${h1s[0].slice(0, 120)}”.`
        : "The H1 heading is missing from the homepage.",
      h1s.length ? "passing" : "missing",
      "Add one descriptive H1 that states the page's primary topic."
    ),
    check(
      "3.5",
      "Machine-readable contact details",
      business && business.address && (business.telephone || business.email)
        ? "Address and contact details are present in structured data."
        : "Some contact details are missing from machine-readable structured data.",
      business && business.address && (business.telephone || business.email)
        ? "passing"
        : "attention",
      "Include address plus telephone or email in your business JSON-LD."
    ),
    check(
      "3.6",
      "Signal-to-markup ratio",
      `Visible text is ${textRatio.toFixed(1)}% of the homepage HTML.`,
      textRatio >= 10 ? "passing" : "attention",
      "Reduce boilerplate markup and ship more useful text in the initial HTML."
    ),
    check(
      "3.7",
      "Agent commerce endpoints",
      ucp?.status === 200 || catalog?.status === 200
        ? "An agent commerce/catalog endpoint was found."
        : "/.well-known/ucp and ai-catalog.json are both missing (informational).",
      ucp?.status === 200 || catalog?.status === 200 ? "info" : "attention",
      "For transactional sites, consider publishing a structured agent-facing catalog.",
      false
    ),
  ];

  const contentChecks = [
    check(
      "4.1",
      "Clear business description",
      description.length >= 40
        ? `The meta description gives machines a concise summary: “${description.slice(0, 180)}”.`
        : "No sufficiently clear one-sentence business description was found.",
      description.length >= 40 ? "passing" : "attention",
      "State who you help, what you provide, and where you operate in one plain sentence."
    ),
    check(
      "4.2",
      "Question-led answers",
      hasFaq
        ? "Question-form headings or FAQ schema were found."
        : "No question-form headings or FAQ-style answer content was found.",
      hasFaq ? "passing" : "attention",
      "Add concise answers under real customer questions; avoid thin or invented FAQs."
    ),
    check(
      "4.3",
      "Concrete pricing",
      hasPrice
        ? "At least one concrete price was found in the visible text."
        : "No concrete price was found in the visible text.",
      hasPrice ? "passing" : "attention",
      "Where relevant, publish prices, ranges, or a clear explanation of how pricing is calculated."
    ),
    check(
      "4.4",
      "Content freshness",
      newestYear === null
        ? "No explicit year was found, so freshness is difficult to verify."
        : `The newest explicit year found in the page text is ${newestYear}.`,
      newestYear === null || newestYear < currentYear - 1 ? "attention" : "passing",
      "Show clear publish/update dates and review time-sensitive claims regularly."
    ),
    check(
      "4.5",
      "Content concreteness",
      concreteSignals >= 3
        ? `${concreteSignals} concrete numeric facts or quantified claims were detected.`
        : `Only ${concreteSignals} concrete numeric facts or quantified claims were detected.`,
      concreteSignals >= 3 ? "passing" : "attention",
      "Replace vague adjectives with evidence: numbers, dates, locations, examples, and named outcomes."
    ),
  ];

  const visibilityChecks = [
    check(
      "5.1",
      "Entity identification",
      businessName
        ? `The site identifies the entity as “${businessName}” in structured metadata.`
        : "The company could not be identified reliably from structured metadata.",
      businessName ? "info" : "na",
      "Add a consistent organization name in JSON-LD and og:site_name.",
      false
    ),
    check(
      "5.2",
      "Google Business Profile",
      hasGoogleBusiness
        ? "A Google Maps or Business Profile link was found."
        : "No Google Business Profile link or map embed was found on the homepage.",
      hasGoogleBusiness ? "info" : "attention",
      "If the business serves a location, link its verified Google Business Profile.",
      false
    ),
    check(
      "5.3",
      "External AI recall",
      "Brand recall and category recommendation require independent search-provider probes and are not included in this technical scan.",
      "na",
      undefined,
      false
    ),
  ];

  const categories: ReadinessCategory[] = [
    { id: "access", name: "Access", score: scoreChecks(accessChecks), checks: accessChecks },
    {
      id: "metadata",
      name: "Metadata",
      score: scoreChecks(metadataChecks),
      checks: metadataChecks,
    },
    {
      id: "agent-readiness",
      name: "Agent readiness",
      score: scoreChecks(agentChecks),
      checks: agentChecks,
    },
    {
      id: "content-citability",
      name: "Content citability",
      score: scoreChecks(contentChecks),
      checks: contentChecks,
    },
    { id: "ai-visibility", name: "AI visibility", score: null, checks: visibilityChecks },
  ];
  const scoredCategories = categories.filter((category) => category.score !== null);
  const overallScore = Math.round(
    scoredCategories.reduce((total, category) => total + category.score!, 0) /
      scoredCategories.length
  );
  const grade =
    overallScore >= 90
      ? "Excellent"
      : overallScore >= 75
        ? "Strong"
        : overallScore >= 60
          ? "Developing"
          : overallScore >= 40
            ? "Needs work"
            : "High risk";
  const attentionCount = categories
    .flatMap((category) => category.checks)
    .filter((item) => item.scored && ["attention", "missing"].includes(item.status)).length;

  return {
    url: requestedUrl.toString(),
    finalUrl: homepage.url,
    scannedAt: new Date().toISOString(),
    overallScore,
    grade,
    summary: attentionCount
      ? `${attentionCount} scored checks need attention. Start with missing access and agent-readiness signals, then improve content clarity.`
      : "The site passes all scored technical and content checks in this scan.",
    categories,
  };
}
