// ============================================================================
// File Path: src/components/v3/reports/eight-stocks/copy.ts
// Why: Every word of report 01 in both locales, one structure for both so
//      the English and Persian pages cannot drift apart. The Persian is
//      Farjad's own Telegram post, set in written (not spoken) forms for the
//      site; the English says the same thing, not a looser version of it.
//      Strings that carry a figure are functions: the figure is computed
//      from data.ts and formatted by the caller.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { CompanyKey, CountryKey, LayerKey } from "./data"

type Copy = {
  countries: Record<CountryKey, string>
  hero: { kicker: string; hook: string[]; megaUnit: string; megaLabel: string; stackHint: string; asOf: string; byline: string }
  basket: {
    kicker: string
    title: string
    lead: string
    presetsLabel: string
    presets: { all: string; nvidia: string; top4: string }
    basketLabel: string
    companiesLabel: string
    verdict: (bigger: string, total: string) => string
    legendBasket: string
    legendGdp: string
    rowHint: string
  }
  stack: {
    kicker: string
    title: string
    lead: string
    sliderLabel: string
    topN: (n: string) => string
    europe: string
    companies: string
    eu27: string
    reading: (share: string) => string
    passed: (n: string) => string
    notYet: string
  }
  nvidia: {
    kicker: string
    title: string
    lead: string
    play: string
    pause: string
    yearLabel: string
    today: string
    passed: (n: string) => string
    growth: (x: string) => string
    note: string
  }
  top4: { kicker: string; title: string; lead: string; companies: string; economies: string; economyNames: string }
  stockFlow: {
    kicker: string
    claim: string
    claimAfter: string
    title: string
    stock: { term: string; title: string; body: string; mark: string }
    flow: { term: string; title: string; body: string; mark: string }
  }
  why: {
    kicker: string
    title: string
    body: string[]
    aside: string
    onlys: { key: CompanyKey; was: string; is: string }[]
  }
  layers: {
    kicker: string
    title: string
    lead: string
    hint: string
    names: Record<LayerKey, { name: string; note: string }>
    clear: string
  }
  question: {
    kicker: string
    old: string
    title: string
    yes: { tag: string; body: string }
    no: { tag: string; body: string }
    closing: string
  }
  method: {
    kicker: string
    title: string
    notes: string[]
    tableTitle: string
    th: { rank: string; country: string; gdp: string; ratio: string }
    sourcesTitle: string
    sources: { label: string; href: string }[]
  }
  colophon: {
    by: string
    name: string
    bio: string
    share: string
    copy: string
    copied: string
    rights: string
    back: string
    more: string
  }
}

export const COPY: Record<Locale, Copy> = {
  en: {
    countries: {
      de: "Germany", gb: "United Kingdom", fr: "France", it: "Italy", ru: "Russia",
      es: "Spain", nl: "Netherlands", ch: "Switzerland", pl: "Poland", ie: "Ireland",
      be: "Belgium", se: "Sweden", at: "Austria", no: "Norway", dk: "Denmark",
      ro: "Romania", cz: "Czech Republic", pt: "Portugal", fi: "Finland", gr: "Greece",
    },
    hero: {
      kicker: "Report 01",
      hook: [
        "In a conversation I guessed that NVIDIA alone is worth about as much as the yearly output of most European countries.",
        "Then I checked. Then I added up seven more companies.",
      ],
      megaUnit: "trillion",
      megaLabel: "The combined market value of eight American companies. Nothing else.",
      stackHint: "Tap a company to see its share.",
      asOf: "Market values at the close of 25 September 2026",
      byline: "Farjad",
    },
    basket: {
      kicker: "Next to Europe",
      title: "Build a basket of companies. Set it against Europe.",
      lead: "Every row is one country's GDP for 2026, the value of everything it produces in a year. The light bar is your basket's market value. Add or remove companies and watch the multiples move.",
      presetsLabel: "Quick picks",
      presets: { all: "All eight", nvidia: "NVIDIA only", top4: "Top four" },
      basketLabel: "Your basket",
      companiesLabel: "Companies in the basket",
      verdict: (bigger, total) => `Worth more than the annual GDP of ${bigger} of these ${total} economies.`,
      legendBasket: "Basket market value",
      legendGdp: "Country GDP, 2026",
      rowHint: "× how many times the basket fits the country's GDP",
    },
    stack: {
      kicker: "Stacking Europe",
      title: "How many economies does it take?",
      lead: "Add Europe's economies one at a time, largest first, and compare a full year of their output with the value of the eight companies.",
      sliderLabel: "Number of economies",
      topN: (n) => `Europe's top ${n}`,
      europe: "Combined GDP",
      companies: "8 companies",
      eu27: "EU-27",
      reading: (share) => `The eight companies equal ${share} of this group's yearly output.`,
      passed: (n) => `It takes the ${n} largest economies to out-produce, in a year, what eight companies are worth today.`,
      notYet: "This group still produces less in a year than the eight are worth.",
    },
    nvidia: {
      kicker: "But wait",
      title: "The strange part is NVIDIA.",
      lead: "On its own, NVIDIA is worth almost exactly Germany's yearly GDP, the largest economy in Europe. Press play and watch it pass the countries one by one.",
      play: "Play",
      pause: "Pause",
      yearLabel: "Year end",
      today: "Today",
      passed: (n) => `Bigger than ${n} of the 20 economies`,
      growth: (x) => `${x}× since the end of 2022`,
      note: "Countries are fixed at their 2026 GDP so only NVIDIA moves. Values are at each year end; 2026 is 25 September.",
    },
    top4: {
      kicker: "The first four",
      title: "NVIDIA + Apple + Google + Microsoft",
      lead: "Together, about the size of the combined yearly GDP of Europe's five largest economies.",
      companies: "4 companies",
      economies: "5 economies",
      economyNames: "Germany, UK, France, Italy, Russia",
    },
    stockFlow: {
      kicker: "One important point",
      claim: "I am not saying “NVIDIA is bigger than Germany.”",
      claimAfter: "In economic terms, that sentence is not accurate.",
      title: "Market cap and GDP are different things.",
      stock: {
        term: "Market cap · a stock",
        title: "A photo, taken once",
        body: "What the market thinks a company is worth today. The value of an asset at a single point in time.",
        mark: "today",
      },
      flow: {
        term: "GDP · a flow",
        title: "A stream, over a year",
        body: "What a country produces in goods and services over twelve months. A flow of economic output.",
        mark: "12 months of output",
      },
    },
    why: {
      kicker: "So why put them side by side?",
      title: "To see the scale of what has happened in the tech economy.",
      body: [
        "We are no longer talking about a few big companies. We are talking about an unprecedented concentration of capital, technology, computing infrastructure and, above all, expectations about the future, in a very small number of firms.",
        "Today's market is betting that AI is not just a new industry. It is meant to become part of the infrastructure of the future economy.",
      ],
      aside: "The debate that started this was political. My point was that America is not run by politicians alone. The interests of these companies now carry real weight too.",
      onlys: [
        { key: "nvidia", was: "Doesn't just sell GPUs.", is: "A full AI computing platform: chips, CUDA software, networking and data-centre systems." },
        { key: "microsoft", was: "Doesn't just sell Windows.", is: "Azure cloud and AI tools for organisations." },
        { key: "amazon", was: "Isn't just an online store.", is: "AWS, the largest cloud provider, with its own AI chips." },
        { key: "alphabet", was: "Isn't just a search engine.", is: "AI models, Google Cloud and its own TPU chips." },
      ],
    },
    layers: {
      kicker: "The layers",
      title: "Each company holds a different layer of the digital economy.",
      lead: "From silicon at the bottom to the platforms people live on at the top.",
      hint: "Choose a company to see which layers it holds.",
      names: {
        chips: { name: "Chips", note: "Silicon and hardware" },
        compute: { name: "Compute", note: "Processing power and data centres" },
        cloud: { name: "Cloud", note: "Computing rented to everyone" },
        data: { name: "Data", note: "The fuel for models" },
        ai: { name: "AI", note: "Models and AI tools" },
        platforms: { name: "Platforms", note: "Where users actually spend their time" },
      },
      clear: "Show all",
    },
    question: {
      kicker: "The real question",
      old: "The question that matters to me is not “how did eight companies reach $25 trillion?”",
      title: "If these valuations are right, what picture of the next ten years does the market see that we don't yet see in full?",
      yes: { tag: "If they are right", body: "The market is pricing an economy in which AI is infrastructure, like electricity and the internet." },
      no: { tag: "If they are wrong", body: "We are looking at one of the most optimistic valuations in the history of capital markets." },
      closing: "Either way, the story matters.",
    },
    method: {
      kicker: "Method and sources",
      title: "How the numbers were built",
      notes: [
        "Market values are at the close of 25 September 2026 and change every trading day. Google means Alphabet.",
        "GDP figures are the IMF's projections for 2026, in current US dollars, not final results.",
        "Russia is counted as European, following the IMF's regional table. It spans two continents; leaving it out would make the comparison more striking, not less.",
        "Market cap is a stock and GDP is a flow. The comparison shows scale and concentration. It does not say a company is richer than a country.",
        "This is analysis for education. It is not investment advice.",
      ],
      tableTitle: "The eight companies ($25.68T) against each economy",
      th: { rank: "#", country: "Country", gdp: "GDP 2026", ratio: "8 companies ÷ GDP" },
      sourcesTitle: "Sources",
      sources: [
        { label: "StockTitan: largest companies by market cap (25 Sep 2026)", href: "https://www.stocktitan.net/rankings/companies-market-cap" },
        { label: "IMF World Economic Outlook, April 2026", href: "https://www.imf.org/en/publications/weo/issues/2026/04/14/world-economic-outlook-april-2026" },
        { label: "Worldometer: GDP by country in Europe, 2026 (IMF data)", href: "https://www.worldometers.info/gdp/gdp-by-country/?region=europe&year=2026&metric=nominal" },
        { label: "Wikipedia: Economy of the European Union (EU-27 GDP)", href: "https://en.wikipedia.org/wiki/Economy_of_the_European_Union" },
        { label: "companiesmarketcap.com: NVIDIA market cap history", href: "https://companiesmarketcap.com/nvidia/marketcap/" },
      ],
    },
    colophon: {
      by: "Research and analysis",
      name: "Farjad",
      bio: "AI strategist, startup mentor and business coach, based in Toronto.",
      share: "Share this report",
      copy: "Copy link",
      copied: "Link copied",
      rights: "© 2026 Farjad (FarjadTalks). All rights reserved. You may quote or republish with credit and a link to this page. Educational analysis, not investment advice.",
      back: "All reports",
      more: "Talk to me about AI strategy",
    },
  },

  fa: {
    countries: {
      de: "آلمان", gb: "بریتانیا", fr: "فرانسه", it: "ایتالیا", ru: "روسیه",
      es: "اسپانیا", nl: "هلند", ch: "سوئیس", pl: "لهستان", ie: "ایرلند",
      be: "بلژیک", se: "سوئد", at: "اتریش", no: "نروژ", dk: "دانمارک",
      ro: "رومانی", cz: "جمهوری چک", pt: "پرتغال", fi: "فنلاند", gr: "یونان",
    },
    hero: {
      kicker: "گزارش ۰۱",
      hook: [
        "جایی بحث شد و من حسی گفتم ارزش NVIDIA به‌تنهایی اندازه‌ی GDP بیشتر کشورهای اروپایی است.",
        "بعد چک کردم. بعد هفت شرکت دیگر را هم کنارش جمع زدم.",
      ],
      megaUnit: "تریلیون",
      megaLabel: "ارزش بازار مجموع فقط همین ۸ شرکت آمریکایی. کاری به بقیه‌ی شرکت‌های بزرگ ندارم.",
      stackHint: "روی هر شرکت بزنید تا سهمش را ببینید.",
      asOf: "ارزش بازار در پایان معاملات ۲۵ سپتامبر ۲۰۲۶",
      byline: "فرجاد",
    },
    basket: {
      kicker: "کنار اقتصاد اروپا",
      title: "سبد شرکت‌ها را خودتان بچینید و کنار اروپا بگذارید.",
      lead: "هر ردیف GDP سال ۲۰۲۶ یک کشور است؛ یعنی ارزش هر چیزی که آن کشور در یک سال تولید می‌کند. نوار روشن ارزش بازار سبد شماست. شرکتی اضافه یا کم کنید و ببینید ضریب‌ها چطور عوض می‌شوند.",
      presetsLabel: "انتخاب سریع",
      presets: { all: "هر ۸ شرکت", nvidia: "فقط NVIDIA", top4: "۴ تای اول" },
      basketLabel: "سبد شما",
      companiesLabel: "شرکت‌های داخل سبد",
      verdict: (bigger, total) => `از GDP سالانه‌ی ${bigger} اقتصاد از این ${total} اقتصاد بیشتر است.`,
      legendBasket: "ارزش بازار سبد",
      legendGdp: "GDP کشور در ۲۰۲۶",
      rowHint: "× یعنی سبد چند برابر GDP آن کشور است",
    },
    stack: {
      kicker: "روی هم چیدن اروپا",
      title: "چند اقتصاد لازم است؟",
      lead: "اقتصادهای اروپا را از بزرگ به کوچک یکی‌یکی روی هم بگذارید و تولید یک سال کامل آن‌ها را با ارزش این ۸ شرکت مقایسه کنید.",
      sliderLabel: "تعداد اقتصادها",
      topN: (n) => `${n} اقتصاد بزرگ اروپا`,
      europe: "مجموع GDP",
      companies: "۸ شرکت",
      eu27: "اتحادیه‌ی اروپا (۲۷ کشور)",
      reading: (share) => `ارزش ۸ شرکت برابر ${share} تولید سالانه‌ی این گروه است.`,
      passed: (n) => `${n} اقتصاد بزرگ اروپا لازم است تا تولید یک سالشان از ارزش امروز ۸ شرکت بیشتر شود.`,
      notYet: "تولید یک سال این گروه هنوز از ارزش ۸ شرکت کمتر است.",
    },
    nvidia: {
      kicker: "ولی صبر کنید",
      title: "قسمت عجیب‌تر داستان NVIDIA است.",
      lead: "ارزش بازار NVIDIA به‌تنهایی تقریباً هم‌اندازه‌ی GDP سالانه‌ی آلمان است؛ بزرگ‌ترین اقتصاد اروپا. دکمه‌ی پخش را بزنید و ببینید چطور یکی‌یکی از کشورها جلو می‌زند.",
      play: "پخش",
      pause: "توقف",
      yearLabel: "پایان سال",
      today: "امروز",
      passed: (n) => `بزرگ‌تر از ${n} اقتصاد از ۲۰ اقتصاد`,
      growth: (x) => `${x} برابر از پایان ۲۰۲۲ تا امروز`,
      note: "GDP کشورها روی عدد ۲۰۲۶ ثابت مانده تا فقط NVIDIA حرکت کند. ارزش‌ها مربوط به پایان هر سال است و ۲۰۲۶ یعنی ۲۵ سپتامبر.",
    },
    top4: {
      kicker: "چهار تای اول",
      title: "NVIDIA + Apple + Google + Microsoft",
      lead: "روی هم تقریباً به اندازه‌ی مجموع GDP سالانه‌ی پنج اقتصاد بزرگ اروپا.",
      companies: "۴ شرکت",
      economies: "۵ اقتصاد",
      economyNames: "آلمان، بریتانیا، فرانسه، ایتالیا، روسیه",
    },
    stockFlow: {
      kicker: "یک نکته‌ی خیلی مهم",
      claim: "من نمی‌گویم «NVIDIA از آلمان بزرگ‌تر است».",
      claimAfter: "این از نظر اقتصادی جمله‌ی دقیقی نیست.",
      title: "Market Cap با GDP فرق دارد.",
      stock: {
        term: "Market Cap · موجودی",
        title: "یک عکس در یک لحظه",
        body: "بازار امروز یک شرکت را چقدر ارزش‌گذاری می‌کند. ارزش یک دارایی در یک نقطه‌ی زمانی.",
        mark: "امروز",
      },
      flow: {
        term: "GDP · جریان",
        title: "یک جریان در طول سال",
        body: "یک کشور در طول یک سال چقدر کالا و خدمات تولید می‌کند. جریان تولید اقتصادی.",
        mark: "۱۲ ماه تولید",
      },
    },
    why: {
      kicker: "پس چرا این دو را کنار هم گذاشتم؟",
      title: "برای اینکه مقیاس اتفاقی را که در اقتصاد تکنولوژی افتاده ببینیم.",
      body: [
        "ما دیگر فقط درباره‌ی چند شرکت بزرگ حرف نمی‌زنیم. داریم درباره‌ی تمرکز بی‌سابقه‌ای از سرمایه، تکنولوژی، زیرساخت محاسباتی و البته «انتظار از آینده» در تعداد بسیار کمی شرکت حرف می‌زنیم.",
        "بازار امروز روی این فرض شرط می‌بندد که AI فقط یک صنعت جدید نیست. قرار است بخشی از زیرساخت اقتصاد آینده باشد.",
      ],
      aside: "بحثی که این کنجکاوی را شروع کرد سیاسی بود. حرف من این بود که آمریکا را فقط سیاستمدارها نمی‌گردانند؛ منافع این شرکت‌ها هم امروز کم‌تأثیر نیست.",
      onlys: [
        { key: "nvidia", was: "فقط GPU نمی‌فروشد.", is: "پلتفرم کامل محاسبات AI: چیپ، نرم‌افزار CUDA، شبکه و سیستم‌های دیتاسنتر." },
        { key: "microsoft", was: "فقط Windows نمی‌فروشد.", is: "ابر Azure و ابزارهای AI برای سازمان‌ها." },
        { key: "amazon", was: "فقط فروشگاه اینترنتی نیست.", is: "AWS، بزرگ‌ترین ارائه‌دهنده‌ی ابر، با چیپ‌های AI اختصاصی خودش." },
        { key: "alphabet", was: "فقط موتور جست‌وجو نیست.", is: "مدل‌های AI، ابر گوگل و چیپ‌های TPU خودش." },
      ],
    },
    layers: {
      kicker: "لایه‌ها",
      title: "هر کدام از این شرکت‌ها لایه‌ای از زیرساخت اقتصاد دیجیتال آینده را در دست دارد.",
      lead: "از سیلیکون در پایین تا پلتفرم‌هایی که مردم رویشان زندگی می‌کنند در بالا.",
      hint: "یک شرکت را انتخاب کنید تا ببینید کدام لایه‌ها دست اوست.",
      names: {
        chips: { name: "Chips", note: "چیپ و سخت‌افزار" },
        compute: { name: "Compute", note: "قدرت محاسباتی و دیتاسنتر" },
        cloud: { name: "Cloud", note: "اجاره‌ی محاسبات به همه" },
        data: { name: "Data", note: "داده، سوخت مدل‌ها" },
        ai: { name: "AI", note: "مدل‌ها و ابزارهای هوش مصنوعی" },
        platforms: { name: "Platforms", note: "جایی که کاربران وقتشان را می‌گذرانند" },
      },
      clear: "نمایش همه",
    },
    question: {
      kicker: "سؤال اصلی",
      old: "سؤال مهم‌تر برای من این نیست که «چطور ارزش ۸ شرکت به ۲۵ تریلیون دلار رسید؟»",
      title: "اگر این ارزش‌گذاری‌ها درست باشند، بازار چه تصویری از اقتصاد ۱۰ سال آینده می‌بیند که ما هنوز کامل نمی‌بینیم؟",
      yes: { tag: "اگر درست باشند", body: "بازار دارد اقتصادی را قیمت‌گذاری می‌کند که در آن AI زیرساخت است؛ مثل برق و اینترنت." },
      no: { tag: "اگر اشتباه باشند", body: "داریم درباره‌ی یکی از بزرگ‌ترین قیمت‌گذاری‌های خوش‌بینانه‌ی تاریخ بازار سرمایه حرف می‌زنیم." },
      closing: "در هر دو حالت، داستان مهم است.",
    },
    method: {
      kicker: "روش و منابع",
      title: "این عددها چطور ساخته شدند",
      notes: [
        "ارزش بازار مربوط به پایان معاملات ۲۵ سپتامبر ۲۰۲۶ است و هر روز تغییر می‌کند. منظور از Google شرکت Alphabet است.",
        "GDP کشورها پیش‌بینی صندوق بین‌المللی پول برای سال ۲۰۲۶ به دلار جاری است، نه عدد نهایی.",
        "روسیه طبق جدول منطقه‌ای IMF جزو اروپا حساب شده است. روسیه در دو قاره قرار دارد و حذفش مقایسه را چشمگیرتر می‌کند، نه کم‌رنگ‌تر.",
        "Market Cap موجودی است و GDP جریان. این مقایسه مقیاس و تمرکز را نشان می‌دهد، نه اینکه یک شرکت از یک کشور ثروتمندتر است.",
        "این تحلیل آموزشی است و توصیه‌ی سرمایه‌گذاری نیست.",
      ],
      tableTitle: "۸ شرکت (۲۵٫۶۸ تریلیون دلار) در برابر هر اقتصاد",
      th: { rank: "#", country: "کشور", gdp: "GDP ۲۰۲۶", ratio: "۸ شرکت ÷ GDP" },
      sourcesTitle: "منابع",
      sources: [
        { label: "StockTitan: بزرگ‌ترین شرکت‌ها بر اساس ارزش بازار (۲۵ سپتامبر ۲۰۲۶)", href: "https://www.stocktitan.net/rankings/companies-market-cap" },
        { label: "IMF World Economic Outlook، آوریل ۲۰۲۶", href: "https://www.imf.org/en/publications/weo/issues/2026/04/14/world-economic-outlook-april-2026" },
        { label: "Worldometer: GDP کشورهای اروپا در ۲۰۲۶ (داده‌ی IMF)", href: "https://www.worldometers.info/gdp/gdp-by-country/?region=europe&year=2026&metric=nominal" },
        { label: "Wikipedia: اقتصاد اتحادیه‌ی اروپا (GDP اتحادیه‌ی ۲۷ کشور)", href: "https://en.wikipedia.org/wiki/Economy_of_the_European_Union" },
        { label: "companiesmarketcap.com: تاریخچه‌ی ارزش بازار NVIDIA", href: "https://companiesmarketcap.com/nvidia/marketcap/" },
      ],
    },
    colophon: {
      by: "تهیه و تحلیل",
      name: "فرجاد",
      bio: "استراتژیست هوش مصنوعی، منتور استارتاپ و کوچ کسب‌وکار، ساکن تورنتو.",
      share: "این گزارش را به اشتراک بگذارید",
      copy: "کپی لینک",
      copied: "لینک کپی شد",
      rights: "© ۲۰۲۶ فرجاد (FarjadTalks). همه‌ی حقوق محفوظ است. نقل و بازنشر با ذکر نام و لینک همین صفحه آزاد است. این محتوا تحلیل آموزشی است و توصیه‌ی سرمایه‌گذاری نیست.",
      back: "همه‌ی گزارش‌ها",
      more: "درباره‌ی استراتژی AI با من صحبت کنید",
    },
  },
}
