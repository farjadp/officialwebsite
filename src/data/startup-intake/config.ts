// ============================================================================
// Startup Intake — typed question config with country adaptation
// All applicant-facing text is Persian. Country-specific variants reference
// real local programs (Startup Denmark, Business Finland, Startup Estonia,
// Türkiye Tech Visa, Dutch Startup Visa/RVO, Canada SUV).
// ============================================================================

export const INTAKE_COUNTRIES = ["dk", "fi", "ee", "tr", "nl", "ca"] as const
export type IntakeCountry = (typeof INTAKE_COUNTRIES)[number]

export interface CountryInfo {
    id: IntakeCountry
    nameFa: string
    flag: string
}

export const COUNTRIES: CountryInfo[] = [
    { id: "dk", nameFa: "دانمارک", flag: "🇩🇰" },
    { id: "fi", nameFa: "فنلاند", flag: "🇫🇮" },
    { id: "ee", nameFa: "استونی", flag: "🇪🇪" },
    { id: "tr", nameFa: "ترکیه", flag: "🇹🇷" },
    { id: "nl", nameFa: "هلند", flag: "🇳🇱" },
    { id: "ca", nameFa: "کانادا", flag: "🇨🇦" },
]

export function countryInfo(id: string): CountryInfo | undefined {
    return COUNTRIES.find((c) => c.id === id)
}

export interface IntakeQuestion {
    id: string
    text: string
    hint?: string
    /** Country-specific replacement for `text` */
    countryText?: Partial<Record<IntakeCountry, string>>
    /** Country-specific replacement for `hint` */
    countryHint?: Partial<Record<IntakeCountry, string>>
}

export interface IntakeSection {
    id: string
    title: string
    questions: IntakeQuestion[]
}

export function questionText(q: IntakeQuestion, country: IntakeCountry | null): string {
    if (country && q.countryText?.[country]) return q.countryText[country] as string
    return q.text
}

export function questionHint(q: IntakeQuestion, country: IntakeCountry | null): string | undefined {
    if (country && q.countryHint?.[country]) return q.countryHint[country] as string
    return q.hint
}

export const INTAKE_SECTIONS: IntakeSection[] = [
    {
        id: "problem",
        title: "۱. مشکل و ارزش پیشنهادی (Problem–Solution Fit)",
        questions: [
            {
                id: "problem-what",
                text: "دقیقاً چه مشکلی را حل می‌کنید؟",
                hint: "یک جمله، نه پاراگراف",
            },
            {
                id: "problem-current",
                text: "الان مشتری این مشکل را چطور حل می‌کند؟",
                hint: "راه‌حل فعلی چیست — دستی، رقیب، یا اصلاً حل نمی‌شود؟",
            },
            {
                id: "problem-why-now",
                text: "چرا الان؟ چرا این مشکل تا حالا حل نشده یا بد حل شده؟",
            },
            {
                id: "problem-evidence",
                text: "شواهد دارید که این مشکل واقعی و بزرگ است؟",
                hint: "مصاحبه با مشتری، داده صنعتی، حادثه واقعی",
            },
        ],
    },
    {
        id: "product",
        title: "۲. محصول (جزئیات فنی و کاربردی)",
        questions: [
            {
                id: "product-what",
                text: "محصول دقیقاً چیست؟ سخت‌افزار، نرم‌افزار، یا هر دو؟",
            },
            {
                id: "product-mvp",
                text: "MVP چیست؟ همین الان چه چیزی ساخته شده یا قابل دمو است؟",
            },
            {
                id: "product-stack",
                text: "Tech stack و معماری اصلی چیست؟",
                hint: "مثلاً نوع سنسورها، پروتکل انتقال داده، مدل‌های تحلیلی، پلتفرم نرم‌افزاری",
            },
            {
                id: "product-data",
                text: "چه داده‌ای جمع می‌کنید و چطور به بینش (insight) تبدیل می‌شود؟",
            },
            {
                id: "product-moat",
                text: "IP یا مزیت فنی دفاع‌پذیر (defensible moat) چیست؟",
                hint: "patent، الگوریتم اختصاصی، داده انحصاری؟",
            },
            {
                id: "product-stage",
                text: "محصول در چه مرحله‌ای است؟",
                hint: "concept / prototype / pilot / revenue",
            },
            {
                id: "product-limits",
                text: "محدودیت‌های فعلی محصول چیست؟",
                hint: "صادقانه — چون سرمایه‌گذار حتماً می‌پرسد",
            },
        ],
    },
    {
        id: "market",
        title: "۳. مشتری و بازار هدف",
        questions: [
            {
                id: "market-icp",
                text: "مشتری ایده‌آل شما دقیقاً کیست؟",
            },
            {
                id: "market-pilot",
                text: "اولین مشتری واقعی (pilot customer) کیست یا چه کسی را هدف گرفته‌اید؟",
            },
            {
                id: "market-size",
                text: "اندازه بازار چقدر است؟",
                hint: "TAM/SAM/SOM — حتی تخمین اولیه",
            },
            {
                id: "market-geo",
                text: "چرا کشور/منطقه انتخابی نقطه شروع خوبی است؟",
                countryText: {
                    dk: "چرا دانمارک/اسکاندیناوی نقطه شروع خوبی برای شماست؟",
                    fi: "چرا فنلاند/اروپای شمالی نقطه شروع خوبی برای شماست؟",
                    ee: "چرا استونی/بالتیک نقطه شروع خوبی برای شماست؟",
                    tr: "چرا ترکیه/منطقه اوراسیا نقطه شروع خوبی برای شماست؟",
                    nl: "چرا هلند/اروپای غربی نقطه شروع خوبی برای شماست؟",
                    ca: "چرا کانادا/آمریکای شمالی نقطه شروع خوبی برای شماست؟",
                },
                countryHint: {
                    dk: "به بازار اسکاندیناوی، دسترسی به اتحادیه اروپا و اکوسیستم Startup Denmark فکر کنید.",
                    fi: "به Business Finland، خوشه دریایی (Maritime cluster)، دانشگاه Aalto و رویداد Slush اشاره کنید.",
                    ee: "به Startup Estonia، برنامه e-Residency و دانشگاه TalTech فکر کنید.",
                    tr: "به بازار بزرگ داخلی ترکیه، Teknopark İstanbul و حمایت‌های KOSGEB/TÜBİTAK فکر کنید.",
                    nl: "به RVO، دانشگاه TU Delft، شتاب‌دهنده HighTechXL و موقعیت لجستیکی هلند در اروپا فکر کنید.",
                    ca: "به برنامه Start-up Visa، سازمان‌های Designated و اکوسیستم MaRS تورنتو فکر کنید.",
                },
            },
        ],
    },
    {
        id: "competition",
        title: "۴. رقبا و تمایز",
        questions: [
            {
                id: "comp-who",
                text: "رقبای مستقیم و غیرمستقیم چه کسانی هستند؟",
            },
            {
                id: "comp-why-you",
                text: "چرا مشتری شما را به‌جای رقیب انتخاب می‌کند؟",
                hint: "سرعت، دقت، هزینه، پوشش؟",
            },
            {
                id: "comp-barrier",
                text: "Barrier to entry برای رقبای جدید چیست؟",
            },
        ],
    },
    {
        id: "business-model",
        title: "۵. مدل درآمدی (Business Model)",
        questions: [
            {
                id: "bm-revenue",
                text: "چطور پول درمی‌آورید؟",
                hint: "اشتراک SaaS، فروش سخت‌افزار + نصب، قرارداد پروژه‌ای، لایسنس داده؟",
            },
            {
                id: "bm-pricing",
                text: "قیمت‌گذاری تقریبی چیست؟",
            },
            {
                id: "bm-unit-econ",
                text: "Unit economics اولیه چیست؟",
                hint: "هزینه هر واحد، هزینه نگهداری، حاشیه سود تخمینی",
            },
            {
                id: "bm-sales-cycle",
                text: "چرخه فروش چقدر طول می‌کشد؟",
                hint: "B2B صنعتی معمولاً کند است",
            },
        ],
    },
    {
        id: "team",
        title: "۶. تیم و اجرا",
        questions: [
            {
                id: "team-roles",
                text: "هرکس دقیقاً چه نقشی دارد و چرا او؟",
                hint: "Founder-market fit",
            },
            {
                id: "team-gaps",
                text: "شکاف‌های تیمی چیست؟",
                hint: "مثلاً نیاز به فروش صنعتی یا دیتاساینتیست؟",
            },
            {
                id: "team-runway",
                text: "Runway فعلی و نیاز مالی برای ۱۲–۱۸ ماه آینده چقدر است؟",
            },
            {
                id: "team-milestones",
                text: "Milestone های کلیدی ۶، ۱۲ و ۲۴ ماه آینده چیست؟",
            },
        ],
    },
    {
        id: "destination",
        title: "۷. مخصوص کشور مقصد",
        questions: [
            {
                id: "dest-why",
                text: "چرا این کشور به‌عنوان مقر ثبت انتخاب شده؟",
                hint: "نه فقط ویزا — توجیه بیزینسی واقعی",
                countryText: {
                    dk: "چرا دانمارک به‌عنوان مقر ثبت انتخاب شده؟",
                    fi: "چرا فنلاند به‌عنوان مقر ثبت انتخاب شده؟",
                    ee: "چرا استونی به‌عنوان مقر ثبت انتخاب شده؟",
                    tr: "چرا ترکیه به‌عنوان مقر ثبت انتخاب شده؟",
                    nl: "چرا هلند به‌عنوان مقر ثبت انتخاب شده؟",
                    ca: "چرا کانادا به‌عنوان مقر ثبت انتخاب شده؟",
                },
                countryHint: {
                    dk: "نه فقط ویزا — توجیه بیزینسی واقعی. هیئت Startup Denmark دقیقاً همین را ارزیابی می‌کند.",
                    fi: "نه فقط ویزا — توجیه بیزینسی واقعی. Business Finland در ارزیابی Startup Permit همین را می‌سنجد.",
                    ee: "نه فقط ویزا — توجیه بیزینسی واقعی. کمیته Startup Estonia همین را بررسی می‌کند؛ e-Residency به‌تنهایی کافی نیست.",
                    tr: "نه فقط ویزا — توجیه بیزینسی واقعی. ارزیابان Türkiye Tech Visa به مدل تجاری واقعی اهمیت می‌دهند.",
                    nl: "نه فقط ویزا — توجیه بیزینسی واقعی. Facilitator هلندی و RVO باید طرح شما را تأیید کنند.",
                    ca: "نه فقط ویزا — توجیه بیزینسی واقعی. سازمان‌های Designated برنامه SUV دقیقاً همین را ارزیابی می‌کنند.",
                },
            },
            {
                id: "dest-hiring",
                text: "برنامه استخدام محلی چیست؟",
                countryText: {
                    dk: "برنامه استخدام محلی در دانمارک چیست؟",
                    fi: "برنامه استخدام محلی در فنلاند چیست؟",
                    ee: "برنامه استخدام محلی در استونی چیست؟",
                    tr: "برنامه استخدام محلی در ترکیه چیست؟",
                    nl: "برنامه استخدام محلی در هلند چیست؟",
                    ca: "برنامه استخدام محلی در کانادا چیست؟",
                },
                countryHint: {
                    dk: "Startup Denmark ایجاد شغل محلی را جدی می‌بیند — برنامه واقعی ارائه دهید.",
                    fi: "Business Finland ایجاد اشتغال در فنلاند را یکی از معیارهای اصلی می‌داند.",
                    ee: "Startup Estonia رشد تیم محلی را در تمدید اقامت جدی می‌بیند.",
                    tr: "نهادهای حامی مثل KOSGEB و Teknopark İstanbul به استخدام نیروی محلی اهمیت می‌دهند.",
                    nl: "RVO و Facilitator هلندی به تعهد شما برای ایجاد شغل محلی توجه می‌کنند.",
                    ca: "برنامه SUV کانادا ایجاد شغل برای کانادایی‌ها را از اهداف اصلی خود می‌داند.",
                },
            },
            {
                id: "dest-ecosystem",
                text: "چه ارتباطی با اکوسیستم کشور مقصد دارید یا برنامه‌ریزی کرده‌اید؟",
                countryText: {
                    dk: "چه ارتباطی با اکوسیستم دانمارک دارید یا برنامه‌ریزی کرده‌اید؟",
                    fi: "چه ارتباطی با اکوسیستم فنلاند دارید یا برنامه‌ریزی کرده‌اید؟",
                    ee: "چه ارتباطی با اکوسیستم استونی دارید یا برنامه‌ریزی کرده‌اید؟",
                    tr: "چه ارتباطی با اکوسیستم ترکیه دارید یا برنامه‌ریزی کرده‌اید؟",
                    nl: "چه ارتباطی با اکوسیستم هلند دارید یا برنامه‌ریزی کرده‌اید؟",
                    ca: "چه ارتباطی با اکوسیستم کانادا دارید یا برنامه‌ریزی کرده‌اید؟",
                },
                countryHint: {
                    dk: "هاب‌ها و برنامه‌های واقعی را نام ببرید — مثل Startup Denmark و اکوسیستم کپنهاگ.",
                    fi: "برنامه‌های واقعی را نام ببرید — Business Finland، دانشگاه Aalto، رویداد Slush، خوشه دریایی.",
                    ee: "برنامه‌های واقعی را نام ببرید — Startup Estonia، e-Residency، دانشگاه TalTech.",
                    tr: "برنامه‌های واقعی را نام ببرید — Teknopark İstanbul، KOSGEB، TÜBİTAK.",
                    nl: "برنامه‌های واقعی را نام ببرید — TU Delft، HighTechXL، RVO.",
                    ca: "برنامه‌های واقعی را نام ببرید — MaRS، سازمان‌های Designated برنامه SUV.",
                },
            },
        ],
    },
]

/** All known question ids (server-side validation allowlist). */
export const ALL_QUESTION_IDS: string[] = INTAKE_SECTIONS.flatMap((s) =>
    s.questions.map((q) => q.id)
)

export interface IntakeFounder {
    name: string
    role: string
    email: string
    phone?: string
    linkedin?: string
    photoUrl?: string
}

export interface IntakeFile {
    url: string
    name: string
    size: number
}

export interface IntakeFiles {
    logo?: IntakeFile
    pitchDeck?: IntakeFile
    documents?: IntakeFile[]
}

/** Convert latin digits in a string/number to Persian digits. */
export function faDigits(value: number | string): string {
    return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])
}
