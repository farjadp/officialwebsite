// ============================================================================
// File Path: src/data/ai-website-readiness/scanner-strings.ts
// Why: Every human-readable string the scanner produces — category names,
//      grades, error messages, and each check's title / detail / recommendation
//      — in both locales. The scanner in src/lib/ai-website-readiness.ts keeps
//      all of its detection logic, weights and scoring; it only reads its
//      sentences from here so a Persian visitor gets a Persian report.
// Env / Identity: Pure data. No node APIs, safe on either side of the wire.
// ============================================================================

export type AiReadinessLocale = "en" | "fa";

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Persian prose takes Persian digits; technical tokens keep their own. */
function fd(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => FA_DIGITS[Number(digit)]);
}

/** Thousands-separated count, with the Persian thousands mark. */
function faCount(value: number): string {
  return fd(value.toLocaleString("en-US")).replace(/,/g, "٬");
}

function enCount(value: number): string {
  return value.toLocaleString("en-US");
}

const en = {
  errors: {
    onlyHttp: "Only HTTP and HTTPS URLs can be scanned.",
    credentials: "URLs containing credentials are not supported.",
    ports: "Only standard web ports can be scanned.",
    privateHost: "Local and private websites cannot be scanned.",
    unresolved: "The website hostname could not be resolved.",
    tooManyRedirects: "The website redirected too many times.",
    invalidRedirect: "The website returned an invalid redirect.",
    tooLarge: "The website response is too large to scan safely.",
    timeout: "The website took too long to respond.",
    emptyUrl: "Enter a website URL.",
    invalidUrl: "Enter a valid website URL.",
    notHtml: "The URL did not return an HTML page.",
    scanFailed: "The scan could not be completed.",
  },

  categories: {
    access: "Access",
    metadata: "Metadata",
    agent: "Agent readiness",
    content: "Content citability",
    visibility: "AI visibility",
  },

  grades: {
    excellent: "Excellent",
    strong: "Strong",
    developing: "Developing",
    needsWork: "Needs work",
    highRisk: "High risk",
  },

  summary: {
    critical: (count: number, titles: string[], cap: number) =>
      `${count} critical ${count === 1 ? "check is" : "checks are"} failing (${titles.join(
        ", "
      )}). The score is capped at ${cap} until ${
        count === 1 ? "it is" : "they are"
      } fixed — start there, the rest can wait.`,
    attention: (count: number) =>
      `${count} scored checks need attention. Start with missing access and agent-readiness signals, then improve content clarity.`,
    clean: "The site passes all scored technical and content checks in this scan.",
  },

  checks: {
    homepage: {
      title: "Homepage availability",
      ok: (https: boolean) =>
        `The homepage responded HTTP 200 over ${https ? "HTTPS" : "HTTP"}.`,
      bad: (status: number) => `The homepage responded HTTP ${status}.`,
      rec: "Serve the canonical homepage over HTTPS with a 200 response.",
    },
    robots: {
      title: "robots.txt",
      ok: "robots.txt is present and contains valid User-agent directives.",
      bad: "robots.txt is missing or does not contain a valid User-agent directive.",
      rec: "Publish a plain-text /robots.txt file with explicit crawler rules.",
    },
    crawlerAccess: {
      title: "AI crawler access",
      ok: "OpenAI and Perplexity search crawlers are allowed by robots.txt.",
      bad: "One or more AI search crawlers are not allowed by robots.txt.",
      rec: "Allow OAI-SearchBot and PerplexityBot unless your publishing policy requires blocking them.",
    },
    parity: {
      title: "Bot/visitor parity",
      ok: (botChars: number, humanChars: number) =>
        `GPTBot received substantially the same HTML as a normal visitor (${enCount(
          botChars
        )} vs. ${enCount(humanChars)} characters).`,
      bad: "GPTBot did not receive substantially the same HTML as a normal visitor.",
      rec: "Avoid serving AI crawlers an error, challenge, or materially different page.",
    },
    sitemap: {
      title: "XML sitemap",
      ok: (url: string, count: number) =>
        `Sitemap found at ${url} (${enCount(count)} discovered URLs).`,
      bad: "No valid XML sitemap was found.",
      rec: "Publish a sitemap.xml and declare it in robots.txt.",
    },
    sitemapHealth: {
      title: "Sitemap URL health",
      ok: (healthy: number, total: number) =>
        `${enCount(healthy)}/${enCount(
          total
        )} sampled sitemap URLs returned HTTP 200 without noindex.`,
      none: "No sitemap URLs were available to sample.",
      rec: "Remove broken or noindex URLs from the sitemap.",
    },
    sitemapFreshness: {
      title: "Sitemap freshness",
      ok: (withLastmod: number, total: number) =>
        `lastmod is present on ${enCount(withLastmod)}/${enCount(total)} discovered entries.`,
      none: "No sitemap entries were available to inspect.",
      rec: "Add accurate lastmod values to sitemap entries.",
    },
    challenge: {
      title: "Challenge-free access",
      blocked: "A challenge or CAPTCHA page may be blocking the homepage.",
      clear: "No challenge or CAPTCHA page was detected on the homepage.",
      rec: "Let legitimate crawlers access public content without interactive challenges.",
    },

    titleDescription: {
      title: "Title and description",
      ok: "The homepage has both a title and meta description.",
      bad: (noTitle: boolean, noDescription: boolean) =>
        `Missing ${[noTitle && "title", noDescription && "meta description"]
          .filter(Boolean)
          .join(" and ")}.`,
      rec: "Add a unique, descriptive title and meta description.",
    },
    canonical: {
      title: "Canonical URL",
      ok: (canonical: string) => `Canonical URL is set to ${canonical}.`,
      bad: "The homepage has no canonical URL.",
      rec: "Add a self-referencing canonical URL on the homepage.",
    },
    openGraph: {
      title: "Open Graph metadata",
      bad: (fields: string[]) => `Missing Open Graph fields: ${fields.join(", ")}.`,
      ok: "All four core Open Graph tags are present.",
      rec: "Add og:title, og:description, og:image, and og:url to the raw HTML.",
    },
    socialImage: {
      title: "Social image",
      ok: (contentType: string) => `og:image loads successfully (${contentType}).`,
      invalid: "The configured og:image did not return a valid image.",
      none: "No og:image was found.",
      rec: "Use an absolute, crawlable 1200×630 social image URL.",
    },
    twitterCard: {
      title: "Twitter card",
      ok: (value: string) => `twitter:card is present (${value}).`,
      none: "twitter:card is not present.",
      rec: "Add twitter:card for richer link previews.",
    },
    businessSchema: {
      title: "Business structured data",
      incomplete: (missing: string[]) =>
        `A business node was found but is missing: ${missing.join(", ")}.`,
      ok: "A complete business/organization JSON-LD node was found.",
      none: "No business or organization JSON-LD node was found.",
      rec: "Add Organization or LocalBusiness JSON-LD with name, URL, address, and telephone.",
    },
    serviceSchema: {
      title: "Service and product schema",
      ok: "Service, Product, or FAQPage schema was found.",
      none: "No Service, Product, or FAQPage schema was found.",
      rec: "Add schema only for services, products, and FAQs that are visible on the page.",
    },
    language: {
      title: "Language annotations",
      ok: (lang: string, hreflang: boolean) =>
        `html lang="${lang}" is set${hreflang ? " and hreflang annotations are present" : ""}.`,
      none: "The html lang attribute is missing.",
      rec: "Set html lang and add hreflang links for alternate language versions.",
    },
    canonicalConsistency: {
      title: "Canonical consistency across pages",
      none: "No sampled page declared a canonical URL, so consistency could not be checked.",
      collapsed: (count: number, canonical: string) =>
        `All ${enCount(
          count
        )} sampled pages declare the same canonical URL (${canonical}) and none points at itself. Those pages are telling search engines not to index them.`,
      ratio: (self: number, total: number) =>
        `${enCount(self)}/${enCount(total)} sampled pages canonicalise to themselves.`,
      rec: "Every page needs its own self-referencing canonical. A canonical set in a shared root layout is inherited by every page, which makes the whole site claim to be one URL.",
    },

    llms: {
      title: "llms.txt",
      ok: "llms.txt is available at the site root.",
      none: "llms.txt is missing from the site root.",
      rec: "Publish /llms.txt with a concise description and links to authoritative pages.",
    },
    extendedAgentFiles: {
      title: "Extended agent files",
      ok: (names: string[]) => `${names.join(" and ")} found.`,
      none: "llms-full.txt and agents.md are both missing (informational).",
      rec: "Consider an extended machine-readable guide for complex sites.",
    },
    serverReadable: {
      title: "Server-readable content",
      ok: (chars: number) =>
        `${enCount(chars)} characters of visible text were found in the initial HTML.`,
      thin: (chars: number) =>
        `Only ${enCount(chars)} characters of visible text were found in the initial HTML.`,
      rec: "Render the core page copy in HTML instead of requiring JavaScript.",
    },
    heading: {
      title: "Primary heading",
      ok: (h1: string) => `A clear H1 was found: “${h1}”.`,
      none: "The H1 heading is missing from the homepage.",
      rec: "Add one descriptive H1 that states the page's primary topic.",
    },
    machineContact: {
      title: "Machine-readable contact details",
      ok: "Address and contact details are present in structured data.",
      partial: "Some contact details are missing from machine-readable structured data.",
      rec: "Include address plus telephone or email in your business JSON-LD.",
    },
    signalRatio: {
      title: "Signal-to-markup ratio",
      detail: (ratio: number) =>
        `Visible text is ${ratio.toFixed(1)}% of the homepage HTML.`,
      rec: "Reduce boilerplate markup and ship more useful text in the initial HTML.",
    },
    agentCommerce: {
      title: "Agent commerce endpoints",
      ok: "An agent commerce/catalog endpoint was found.",
      none: "/.well-known/ucp and ai-catalog.json are both missing (informational).",
      rec: "For transactional sites, consider publishing a structured agent-facing catalog.",
    },

    businessDescription: {
      title: "Clear business description",
      ok: (description: string) =>
        `The meta description gives machines a concise summary: “${description}”.`,
      none: "No sufficiently clear one-sentence business description was found.",
      rec: "State who you help, what you provide, and where you operate in one plain sentence.",
    },
    questionLed: {
      title: "Question-led answers",
      ok: "Question-form headings or FAQ schema were found.",
      none: "No question-form headings or FAQ-style answer content was found.",
      rec: "Add concise answers under real customer questions; avoid thin or invented FAQs.",
    },
    pricing: {
      title: "Concrete pricing",
      ok: "At least one concrete price was found in the visible text.",
      none: "No concrete price was found in the visible text.",
      rec: "Where relevant, publish prices, ranges, or a clear explanation of how pricing is calculated.",
    },
    freshness: {
      title: "Content freshness",
      none: "No explicit year was found, so freshness is difficult to verify.",
      ok: (year: number) => `The newest explicit year found in the page text is ${year}.`,
      rec: "Show clear publish/update dates and review time-sensitive claims regularly.",
    },
    concreteness: {
      title: "Content concreteness",
      ok: (count: number) =>
        `${enCount(count)} concrete numeric facts or quantified claims were detected.`,
      weak: (count: number) =>
        `Only ${enCount(count)} concrete numeric facts or quantified claims were detected.`,
      rec: "Replace vague adjectives with evidence: numbers, dates, locations, examples, and named outcomes.",
    },

    entity: {
      title: "Entity identification",
      ok: (name: string) => `The site identifies the entity as “${name}” in structured metadata.`,
      none: "The company could not be identified reliably from structured metadata.",
      rec: "Add a consistent organization name in JSON-LD and og:site_name.",
    },
    googleBusiness: {
      title: "Google Business Profile",
      ok: "A Google Maps or Business Profile link was found.",
      none: "No Google Business Profile link or map embed was found on the homepage.",
      rec: "If the business serves a location, link its verified Google Business Profile.",
    },
    externalRecall: {
      title: "External AI recall",
      detail:
        "Brand recall and category recommendation require independent search-provider probes and are not included in this technical scan.",
    },
  },
};

export type ScannerStrings = typeof en;

const fa: ScannerStrings = {
  errors: {
    onlyHttp: "فقط نشانی‌های HTTP و HTTPS قابل بررسی‌اند.",
    credentials: "نشانی‌هایی که نام کاربری و گذرواژه دارند پشتیبانی نمی‌شوند.",
    ports: "فقط پورت‌های استاندارد وب قابل بررسی‌اند.",
    privateHost: "وب‌سایت‌های محلی و خصوصی قابل بررسی نیستند.",
    unresolved: "نام میزبان وب‌سایت پیدا نشد.",
    tooManyRedirects: "وب‌سایت بیش از حد تغییر مسیر داد.",
    invalidRedirect: "وب‌سایت یک تغییر مسیر نامعتبر برگرداند.",
    tooLarge: "پاسخ وب‌سایت برای بررسی ایمن بیش از اندازه بزرگ است.",
    timeout: "وب‌سایت خیلی دیر پاسخ داد.",
    emptyUrl: "نشانی وب‌سایت را وارد کنید.",
    invalidUrl: "یک نشانی معتبر وب‌سایت وارد کنید.",
    notHtml: "این نشانی یک صفحه‌ی HTML برنگرداند.",
    scanFailed: "بررسی کامل نشد.",
  },

  categories: {
    access: "دسترسی",
    metadata: "فراداده",
    agent: "آمادگی برای عامل‌ها",
    content: "قابلیت ارجاع محتوا",
    visibility: "دیده‌شدن در هوش مصنوعی",
  },

  grades: {
    excellent: "عالی",
    strong: "قوی",
    developing: "در حال شکل‌گیری",
    needsWork: "نیازمند کار",
    highRisk: "پرریسک",
  },

  summary: {
    critical: (count, titles, cap) =>
      `${fd(count)} سنجه‌ی بحرانی ${count === 1 ? "ناموفق است" : "ناموفق‌اند"} (${titles.join(
        "، "
      )}). تا وقتی ${count === 1 ? "این مورد اصلاح نشود" : "این موارد اصلاح نشوند"} امتیاز کل روی ${fd(
        cap
      )} سقف می‌خورد؛ از همین‌جا شروع کنید، بقیه می‌تواند صبر کند.`,
    attention: (count) =>
      `${fd(
        count
      )} سنجه‌ی امتیازدار نیاز به رسیدگی دارد. از نشانه‌های غایبِ دسترسی و آمادگی برای عامل‌ها شروع کنید و بعد سراغ شفافیت محتوا بروید.`,
    clean: "این وب‌سایت همه‌ی سنجه‌های فنی و محتوایی امتیازدار این بررسی را با موفقیت گذرانده است.",
  },

  checks: {
    homepage: {
      title: "در دسترس بودن صفحه‌ی اصلی",
      ok: (https) =>
        `صفحه‌ی اصلی با کد HTTP ۲۰۰ و روی ${https ? "HTTPS" : "HTTP"} پاسخ داد.`,
      bad: (status) => `صفحه‌ی اصلی با کد HTTP ${fd(status)} پاسخ داد.`,
      rec: "صفحه‌ی اصلی را روی HTTPS و با پاسخ ۲۰۰ ارائه کنید.",
    },
    robots: {
      title: "robots.txt",
      ok: "فایل robots.txt موجود است و دستورهای User-agent معتبر دارد.",
      bad: "فایل robots.txt یا موجود نیست یا دستور User-agent معتبری ندارد.",
      rec: "یک فایل متنی /robots.txt با قواعد صریح برای خزنده‌ها منتشر کنید.",
    },
    crawlerAccess: {
      title: "دسترسی خزنده‌های هوش مصنوعی",
      ok: "خزنده‌های جست‌وجوی OpenAI و Perplexity در robots.txt مجاز شده‌اند.",
      bad: "دست‌کم یکی از خزنده‌های جست‌وجوی هوش مصنوعی در robots.txt مجاز نیست.",
      rec: "مگر آنکه سیاست انتشار شما مسدودکردن‌شان را ایجاب کند، به OAI-SearchBot و PerplexityBot اجازه‌ی دسترسی بدهید.",
    },
    parity: {
      title: "یکسانی صفحه برای ربات و بازدیدکننده",
      ok: (botChars, humanChars) =>
        `خزنده‌ی GPTBot تقریباً همان HTML بازدیدکننده‌ی عادی را دریافت کرد (${faCount(
          botChars
        )} در برابر ${faCount(humanChars)} نویسه).`,
      bad: "خزنده‌ی GPTBot همان HTML بازدیدکننده‌ی عادی را دریافت نکرد.",
      rec: "به خزنده‌های هوش مصنوعی خطا، صفحه‌ی احراز هویت یا نسخه‌ای متفاوت از صفحه ندهید.",
    },
    sitemap: {
      title: "نقشه‌ی سایت XML",
      ok: (url, count) =>
        `نقشه‌ی سایت در ${url} پیدا شد (${faCount(count)} نشانی شناسایی‌شده).`,
      bad: "هیچ نقشه‌ی سایت XML معتبری پیدا نشد.",
      rec: "یک فایل sitemap.xml منتشر کنید و نشانی‌اش را در robots.txt اعلام کنید.",
    },
    sitemapHealth: {
      title: "سلامت نشانی‌های نقشه‌ی سایت",
      ok: (healthy, total) =>
        `${faCount(healthy)} نشانی از ${faCount(
          total
        )} نشانی نمونه‌برداری‌شده‌ی نقشه‌ی سایت، بدون noindex و با کد ۲۰۰ پاسخ داد.`,
      none: "هیچ نشانی‌ای برای نمونه‌برداری از نقشه‌ی سایت در دسترس نبود.",
      rec: "نشانی‌های خراب یا دارای noindex را از نقشه‌ی سایت بردارید.",
    },
    sitemapFreshness: {
      title: "تازگی نقشه‌ی سایت",
      ok: (withLastmod, total) =>
        `برچسب lastmod روی ${faCount(withLastmod)} مدخل از ${faCount(
          total
        )} مدخل شناسایی‌شده ثبت شده است.`,
      none: "هیچ مدخلی از نقشه‌ی سایت برای بررسی در دسترس نبود.",
      rec: "برای مدخل‌های نقشه‌ی سایت مقدار lastmod دقیق بگذارید.",
    },
    challenge: {
      title: "دسترسی بدون مانع",
      blocked: "شاید یک صفحه‌ی CAPTCHA یا آزمون انسان‌بودن جلوی صفحه‌ی اصلی را گرفته باشد.",
      clear: "هیچ صفحه‌ی CAPTCHA یا آزمون انسان‌بودنی روی صفحه‌ی اصلی دیده نشد.",
      rec: "بگذارید خزنده‌های معتبر بدون آزمون تعاملی به محتوای عمومی برسند.",
    },

    titleDescription: {
      title: "عنوان و توضیح",
      ok: "صفحه‌ی اصلی هم عنوان دارد و هم توضیح متا.",
      bad: (noTitle, noDescription) =>
        `${[noTitle && "عنوان", noDescription && "توضیح متا"]
          .filter(Boolean)
          .join(" و ")} موجود نیست.`,
      rec: "یک عنوان و توضیح متای یکتا و گویا بنویسید.",
    },
    canonical: {
      title: "نشانی canonical",
      ok: (canonical) => `نشانی canonical روی ${canonical} تنظیم شده است.`,
      bad: "صفحه‌ی اصلی نشانی canonical ندارد.",
      rec: "روی صفحه‌ی اصلی یک canonical که به خودش ارجاع می‌دهد بگذارید.",
    },
    openGraph: {
      title: "فراداده‌ی Open Graph",
      bad: (fields) => `این فیلدهای Open Graph موجود نیستند: ${fields.join("، ")}.`,
      ok: "هر چهار برچسب اصلی Open Graph موجود است.",
      rec: "برچسب‌های og:title و og:description و og:image و og:url را در HTML خام اضافه کنید.",
    },
    socialImage: {
      title: "تصویر شبکه‌های اجتماعی",
      ok: (contentType) => `تصویر og:image درست بارگذاری می‌شود (${contentType}).`,
      invalid: "تصویر تنظیم‌شده در og:image یک تصویر معتبر برنگرداند.",
      none: "هیچ og:image پیدا نشد.",
      rec: "یک نشانی تصویر مطلق و قابل خزش با ابعاد ۱۲۰۰×۶۳۰ بگذارید.",
    },
    twitterCard: {
      title: "کارت توییتر",
      ok: (value) => `برچسب twitter:card موجود است (${value}).`,
      none: "برچسب twitter:card موجود نیست.",
      rec: "برای پیش‌نمایش غنی‌تر پیوندها، twitter:card را اضافه کنید.",
    },
    businessSchema: {
      title: "داده‌ی ساختاریافته‌ی کسب‌وکار",
      incomplete: (missing) =>
        `یک گره‌ی کسب‌وکار پیدا شد اما این موارد را ندارد: ${missing.join("، ")}.`,
      ok: "یک گره‌ی JSON-LD کامل برای کسب‌وکار یا سازمان پیدا شد.",
      none: "هیچ گره‌ی JSON-LD برای کسب‌وکار یا سازمان پیدا نشد.",
      rec: "یک JSON-LD از نوع Organization یا LocalBusiness با نام، نشانی وب، نشانی پستی و تلفن اضافه کنید.",
    },
    serviceSchema: {
      title: "اسکیمای خدمت و محصول",
      ok: "اسکیمای Service یا Product یا FAQPage پیدا شد.",
      none: "هیچ اسکیمای Service یا Product یا FAQPage پیدا نشد.",
      rec: "فقط برای خدمت‌ها، محصول‌ها و پرسش‌هایی اسکیما بنویسید که روی صفحه دیده می‌شوند.",
    },
    language: {
      title: "نشانه‌گذاری زبان",
      ok: (lang, hreflang) =>
        `ویژگی html lang="${lang}" تنظیم شده است${hreflang ? " و نشانه‌گذاری hreflang هم وجود دارد" : ""}.`,
      none: "ویژگی lang روی تگ html موجود نیست.",
      rec: "ویژگی lang را روی html تنظیم کنید و برای نسخه‌های زبانی دیگر پیوند hreflang بگذارید.",
    },
    canonicalConsistency: {
      title: "یکدستی canonical در کل صفحه‌ها",
      none: "هیچ‌کدام از صفحه‌های نمونه canonical اعلام نکرده بودند، پس یکدستی بررسی نشد.",
      collapsed: (count, canonical) =>
        `هر ${fd(
          count
        )} صفحه‌ی نمونه یک canonical یکسان (${canonical}) اعلام کرده‌اند و هیچ‌کدام به خودش ارجاع نمی‌دهد. این صفحه‌ها عملاً به موتورهای جست‌وجو می‌گویند نمایه‌شان نکنند.`,
      ratio: (self, total) =>
        `${fd(self)} صفحه از ${fd(total)} صفحه‌ی نمونه به خودش canonical می‌دهد.`,
      rec: "هر صفحه به canonical مخصوص خودش نیاز دارد. canonical‌ای که در لایه‌ی مشترک قالب تنظیم شود به همه‌ی صفحه‌ها ارث می‌رسد و کل وب‌سایت ادعا می‌کند یک نشانی است.",
    },

    llms: {
      title: "llms.txt",
      ok: "فایل llms.txt در ریشه‌ی وب‌سایت در دسترس است.",
      none: "فایل llms.txt در ریشه‌ی وب‌سایت موجود نیست.",
      rec: "فایل /llms.txt را با توضیحی کوتاه و پیوند به صفحه‌های مرجع منتشر کنید.",
    },
    extendedAgentFiles: {
      title: "فایل‌های تکمیلی عامل‌ها",
      ok: (names) => `${names.join(" و ")} ${names.length === 1 ? "پیدا شد" : "پیدا شدند"}.`,
      none: "هیچ‌کدام از llms-full.txt و agents.md موجود نیستند (صرفاً اطلاع‌رسانی).",
      rec: "برای وب‌سایت‌های پیچیده، یک راهنمای ماشین‌خوان مفصل‌تر را در نظر بگیرید.",
    },
    serverReadable: {
      title: "محتوای خواندنی از سمت سرور",
      ok: (chars) => `${faCount(chars)} نویسه متن قابل مشاهده در HTML اولیه پیدا شد.`,
      thin: (chars) => `فقط ${faCount(chars)} نویسه متن قابل مشاهده در HTML اولیه پیدا شد.`,
      rec: "متن اصلی صفحه را در HTML بیاورید، نه وابسته به اجرای جاوااسکریپت.",
    },
    heading: {
      title: "عنوان اصلی",
      ok: (h1) => `یک H1 روشن پیدا شد: «${h1}»`,
      none: "عنوان H1 روی صفحه‌ی اصلی موجود نیست.",
      rec: "یک H1 گویا بگذارید که موضوع اصلی صفحه را بیان کند.",
    },
    machineContact: {
      title: "اطلاعات تماس ماشین‌خوان",
      ok: "نشانی و اطلاعات تماس در داده‌ی ساختاریافته موجود است.",
      partial: "بخشی از اطلاعات تماس در داده‌ی ساختاریافته‌ی ماشین‌خوان موجود نیست.",
      rec: "در JSON-LD کسب‌وکارتان نشانی پستی را به‌همراه تلفن یا ایمیل بیاورید.",
    },
    signalRatio: {
      title: "نسبت متن به نشانه‌گذاری",
      detail: (ratio) =>
        `متن قابل مشاهده ${fd(ratio.toFixed(1)).replace(".", "٫")}٪ از HTML صفحه‌ی اصلی است.`,
      rec: "نشانه‌گذاری اضافه را کم کنید و متن مفیدتری در HTML اولیه بفرستید.",
    },
    agentCommerce: {
      title: "نقطه‌های اتصال تجارت عامل‌محور",
      ok: "یک نقطه‌ی اتصال کاتالوگ یا تجارت عامل‌محور پیدا شد.",
      none: "هیچ‌کدام از /.well-known/ucp و ai-catalog.json موجود نیستند (صرفاً اطلاع‌رسانی).",
      rec: "برای وب‌سایت‌های فروش، انتشار یک کاتالوگ ساختاریافته‌ی مخصوص عامل‌ها را در نظر بگیرید.",
    },

    businessDescription: {
      title: "توضیح روشن کسب‌وکار",
      ok: (description) => `توضیح متا خلاصه‌ای فشرده به ماشین‌ها می‌دهد: «${description}»`,
      none: "هیچ توضیح یک‌جمله‌ای و به‌اندازه روشنی از کسب‌وکار پیدا نشد.",
      rec: "در یک جمله‌ی ساده بگویید به چه کسی کمک می‌کنید، چه ارائه می‌دهید و کجا کار می‌کنید.",
    },
    questionLed: {
      title: "پاسخ‌های پرسش‌محور",
      ok: "تیترهای پرسشی یا اسکیمای FAQ پیدا شد.",
      none: "هیچ تیتر پرسشی یا محتوای پاسخ‌محور پیدا نشد.",
      rec: "زیر پرسش‌های واقعی مشتریان پاسخ‌های کوتاه بنویسید و از پرسش‌های ساختگی یا کم‌مایه بپرهیزید.",
    },
    pricing: {
      title: "قیمت مشخص",
      ok: "دست‌کم یک قیمت مشخص در متن قابل مشاهده پیدا شد.",
      none: "هیچ قیمت مشخصی در متن قابل مشاهده پیدا نشد.",
      rec: "هرجا مناسب است قیمت، بازه‌ی قیمت یا توضیح روشنی از نحوه‌ی محاسبه‌ی آن منتشر کنید.",
    },
    freshness: {
      title: "تازگی محتوا",
      none: "هیچ سالی به‌صراحت در متن نیامده، پس تازگی محتوا به‌سختی قابل راستی‌آزمایی است.",
      ok: (year) => `تازه‌ترین سالی که در متن صفحه آمده ${fd(year)} است.`,
      rec: "تاریخ انتشار و به‌روزرسانی را روشن نشان دهید و ادعاهای زمان‌مند را مرتب بازبینی کنید.",
    },
    concreteness: {
      title: "ملموس بودن محتوا",
      ok: (count) => `${fd(count)} واقعیت عددی یا ادعای کمّی مشخص شناسایی شد.`,
      weak: (count) => `فقط ${fd(count)} واقعیت عددی یا ادعای کمّی مشخص شناسایی شد.`,
      rec: "به‌جای صفت‌های مبهم شاهد بیاورید: عدد، تاریخ، مکان، نمونه و نتیجه‌های نام‌دار.",
    },

    entity: {
      title: "شناسایی هویت",
      ok: (name) => `وب‌سایت هویت خود را در فراداده‌ی ساختاریافته «${name}» معرفی می‌کند.`,
      none: "نام شرکت از روی فراداده‌ی ساختاریافته به‌روشنی قابل تشخیص نبود.",
      rec: "یک نام سازمانی یکدست در JSON-LD و og:site_name بگذارید.",
    },
    googleBusiness: {
      title: "نمایه‌ی کسب‌وکار گوگل",
      ok: "یک پیوند به گوگل مپ یا نمایه‌ی کسب‌وکار پیدا شد.",
      none: "هیچ پیوند نمایه‌ی کسب‌وکار گوگل یا نقشه‌ی جاسازی‌شده روی صفحه‌ی اصلی پیدا نشد.",
      rec: "اگر کسب‌وکار به یک منطقه خدمت می‌دهد، نمایه‌ی تأییدشده‌ی کسب‌وکار گوگلش را پیوند بدهید.",
    },
    externalRecall: {
      title: "یادآوری برند در هوش مصنوعی",
      detail:
        "سنجش یادآوری برند و پیشنهادشدن در یک دسته، به آزمون مستقل از سمت ارائه‌دهنده‌های جست‌وجو نیاز دارد و در این بررسی فنی نمی‌گنجد.",
    },
  },
};

export function getScannerStrings(locale: AiReadinessLocale = "en"): ScannerStrings {
  return locale === "fa" ? fa : en;
}
