// ============================================================================
// Hardware Source: data.ts
// Version: 3.1.0 — 2026-09-25
// Why: Static content payload provider for unified portfolio (Persian locale).
//      The prose is Persian; `category`, `status` and `visibility` stay English
//      because they are keys, not copy — their labels live per-locale in
//      components/v3/pages/portfolio.tsx. ids, order and structure match
//      src/app/(public)/portfolio/data.ts exactly.
// Env / Identity: TypeScript Module
// ============================================================================

export type PortfolioCategory =
    | "My Startups"
    | "Companies & Ventures"
    | "GitHub Projects";

export const CATEGORIES: PortfolioCategory[] = [
    "My Startups",
    "Companies & Ventures",
    "GitHub Projects"
];

export type PortfolioItem = {
    id: string;
    title: string;
    category: PortfolioCategory;
    role: string;
    summary: string;
    problem?: string;
    contribution?: string;
    outcome?: string;
    techStack?: string[];
    github?: string;
    link?: string;
    visibility?: "Public" | "Private";
    tags?: string[];
    yearRange?: string;

    // Case Study Specifics
    diagnosis?: string;
    proposedStrategy?: string[];
    executionSteps?: { title: string; description: string }[];
    lessons?: string[];
};

export const FOUNDER_JOURNEY = [
    {
        name: "North Road AI",
        role: "بنیان‌گذار",
        years: "۲۰۲۴ تاکنون",
        status: "Active",
        statusLabel: "استارتاپ فعلی",
        description: [
            "North Road AI کسب‌وکاری است که سامانه‌های مبتنی بر هوش مصنوعی می‌سازد تا بنیان‌گذاران تصمیم‌های استراتژیک روشن‌تری بگیرند و استارتاپشان را بهتر اداره کنند.",
            "ایده از سال‌ها کار با استارتاپ‌های مرحله‌ی اولیه بیرون آمد؛ جایی که یک الگوی ساختاری مدام تکرار می‌شد: اولویت‌های مبهم، اطلاعات پراکنده، چارچوب‌های ضعیف تصمیم‌گیری و بنیان‌گذارانی که زیر بار پیچیدگی عملیات خم شده بودند.",
            "تمرکز پروژه روی ابزارهای کاربردی است: روشن کردن جهت استراتژیک، ساختار دادن به تصمیم‌های پیچیده، تحلیل بازار، اداره‌ی عملیات و کم کردن بار ذهنی تیم‌های مرحله‌ی اولیه."
        ]
    },
    {
        name: "AI Cardia",
        role: "بنیان‌گذار",
        years: "۲۰۲۵ تاکنون",
        status: "Building",
        statusLabel: "در حال ساخت (جذب هم‌بنیان‌گذار)",
        description: [
            "AI Cardia یک ایده‌ی فناوری سلامت است که از هوش مصنوعی برای تشخیص زودهنگام و پایش بیماری‌های قلبی‌عروقی استفاده می‌کند.",
            "پروژه بررسی می‌کند که تحلیل داده، یادگیری ماشین و دانش پزشکی چطور می‌توانند به ساخت ابزارهایی برای مراقبت پیشگیرانه و فعال کمک کنند."
        ]
    },
    {
        name: "Rootopia",
        role: "بنیان‌گذار",
        years: "۲۰۲۵",
        status: "Dead",
        statusLabel: "بسته‌شده، فاز تحقیق بازار",
        description: [
            "Rootopia استارتاپی در حوزه‌ی کشاورزی عمودی و کشاورزی پایدار است؛ با هدف تولید سبزی‌های برگی بدون سم در سامانه‌های کشت سرپوشیده‌ی کنترل‌شده.",
            "این کسب‌وکار بررسی می‌کند که هوش مصنوعی، محیط‌های کنترل‌شده و فناوری نوین کشاورزی چطور می‌توانند از تولید غذای محلی برای بازارهای شهری پشتیبانی کنند."
        ]
    },
    {
        name: "ColonyNova",
        role: "بنیان‌گذار",
        years: "۲۰۲۴",
        status: "Dead",
        statusLabel: "بسته‌شده، پس از MVP",
        description: [
            "ColonyNova کسب‌وکاری در جریان است که مدل‌های تازه‌ای از شتاب‌دهی استارتاپ، همکاری و زیست‌بوم‌های نوآوری را بررسی می‌کند.",
            "تمرکز پروژه روی این است که بنیان‌گذاران، پژوهشگران و فناوران چطور می‌توانند در محیط‌های ساختارمند برای ساخت کسب‌وکارهای تازه و ایده‌های آزمایشی با هم کار کنند."
        ]
    },
    {
        name: "ArtOkids",
        role: "بنیان‌گذار",
        years: "۲۰۲۲ تا ۲۰۲۳",
        status: "Dead",
        statusLabel: "بسته‌شده، فاز تحقیق بازار",
        description: [
            "ArtOkids پلتفرمی خلاقانه بود برای پیوند دادن کودکان، خلاقیت و محیط‌های یادگیری دیجیتال. ایده این بود که ابزارهای هنری و آموزشی در اختیار کودکان قرار بگیرد تا تخیل و تفکر خلاقشان رشد کند.",
            "این کسب‌وکار تقاطع آموزش، خلاقیت و پلتفرم‌های دیجیتال را کاوید."
        ]
    },
    {
        name: "Bleesta",
        role: "بنیان‌گذار",
        years: "پیش‌تر",
        status: "Done",
        statusLabel: "پایان‌یافته",
        description: [
            "Bleesta به‌عنوان ایده‌ی یک پلتفرم دیجیتال برای خدمات آنلاین امروزی و تعامل‌های پلتفرمی ساخته شد. پروژه ساختارهای مقیاس‌پذیر محصول دیجیتال و طراحی پلتفرم کاربرمحور را بررسی کرد.",
            "Bleesta بخشی از تلاشی گسترده‌تر برای آزمودن ایده‌های تازه‌ی محصول و زیست‌بوم‌های دیجیتال بود."
        ]
    },
    {
        name: "Arch North Land",
        role: "بنیان‌گذار",
        years: "پیش‌تر",
        status: "Done",
        statusLabel: "پایان‌یافته",
        description: [
            "Arch North Land پروژه‌ای بود برای بررسی نسبت میان معماری، توسعه‌ی شهری و پلتفرم‌های دیجیتال امروزی.",
            "ایده روی ترکیب تفکر معمارانه با مدل‌های تازه‌ی کسب‌وکار برای خدمات توسعه‌ی زمین و طراحی شهری تمرکز داشت."
        ]
    },
    {
        name: "2bHiTech",
        role: "بنیان‌گذار",
        years: "پیش‌تر",
        status: "Done",
        statusLabel: "پایان‌یافته",
        description: [
            "2bHiTech یک اقدام فناورانه‌ی اولیه بود برای ساخت ابزارها و پلتفرم‌های دیجیتال در دوره‌ی رشد زیست‌بوم آنلاین. کار شامل تجربه‌ی توسعه‌ی نرم‌افزار، زیرساخت دیجیتال و خدمات اینترنتی مرحله‌ی اولیه بود.",
            "این پروژه کاوشی زودهنگام در ساختار و اداره‌ی شرکت‌های فناوری بود."
        ]
    },
    {
        name: "OrganicHub",
        role: "بنیان‌گذار",
        years: "پیش‌تر",
        status: "Acquired",
        statusLabel: "واگذارشده، فروش به سرمایه‌گذار",
        description: [
            "OrganicHub پلتفرمی بود با تمرکز بر سامانه‌های غذایی پایدار و زنجیره‌های تأمین کشاورزی سالم‌تر. هدف این بود که بررسی شود تولید محلی و توزیع هوشمندتر چطور می‌تواند محصولات ارگانیک را در دسترس‌تر کند.",
            "این پروژه به من کمک کرد تقاطع سامانه‌های غذایی، فناوری و بازارگاه‌های جامعه‌محور را بشناسم."
        ]
    }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
    // --- 1. Companies & Ventures ---
    {
        id: "ashavid",
        title: "AshaVid",
        category: "Companies & Ventures",
        role: "بنیان‌گذار و مدیر ارشد استراتژی",
        summary: "پلتفرم منتورشیپ استراتژیک برای بنیان‌گذاران مهاجری که کسب‌وکارشان را در کانادا بزرگ می‌کنند.",
        visibility: "Public",
        contribution: "تز اصلی کسب‌وکار، استراتژی GTM و چارچوب‌های ساختارمند منتورشیپ بنیان‌گذاران را ساختم تا بنیان‌گذاران مهاجر پیش از افتادن در دام مشاوران سودجوی مهاجرت، جای درست را پیدا کنند.",
        outcome: "یک مجموعه‌ی مشاوره و پلتفرم دیجیتال سودده که از شرکت‌های SUV در مراحل اولیه‌ی تورنتو پشتیبانی می‌کند.",
        tags: ["استراتژی کسب‌وکار", "تمرکز بر SUV", "تحول دیجیتال"],
        link: "https://ashavid.com"
    },
    {
        id: "dpf",
        title: "Developer Persian Front (DPF)",
        category: "Companies & Ventures",
        role: "بنیان‌گذار و مدیر",
        summary: "پلتفرمی آموزشی برای پر کردن فاصله‌ی میان آموزش تئوری و مهندسی عملی، ویژه‌ی توسعه‌دهندگان فارسی‌زبان.",
        visibility: "Public",
        problem: "برنامه‌ی درسی دانشگاه‌ها در خاورمیانه پیوسته ناتوان از تربیت توسعه‌دهنده‌ی آماده‌ی صنعت بود.",
        contribution: "برنامه‌ی آموزشی را طراحی و بزرگ کردم، معماری پلتفرم را ساختم و جامعه‌ای از مهندسان نرم‌افزار را پروراندم.",
        outcome: "بیش از ۳٬۰۰۰ توسعه‌دهنده آموزش دیدند و بسیاری از آن‌ها امروز مهندس میان‌رده تا ارشد در قطب‌های فناوری جهان هستند.",
        tags: ["آموزش دیجیتال", "رشد جامعه", "React"],
    },
    {
        id: "hofin",
        title: "HoFin",
        category: "Companies & Ventures",
        role: "هم‌بنیان‌گذار",
        summary: "طرحی فین‌تکی برای ساخت زیرساخت استاندارد تراکنش‌های دیجیتال.",
        visibility: "Private",
        contribution: "لایه‌ی نخست هماهنگ‌سازی پرداخت را در MVP معماری کردم و پروتکل‌های امنیتی آن را طراحی کردم.",
        outcome: "امکان‌پذیری ایده‌ی اولیه اثبات شد و پیش از کناره‌گیری من، چند همکاری آزمایشی نهایی شد.",
        tags: ["فین‌تک", "درگاه پرداخت", "Node.js"],
    },
    {
        id: "abr-arvan",
        title: "زیرساخت ابری ملی",
        category: "Companies & Ventures",
        role: "مدیر ارشد فنی",
        summary: "نخستین طرح زیرساخت رایانش ابری با پشتیبانی دولت در ایران.",
        visibility: "Private",
        problem: "کشور توان رایانش ابری مستقل نداشت و به‌طور کامل به شبکه‌های بیرونی و آسیب‌پذیر تکیه می‌کرد.",
        contribution: "یک بخش مهندسی بزرگ را هدایت کردم تا ذخیره‌سازی شیئی مقیاس‌پذیر، گره‌های محاسباتی توزیع‌شده و یک لایه‌ی هایپروایزر امن را از صفر طراحی کند.",
        outcome: "شبکه‌ی پایه راه‌اندازی شد، روزانه میلیون‌ها درخواست را پاسخ می‌داد و تأخیر اپلیکیشن‌های داخلی را به‌طور محسوسی کم کرد.",
        tags: ["معماری ابری", "سامانه‌های توزیع‌شده", "Go", "Kubernetes"],
    },
    {
        id: "raf",
        title: "آژانس تبلیغاتی RAF",
        category: "Companies & Ventures",
        role: "مدیر هنری",
        summary: "آژانسی شناخته‌شده در حوزه‌ی دیجیتال و خلاقیت که کمپین‌هایی در مقیاس ملی تولید می‌کرد.",
        visibility: "Public",
        contribution: "چارچوب‌های تبلیغات سنتی را به قیف‌های دیجیتال نتیجه‌محور تبدیل کردم و اصول UI/UX را مستقیم وارد خلق آگهی کردم.",
        outcome: "نگه‌داشت کاربر در ده‌ها دارایی دیجیتال مشتریان بالا رفت و چرخه‌ی تحویل خلاقانه‌ی آژانس نو شد.",
        tags: ["مدیریت خلاقیت", "UI/UX", "استراتژی دیجیتال"],
    },
    {
        id: "ministry-industry",
        title: "وزارت صنعت و معادن",
        category: "Companies & Ventures",
        role: "مشاور فنی",
        summary: "تحول دیجیتال شبکه‌های لجستیک قدیمی دولتی.",
        visibility: "Private",
        contribution: "مسیرهای کاغذی چنددهه‌ای و معماری یکپارچه‌ی مِین‌فریم‌های IBM را ممیزی کردم و به‌جای آن‌ها میکروسرویس‌های امروزی و چابک پیشنهاد دادم.",
        outcome: "چرخه‌ی گزارش‌گیری زنجیره‌ی تأمین از چند هفته به چند ساعت رسید.",
        tags: ["معماری سازمانی", "مشاوره", "نوسازی سامانه‌های قدیمی"],
    },
    {
        id: "visaroads",
        title: "VisaRoads",
        category: "Companies & Ventures",
        role: "منتور استارتاپ",
        summary: "مجموعه‌ای تخصصی که پرونده‌ی بنیان‌گذاران فناوری را در برنامه‌ی استارتاپ ویزای کانادا پیش می‌برد و به آن‌ها منتورشیپ می‌دهد.",
        visibility: "Public",
        problem: "بنیان‌گذاران با مهارت فنی قوی می‌آمدند، اما هیچ درکی از استراتژی ورود به بازار آمریکای شمالی و انتظارهای سرمایه‌گذار نداشتند.",
        contribution: "برنامه‌ی آموزشی ساخت pitch deck، اعتبارسنجی تناسب محصول و بازار و ساختاردهی کسب‌وکار در آمریکای شمالی را تدوین کردم.",
        outcome: "ده‌ها تیم بنیان‌گذار منتور شدند، شانس تأیید پرونده‌شان بالا رفت و برای درآمدزایی واقعی پس از ورود آماده شدند.",
        tags: ["منتورشیپ", "استراتژی GTM", "ارائه به سرمایه‌گذار"],
        link: "https://visaroads.com"
    },
    {
        id: "vania-it",
        title: "VaniaIT",
        category: "Companies & Ventures",
        role: "راهکار سازمانی، توسعه و برنامه‌نویسی",
        summary: "ارائه‌دهنده‌ی راهکارهای سازمانی؛ جایی که پورتال‌های شاخص متعددی را برای شرکت‌های بزرگ ایرانی توسعه دادم و برنامه‌نویسی کردم (۲۰۱۰ تا ۲۰۱۵).",
        visibility: "Public",
        contribution: "راهکارها و پورتال‌های وب در سطح سازمانی را معماری و برنامه‌نویسی کردم و پایه‌ی دیجیتال چند نهاد بزرگ را گذاشتم.",
        tags: ["نرم‌افزار سازمانی", "پورتال وب", "مهندسی نرم‌افزار"],
    },
    {
        id: "herestate",
        title: "HereState",
        category: "Companies & Ventures",
        role: "مشاور استراتژیک",
        summary: "مطالعه‌ی موردی یک مشاوره درباره‌ی کمک به یک تیم پراپ‌تک برای بازتعریف ورود به بازار، روشن کردن جایگاه‌یابی و هم‌راستا کردن بلندپروازی محصول با یک مسیر GTM معتبر.",
        visibility: "Public",
        yearRange: "2026",
        problem: "یک تیم فنیِ قوی در پراپ‌تک کانادا در حال ساخت یک پلتفرم بلندپروازانه‌ی املاک مبتنی بر هوش مصنوعی بود، اما گلوگاه اصلی آن‌ها خودِ محصول نبود؛ ابهام در منطق ورود به بازار بود.",
        diagnosis: "محصول خیلی زود شبیه یک بازی B2C دیده می‌شد، در حالی‌که مسیر قوی‌تر، ورود اعتمادمحور از جنس B2B یا B2B2C بود؛ همراه با روایت دقیق‌تر در ارائه، اولویت‌بندی بهتر و منطق روشن‌تر توزیع.",
        outcome: "شفافیت استراتژیک در مورد ورود به بازار ایجاد شد، جهت GTM بازتعریف شد و ارائه، پیام و استراتژی دیجیتال با واقعیت کسب‌وکار هم‌راستا شدند.",
        proposedStrategy: [
            "تغییر از نگاه گسترده‌ی B2C به یک نقطه‌ی ورود B2B یا B2B2C.",
            "ساختن بر پایه‌ی کانال‌های اعتمادمحور به‌جای فعالیت محتوایی عمومی.",
            "بازنویسی روایت ورود به بازار تا ارائه، پیام و توزیع همگی از یک تز واحد پشتیبانی کنند."
        ],
        executionSteps: [
            {
                title: "روشن کردن نقطه‌ی ورود اولیه",
                description: "تعریف نخستین کانال معتبر، محدود کردن جایگاه‌یابی و پایان دادن به اشتباه گرفتن دیده‌شدن با استراتژی."
            },
            {
                title: "بازسازی روایت",
                description: "بازچینش دک و داستان استراتژیک بر محور اعتماد، منطق کانال و توالی تجاری."
            },
            {
                title: "فعال‌سازی ارتباط‌گیری اعتمادمحور",
                description: "استفاده از روایت تازه برای ارتباط‌گیری B2B، گفت‌وگو با شریک‌ها و جهت‌گیری دیجیتال منضبط‌تر."
            }
        ],
        lessons: [
            "محصول قوی به‌تنهایی کافی نیست اگر منطق ورود به بازار ضعیف باشد.",
            "طرح کسب‌وکار جای شفافیت در GTM را نمی‌گیرد.",
            "بازارهایی که بر اعتماد بنا شده‌اند، به کانال‌های اعتمادمحور نیاز دارند."
        ],
        tags: ["پراپ‌تک", "استراتژی GTM", "تشخیص استراتژیک", "روایت ارائه", "B2B"],
    },
    // --- CATEGORY: GITHUB PROJECTS ---
    {
        id: "officialwebsite",
        title: "وب‌سایت شخصی فرجاد",
        category: "GitHub Projects",
        role: "مالک محصول و سازنده",
        summary: "پلتفرم تحریریه و نمونه‌کار شخصی برای ارائه‌ی یادداشت‌ها، خدمات و کارهای منتخب.",
        problem: "به بستری سریع و درجه‌یک نیاز داشتم تا یادداشت‌ها، پروژه‌ها و نمونه‌کارهایم را با ظاهری درخور منتشر کنم.",
        techStack: ["TypeScript", "Next.js", "React", "Tailwind"],
        github: "https://github.com/farjadp/officialwebsite",
        visibility: "Public",
        tags: ["معماری", "فرانت‌اند"]
    },
    {
        id: "course-creation-agent",
        title: "ایجنت ساخت دوره‌ی آموزشی",
        category: "GitHub Projects",
        role: "پروژه‌ی فنی",
        summary: "سامانه‌ی تولید محتوای چندایجنتی با Google ADK و پروتکل A2A.",
        techStack: ["Python", "Google ADK", "LLMs"],
        github: "https://github.com/farjadp/course-creation-agent",
        visibility: "Public",
        tags: ["چندایجنتی", "هوش مصنوعی"]
    },
    {
        id: "nabzx",
        title: "NabzX",
        category: "GitHub Projects",
        role: "پروژه‌ی فنی",
        summary: "سامانه‌ی تحلیل گفتمان با رویکرد پژوهش‌محور، بر پایه‌ی سیگنال‌های رفتاری و ساختار تعامل.",
        techStack: ["TypeScript", "Data Pipelines"],
        github: "https://github.com/farjadp/nabzx",
        visibility: "Public",
        tags: ["مهندسی داده", "تحلیل"]
    },
    {
        id: "visachee",
        title: "VisaChee",
        category: "GitHub Projects",
        role: "سازنده",
        summary: "نمونه‌ی اولیه‌ی رباتی برای ارزیابی پرونده‌ی مهاجرت.",
        techStack: ["Python", "Telegram API"],
        github: "https://github.com/farjadp/VisaChee",
        visibility: "Public",
        tags: ["نمونه‌سازی", "خودکارسازی"]
    },
    {
        id: "startupstoryscale",
        title: "Startup Story Scale",
        category: "GitHub Projects",
        role: "سازنده",
        summary: "ایده‌ای برای سنجش آمادگی روابط عمومی و برآورد زمان‌بندی در استارتاپ‌ها.",
        techStack: ["TypeScript", "Algorithms"],
        github: "https://github.com/farjadp/startupstoryscale",
        visibility: "Private",
        tags: ["ابزارسازی", "روابط عمومی"]
    },
    {
        id: "nft-ship",
        title: "پروتکل NFTsShip",
        category: "GitHub Projects",
        role: "مشارکت‌کننده‌ی اصلی",
        summary: "کاوشی در مراحل اولیه برای استانداردسازی قراردادهای هوشمند انتشار NFT.",
        visibility: "Public",
        contribution: "بازنویسی‌های استاندارد توکن را با Solidity نوشتم و MVP رابط mint را با React ساختم.",
        tags: ["Web3", "Solidity", "React", "DApp"],
        github: "https://github.com/farjadp/nfts-ship"
    },
    {
        id: "parscalendar",
        title: "Pars Calendar، اپلیکیشن iOS",
        category: "GitHub Projects",
        role: "سازنده و معمار",
        summary: "اپلیکیشن بومی iOS که تقویم‌های تاریخی ایران (جلالی و زرتشتی) را به دستگاه‌های امروزی می‌آورد.",
        visibility: "Public",
        problem: "تقویم‌های فارسی موجود پر از تبلیغات، بدساخت یا درباره‌ی جشن‌های کهن زرتشتی نادرست بودند.",
        contribution: "یک اپلیکیشن SwiftUI با اولویت کار آفلاین ساختم، با الگوریتم‌های دقیق محاسبات نجومی برای سال‌های کبیسه.",
        outcome: "ابزاری تمیز و بدون تبلیغات که ارزش فرهنگی عمیقی را با تجربه‌ی کاربری امروزی ارائه می‌کند.",
        tags: ["SwiftUI", "iOS", "الگوریتم"],
        github: "https://github.com/farjadp/parscalendar"
    },
    {
        id: "imedica",
        title: "داشبورد بیماران iMedica",
        category: "GitHub Projects",
        role: "توسعه‌دهنده‌ی ارشد رابط کاربری",
        summary: "رابط داشبوردی با امنیت بالا برای مدیریت بیماران کلینیک.",
        visibility: "Private",
        contribution: "فرانت‌اند Next.js را توسعه دادم، با تمرکز کامل بر الگوهای پوشاندن داده در سمت کلاینت مطابق HIPAA.",
        tags: ["Next.js", "سلامت", "TailwindCSS"],
    },
    {
        id: "preventix",
        title: "MVP موبایل Preventix",
        category: "GitHub Projects",
        role: "معمار موبایل",
        summary: "نمونه‌ی اولیه‌ی پایش سلامت پیشگیرانه، طراحی‌شده برای انتشار چندسکویی.",
        visibility: "Private",
        contribution: "اسکلت React Native را برپا کردم و نمودارهای اصلی نمایش داده‌های زیستی را با D3.js ساختم.",
        tags: ["React Native", "D3.js", "فناوری سلامت"],
    },
    {
        id: "searchnestlab",
        title: "جعبه‌ابزار سئوی SearchNestLab",
        category: "GitHub Projects",
        role: "سازنده‌ی فول‌استک",
        summary: "مجموعه‌ای داخلی از اسکریپت‌ها برای خودکار کردن ممیزی‌های دقیق سئو برای مشتریان آژانس.",
        visibility: "Public",
        contribution: "اسکرپرهای Python نوشتم تا نمره‌های Lighthouse را جمع کند و صفحه‌های یتیم را در نقشه‌های سایت بزرگ پیدا کند.",
        tags: ["Python", "سئو", "خودکارسازی"],
        github: "https://github.com/farjadp/searchnestlab"
    },
    {
        id: "nextjs-boilerplate",
        title: "بویلرپلیت سازمانی Next.js",
        category: "GitHub Projects",
        role: "پدیدآورنده",
        summary: "نقطه‌ی شروعی آزموده برای اپلیکیشن‌های بزرگ Next.js.",
        visibility: "Public",
        contribution: "قواعد سخت‌گیرانه‌ی ESLint، پیکربندی Prettier، هوک‌های Husky و یک معماری ماژولار Tailwind را در یک قالب جمع کردم.",
        tags: ["Next.js", "ابزارسازی", "معماری"],
        github: "https://github.com/farjadp/nextjs-boilerplate"
    },
    {
        id: "react-native-auth",
        title: "احراز هویت با Deep Link در React Native",
        category: "GitHub Projects",
        role: "پژوهشگر",
        summary: "مخزنی آزمایشی برای سنجش ماندگاری پیچیده‌ی وضعیت در جریان‌های deep link مربوط به OAuth در iOS.",
        visibility: "Public",
        tags: ["React Native", "OAuth", "امنیت"],
        github: "https://github.com/farjadp/react-native-auth"
    },
    {
        id: "agentic-ai-scraper",
        title: "اسکرپر مبتنی بر ایجنت هوش مصنوعی",
        category: "GitHub Projects",
        role: "پدیدآورنده",
        summary: "ایجنت مرورگر بدون‌رابط با Python که می‌تواند در shadow DOM حرکت کند و پشت دیوارهای ورود، داده ثبت کند.",
        visibility: "Private",
        tags: ["Python", "Playwright", "ایجنت هوش مصنوعی"],
    },
    {
        id: "svelte-portfolio",
        title: "نمونه‌کار مینیمال Svelte",
        category: "GitHub Projects",
        role: "طراح و توسعه‌دهنده",
        summary: "آزمودن کارایی SvelteKit با ساخت یک تولیدکننده‌ی نمونه‌کار ایستا که حس بدون‌جاوااسکریپت می‌دهد.",
        visibility: "Public",
        tags: ["SvelteKit", "کارایی", "طراحی رابط"],
        github: "https://github.com/farjadp/svelte-portfolio"
    }
];
