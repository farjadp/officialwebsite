// ============================================================================
// File Path: src/components/home/v3/copy.ts
// Why: Every word of the v3 home page, in both locales, in one place so the
//      English and Persian homes cannot drift apart structurally. Facts are
//      the ones the site already publishes (resume, about/data.ts, the lab
//      page, the Persian home's ledger); nothing is claimed here first.
//      Figures follow the 21 Sep standardisation: 22+ years, 25 startups,
//      $3M raised.
// ============================================================================

export type Locale = "en" | "fa"

export type Role = {
  key: "ai" | "mentor" | "coach"
  tab: string
  headline: string
  accent: string
  body: string
  proof: string[]
  cta: { label: string; href: string }
  secondary: { label: string; href: string }
}

export type HomeCopy = {
  eyebrow: string
  rolesLabel: string
  roles: Role[]
  portraitAlt: string
  labBadge: { title: string; detail: string; href: string }
  marquee: string[]
  facts: { value: number; prefix?: string; suffix: string; label: string }[]
  start: {
    title: string
    accent: string
    ways: { kicker: string; title: string; body: string; href: string }[]
  }
  record: { kicker: string; title: string; rows: { year: string; lines: string[] }[] }
  evidence: { kicker: string; photos: { src: string; alt: string; caption: string }[] }
  writing?: { title: string; all: string; empty: string }
  closing: { title: string; accent: string; body: string; cta: { label: string; href: string } }
}

export const HOME_COPY: Record<Locale, HomeCopy> = {
  en: {
    eyebrow: "Farjad · Toronto · 22+ years building companies",
    rolesLabel: "What I do",
    roles: [
      {
        key: "ai",
        tab: "AI Strategist",
        headline: "AI that earns its place in ",
        accent: "your business.",
        body: "I find where AI creates real leverage in your company, and where it doesn't. Then I design it, ship it and keep it secure.",
        proof: ["ISO 27001 Lead Auditor", "Former CTO, government-backed cloud", "AshaVid, Chief Strategy Officer"],
        cta: { label: "Book an AI strategy call", href: "/booking" },
        secondary: { label: "Take the AI adoption score", href: "/tools/ai-adoption-score" },
      },
      {
        key: "mentor",
        tab: "Startup Mentor",
        headline: "From a raw idea to a company ",
        accent: "people pay.",
        body: "Customer discovery, lean validation and honest feedback, week by week, from someone who has built companies and lost one.",
        proof: ["25 startups mentored", "VisaRoads mentor", "Treefrog accelerator"],
        cta: { label: "See the Founder Lab", href: "/lab" },
        secondary: { label: "Startup readiness score", href: "/tools/startup-readiness" },
      },
      {
        key: "coach",
        tab: "Business Coach",
        headline: "Clarity for the decisions ",
        accent: "only you can make.",
        body: "A calm, direct sparring partner for founders and owners who have hit a ceiling. Not a cheerleader.",
        proof: ["Schulich School of Business", "DBA, Brand Management", "Doctoral studies in anthropology"],
        cta: { label: "Book a coaching session", href: "/booking" },
        secondary: { label: "How founder advisory works", href: "/services/founder-advisory" },
      },
    ],
    portraitAlt: "Farjad, portrait",
    labBadge: { title: "Founder Lab", detail: "8 weeks · 5 teams · free · English & فارسی", href: "/lab" },
    marquee: [
      "ISO 27001 Lead Auditor",
      "Schulich School of Business",
      "York Regional Council",
      "Treefrog accelerator",
      "AshaVid",
      "VisaRoads",
      "Former CTO",
      "22+ years, two countries",
    ],
    facts: [
      { value: 22, suffix: "+", label: "years in technology" },
      { value: 25, suffix: "", label: "startups mentored" },
      { value: 3, prefix: "$", suffix: "M", label: "raised by the teams" },
    ],
    start: {
      title: "Start small.",
      accent: "No pitch deck needed.",
      ways: [
        { kicker: "First step", title: "A diagnostic call", body: "One problem, looked at honestly. You leave with a next step.", href: "/booking" },
        { kicker: "10 minutes", title: "A free self-assessment", body: "Scores from startup readiness to AI adoption, with a written read-out.", href: "/tools" },
        { kicker: "8 weeks", title: "The Founder Lab", body: "Real work on your startup, alongside four other teams. Free.", href: "/lab" },
      ],
    },
    record: {
      kicker: "The record",
      title: "Twenty years, two countries, no adjectives.",
      rows: [
        { year: "2006", lines: ["Founder and CEO of DPF, a data processing company. Until 2023."] },
        { year: "2017", lines: ["CTO of Iran's first government-backed cloud computing company. Until 2020."] },
        { year: "2020", lines: ["Co-founder of HoFin, a mental-health app published on the App Store.", "Doctoral studies in anthropology."] },
        { year: "2022", lines: ["Startup mentor at VisaRoads.", "Founder of NFTsShip, Iran's first NFT platform and event."] },
        { year: "2024", lines: ["Treefrog accelerator programme, Ontario."] },
        { year: "2025", lines: ["Founder and Chief Strategy Officer of AshaVid, Toronto.", "Venture masterclass, Schulich Academy."] },
        { year: "2026", lines: ["Digital transformation specialist, Schulich School of Business, York University."] },
      ],
    },
    evidence: {
      kicker: "In the room",
      photos: [
        { src: "/images/lab/council.jpg", alt: "Presenting programme results to York Regional Council", caption: "York Regional Council, presenting the teams' results" },
        { src: "/images/lab/panel.jpg", alt: "Closing panel of the Digital Transformation programme", caption: "Closing panel, Toronto" },
      ],
    },
    writing: { title: "Writing", all: "All writing", empty: "New essays are on the way." },
    closing: {
      title: "One honest conversation ",
      accent: "is usually enough to see it.",
      body: "Bring the decision you keep postponing. We will look at it together, plainly.",
      cta: { label: "Book a call", href: "/booking" },
    },
  },

  fa: {
    eyebrow: "فرجاد · تورنتو · ۲۲+ سال ساختن شرکت",
    rolesLabel: "کارهایی که می‌کنم",
    roles: [
      {
        key: "ai",
        tab: "استراتژیست هوش مصنوعی",
        headline: "هوش مصنوعی، فقط جایی که ",
        accent: "واقعاً ارزش می‌سازد.",
        body: "پیدا می‌کنم کجای کسب‌وکار شما هوش مصنوعی اهرم واقعی می‌سازد و کجا نه. بعد آن را طراحی می‌کنم، راه می‌اندازم و امن نگه می‌دارم.",
        proof: ["ممیز ارشد ISO 27001", "مدیر ارشد فنی پیشین، رایانش ابری دولتی", "مدیر ارشد استراتژی AshaVid"],
        cta: { label: "رزرو جلسه‌ی استراتژی هوش مصنوعی", href: "/fa/booking" },
        secondary: { label: "سنجش پذیرش هوش مصنوعی", href: "/fa/tools/ai-adoption-score" },
      },
      {
        key: "mentor",
        tab: "منتور استارتاپ",
        headline: "از یک ایده‌ی خام تا شرکتی که ",
        accent: "مشتری پولش را می‌دهد.",
        body: "کشف مشتری، اعتبارسنجی ناب و بازخورد بی‌تعارف، هفته به هفته، با کسی که شرکت ساخته و یکی را هم از دست داده است.",
        proof: ["۲۵ استارتاپ منتورشده", "منتور VisaRoads", "برنامه‌ی شتاب‌دهی Treefrog"],
        cta: { label: "آشنایی با آزمایشگاه بنیان‌گذار", href: "/fa/lab" },
        secondary: { label: "سنجش آمادگی استارتاپ", href: "/fa/tools/startup-readiness" },
      },
      {
        key: "coach",
        tab: "کوچ کسب‌وکار",
        headline: "وضوح، برای تصمیم‌هایی که ",
        accent: "فقط خودتان می‌توانید بگیرید.",
        body: "یک هم‌فکر آرام و رک برای بنیان‌گذاران و مدیرانی که به سقف رشد خورده‌اند. نه تشویق‌کننده.",
        proof: ["دانشکده‌ی کسب‌وکار شولیک", "DBA، مدیریت برند", "دکتری انسان‌شناسی"],
        cta: { label: "رزرو جلسه‌ی کوچینگ", href: "/fa/booking" },
        secondary: { label: "مشاوره‌ی بنیان‌گذار چطور کار می‌کند", href: "/fa/services/founder-advisory" },
      },
    ],
    portraitAlt: "پرتره‌ی فرجاد",
    labBadge: { title: "آزمایشگاه بنیان‌گذار", detail: "۸ هفته · ۵ تیم · رایگان · فارسی و انگلیسی", href: "/fa/lab" },
    marquee: [
      "ممیز ارشد ISO 27001",
      "دانشکده‌ی کسب‌وکار شولیک",
      "شورای منطقه‌ای یورک",
      "شتاب‌دهنده‌ی Treefrog",
      "AshaVid",
      "VisaRoads",
      "مدیر ارشد فنی پیشین",
      "۲۲+ سال، دو کشور",
    ],
    facts: [
      { value: 22, suffix: "+", label: "سال در فناوری" },
      { value: 25, suffix: "", label: "استارتاپ منتورشده" },
      { value: 3, suffix: "", label: "میلیون دلار جذب‌شده توسط تیم‌ها" },
    ],
    start: {
      title: "از کار کوچک شروع کنید.",
      accent: "پیچ‌دک لازم نیست.",
      ways: [
        { kicker: "قدم اول", title: "جلسه‌ی تشخیص", body: "یک مسئله، با نگاهی صادقانه. با یک قدم بعدی مشخص بیرون می‌روید.", href: "/fa/booking" },
        { kicker: "۱۰ دقیقه", title: "خودارزیابی رایگان", body: "سنجه‌هایی از آمادگی استارتاپ تا پذیرش هوش مصنوعی، با گزارش مکتوب.", href: "/fa/tools" },
        { kicker: "۸ هفته", title: "آزمایشگاه بنیان‌گذار", body: "کار واقعی روی استارتاپ شما، کنار چهار تیم دیگر. رایگان.", href: "/fa/lab" },
      ],
    },
    record: {
      kicker: "کارنامه",
      title: "بیست سال، دو کشور، بدون صفت.",
      rows: [
        { year: "۲۰۰۶", lines: ["بنیان‌گذار و مدیر DPF، شرکت پردازش داده. تا ۲۰۲۳."] },
        { year: "۲۰۱۷", lines: ["مدیر ارشد فنی نخستین شرکت رایانش ابری دولتی ایران. تا ۲۰۲۰."] },
        { year: "۲۰۲۰", lines: ["هم‌بنیان‌گذار HoFin، اپلیکیشن سلامت روان، منتشرشده روی اپ‌استور.", "دکتری انسان‌شناسی."] },
        { year: "۲۰۲۲", lines: ["منتور استارتاپ‌ها در VisaRoads.", "بنیان‌گذار NFTsShip، نخستین پلتفرم و رویداد NFT ایران."] },
        { year: "۲۰۲۴", lines: ["برنامه‌ی شتاب‌دهی Treefrog، انتاریو."] },
        { year: "۲۰۲۵", lines: ["بنیان‌گذار و مدیر ارشد استراتژی AshaVid، تورنتو.", "مسترکلاس ونچر، آکادمی شولیک."] },
        { year: "۲۰۲۶", lines: ["متخصص تحول دیجیتال، دانشکده‌ی کسب‌وکار شولیک، دانشگاه یورک."] },
      ],
    },
    evidence: {
      kicker: "در صحنه",
      photos: [
        { src: "/images/lab/council.jpg", alt: "ارائه‌ی نتایج برنامه در صحن شورای منطقه‌ای یورک", caption: "شورای منطقه‌ای یورک، ارائه‌ی نتایج تیم‌ها" },
        { src: "/images/lab/panel.jpg", alt: "پنل پایانی برنامه‌ی Digital Transformation", caption: "پنل پایانی، تورنتو" },
      ],
    },
    closing: {
      title: "معمولاً یک گفت‌وگوی صادقانه ",
      accent: "برای دیدنش کافی است.",
      body: "تصمیمی را که مدام عقب می‌اندازید بیاورید. با هم، بی‌تعارف، نگاهش می‌کنیم.",
      cta: { label: "رزرو جلسه", href: "/fa/booking" },
    },
  },
}
