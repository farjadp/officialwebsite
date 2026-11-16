// ============================================================================
// File: src/components/v3/case-studies/belink/copy.ts
// Role: Every word of the Belink case study, English and Persian, in one
//       shape so both pages stay structurally identical.
// Rule: figures in prose must match data.ts. Nothing here names a company or
//       a person from the dataset.
// ============================================================================

import type { Locale } from "@/components/home/v3/copy"
import type { CoverageKey } from "./data"
import { CONSENT_TEXT } from "@/lib/case-study-consent"

type Copy = {
    kicker: string
    title: string
    accent: string
    lead: string
    teaser: {
        stats: { value: number; suffix?: string; label: string }[]
        insideKicker: string
        insideTitle: string
        inside: string[]
        privacy: string
        backToPortfolio: string
    }
    form: {
        kicker: string
        title: string
        body: string
        email: string
        emailPlaceholder: string
        name: string
        namePlaceholder: string
        optional: string
        consent: string
        marketing: string
        submit: string
        sending: string
        privacyLink: string
        privacyNote: string
        successTitle: string
        successBody: string
        successAgain: string
        errorGeneric: string
        errorNetwork: string
    }
    report: {
        problemKicker: string
        problemTitle: string
        problem: string[]
        builtKicker: string
        builtTitle: string
        steps: { title: string; body: string }[]
        dataKicker: string
        dataTitle: string
        dataLead: string
        coverageTitle: string
        coverage: Record<CoverageKey, string>
        erasTitle: string
        erasNote: string
        sectorsTitle: string
        sectorsNote: string
        emailTitle: string
        emailCorporate: string
        emailFree: string
        findingsKicker: string
        findingsTitle: string
        findings: { title: string; body: string }[]
        lessonsKicker: string
        lessonsTitle: string
        lessons: string[]
        methodKicker: string
        method: string[]
        print: string
        ctaTitle: string
        ctaAccent: string
        ctaBody: string
        ctaButton: string
        companies: string
        of: string
    }
    expired: {
        title: string
        body: string
        button: string
    }
}

export const COPY: Record<Locale, Copy> = {
    en: {
        kicker: "Case study · Data system",
        title: "Mapping Iran's startup ecosystem:",
        accent: "13,636 companies in one working panel",
        lead: "Belink lists Iran's startups and tech companies one profile at a time. I turned that directory into a cleaned, scored and searchable dataset — and learned what the ecosystem actually looks like when you can see all of it at once.",
        teaser: {
            stats: [
                { value: 13636, label: "company profiles collected and cleaned" },
                { value: 45, suffix: "%", label: "of dated companies were founded in 2014–2018" },
                { value: 410, label: "rows share one email with another company" },
            ],
            insideKicker: "Inside the full case study",
            insideTitle: "What you get by email",
            inside: [
                "The five-stage pipeline: collect, clean, classify, score, work",
                "How complete the directory really is, field by field",
                "The founding wave of 2014–2018, and what came after",
                "The ten largest sectors, and why half the directory has none",
                "Four lessons for anyone turning a public directory into a dataset",
                "Method and caveats — only aggregate figures, no company or contact data",
            ],
            privacy: "The full case study publishes only totals and shares. The company-level panel is private and is not shared.",
            backToPortfolio: "Back to portfolio",
        },
        form: {
            kicker: "Get the case study",
            title: "Sent to your inbox",
            body: "Enter your email and I'll send you a private link to the full case study. It opens in your browser and saves as a PDF.",
            email: "Email",
            emailPlaceholder: "you@company.com",
            name: "Name",
            namePlaceholder: "What should I call you?",
            optional: "optional",
            consent: CONSENT_TEXT.delivery.en,
            marketing: CONSENT_TEXT.marketing.en,
            submit: "Email me the case study",
            sending: "Sending…",
            privacyLink: "Privacy policy",
            privacyNote: "One email with one link. Nothing else unless you tick the second box.",
            successTitle: "Check your inbox",
            successBody: "If {email} can receive mail, the link is on its way. It can take a minute — check spam or promotions if it doesn't show up.",
            successAgain: "Use a different address",
            errorGeneric: "Something went wrong. Please try again.",
            errorNetwork: "Couldn't reach the site. Check your connection and try again.",
        },
        report: {
            problemKicker: "01 · The problem",
            problemTitle: "A directory you can only read one page at a time",
            problem: [
                "Belink is the closest thing Iran's tech scene has to a shared register: thousands of startups, accelerators and co-working spaces, each with a profile.",
                "But a directory answers one question — tell me about this company. It cannot answer the questions a mentor, investor or partner actually asks: how many, in which fields, founded when, reachable how, and which of them are worth a conversation first.",
            ],
            builtKicker: "02 · What I built",
            builtTitle: "Five stages from directory to dataset",
            steps: [
                { title: "Collect", body: "Every public company profile, captured in full — 13,636 rows, 13,415 distinct names." },
                { title: "Clean", body: "Phones and emails normalised and validated; each email classed as company domain or free-mail; emails used by more than one company flagged." },
                { title: "Classify", body: "Belink's own sector and sub-sector tags kept as fields; founding years checked and anything outside 1970–2026 set aside." },
                { title: "Score", body: "A transparent rule-based score sorts every row into hot, warm, cold or skip, with a manual override and a written reason — rescored in one click when the rules change." },
                { title: "Work", body: "A bilingual panel with filters, table and card views, tags, bulk copy and filtered CSV export — one of six linked panels covering accelerators and investors, Canadian businesses, employers and labour demand." },
            ],
            dataKicker: "03 · What the data shows",
            dataTitle: "The ecosystem, all at once",
            dataLead: "Every figure below is a total or a share across the whole snapshot. No company is named.",
            coverageTitle: "How complete is each field?",
            coverage: {
                address: "Street address",
                website: "Website",
                phone: "Phone",
                email: "Email",
                sector: "Sector",
                instagram: "Instagram",
                founders: "Founders listed",
                telegram: "Telegram",
                linkedin: "LinkedIn",
            },
            erasTitle: "When were they founded?",
            erasNote: "Of 10,199 companies with a valid founding year. Peak year: 2016, with 1,111.",
            sectorsTitle: "Largest sectors",
            sectorsNote: "Top ten of 384 sector labels, among the 6,229 companies that have one.",
            emailTitle: "Whose email is it?",
            emailCorporate: "On the company's own domain",
            emailFree: "Free-mail (Gmail, Yahoo …)",
            findingsKicker: "04 · Findings",
            findingsTitle: "Four things the directory doesn't tell you",
            findings: [
                { title: "One founding wave", body: "45% of companies with a known year were founded between 2014 and 2018. Only 350 — 3.4% — date from 2022 or later. Part of that is listing lag, but the wave is unmistakable." },
                { title: "Half the map is unlabelled", body: "Only 46% of profiles carry a sector and a quarter list their founders. Any analysis by industry speaks for less than half of the ecosystem." },
                { title: "Reachable — mostly", body: "Two in three profiles have an email, three in four a website. But one in six (2,119) offers no email, phone or website at all." },
                { title: "Names lie, emails don't", body: "410 rows share an email with another company — holding groups, agencies and renamed firms. De-duplicating on name alone would have kept them all." },
            ],
            lessonsKicker: "05 · Lessons",
            lessonsTitle: "What I'd tell anyone doing this",
            lessons: [
                "A directory is not a dataset. Most of the value is in the cleaning, not the collecting.",
                "De-duplicate on the contact route, not the name.",
                "Score in the open: simple rules, a written reason, and a human override beat a clever black box.",
                "Decide early what stays private. The working panel holds contact data; what goes public is aggregates only.",
            ],
            methodKicker: "Method & caveats",
            method: [
                "Source: public company profiles on belink.ir, captured in a 2026 snapshot (13,636 rows).",
                "A field counts as present when it is non-empty; it was not verified to work.",
                "Founding years outside 1970–2026 were excluded (10,199 valid). Recent years are under-counted while new companies wait to be listed.",
                "City is not reported: most addresses omit it.",
                "No company, person or contact detail from the dataset is published here.",
            ],
            print: "Save as PDF",
            ctaTitle: "Have a messy directory of your own?",
            ctaAccent: "Let's turn it into decisions.",
            ctaBody: "I help founders and teams turn scattered data into something they can act on — and use AI where it actually helps.",
            ctaButton: "Book a conversation",
            companies: "companies",
            of: "of",
        },
        expired: {
            title: "This link has expired or isn't valid",
            body: "Reading links are personal and last 30 days. Ask for a fresh one — it takes a few seconds.",
            button: "Get a new link",
        },
    },
    fa: {
        kicker: "کیس‌استادی · سامانه‌ی داده",
        title: "نقشه‌ی اکوسیستم استارتاپی ایران:",
        accent: "۱۳٬۶۳۶ شرکت در یک پنل کاری",
        lead: "بلینک استارتاپ‌ها و شرکت‌های فناوری ایران را تک‌تک و پروفایل‌به‌پروفایل نشان می‌دهد. من این فهرست را به یک دیتاست پاک‌شده، امتیازدار و قابل جست‌وجو تبدیل کردم و دیدم وقتی کل اکوسیستم را یک‌جا ببینی، واقعاً چه شکلی دارد.",
        teaser: {
            stats: [
                { value: 13636, label: "پروفایل شرکت، جمع‌آوری و پاک‌سازی‌شده" },
                { value: 45, suffix: "٪", label: "از شرکت‌های دارای سال تأسیس، بین ۲۰۱۴ تا ۲۰۱۸ ساخته شده‌اند" },
                { value: 410, label: "ردیف، ایمیلشان با یک شرکت دیگر مشترک است" },
            ],
            insideKicker: "در نسخه‌ی کامل کیس‌استادی",
            insideTitle: "آنچه با ایمیل می‌گیرید",
            inside: [
                "خط تولید پنج‌مرحله‌ای: جمع‌آوری، پاک‌سازی، دسته‌بندی، امتیازدهی، کار",
                "این فهرست واقعاً چقدر کامل است، فیلد به فیلد",
                "موج تأسیس ۲۰۱۴ تا ۲۰۱۸ و آنچه بعد از آن آمد",
                "ده حوزه‌ی بزرگ، و اینکه چرا نیمی از فهرست حوزه ندارد",
                "چهار درس برای هر کسی که می‌خواهد یک فهرست عمومی را به دیتاست تبدیل کند",
                "روش و محدودیت‌ها؛ فقط ارقام تجمیعی، بدون هیچ داده‌ی شرکت یا تماس",
            ],
            privacy: "نسخه‌ی کامل فقط جمع‌ها و درصدها را منتشر می‌کند. پنل در سطح شرکت خصوصی است و در اختیار کسی قرار نمی‌گیرد.",
            backToPortfolio: "بازگشت به نمونه‌کارها",
        },
        form: {
            kicker: "دریافت کیس‌استادی",
            title: "به صندوق ایمیل شما",
            body: "ایمیلتان را وارد کنید تا یک لینک خصوصی به نسخه‌ی کامل برایتان بفرستم. در مرورگر باز می‌شود و می‌توانید PDF بگیرید.",
            email: "ایمیل",
            emailPlaceholder: "you@company.com",
            name: "نام",
            namePlaceholder: "چه صدایتان کنم؟",
            optional: "اختیاری",
            consent: CONSENT_TEXT.delivery.fa,
            marketing: CONSENT_TEXT.marketing.fa,
            submit: "کیس‌استادی را برایم بفرست",
            sending: "در حال ارسال…",
            privacyLink: "سیاست حریم خصوصی",
            privacyNote: "یک ایمیل با یک لینک. اگر گزینه‌ی دوم را نزنید، چیز دیگری نمی‌آید.",
            successTitle: "صندوق ایمیلتان را ببینید",
            successBody: "اگر {email} ایمیل دریافت می‌کند، لینک در راه است. ممکن است یکی دو دقیقه طول بکشد؛ اگر نیامد، پوشه‌ی اسپم یا تبلیغات را هم نگاه کنید.",
            successAgain: "با ایمیل دیگری",
            errorGeneric: "مشکلی پیش آمد. لطفاً دوباره امتحان کنید.",
            errorNetwork: "به سایت وصل نشد. اتصال اینترنت را بررسی کنید و دوباره امتحان کنید.",
        },
        report: {
            problemKicker: "۰۱ · مسئله",
            problemTitle: "فهرستی که فقط صفحه‌به‌صفحه خوانده می‌شود",
            problem: [
                "بلینک نزدیک‌ترین چیزی است که اکوسیستم فناوری ایران به یک ثبت مشترک دارد: هزاران استارتاپ، شتاب‌دهنده و فضای کار اشتراکی، هر کدام با یک پروفایل.",
                "اما یک فهرست فقط به یک سؤال جواب می‌دهد: «درباره‌ی این شرکت بگو». به سؤال‌هایی که منتور، سرمایه‌گذار یا شریک واقعاً می‌پرسد جواب نمی‌دهد: چند تا، در چه حوزه‌هایی، از چه سالی، از چه راهی در دسترس، و با کدام‌شان اول باید حرف زد.",
            ],
            builtKicker: "۰۲ · آنچه ساختم",
            builtTitle: "پنج مرحله از فهرست تا دیتاست",
            steps: [
                { title: "جمع‌آوری", body: "همه‌ی پروفایل‌های عمومی شرکت‌ها، کامل؛ ۱۳٬۶۳۶ ردیف با ۱۳٬۴۱۵ نام متمایز." },
                { title: "پاک‌سازی", body: "تلفن‌ها و ایمیل‌ها یکدست و اعتبارسنجی شدند؛ هر ایمیل به «دامنه‌ی خود شرکت» یا «ایمیل رایگان» دسته‌بندی شد؛ ایمیل‌هایی که چند شرکت با هم دارند علامت خوردند." },
                { title: "دسته‌بندی", body: "حوزه و زیرحوزه‌ی خود بلینک به‌صورت فیلد نگه داشته شد؛ سال‌های تأسیس بررسی شد و هر چه بیرون از ۱۹۷۰ تا ۲۰۲۶ بود کنار رفت." },
                { title: "امتیازدهی", body: "یک امتیاز شفاف و قاعده‌محور هر ردیف را در یکی از چهار دسته‌ی داغ، گرم، سرد یا ردشده می‌گذارد؛ با امکان تغییر دستی و ثبت دلیل، و با یک کلیک دوباره محاسبه می‌شود." },
                { title: "کار", body: "یک پنل دوزبانه با فیلتر، نمای جدولی و کارتی، تگ، کپی دسته‌جمعی و خروجی CSV فیلترشده؛ یکی از شش پنل به‌هم‌پیوسته برای شتاب‌دهنده‌ها و سرمایه‌گذاران، کسب‌وکارهای کانادا، کارفرماها و تقاضای بازار کار." },
            ],
            dataKicker: "۰۳ · داده چه می‌گوید",
            dataTitle: "اکوسیستم، یک‌جا",
            dataLead: "همه‌ی ارقام زیر جمع یا درصد کل نسخه‌ی ثبت‌شده است. نام هیچ شرکتی نیامده.",
            coverageTitle: "هر فیلد چقدر پر است؟",
            coverage: {
                address: "نشانی",
                website: "وب‌سایت",
                phone: "تلفن",
                email: "ایمیل",
                sector: "حوزه",
                instagram: "اینستاگرام",
                founders: "نام مؤسسان",
                telegram: "تلگرام",
                linkedin: "لینکدین",
            },
            erasTitle: "کی تأسیس شده‌اند؟",
            erasNote: "از ۱۰٬۱۹۹ شرکتی که سال تأسیس معتبر دارند. سال اوج: ۲۰۱۶ با ۱٬۱۱۱ شرکت.",
            sectorsTitle: "بزرگ‌ترین حوزه‌ها",
            sectorsNote: "ده حوزه‌ی اول از ۳۸۴ برچسب، میان ۶٬۲۲۹ شرکتی که حوزه دارند.",
            emailTitle: "ایمیل مال کیست؟",
            emailCorporate: "روی دامنه‌ی خود شرکت",
            emailFree: "ایمیل رایگان (جیمیل، یاهو و…)",
            findingsKicker: "۰۴ · یافته‌ها",
            findingsTitle: "چهار چیزی که فهرست به شما نمی‌گوید",
            findings: [
                { title: "یک موج تأسیس", body: "۴۵٪ شرکت‌هایی که سال تأسیسشان معلوم است بین ۲۰۱۴ و ۲۰۱۸ ساخته شده‌اند. فقط ۳۵۰ شرکت (۳٫۴٪) مال ۲۰۲۲ به بعد است. بخشی از این فاصله تأخیر در ثبت است، ولی موج کاملاً پیداست." },
                { title: "نیمی از نقشه برچسب ندارد", body: "فقط ۴۶٪ پروفایل‌ها حوزه دارند و یک‌چهارم نام مؤسسان را آورده‌اند. هر تحلیلی بر اساس صنعت، درباره‌ی کمتر از نیمی از اکوسیستم حرف می‌زند." },
                { title: "در دسترس، بیشترشان", body: "دو سوم پروفایل‌ها ایمیل دارند و سه‌چهارم وب‌سایت. ولی از هر شش پروفایل یکی (۲٬۱۱۹ مورد) نه ایمیل دارد، نه تلفن، نه وب‌سایت." },
                { title: "نام‌ها گول می‌زنند، ایمیل‌ها نه", body: "۴۱۰ ردیف ایمیلشان با شرکت دیگری مشترک است: هلدینگ‌ها، آژانس‌ها و شرکت‌هایی که اسم عوض کرده‌اند. حذف تکراری‌ها فقط بر اساس نام، همه‌شان را نگه می‌داشت." },
            ],
            lessonsKicker: "۰۵ · درس‌ها",
            lessonsTitle: "اگر کسی بخواهد همین کار را بکند، این را می‌گویم",
            lessons: [
                "فهرست، دیتاست نیست. بیشترِ ارزش در پاک‌سازی است، نه در جمع‌آوری.",
                "تکراری‌ها را بر اساس راه تماس حذف کنید، نه نام.",
                "امتیازدهی را شفاف نگه دارید: قاعده‌ی ساده، دلیل نوشته‌شده و امکان تصمیم انسانی، از یک جعبه‌سیاه هوشمند بهتر است.",
                "از اول تصمیم بگیرید چه چیزی خصوصی می‌ماند. پنل کاری داده‌ی تماس دارد؛ آنچه عمومی می‌شود فقط ارقام تجمیعی است.",
            ],
            methodKicker: "روش و محدودیت‌ها",
            method: [
                "منبع: پروفایل‌های عمومی شرکت‌ها در belink.ir، در نسخه‌ای که سال ۲۰۲۶ ثبت شد (۱۳٬۶۳۶ ردیف).",
                "یک فیلد وقتی «پر» حساب شده که خالی نباشد؛ درست‌بودن یا کارکردنش بررسی نشده.",
                "سال‌های تأسیس بیرون از ۱۹۷۰ تا ۲۰۲۶ کنار گذاشته شد (۱۰٬۱۹۹ سال معتبر). سال‌های اخیر کم‌شماری دارند، چون شرکت‌های تازه هنوز ثبت نشده‌اند.",
                "شهر گزارش نشده، چون بیشتر نشانی‌ها شهر را ندارند.",
                "هیچ شرکت، فرد یا اطلاعات تماسی از این دیتاست اینجا منتشر نشده است.",
            ],
            print: "ذخیره به‌صورت PDF",
            ctaTitle: "شما هم یک فهرست شلوغ دارید؟",
            ctaAccent: "بیایید آن را به تصمیم تبدیل کنیم.",
            ctaBody: "به بنیان‌گذاران و تیم‌ها کمک می‌کنم داده‌های پراکنده را به چیزی تبدیل کنند که بشود بر اساسش عمل کرد، و هوش مصنوعی را جایی به کار ببرند که واقعاً کمک می‌کند.",
            ctaButton: "رزرو گفت‌وگو",
            companies: "شرکت",
            of: "از",
        },
        expired: {
            title: "این لینک منقضی شده یا معتبر نیست",
            body: "لینک‌های خواندن شخصی‌اند و ۳۰ روز اعتبار دارند. یک لینک تازه بگیرید؛ چند ثانیه بیشتر طول نمی‌کشد.",
            button: "گرفتن لینک تازه",
        },
    },
}
