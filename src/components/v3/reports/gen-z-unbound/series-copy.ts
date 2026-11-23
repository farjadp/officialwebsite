// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/series-copy.ts
// Why: The words the three parts of the Gen Z series share: the series name,
//      the part labels, the badge names (one badge case runs across all three
//      parts), the method note, the cautions every part repeats and the
//      sources. Part-specific copy lives in part1/ part2/ part3/.
// ============================================================================

import type { Locale } from "@/lib/nav"

export const SERIES_SLUGS = ["gen-z-unbound-politics", "gen-z-four-countries-one-generation", "gen-z-trust-you-can-check"] as const
export type PartIndex = 0 | 1 | 2

export type MedalKey = "room" | "twin" | "camps" | "issues" | "guess" | "distance" | "abroad" | "stars" | "trust" | "feeds" | "unexplained" | "studies"

/** Badges by part, in the order the reader meets them. */
export const MEDALS_BY_PART: MedalKey[][] = [
  ["room", "twin", "camps", "issues"],
  ["guess", "distance", "abroad", "stars"],
  ["trust", "feeds", "unexplained", "studies"],
]

type SeriesCopy = {
  series: string
  seriesShort: string
  partLabel: (n: number) => string
  parts: { title: string; teaser: string }[]
  nav: { title: string; here: string; soon: (date: string) => string; read: string }
  medals: { title: string; hint: string; open: string; close: string; complete: string; locked: (date: string) => string; names: Record<MedalKey, string> }
  scope: { title: string; body: string }
  status: string
  byline: string
  notes: { t: string; b: string }[]
  sourcesTitle: string
  sources: { label: string; href: string }[]
  credit: string
  disclaimer: string
  cta: string
}

export const SERIES: Record<Locale, SeriesCopy> = {
  en: {
    series: "Gen Z, Unbound",
    seriesShort: "Gen Z series",
    partLabel: (n) => `Part ${n} of 3`,
    parts: [
      { title: "Eight in a Hundred, and Two", teaser: "Young people's views come loose from each other, and the right shrinks." },
      { title: "One Generation, Four Countries", teaser: "Young Americans, Britons, French and Germans now think much alike." },
      { title: "Trust You Can Check", teaser: "What still earns trust, and what the survey cannot yet explain." },
    ],
    nav: { title: "The series", here: "You are here", soon: (d) => `Out ${d}`, read: "Read" },
    medals: {
      title: "Series badges",
      hint: "One for each figure you try, across all three parts. Kept only in this browser.",
      open: "Open badges",
      close: "Close",
      complete: "All twelve. You have read the whole survey more closely than most people who cite it.",
      locked: (d) => `Opens ${d}`,
      names: {
        room: "Room of 100",
        twin: "Find a twin",
        camps: "Two camps",
        issues: "Degree, not direction",
        guess: "Border guesser",
        distance: "Cultural distance",
        abroad: "Match abroad",
        stars: "Shared stars",
        trust: "Trust ledger",
        feeds: "Feed counter",
        unexplained: "Four fifths",
        studies: "Evidence reader",
      },
    },
    scope: {
      title: "What this is, and what it is not",
      body:
        "A reading of one survey report: Electric Twin's “Gen Z is Unbound” (October 2026), 51,929 online-panel survey responses from the US, UK, France and Germany, collected in two waves between January and April 2026. Electric Twin is a London company that sells AI-simulated (“synthetic”) audiences, and the report's academic co-author is listed by the company as its science advisor. It is not peer-reviewed, and it is one snapshot in time, so it cannot tell a generation apart from an age. The figures are the report's; the reading and the charts are mine.",
    },
    status: "Company survey report · not peer-reviewed · publisher sells synthetic audiences",
    byline: "Read and drawn by Farjad · Source: Electric Twin, with Prof. Michael Muthukrishna",
    notes: [
      {
        t: "A company report, not a paper",
        b: "Electric Twin is a London startup that sells AI-simulated “synthetic audiences” and raised £10m in February 2026. The report's academic co-author, Professor Michael Muthukrishna (LSE), is listed on the company's site as its science advisor. A survey showing that generation predicts individual views poorly also suits a business that models people one by one; we flag that not as an accusation but because readers should know. There is no peer review, preprint, data release or named panel provider.",
      },
      {
        t: "Responses, not people",
        b: "51,929 is the number of analysed responses across two waves; the report does not say whether the same people answered both. Vote was asked in both waves in the US but only in the second wave (22–26 April) in Europe, so every European left/right figure rests on that wave.",
      },
      {
        t: "One snapshot",
        b: "Two waves, three months apart. A cross-section cannot separate age from generation: today's young may look like today's old when they are old, or they may not. The report says this itself.",
      },
      {
        t: "Online panel, quota sample",
        b: "Respondents were recruited online and quota-sampled on age, region and education. Online panels reach the internet-heavy more easily, which matters most for the oldest groups.",
      },
      {
        t: "Four rich democracies",
        b: "The US, UK, France and Germany. “Gen Z” here means young people in those four countries, not young people everywhere.",
      },
      {
        t: "What we added",
        b: "The interactive figures, the Persian translation and the reading for founders and marketers are ours. Where we read a number off a chart rather than from the text, the figure says so.",
      },
    ],
    sourcesTitle: "Sources",
    sources: [
      { label: "Electric Twin (2026). Gen Z is Unbound. Survey report (PDF dated October 2026; published 19 November 2026).", href: "https://www.electrictwin.com/research/gen-z-unbound" },
      { label: "UKTN (12 Feb 2026). AI startup building synthetic audiences to model human thought raises £10m.", href: "https://www.uktech.news/ai/ai-startup-building-synthetic-audiences-to-model-human-thought-raises-10m-20260212" },
      { label: "Muthukrishna, M. et al. (2020). Beyond WEIRD psychology: measuring and mapping scales of cultural and psychological distance. Psychological Science 31(6).", href: "https://doi.org/10.1177/0956797620916782" },
      { label: "Pew Research Center (2019). Defining generations: where Millennials end and Generation Z begins.", href: "https://www.pewresearch.org/short-reads/2019/01/17/where-millennials-end-and-generation-z-begins/" },
    ],
    credit: "All survey figures are Electric Twin's, quoted as printed. Charts redrawn from the report's numbers.",
    disclaimer: "A reading of a company survey report. Figures are the report's, checked for internal consistency; interpretations are labelled.",
    cta: "Talk through your audience strategy",
  },
  fa: {
    series: "نسل زد، بی‌بسته",
    seriesShort: "مجموعه‌ی نسل زد",
    partLabel: (n) => `بخش ${["۱", "۲", "۳"][n - 1]} از ۳`,
    parts: [
      { title: "هشت از صد، و دو", teaser: "نظرهای جوان‌ها دیگر به هم گره نخورده‌اند، و راستِ تند کوچک شده است." },
      { title: "یک نسل، چهار کشور", teaser: "جوان‌های آمریکا، بریتانیا، فرانسه و آلمان حالا شبیه هم فکر می‌کنند." },
      { title: "اعتمادی که بشود وارسی‌اش کرد", teaser: "چه چیزی هنوز اعتماد می‌خرد، و چه چیزی را این نظرسنجی هنوز نمی‌تواند توضیح دهد." },
    ],
    nav: { title: "این مجموعه", here: "این‌جا هستید", soon: (d) => `انتشار ${d}`, read: "بخوانید" },
    medals: {
      title: "نشان‌های مجموعه",
      hint: "برای هر نمودار که امتحان کنید یک نشان، در هر سه بخش. فقط در همین مرورگر می‌ماند.",
      open: "باز کردن نشان‌ها",
      close: "بستن",
      complete: "هر دوازده نشان. این نظرسنجی را دقیق‌تر از بیشترِ کسانی خوانده‌اید که به آن استناد می‌کنند.",
      locked: (d) => `از ${d}`,
      names: {
        room: "اتاق صدنفره",
        twin: "پیدا کردن هم‌فکر",
        camps: "دو اردوگاه",
        issues: "شدت، نه جهت",
        guess: "حدس کشور",
        distance: "فاصله‌ی فرهنگی",
        abroad: "هم‌فکر در خارج",
        stars: "ستاره‌های مشترک",
        trust: "دفتر اعتماد",
        feeds: "شمارش فیدها",
        unexplained: "چهار پنجم",
        studies: "خواننده‌ی شواهد",
      },
    },
    scope: {
      title: "این گزارش چیست و چه نیست",
      body:
        "خوانشی از یک گزارش نظرسنجی: «نسل زد بی‌بسته است» از شرکت Electric Twin (اکتبر ۲۰۲۶)، با ۵۱٬۹۲۹ پاسخِ پنل آنلاین از آمریکا، بریتانیا، فرانسه و آلمان که در دو موج، بین ژانویه و آوریل ۲۰۲۶، جمع شده‌اند. Electric Twin شرکتی لندنی است که «مخاطب مصنوعی» شبیه‌سازی‌شده با هوش مصنوعی می‌فروشد و هم‌نویسنده‌ی دانشگاهیِ گزارش در سایت شرکت مشاور علمی‌اش معرفی شده. گزارش داوری علمی نشده و فقط یک عکس از یک لحظه است؛ پس نمی‌تواند اثر «نسل» را از اثر «سن» جدا کند. عددها مال گزارش‌اند؛ خوانش و نمودارها مال من.",
    },
    status: "گزارش نظرسنجی یک شرکت · داوری‌نشده · ناشر مخاطب مصنوعی می‌فروشد",
    byline: "خوانش و نمودار: فرجاد · منبع: Electric Twin، با همکاری پروفسور مایکل موتوکریشنا",
    notes: [
      {
        t: "گزارش یک شرکت، نه مقاله",
        b: "Electric Twin یک استارتاپ لندنی است که «مخاطبِ مصنوعی» شبیه‌سازی‌شده با هوش مصنوعی می‌فروشد و فوریه‌ی ۲۰۲۶ ده میلیون پوند سرمایه جذب کرد. پروفسور مایکل موتوکریشنا (LSE)، هم‌نویسنده‌ی دانشگاهیِ گزارش، در سایت این شرکت مشاور علمی‌اش معرفی شده. نظرسنجی‌ای که نشان می‌دهد «نسل» نظرِ تک‌تک آدم‌ها را بد پیش‌بینی می‌کند، با کسب‌وکاری که آدم‌ها را یکی‌یکی مدل می‌کند هم جور درمی‌آید؛ این را برای اتهام نمی‌گوییم، می‌گوییم چون خواننده باید بداند. نه داوری علمی در کار است، نه پیش‌انتشار، نه داده‌ی منتشرشده، نه نامِ شرکتِ پنل.",
      },
      {
        t: "پاسخ، نه آدم",
        b: "۵۱٬۹۲۹ تعداد پاسخ‌های تحلیل‌شده در دو موج است؛ گزارش نمی‌گوید همان آدم‌ها در هر دو موج جواب داده‌اند یا نه. رأی در آمریکا در هر دو موج پرسیده شد، ولی در اروپا فقط در موج دوم (۲۲ تا ۲۶ آوریل)؛ پس هر عدد چپ و راستِ اروپا به همان موج تکیه دارد.",
      },
      {
        t: "یک عکس از یک لحظه",
        b: "دو موج، با سه ماه فاصله. داده‌ی مقطعی نمی‌تواند سن را از نسل جدا کند: شاید جوان‌های امروز وقتی پیر شوند شبیه پیرهای امروز شوند، شاید هم نه. خود گزارش هم همین را می‌گوید.",
      },
      {
        t: "پنل آنلاین، نمونه‌ی سهمیه‌ای",
        b: "پاسخ‌دهنده‌ها آنلاین جذب شده‌اند و نمونه بر اساس سن، منطقه و تحصیلات سهمیه‌بندی شده. پنل آنلاین راحت‌تر به آدم‌های اهل اینترنت می‌رسد، و این برای مسن‌ترین گروه‌ها بیشتر اهمیت دارد.",
      },
      {
        t: "چهار دموکراسی ثروتمند",
        b: "آمریکا، بریتانیا، فرانسه و آلمان. «نسل زد» در این گزارش یعنی جوان‌های همین چهار کشور، نه جوان‌های همه‌جای دنیا.",
      },
      {
        t: "چه چیزی را ما اضافه کردیم",
        b: "نمودارهای تعاملی، ترجمه‌ی فارسی و برداشت برای بنیان‌گذارها و بازاریاب‌ها کار ماست. هر جا عددی را از روی نمودار خوانده‌ایم و نه از متن، کنار همان نمودار گفته‌ایم.",
      },
    ],
    sourcesTitle: "منابع",
    sources: [
      { label: "Electric Twin (2026). Gen Z is Unbound. Survey report (PDF dated October 2026; published 19 November 2026).", href: "https://www.electrictwin.com/research/gen-z-unbound" },
      { label: "UKTN (12 Feb 2026). AI startup building synthetic audiences to model human thought raises £10m.", href: "https://www.uktech.news/ai/ai-startup-building-synthetic-audiences-to-model-human-thought-raises-10m-20260212" },
      { label: "Muthukrishna, M. et al. (2020). Beyond WEIRD psychology: measuring and mapping scales of cultural and psychological distance. Psychological Science 31(6).", href: "https://doi.org/10.1177/0956797620916782" },
      { label: "Pew Research Center (2019). Defining generations: where Millennials end and Generation Z begins.", href: "https://www.pewresearch.org/short-reads/2019/01/17/where-millennials-end-and-generation-z-begins/" },
    ],
    credit: "همه‌ی عددهای نظرسنجی مال Electric Twin است و همان‌طور که چاپ شده نقل شده. نمودارها از روی عددهای گزارش دوباره کشیده شده‌اند.",
    disclaimer: "خوانشی از گزارش نظرسنجی یک شرکت. عددها مال گزارش‌اند و سازگاری درونی‌شان بررسی شده؛ برداشت‌ها برچسب خورده‌اند.",
    cta: "درباره‌ی استراتژی مخاطب‌تان حرف بزنیم",
  },
}
