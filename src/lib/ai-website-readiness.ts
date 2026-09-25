import { isIP } from "node:net";
import { resolve4, resolve6 } from "node:dns/promises";
import {
  getScannerStrings,
  type AiReadinessLocale,
  type ScannerStrings,
} from "@/data/ai-website-readiness/scanner-strings";

export type { AiReadinessLocale };

export type CheckStatus = "passing" | "attention" | "missing" | "info" | "na";

/**
 * How much a check moves the score.
 *
 * The scanner used to average every check equally, so a missing canonical
 * counted exactly as much as a missing twitter:card. It graded this very site
 * 84/100 while every one of its pages was canonicalising to the homepage.
 *
 * - critical: the site is actively working against itself. Caps the total.
 * - important: a real gap that costs visibility.
 * - minor: worth fixing, not worth alarming anyone about.
 */
export type CheckWeight = "critical" | "important" | "minor";

const WEIGHTS: Record<CheckWeight, number> = {
  critical: 5,
  important: 3,
  minor: 1,
};

/** A failing critical check holds the whole report down to this. */
const CRITICAL_FAILURE_SCORE_CAP = 50;

export type ReadinessCheck = {
  id: string;
  title: string;
  detail: string;
  status: CheckStatus;
  recommendation?: string;
  scored: boolean;
  weight: CheckWeight;
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

async function assertPublicUrl(url: URL, s: ScannerStrings) {
  if (!["http:", "https:"].includes(url.protocol)) throw new Error(s.errors.onlyHttp);
  if (url.username || url.password) throw new Error(s.errors.credentials);
  if (url.port && !["80", "443"].includes(url.port)) throw new Error(s.errors.ports);
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".internal"))
    throw new Error(s.errors.privateHost);
  const literal = isIP(hostname)
    ? [hostname]
    : [
        ...(await resolve4(hostname).catch(() => [])),
        ...(await resolve6(hostname).catch(() => [])),
      ];
  if (!literal.length) throw new Error(s.errors.unresolved);
  if (literal.some(isPrivateIp)) throw new Error(s.errors.privateHost);
}

function normalizeUrl(input: string, s: ScannerStrings) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error(s.errors.emptyUrl);
  return new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
}

async function safeFetch(
  input: URL,
  s: ScannerStrings,
  init: RequestInit = {},
  redirects = 0
): Promise<FetchResult> {
  if (redirects > 4) throw new Error(s.errors.tooManyRedirects);
  await assertPublicUrl(input, s);
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
      if (!location) throw new Error(s.errors.invalidRedirect);
      return safeFetch(new URL(location, input), s, init, redirects + 1);
    }
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_BYTES) throw new Error(s.errors.tooLarge);
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) throw new Error(s.errors.tooLarge);
    return {
      url: response.url || input.toString(),
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      text: new TextDecoder().decode(buffer),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError")
      throw new Error(s.errors.timeout);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function tryFetch(url: URL, s: ScannerStrings, init?: RequestInit) {
  try {
    return await safeFetch(url, s, init);
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
  scored = true,
  weight: CheckWeight = "important"
): ReadinessCheck {
  return { id, title, detail, status, recommendation, scored, weight };
}

function statusPoints(status: CheckStatus) {
  return status === "passing" ? 1 : status === "attention" ? 0.5 : 0;
}

/** Weighted mean, so the checks that actually matter dominate the number. */
function scoreChecks(checks: ReadinessCheck[]) {
  const scored = checks.filter((item) => item.scored && item.status !== "na");
  if (!scored.length) return 0;
  const earned = scored.reduce(
    (total, item) => total + statusPoints(item.status) * WEIGHTS[item.weight],
    0
  );
  const available = scored.reduce((total, item) => total + WEIGHTS[item.weight], 0);
  return Math.round((earned / available) * 100);
}

/** Critical checks that are outright failing (not merely "attention"). */
function failingCritical(checks: ReadinessCheck[]) {
  return checks.filter(
    (item) => item.scored && item.weight === "critical" && (item.status === "missing" || item.status === "attention")
  );
}

/** Compare URLs without tripping over a trailing slash or a www prefix. */
function normalizeForCompare(input: string) {
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./i, "");
    const path = url.pathname.replace(/\/+$/, "");
    return `${host}${path}`.toLowerCase();
  } catch {
    return input.trim().toLowerCase();
  }
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

/** Score band, locale-independent. Kept separate so logs stay comparable. */
export type GradeKey = "excellent" | "strong" | "developing" | "needsWork" | "highRisk";

export function gradeKeyFor(score: number): GradeKey {
  return score >= 90
    ? "excellent"
    : score >= 75
      ? "strong"
      : score >= 60
        ? "developing"
        : score >= 40
          ? "needsWork"
          : "highRisk";
}

export async function analyzeWebsite(
  input: string,
  locale: AiReadinessLocale = "en"
): Promise<WebsiteReadinessReport> {
  const t = getScannerStrings(locale);
  const c = t.checks;
  const requestedUrl = normalizeUrl(input, t);
  const homepage = await safeFetch(requestedUrl, t);
  if (!homepage.contentType.includes("text/html")) throw new Error(t.errors.notHtml);
  const finalUrl = new URL(homepage.url);
  const origin = finalUrl.origin;
  const html = homepage.text;
  const text = stripHtml(html);
  const robotsUrl = new URL("/robots.txt", origin);
  const robots = await tryFetch(robotsUrl, t);
  const robotsOk = !!robots && robots.status === 200 && /user-agent\s*:/i.test(robots.text);
  const declaredSitemap = robots?.text.match(/^\s*sitemap:\s*(\S+)/im)?.[1];

  const [botPage, llms, llmsFull, agents, ucp, catalog] = await Promise.all([
    tryFetch(finalUrl, t, { headers: { "user-agent": "GPTBot/1.0" } }),
    tryFetch(new URL("/llms.txt", origin), t),
    tryFetch(new URL("/llms-full.txt", origin), t),
    tryFetch(new URL("/agents.md", origin), t),
    tryFetch(new URL("/.well-known/ucp", origin), t),
    tryFetch(new URL("/ai-catalog.json", origin), t),
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
      const result = await tryFetch(candidateUrl, t);
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
          return tryFetch(new URL(url, origin), t);
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
        return tryFetch(new URL(entry.loc), t);
      } catch {
        return null;
      }
    })
  );
  // The sampled pages used to be checked only for status and noindex. That is
  // why this scanner scored farjadp.info 84/100 while every page on it declared
  // the homepage as its canonical: the canonical check only ever ran against
  // the homepage, where the value looks fine in isolation. Canonical is a
  // site-wide property, so it has to be sampled site-wide.
  const sampleCanonicals = sampleResults
    .map((result, index) => {
      if (!result || result.status !== 200) return null;
      const declared = getCanonical(result.text);
      if (!declared) return null;
      try {
        return {
          page: new URL(sampleEntries[index].loc).toString(),
          canonical: new URL(declared, result.url).toString(),
        };
      } catch {
        return null;
      }
    })
    .filter((entry): entry is { page: string; canonical: string } => entry !== null);

  const selfReferencing = sampleCanonicals.filter(
    (entry) => normalizeForCompare(entry.page) === normalizeForCompare(entry.canonical)
  ).length;
  const distinctCanonicals = new Set(
    sampleCanonicals.map((entry) => normalizeForCompare(entry.canonical))
  );
  // Several different pages all naming one URL as their original is the
  // signature of a canonical set in a shared layout.
  const collapsedToOne =
    sampleCanonicals.length >= 3 && distinctCanonicals.size === 1 && selfReferencing === 0;

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
      ogImageResult = await tryFetch(new URL(ogImage, finalUrl), t);
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

  const crawlersAllowed =
    robotsOk && ["OAI-SearchBot", "PerplexityBot"].every((agent) => robotsAllows(robots!.text, agent));
  const botParity =
    botPage?.status === 200 &&
    Math.abs(botPage.text.length - html.length) / Math.max(html.length, 1) < 0.05;
  const challenged = /captcha|cf-chl-|challenge-platform|verify you are human/i.test(html);
  const twitterCard = getMeta(html, "twitter:card");
  const hasServiceSchema = schemaTypes.some((type) =>
    ["Service", "Product", "FAQPage"].includes(type)
  );
  const socialImageOk =
    ogImageResult?.status === 200 && ogImageResult.contentType.startsWith("image/");
  const extendedAgentNames = [
    llmsFull?.status === 200 && "llms-full.txt",
    agents?.status === 200 && "agents.md",
  ].filter(Boolean) as string[];
  const machineContactOk = !!(business && business.address && (business.telephone || business.email));

  const accessChecks = [
    check(
      "1.1",
      c.homepage.title,
      homepage.status === 200
        ? c.homepage.ok(finalUrl.protocol === "https:")
        : c.homepage.bad(homepage.status),
      homepage.status === 200 && finalUrl.protocol === "https:" ? "passing" : "attention",
      c.homepage.rec
    , true, "critical"),
    check(
      "1.2",
      c.robots.title,
      robotsOk ? c.robots.ok : c.robots.bad,
      robotsOk ? "passing" : "missing",
      c.robots.rec
    , true, "important"),
    check(
      "1.3",
      c.crawlerAccess.title,
      crawlersAllowed ? c.crawlerAccess.ok : c.crawlerAccess.bad,
      crawlersAllowed ? "passing" : "attention",
      c.crawlerAccess.rec
    , true, "critical"),
    check(
      "1.4",
      c.parity.title,
      botParity ? c.parity.ok(botPage!.text.length, html.length) : c.parity.bad,
      botParity ? "passing" : "attention",
      c.parity.rec
    , true, "critical"),
    check(
      "1.5",
      c.sitemap.title,
      sitemapResponse
        ? c.sitemap.ok(sitemapUrl?.toString() ?? "", sitemapEntries.length)
        : c.sitemap.bad,
      sitemapResponse ? "passing" : "missing",
      c.sitemap.rec
    , true, "important"),
    check(
      "1.6",
      c.sitemapHealth.title,
      sampleEntries.length
        ? c.sitemapHealth.ok(healthySamples, sampleEntries.length)
        : c.sitemapHealth.none,
      sampleEntries.length && healthySamples === sampleEntries.length
        ? "passing"
        : sampleEntries.length
          ? "attention"
          : "na",
      c.sitemapHealth.rec
    , true, "important"),
    check(
      "1.7",
      c.sitemapFreshness.title,
      sitemapEntries.length
        ? c.sitemapFreshness.ok(
            sitemapEntries.filter((entry) => entry.lastmod).length,
            sitemapEntries.length
          )
        : c.sitemapFreshness.none,
      sitemapEntries.length && sitemapEntries.every((entry) => entry.lastmod)
        ? "passing"
        : sitemapEntries.length
          ? "attention"
          : "na",
      c.sitemapFreshness.rec
    , true, "minor"),
    check(
      "1.8",
      c.challenge.title,
      challenged ? c.challenge.blocked : c.challenge.clear,
      challenged ? "attention" : "passing",
      c.challenge.rec
    , true, "critical"),
  ];

  const metadataChecks = [
    check(
      "2.1",
      c.titleDescription.title,
      title && description
        ? c.titleDescription.ok
        : c.titleDescription.bad(!title, !description),
      title && description ? "passing" : "missing",
      c.titleDescription.rec
    , true, "important"),
    check(
      "2.2",
      c.canonical.title,
      canonical ? c.canonical.ok(canonical) : c.canonical.bad,
      canonical && hasSameOrigin(canonical, finalUrl)
        ? "passing"
        : canonical
          ? "attention"
          : "missing",
      c.canonical.rec
    , true, "critical"),
    check(
      "2.3",
      c.openGraph.title,
      missingOg.length ? c.openGraph.bad(missingOg) : c.openGraph.ok,
      missingOg.length ? "attention" : "passing",
      c.openGraph.rec
    , true, "important"),
    check(
      "2.4",
      c.socialImage.title,
      socialImageOk
        ? c.socialImage.ok(ogImageResult!.contentType.split(";")[0])
        : ogImage
          ? c.socialImage.invalid
          : c.socialImage.none,
      socialImageOk ? "passing" : "attention",
      c.socialImage.rec
    , true, "minor"),
    check(
      "2.5",
      c.twitterCard.title,
      twitterCard ? c.twitterCard.ok(twitterCard) : c.twitterCard.none,
      twitterCard ? "info" : "attention",
      c.twitterCard.rec,
      false
    , "minor"),
    check(
      "2.6",
      c.businessSchema.title,
      business
        ? businessMissing.length
          ? c.businessSchema.incomplete(businessMissing)
          : c.businessSchema.ok
        : c.businessSchema.none,
      business && !businessMissing.length ? "passing" : business ? "attention" : "missing",
      c.businessSchema.rec
    , true, "important"),
    check(
      "2.7",
      c.serviceSchema.title,
      hasServiceSchema ? c.serviceSchema.ok : c.serviceSchema.none,
      hasServiceSchema ? "info" : "attention",
      c.serviceSchema.rec,
      false
    , "minor"),
    check(
      "2.8",
      c.language.title,
      htmlLang ? c.language.ok(htmlLang, hreflang) : c.language.none,
      htmlLang ? "passing" : "missing",
      c.language.rec
    , true, "important"),
    check(
      "2.9",
      c.canonicalConsistency.title,
      !sampleCanonicals.length
        ? c.canonicalConsistency.none
        : collapsedToOne
          ? c.canonicalConsistency.collapsed(sampleCanonicals.length, [...distinctCanonicals][0])
          : c.canonicalConsistency.ratio(selfReferencing, sampleCanonicals.length),
      !sampleCanonicals.length
        ? "na"
        : collapsedToOne
          ? "missing"
          : selfReferencing === sampleCanonicals.length
            ? "passing"
            : "attention",
      c.canonicalConsistency.rec,
      sampleCanonicals.length > 0,
      "critical"
    ),
  ];

  const agentChecks = [
    check(
      "3.1",
      c.llms.title,
      llms?.status === 200 ? c.llms.ok : c.llms.none,
      llms?.status === 200 ? "passing" : "missing",
      c.llms.rec
    , true, "minor"),
    check(
      "3.2",
      c.extendedAgentFiles.title,
      extendedAgentNames.length
        ? c.extendedAgentFiles.ok(extendedAgentNames)
        : c.extendedAgentFiles.none,
      extendedAgentNames.length ? "info" : "attention",
      c.extendedAgentFiles.rec,
      false
    , "minor"),
    check(
      "3.3",
      c.serverReadable.title,
      text.length >= 300 ? c.serverReadable.ok(text.length) : c.serverReadable.thin(text.length),
      text.length >= 300 ? "passing" : "attention",
      c.serverReadable.rec
    , true, "critical"),
    check(
      "3.4",
      c.heading.title,
      h1s.length ? c.heading.ok(h1s[0].slice(0, 120)) : c.heading.none,
      h1s.length ? "passing" : "missing",
      c.heading.rec
    , true, "important"),
    check(
      "3.5",
      c.machineContact.title,
      machineContactOk ? c.machineContact.ok : c.machineContact.partial,
      machineContactOk ? "passing" : "attention",
      c.machineContact.rec
    , true, "minor"),
    check(
      "3.6",
      c.signalRatio.title,
      c.signalRatio.detail(textRatio),
      textRatio >= 10 ? "passing" : "attention",
      c.signalRatio.rec
    , true, "important"),
    check(
      "3.7",
      c.agentCommerce.title,
      ucp?.status === 200 || catalog?.status === 200
        ? c.agentCommerce.ok
        : c.agentCommerce.none,
      ucp?.status === 200 || catalog?.status === 200 ? "info" : "attention",
      c.agentCommerce.rec,
      false
    , "minor"),
  ];

  const contentChecks = [
    check(
      "4.1",
      c.businessDescription.title,
      description.length >= 40
        ? c.businessDescription.ok(description.slice(0, 180))
        : c.businessDescription.none,
      description.length >= 40 ? "passing" : "attention",
      c.businessDescription.rec
    , true, "important"),
    check(
      "4.2",
      c.questionLed.title,
      hasFaq ? c.questionLed.ok : c.questionLed.none,
      hasFaq ? "passing" : "attention",
      c.questionLed.rec
    , true, "important"),
    check(
      "4.3",
      c.pricing.title,
      hasPrice ? c.pricing.ok : c.pricing.none,
      hasPrice ? "passing" : "attention",
      c.pricing.rec
    , true, "minor"),
    check(
      "4.4",
      c.freshness.title,
      newestYear === null ? c.freshness.none : c.freshness.ok(newestYear),
      newestYear === null || newestYear < currentYear - 1 ? "attention" : "passing",
      c.freshness.rec
    , true, "minor"),
    check(
      "4.5",
      c.concreteness.title,
      concreteSignals >= 3
        ? c.concreteness.ok(concreteSignals)
        : c.concreteness.weak(concreteSignals),
      concreteSignals >= 3 ? "passing" : "attention",
      c.concreteness.rec
    , true, "important"),
  ];

  const visibilityChecks = [
    check(
      "5.1",
      c.entity.title,
      businessName ? c.entity.ok(businessName) : c.entity.none,
      businessName ? "info" : "na",
      c.entity.rec,
      false
    , "minor"),
    check(
      "5.2",
      c.googleBusiness.title,
      hasGoogleBusiness ? c.googleBusiness.ok : c.googleBusiness.none,
      hasGoogleBusiness ? "info" : "attention",
      c.googleBusiness.rec,
      false
    , "minor"),
    check(
      "5.3",
      c.externalRecall.title,
      c.externalRecall.detail,
      "na",
      undefined,
      false
    , "minor"),
  ];

  const categories: ReadinessCategory[] = [
    { id: "access", name: t.categories.access, score: scoreChecks(accessChecks), checks: accessChecks },
    {
      id: "metadata",
      name: t.categories.metadata,
      score: scoreChecks(metadataChecks),
      checks: metadataChecks,
    },
    {
      id: "agent-readiness",
      name: t.categories.agent,
      score: scoreChecks(agentChecks),
      checks: agentChecks,
    },
    {
      id: "content-citability",
      name: t.categories.content,
      score: scoreChecks(contentChecks),
      checks: contentChecks,
    },
    { id: "ai-visibility", name: t.categories.visibility, score: null, checks: visibilityChecks },
  ];
  const scoredCategories = categories.filter((category) => category.score !== null);
  const allChecks = categories.flatMap((category) => category.checks);
  const criticalFailures = failingCritical(allChecks);

  // Weight the categories by how many scored checks each holds, so a category
  // with five checks no longer outweighs one with eight on a per-check basis.
  const weightedTotal = scoredCategories.reduce((total, category) => {
    const count = category.checks.filter((item) => item.scored && item.status !== "na").length;
    return total + category.score! * count;
  }, 0);
  const weightDivisor = scoredCategories.reduce((total, category) => {
    return total + category.checks.filter((item) => item.scored && item.status !== "na").length;
  }, 0);
  const rawScore = weightDivisor ? Math.round(weightedTotal / weightDivisor) : 0;

  // A site that blocks AI crawlers, serves nothing to bots, or de-indexes itself
  // is not "STRONG" no matter how many minor checks pass. Report the fault.
  const overallScore = criticalFailures.length
    ? Math.min(rawScore, CRITICAL_FAILURE_SCORE_CAP)
    : rawScore;
  const grade = t.grades[gradeKeyFor(overallScore)];
  const attentionCount = categories
    .flatMap((category) => category.checks)
    .filter((item) => item.scored && ["attention", "missing"].includes(item.status)).length;

  return {
    url: requestedUrl.toString(),
    finalUrl: homepage.url,
    scannedAt: new Date().toISOString(),
    overallScore,
    grade,
    summary: criticalFailures.length
      ? t.summary.critical(
          criticalFailures.length,
          criticalFailures.map((item) => item.title),
          CRITICAL_FAILURE_SCORE_CAP
        )
      : attentionCount
        ? t.summary.attention(attentionCount)
        : t.summary.clean,
    categories,
  };
}
