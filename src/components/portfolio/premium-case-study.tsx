import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Bot,
    Briefcase,
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Compass,
    Eye,
    FileSearch,
    FileText,
    Handshake,
    Home,
    Layers3,
    Mic,
    MoveRight,
    Network,
    Quote,
    School,
    Sparkles,
    Target,
    Waypoints
} from "lucide-react";

type Locale = "en" | "fa";

type PremiumCaseStudyPageProps = {
    locale?: Locale;
    viewCount: number;
};

type CaseStudyCopy = {
    backLabel: string;
    backHref: string;
    title: string;
    subtitle: string;
    introKicker: string;
    sectionNavLabel: string;
    meta: {
        industry: string;
        projectType: string;
        timeline: string;
        role: string;
    };
    snapshot: { label: string; value: string }[];
    story: {
        eyebrow: string;
        title: string;
        paragraphs: string[];
        takeaway: string;
    };
    product: {
        eyebrow: string;
        title: string;
        intro: string;
        features: string[];
    };
    challenge: {
        eyebrow: string;
        title: string;
        intro: string;
        points: string[];
    };
    diagnosis: {
        eyebrow: string;
        title: string;
        intro: string;
        cards: { title: string; body: string }[];
    };
    critique: {
        eyebrow: string;
        title: string;
        intro: string;
        missingTitle: string;
        changeTitle: string;
        missing: string[];
        change: string[];
    };
    proposal: {
        eyebrow: string;
        title: string;
        intro: string;
        pillars: { title: string; body: string }[];
    };
    execution: {
        eyebrow: string;
        title: string;
        intro: string;
        phases: { title: string; body: string }[];
    };
    impact: {
        eyebrow: string;
        title: string;
        intro: string;
        outcomes: string[];
        quote: string;
    };
    lessons: {
        eyebrow: string;
        title: string;
        items: string[];
    };
    cta: {
        title: string;
        body: string;
        action: string;
        href: string;
    };
};

const COPY: Record<Locale, CaseStudyCopy> = {
    en: {
        backLabel: "Back to Portfolio",
        backHref: "/portfolio",
        title: "From Product to Market: How I Helped a PropTech Team Redefine Its Go-To-Market Strategy",
        subtitle:
            "A premium advisory case study on diagnosing the real bottleneck behind an ambitious AI-powered real estate product: market-entry clarity, not technical capability.",
        introKicker: "HereState Case Study",
        sectionNavLabel: "On this page",
        meta: {
            industry: "PropTech",
            projectType: "Advisory / GTM Strategy / Strategic Diagnosis",
            timeline: "2026",
            role: "Strategic Advisor"
        },
        snapshot: [
            { label: "Startup", value: "HereState" },
            { label: "Industry", value: "Canadian PropTech" },
            { label: "Stage", value: "Early-stage / pre-growth" },
            { label: "Core challenge", value: "Unclear go-to-market strategy" },
            { label: "My role", value: "Strategic advisor" },
            { label: "Focus areas", value: "GTM, B2B strategy, pitch narrative, digital direction" }
        ],
        story: {
            eyebrow: "Story / Context",
            title: "The conversation started with a founder outreach. The real issue surfaced within minutes.",
            paragraphs: [
                "I had posted a public offer to help Iranian founders in Canada think more clearly about strategy, positioning, and execution. A number of people reached out. Most were still in vague idea territory. This one was different.",
                "In the first conversation, it was obvious that the team was technically strong. They were building a real product with real ambition. They had already invested serious energy into the platform, the feature set, and the product vision.",
                "What stood out, though, was that their actual bottleneck was not engineering. The product was moving, but the business logic around market entry was still blurry. They were spending attention in places that felt productive, but were not yet creating real traction."
            ],
            takeaway: "The product was not the main risk. The market-entry logic was."
        },
        product: {
            eyebrow: "The Product",
            title: "What HereState was building",
            intro:
                "HereState was building an AI-powered real estate platform for the Canadian market. The ambition was broad, but coherent: make discovery, decision support, and post-move services feel more intelligent and more integrated.",
            features: [
                "AI-powered property search built around user intent rather than simple listings",
                "Personalized recommendations shaped by preferences, constraints, and life context",
                "A voice assistant layer to make search and decision support more conversational",
                "School and neighborhood intelligence to support practical relocation decisions",
                "A post-move service ecosystem designed to extend value beyond the transaction"
            ]
        },
        challenge: {
            eyebrow: "The Real Challenge",
            title: "The hard part was not product development. It was deciding how the product should enter the market.",
            intro:
                "The startup did not need more abstract ambition. It needed sharper prioritization. The operating pattern at that point was drifting toward activity without a disciplined entry strategy.",
            points: [
                "Too much attention was going into business-plan writing before first-channel clarity existed.",
                "Go-to-market decisions were not prioritized with enough discipline.",
                "Content direction was broad and active, but not anchored to a specific channel strategy.",
                "There was no clear trust-based route into the market.",
                "The team was still treating visibility as a substitute for distribution logic."
            ]
        },
        diagnosis: {
            eyebrow: "My Diagnosis",
            title: "I reframed the problem from product momentum to market-entry design.",
            intro:
                "My role was not to praise the product. It was to identify the hidden constraint behind it. The pattern was familiar: an early-stage team thinking too broadly, too publicly, and too soon.",
            cards: [
                {
                    title: "They were thinking like a B2C brand too early",
                    body: "The instinct was moving toward awareness and public-facing activity before a reliable acquisition path had been defined."
                },
                {
                    title: "Trust mattered more than attention",
                    body: "In a high-trust market such as real estate, broad visibility has less value than access to trusted intermediaries and credible connectors."
                },
                {
                    title: "The product fit a B2B or B2B2C entry path more naturally",
                    body: "The feature set created stronger strategic leverage when framed through partners, brokers, teams, or ecosystem relationships instead of pure direct-to-consumer demand."
                },
                {
                    title: "Random visibility would not solve distribution",
                    body: "Content and online activity without channel logic risked creating noise, not meaningful market access."
                },
                {
                    title: "The narrative was not yet ready for serious conversations",
                    body: "The deck had information, but the story was not sharp enough to support investor, partner, or strategic-channel discussions."
                }
            ]
        },
        critique: {
            eyebrow: "Pitch Deck Critique",
            title: "The deck had material, but not enough market-entry logic.",
            intro:
                "The issue was not a total absence of effort. It was that the pitch still behaved like a collection of slides rather than a disciplined strategic narrative.",
            missingTitle: "What was missing",
            changeTitle: "What needed to change",
            missing: [
                "Visual quality and coherence were below the level needed for a trust-sensitive strategic conversation.",
                "Slide order did not create a strong narrative arc.",
                "Feature explanation was doing more work than market-entry logic.",
                "The story did not yet build conviction around why this team would gain distribution leverage."
            ],
            change: [
                "Upgrade the visual system so the deck matched the seriousness of the business ambition.",
                "Rebuild the sequence around problem, market reality, entry thesis, and commercial logic.",
                "Move from a feature-heavy story to a sharper investor and partner narrative.",
                "Show why the route to market is credible before asking people to believe in long-term platform scale."
            ]
        },
        proposal: {
            eyebrow: "What I Proposed",
            title: "A three-part strategic shift",
            intro:
                "The recommendation was not cosmetic. It was a directional reset designed to align product, positioning, and distribution around a more credible path.",
            pillars: [
                {
                    title: "Shift from broad B2C thinking to B2B / B2B2C entry",
                    body: "Treat the first stage as a distribution design problem. Enter through partners, industry actors, or trust-rich commercial relationships instead of trying to win the consumer market directly from day one."
                },
                {
                    title: "Build around trust-based channels, not generic content marketing",
                    body: "Use connectors, intermediaries, and relationship-led access points. In this category, trust compounds faster than impressions."
                },
                {
                    title: "Rewrite the market-entry narrative",
                    body: "Align the pitch, messaging, and digital presence around one clear question: why is this the right wedge into the market, and why should serious people believe it?"
                }
            ]
        },
        execution: {
            eyebrow: "Execution Framework",
            title: "A strategic roadmap, not a product roadmap",
            intro:
                "The execution logic focused on reducing ambiguity in stages, so each phase would strengthen the next commercial conversation.",
            phases: [
                {
                    title: "Clarify positioning and identify the first target channel",
                    body: "Narrow the entry thesis, define the most credible buyer or partner path, and remove unnecessary strategic noise."
                },
                {
                    title: "Rebuild the pitch narrative and partner message",
                    body: "Restructure the story so it communicates trust, market logic, and commercial sequencing rather than just capability."
                },
                {
                    title: "Launch B2B outreach and a trust-led digital strategy",
                    body: "Use the new narrative to support targeted outreach, partner conversations, and digital activity tied to actual channel goals."
                }
            ]
        },
        impact: {
            eyebrow: "Outcome / Expected Impact",
            title: "This was an advisory intervention, so the value was strategic clarity.",
            intro:
                "I am not interested in inventing fake success metrics for strategy work. The real output was a more honest and more usable operating direction.",
            outcomes: [
                "Sharper clarity around the real go-to-market bottleneck",
                "A reframed entry strategy grounded in trust and channel logic",
                "Improved prioritization between product, narrative, and distribution",
                "A stronger foundation for founder decision-making",
                "Digital direction better aligned with business reality"
            ],
            quote: "Strong products do not fail only because of weak execution. They often fail because the route into the market was never designed clearly enough."
        },
        lessons: {
            eyebrow: "Key Lessons",
            title: "What founders can learn from this case",
            items: [
                "A strong product is not enough if the path to market is still vague.",
                "Business plans do not replace strategic clarity.",
                "Trust-heavy markets require trust-heavy channels.",
                "Content without channel logic becomes noise.",
                "Early-stage founders need the shortest credible route into the market, not the broadest story."
            ]
        },
        cta: {
            title: "If the product is strong but the route to market is still unclear, that is usually a strategy problem.",
            body: "I help founders create clarity across positioning, go-to-market design, and execution logic.",
            action: "Book a strategy conversation",
            href: "mailto:contact@farjad.me"
        }
    },
    fa: {
        backLabel: "بازگشت به پورتفولیو",
        backHref: "/fa/portfolio",
        title: "از محصول تا بازار: چگونه به یک تیم پراپ‌تک کمک کردم استراتژی ورود به بازارش را بازتعریف کند",
        subtitle:
            "یک case study مشاوره‌ای درباره تشخیص گلوگاه واقعی پشت یک محصول بلندپروازانه‌ی املاک مبتنی بر AI: مسئله، ضعف فنی نبود؛ مسئله، نبودِ شفافیت در ورود به بازار بود.",
        introKicker: "Case Study هیر‌استیت",
        sectionNavLabel: "در این صفحه",
        meta: {
            industry: "پراپ‌تک",
            projectType: "مشاوره / استراتژی GTM / تشخیص استراتژیک",
            timeline: "۲۰۲۶",
            role: "مشاور استراتژیک"
        },
        snapshot: [
            { label: "استارتاپ", value: "HereState" },
            { label: "صنعت", value: "پراپ‌تک کانادا" },
            { label: "مرحله", value: "ابتدایی / پیش از رشد" },
            { label: "چالش اصلی", value: "ابهام در استراتژی ورود به بازار" },
            { label: "نقش من", value: "مشاور استراتژیک" },
            { label: "محور تمرکز", value: "GTM، استراتژی B2B، روایت pitch، جهت‌دهی دیجیتال" }
        ],
        story: {
            eyebrow: "داستان / زمینه",
            title: "گفت‌وگو با یک outreach شروع شد. مسئله‌ی واقعی در همان دقایق اول روشن شد.",
            paragraphs: [
                "من یک پیشنهاد عمومی منتشر کرده بودم تا به بنیان‌گذارهای ایرانی در کانادا برای شفاف‌تر فکر کردن درباره‌ی استراتژی، جایگاه‌یابی و اجرا کمک کنم. افراد مختلفی پیام دادند. بیشترشان هنوز در مرحله‌ی ایده‌های مبهم بودند. این مورد فرق داشت.",
                "در همان گفت‌وگوی اول مشخص بود که تیم از نظر فنی قوی است. آن‌ها واقعا در حال ساختن یک محصول واقعی با جاه‌طلبی بالا بودند. روی پلتفرم، قابلیت‌ها و چشم‌انداز محصول انرژی جدی گذاشته بودند.",
                "اما چیزی که خیلی زود به چشم آمد این بود که گلوگاه اصلی، مهندسی نبود. محصول در حال حرکت بود، ولی منطق ورود به بازار هنوز مبهم بود. بخشی از توجه تیم صرف کارهایی می‌شد که ظاهرا مفید بودند، اما هنوز به traction واقعی منجر نمی‌شدند."
            ],
            takeaway: "ریسک اصلی، خودِ محصول نبود. ریسک اصلی، منطق ورود به بازار بود."
        },
        product: {
            eyebrow: "محصول",
            title: "HereState چه چیزی می‌ساخت",
            intro:
                "HereState در حال ساخت یک پلتفرم املاک مبتنی بر هوش مصنوعی برای بازار کانادا بود. دامنه‌ی ایده وسیع بود، اما بی‌منطق نبود: هوشمندتر کردن فرایند کشف، تصمیم‌گیری و حتی خدمات پس از جابه‌جایی.",
            features: [
                "جست‌وجوی ملک مبتنی بر AI بر پایه‌ی نیت کاربر، نه فقط لیستینگ خام",
                "پیشنهادهای شخصی‌سازی‌شده بر اساس ترجیح، محدودیت و شرایط زندگی",
                "لایه‌ی دستیار صوتی برای تعاملی‌تر کردن جست‌وجو و تصمیم‌سازی",
                "اطلاعات مدرسه و محله برای پشتیبانی از تصمیم‌های واقعیِ جابه‌جایی",
                "اکوسیستم خدمات پس از اسکان برای ادامه‌دادن ارزش بعد از معامله"
            ]
        },
        challenge: {
            eyebrow: "چالش واقعی",
            title: "مسئله‌ی سخت، ساختن محصول نبود؛ تصمیم‌گرفتن برای نحوه‌ی ورود آن به بازار بود.",
            intro:
                "استارتاپ به جاه‌طلبی بیشتر نیاز نداشت. به اولویت‌بندی دقیق‌تر نیاز داشت. الگوی کاری در آن مقطع به سمت فعالیت زیاد بدون استراتژی ورود منسجم حرکت می‌کرد.",
            points: [
                "انرژی زیادی صرف نوشتن business plan شده بود، قبل از آنکه کانال اول ورود روشن شود.",
                "تصمیم‌های go-to-market به اندازه‌ی کافی با انضباط اولویت‌بندی نشده بودند.",
                "جهت‌گیری محتوا گسترده و فعال بود، اما به یک استراتژی کانال مشخص وصل نبود.",
                "مسیر روشنی برای ورود trust-based به بازار وجود نداشت.",
                "تیم هنوز visibility را با منطق توزیع اشتباه می‌گرفت."
            ]
        },
        diagnosis: {
            eyebrow: "تشخیص من",
            title: "من مسئله را از momentum محصول به طراحی ورود به بازار بازتعریف کردم.",
            intro:
                "نقش من تعریف و تمجید از محصول نبود. باید محدودیت پنهانی پشت آن را پیدا می‌کردم. الگو آشنا بود: یک تیم early-stage که بیش از حد زود، بیش از حد گسترده و بیش از حد عمومی فکر می‌کند.",
            cards: [
                {
                    title: "تیم خیلی زود مثل یک برند B2C فکر می‌کرد",
                    body: "حرکت ذهنی تیم به سمت awareness و فعالیت عمومی رفته بود، قبل از اینکه مسیر acquisition قابل اتکایی تعریف شود."
                },
                {
                    title: "در این بازار trust از attention مهم‌تر بود",
                    body: "در بازاری مثل املاک، visibility گسترده ارزش کمتری از دسترسی به واسطه‌های معتبر و connectorهای مورد اعتماد دارد."
                },
                {
                    title: "محصول، ورودی طبیعی‌تری از مسیر B2B یا B2B2C داشت",
                    body: "وقتی این قابلیت‌ها از زاویه‌ی partnerها، brokerها، تیم‌ها یا روابط اکوسیستمی دیده می‌شد، leverage استراتژیک خیلی قوی‌تری ایجاد می‌کرد."
                },
                {
                    title: "visibility تصادفی، مسئله‌ی distribution را حل نمی‌کرد",
                    body: "محتوا و فعالیت آنلاین بدون منطق کانال، بیشتر نویز می‌ساخت تا دسترسی واقعی به بازار."
                },
                {
                    title: "روایت deck هنوز آماده‌ی گفت‌وگوهای جدی نبود",
                    body: "در deck اطلاعات وجود داشت، اما داستان به‌اندازه‌ی کافی sharp نبود که از گفت‌وگوهای سرمایه‌گذار، partner یا channel support کند."
                }
            ]
        },
        critique: {
            eyebrow: "نقد Pitch Deck",
            title: "deck اطلاعات داشت، اما منطق ورود به بازار در آن به‌اندازه‌ی کافی دیده نمی‌شد.",
            intro:
                "مسئله کم‌کاری نبود. مسئله این بود که pitch بیشتر شبیه مجموعه‌ای از اسلایدها عمل می‌کرد تا یک روایت استراتژیک منسجم.",
            missingTitle: "چه چیزی کم بود",
            changeTitle: "چه چیزی باید تغییر می‌کرد",
            missing: [
                "کیفیت بصری و انسجام طراحی برای یک گفت‌وگوی استراتژیک trust-sensitive کافی نبود.",
                "ترتیب اسلایدها arc روایی قدرتمندی نمی‌ساخت.",
                "توضیح featureها بیشتر از منطق market entry کار می‌کرد.",
                "داستان هنوز قانع‌کننده نشان نمی‌داد که این تیم دقیقا از کجا قرار است leverage توزیع به‌دست بیاورد."
            ],
            change: [
                "سیستم بصری باید ارتقا پیدا می‌کرد تا deck با جدیت ambition کسب‌وکار هماهنگ شود.",
                "ترتیب داستان باید حول مسئله، واقعیت بازار، thesis ورود و منطق تجاری بازسازی می‌شد.",
                "روایت باید از feature list به investor / partner story تغییر می‌کرد.",
                "قبل از اینکه از دیگران بخواهد به مقیاس بلندمدت پلتفرم باور کنند، باید credible بودن مسیر ورود را نشان می‌داد."
            ]
        },
        proposal: {
            eyebrow: "پیشنهاد من",
            title: "یک تغییر استراتژیک سه‌لایه",
            intro:
                "پیشنهاد صرفا cosmetic نبود. یک reset جهت‌دار بود تا محصول، positioning و distribution روی یک مسیر معتبرتر align شوند.",
            pillars: [
                {
                    title: "تغییر از ذهنیت broad B2C به ورودی B2B / B2B2C",
                    body: "مرحله‌ی اول باید به‌عنوان مسئله‌ی طراحی توزیع دیده می‌شد. ورود از مسیر partnerها، بازیگران صنعت یا روابط تجاری trust-rich منطقی‌تر از تلاش برای فتح مستقیم بازار مصرف‌کننده از روز اول بود."
                },
                {
                    title: "ساختن بر پایه‌ی کانال‌های trust-based، نه content marketing عمومی",
                    body: "باید از connectorها، واسطه‌ها و نقاط دسترسی relationship-led استفاده می‌شد. در این دسته، trust سریع‌تر از impressionها compound می‌شود."
                },
                {
                    title: "بازنویسی روایت market-entry",
                    body: "pitch، پیام و حضور دیجیتال باید حول یک سوال روشن align می‌شد: چرا این، wedge درست برای ورود به بازار است و چرا آدم‌های جدی باید آن را باور کنند؟"
                }
            ]
        },
        execution: {
            eyebrow: "چارچوب اجرا",
            title: "یک roadmap استراتژیک، نه product roadmap",
            intro:
                "منطق اجرا بر کاهش ابهام به‌صورت مرحله‌ای متمرکز بود تا هر فاز، کیفیت گفت‌وگوی تجاری بعدی را تقویت کند.",
            phases: [
                {
                    title: "شفاف‌سازی positioning و شناسایی اولین کانال هدف",
                    body: "ورود اولیه محدودتر شود، معتبرترین مسیر buyer یا partner تعریف شود و نویزهای استراتژیک حذف شوند."
                },
                {
                    title: "بازسازی روایت pitch و پیام شریک تجاری",
                    body: "داستان باید طوری بازچینش می‌شد که به‌جای صرف capability، منطق بازار، trust و توالی تجاری را منتقل کند."
                },
                {
                    title: "شروع outreach B2B و استراتژی دیجیتال trust-led",
                    body: "روایت جدید باید مبنای outreach هدفمند، گفت‌وگو با partnerها و فعالیت دیجیتالی شود که واقعا به هدف کانال وصل است."
                }
            ]
        },
        impact: {
            eyebrow: "خروجی / اثر مورد انتظار",
            title: "این یک مداخله‌ی مشاوره‌ای بود؛ بنابراین ارزش اصلی، شفافیت استراتژیک بود.",
            intro:
                "من علاقه‌ای به ساختن success metric جعلی برای کار استراتژی ندارم. خروجی واقعی، یک جهت عملیاتی صادقانه‌تر و قابل‌استفاده‌تر بود.",
            outcomes: [
                "شفاف‌تر شدن گلوگاه واقعی در go-to-market",
                "بازتعریف استراتژی ورود بر پایه‌ی trust و منطق کانال",
                "بهبود اولویت‌بندی بین محصول، روایت و distribution",
                "قوی‌تر شدن پایه‌ی تصمیم‌گیری برای founder",
                "هم‌راستاتر شدن جهت دیجیتال با واقعیت کسب‌وکار"
            ],
            quote: "محصول‌های قوی فقط به‌خاطر اجرای ضعیف شکست نمی‌خورند. خیلی وقت‌ها شکست می‌خورند چون مسیر ورودشان به بازار هیچ‌وقت به‌وضوح طراحی نشده است."
        },
        lessons: {
            eyebrow: "درس‌های کلیدی",
            title: "Founderها از این case چه چیزی می‌توانند یاد بگیرند",
            items: [
                "محصول قوی کافی نیست اگر مسیر ورود به بازار هنوز مبهم باشد.",
                "business plan جای clarity استراتژیک را نمی‌گیرد.",
                "بازارهای trust-heavy به کانال‌های trust-heavy نیاز دارند.",
                "محتوا بدون منطق کانال، نویز می‌شود.",
                "founderهای early-stage باید کوتاه‌ترین مسیر معتبر به بازار را پیدا کنند، نه گسترده‌ترین روایت را."
            ]
        },
        cta: {
            title: "اگر محصول قوی است ولی مسیر ورود به بازار هنوز روشن نیست، معمولا با یک مسئله‌ی استراتژی طرف هستید.",
            body: "من به founderها کمک می‌کنم تا در positioning، طراحی go-to-market و منطق اجرا clarity ایجاد کنند.",
            action: "رزرو گفت‌وگوی استراتژیک",
            href: "mailto:contact@farjad.me"
        }
    }
};

const SECTION_IDS = [
    "snapshot",
    "story",
    "product",
    "challenge",
    "diagnosis",
    "critique",
    "proposal",
    "execution",
    "impact",
    "lessons"
] as const;

const SECTION_LABELS: Record<Locale, Record<(typeof SECTION_IDS)[number], string>> = {
    en: {
        snapshot: "Quick Snapshot",
        story: "Story / Context",
        product: "The Product",
        challenge: "The Real Challenge",
        diagnosis: "My Diagnosis",
        critique: "Pitch Deck Critique",
        proposal: "What I Proposed",
        execution: "Execution Framework",
        impact: "Outcome / Expected Impact",
        lessons: "Key Lessons"
    },
    fa: {
        snapshot: "نمای سریع",
        story: "داستان / زمینه",
        product: "محصول",
        challenge: "چالش واقعی",
        diagnosis: "تشخیص من",
        critique: "نقد Pitch Deck",
        proposal: "پیشنهاد من",
        execution: "چارچوب اجرا",
        impact: "خروجی / اثر مورد انتظار",
        lessons: "درس‌های کلیدی"
    }
};

const PRODUCT_ICONS = [Bot, Home, Mic, School, Building2];
const DIAGNOSIS_ICONS = [Building2, Handshake, Network, Compass, FileText];
const PHASE_ICONS = [Compass, FileText, Handshake];

function SectionShell({
    id,
    eyebrow,
    title,
    children
}: {
    id: string;
    eyebrow: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-28 border-t border-stone-200 py-16 md:py-24">
            <div className="mb-10 md:mb-14 max-w-3xl">
                <div className="mb-4 text-xs font-mono uppercase tracking-[0.3em] text-stone-500">{eyebrow}</div>
                <h2 className="font-serif text-3xl leading-tight text-stone-950 md:text-5xl">{title}</h2>
            </div>
            {children}
        </section>
    );
}

export function PremiumCaseStudyPage({
    locale = "en",
    viewCount
}: PremiumCaseStudyPageProps) {
    const copy = COPY[locale];
    const isFa = locale === "fa";
    const BackIcon = isFa ? ArrowRight : ArrowLeft;
    const CTAIcon = isFa ? ChevronLeft : ChevronRight;

    return (
        <article
            className="relative min-h-screen overflow-x-hidden bg-[#F8F5EF] pb-28 font-sans text-stone-700 selection:bg-[#D97706] selection:text-white"
            dir={isFa ? "rtl" : "ltr"}
        >
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <div className="absolute left-[-12%] top-[-10%] h-[32rem] w-[32rem] rounded-full bg-[#D7E6E1] opacity-70 blur-[160px]" />
                <div className="absolute bottom-[-14%] right-[-10%] h-[26rem] w-[26rem] rounded-full bg-[#F3D9BA] opacity-70 blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_36%)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 md:px-10 md:pt-28">
                <div className="mb-12 md:mb-16">
                    <Link
                        href={copy.backHref}
                        className="group inline-flex items-center gap-2 text-sm font-mono text-stone-500 transition-colors hover:text-stone-950"
                    >
                        <BackIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        {copy.backLabel}
                    </Link>
                </div>

                <section className="mb-14 border-b border-stone-200 pb-14 md:mb-18 md:pb-18">
                    <div className="mb-8 flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-stone-300 bg-white/90 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.28em] text-stone-600">
                            {copy.introKicker}
                        </span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.28em] text-emerald-700">
                            {copy.meta.industry}
                        </span>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
                        <div className="max-w-4xl">
                            <h1 className="font-serif text-4xl leading-[1.04] tracking-tight text-stone-950 md:text-6xl xl:text-7xl">
                                {copy.title}
                            </h1>
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-600 md:text-xl">
                                {copy.subtitle}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white/85">
                                <div className="relative aspect-[5/4]">
                                    <Image
                                        src="/images/farjad-business-consultant.png"
                                        alt={isFa ? "تصویر مشاوره کسب‌وکار" : "Business strategy consultant visual"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 300px"
                                        priority={false}
                                    />
                                </div>
                                <div className="border-t border-stone-200 px-4 py-3">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-stone-600">
                                            {isFa ? "Strategy" : "Strategy"}
                                        </span>
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-700">
                                            {isFa ? "GTM" : "GTM"}
                                        </span>
                                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-amber-700">
                                            {isFa ? "PropTech" : "PropTech"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                <MetaCard icon={<Layers3 className="h-4 w-4" />} label={isFa ? "نوع پروژه" : "Project Type"} value={copy.meta.projectType} />
                                <MetaCard icon={<Calendar className="h-4 w-4" />} label={isFa ? "بازه زمانی" : "Timeline"} value={copy.meta.timeline} />
                                <MetaCard icon={<Briefcase className="h-4 w-4" />} label={isFa ? "نقش من" : "My Role"} value={copy.meta.role} />
                                <MetaCard icon={<Eye className="h-4 w-4" />} label={isFa ? "بازدید" : "Views"} value={viewCount.toLocaleString(isFa ? "fa-IR" : "en-US")} />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
                    <main>
                        <SectionShell id="snapshot" eyebrow={SECTION_LABELS[locale].snapshot} title={isFa ? "خلاصه‌ی سریع کیس" : "A scannable snapshot of the engagement"}>
                            <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-200 sm:grid-cols-2 xl:grid-cols-3">
                                {copy.snapshot.map((item) => (
                                    <div key={item.label} className="bg-[#FFFCF7] p-6 md:p-7">
                                        <div className="mb-3 text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500">
                                            {item.label}
                                        </div>
                                        <div className="text-base leading-7 text-stone-950 md:text-lg">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </SectionShell>

                        <SectionShell id="story" eyebrow={copy.story.eyebrow} title={copy.story.title}>
                            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
                                <div className="max-w-3xl space-y-6 text-lg leading-8 text-stone-700">
                                    {copy.story.paragraphs.map((paragraph) => (
                                        <p key={paragraph}>{paragraph}</p>
                                    ))}
                                </div>
                                <aside className="space-y-4">
                                    <div className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white/80">
                                        <div className="relative aspect-[4/5]">
                                            <Image
                                                src="/images/farjad-startup-advisor.png"
                                                alt={isFa ? "پرتره مشاوره استارتاپ" : "Startup strategy advisor portrait"}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 100vw, 280px"
                                                priority={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="rounded-[1.5rem] border border-stone-200 bg-white/80 p-6 md:p-7">
                                        <Quote className="mb-5 h-5 w-5 text-[#D97706]" />
                                        <p className="font-serif text-2xl leading-9 text-stone-950">{copy.story.takeaway}</p>
                                    </div>
                                </aside>
                            </div>
                        </SectionShell>

                        <SectionShell id="product" eyebrow={copy.product.eyebrow} title={copy.product.title}>
                            <div className="rounded-[1.75rem] border border-stone-200 bg-white/75 p-7 md:p-10">
                                <p className="max-w-3xl text-lg leading-8 text-stone-700">{copy.product.intro}</p>
                                <div className="mt-10 grid gap-4 md:grid-cols-2">
                                    {copy.product.features.map((feature, index) => {
                                        const Icon = PRODUCT_ICONS[index] ?? Sparkles;
                                        return (
                                        <div key={feature} className="rounded-2xl border border-stone-200 bg-[#FFFDF9] p-5">
                                            <div className="flex items-start gap-3">
                                                <Icon className="mt-1 h-4 w-4 shrink-0 text-[#D97706]" />
                                                <p className="leading-7 text-stone-700">{feature}</p>
                                            </div>
                                        </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </SectionShell>

                        <SectionShell id="challenge" eyebrow={copy.challenge.eyebrow} title={copy.challenge.title}>
                            <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/70 p-7 md:p-10">
                                <p className="mb-8 max-w-3xl text-lg leading-8 text-stone-700">{copy.challenge.intro}</p>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {copy.challenge.points.map((point) => (
                                        <div key={point} className="rounded-2xl border border-stone-200 bg-[#FFFDF9] p-5">
                                            <div className="flex items-start gap-3">
                                                <Target className="mt-1 h-4 w-4 shrink-0 text-amber-600" />
                                                <p className="leading-7 text-stone-700">{point}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SectionShell>

                        <SectionShell id="diagnosis" eyebrow={copy.diagnosis.eyebrow} title={copy.diagnosis.title}>
                            <p className="mb-8 max-w-3xl text-lg leading-8 text-stone-600">{copy.diagnosis.intro}</p>
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {copy.diagnosis.cards.map((card, index) => {
                                    const Icon = DIAGNOSIS_ICONS[index] ?? FileSearch;
                                    return (
                                    <div key={card.title} className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/60 p-6 transition-colors hover:border-emerald-300 hover:bg-emerald-50">
                                        <Icon className="mb-5 h-5 w-5 text-emerald-700" />
                                        <h3 className="mb-3 font-serif text-2xl leading-8 text-stone-950">{card.title}</h3>
                                        <p className="leading-7 text-stone-700">{card.body}</p>
                                    </div>
                                    );
                                })}
                            </div>
                        </SectionShell>

                        <SectionShell id="critique" eyebrow={copy.critique.eyebrow} title={copy.critique.title}>
                            <p className="mb-8 max-w-3xl text-lg leading-8 text-stone-600">{copy.critique.intro}</p>
                            <div className="grid gap-6 lg:grid-cols-2">
                                <AuditPanel title={copy.critique.missingTitle} items={copy.critique.missing} />
                                <AuditPanel title={copy.critique.changeTitle} items={copy.critique.change} accent />
                            </div>
                        </SectionShell>

                        <SectionShell id="proposal" eyebrow={copy.proposal.eyebrow} title={copy.proposal.title}>
                            <p className="mb-8 max-w-3xl text-lg leading-8 text-stone-600">{copy.proposal.intro}</p>
                            <div className="grid gap-6 xl:grid-cols-3">
                                {copy.proposal.pillars.map((pillar, index) => (
                                    <div key={pillar.title} className="relative overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white/80 p-7 md:p-8">
                                        <div className="pointer-events-none absolute inset-x-0 top-0 font-serif text-[7rem] leading-none text-stone-950/[0.05] md:text-[8rem]">
                                            {index + 1}
                                        </div>
                                        <div className="relative">
                                            <div className="mb-4 text-xs font-mono uppercase tracking-[0.28em] text-stone-500">
                                                {isFa ? `ستون ${index + 1}` : `Pillar ${index + 1}`}
                                            </div>
                                            <h3 className="mb-4 font-serif text-2xl leading-8 text-stone-950">{pillar.title}</h3>
                                            <p className="leading-7 text-stone-700">{pillar.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionShell>

                        <SectionShell id="execution" eyebrow={copy.execution.eyebrow} title={copy.execution.title}>
                            <p className="mb-10 max-w-3xl text-lg leading-8 text-stone-600">{copy.execution.intro}</p>
                            <div className={`relative space-y-6 ${isFa ? "before:right-3" : "before:left-3"} before:absolute before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-stone-300`}>
                                {copy.execution.phases.map((phase, index) => (
                                    <div key={phase.title} className={`relative ${isFa ? "pr-12" : "pl-12"}`}>
                                        <div className={`absolute top-2 flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 bg-white text-xs font-mono text-stone-700 ${isFa ? "right-0" : "left-0"}`}>
                                            {index + 1}
                                        </div>
                                        <div className="rounded-[1.5rem] border border-stone-200 bg-white/80 p-6 md:p-7">
                                            <div className="mb-4 flex items-center gap-3">
                                                {(() => {
                                                    const Icon = PHASE_ICONS[index] ?? Compass;
                                                    return <Icon className="h-4 w-4 text-[#D97706]" />;
                                                })()}
                                                <h3 className="font-serif text-2xl leading-8 text-stone-950">{phase.title}</h3>
                                            </div>
                                            <p className="leading-7 text-stone-700">{phase.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionShell>

                        <SectionShell id="impact" eyebrow={copy.impact.eyebrow} title={copy.impact.title}>
                            <p className="mb-8 max-w-3xl text-lg leading-8 text-stone-600">{copy.impact.intro}</p>
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                                <div className="rounded-[1.75rem] border border-stone-200 bg-white/80 p-7 md:p-8">
                                    <div className="grid gap-4">
                                        {copy.impact.outcomes.map((outcome) => (
                                            <div key={outcome} className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-[#FFFDF9] p-5">
                                                <MoveRight className="mt-1 h-4 w-4 shrink-0 text-[#D97706]" />
                                                <p className="leading-7 text-stone-700">{outcome}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <aside className="rounded-[1.75rem] border border-[#D97706]/20 bg-[#FFF2E3] p-7 md:p-8">
                                    <Quote className="mb-5 h-5 w-5 text-[#D97706]" />
                                    <p className="font-serif text-2xl leading-9 text-stone-950">{copy.impact.quote}</p>
                                </aside>
                            </div>
                        </SectionShell>

                        <SectionShell id="lessons" eyebrow={copy.lessons.eyebrow} title={copy.lessons.title}>
                            <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/70 p-7 md:p-10">
                                <div className="grid gap-4">
                                    {copy.lessons.items.map((lesson, index) => (
                                        <div key={lesson} className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-[#FFFDF9] p-5">
                                            <div className="min-w-8 text-sm font-mono text-emerald-700">
                                                {(index + 1).toString().padStart(2, "0")}
                                            </div>
                                            <p className="leading-7 text-stone-700">{lesson}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SectionShell>

                        <section className="border-t border-stone-200 py-16 md:py-24">
                            <div className="rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(249,246,240,0.92))] p-8 md:p-12">
                                <div className="mb-4 text-xs font-mono uppercase tracking-[0.3em] text-stone-500">CTA</div>
                                <h2 className="max-w-4xl font-serif text-3xl leading-tight text-stone-950 md:text-5xl">
                                    {copy.cta.title}
                                </h2>
                                <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">{copy.cta.body}</p>
                                <a
                                    href={copy.cta.href}
                                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                                >
                                    {copy.cta.action}
                                    <CTAIcon className="h-4 w-4" />
                                </a>
                            </div>
                        </section>
                    </main>

                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-5">
                            <div className="rounded-[1.5rem] border border-stone-200 bg-white/85 p-6">
                                <div className="mb-5 text-xs font-mono uppercase tracking-[0.28em] text-stone-500">
                                    {copy.sectionNavLabel}
                                </div>
                                <nav className="space-y-2">
                                    {SECTION_IDS.map((id) => (
                                        <a
                                            key={id}
                                            href={`#${id}`}
                                            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950"
                                        >
                                            <span>{SECTION_LABELS[locale][id]}</span>
                                            {isFa ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            <div className="rounded-[1.5rem] border border-stone-200 bg-[#FFFDF9] p-6">
                                <div className="mb-4 text-xs font-mono uppercase tracking-[0.28em] text-stone-500">
                                    {isFa ? "لنز استراتژیک" : "Strategic Lens"}
                                </div>
                                <div className="space-y-4 text-sm leading-7 text-stone-600">
                                    <MetaLine icon={<Compass className="h-4 w-4" />} text={isFa ? "ورود به بازار قبل از توسعه‌ی awareness عمومی باید شفاف شود." : "Market entry must be clarified before public-awareness activity scales."} />
                                    <MetaLine icon={<Waypoints className="h-4 w-4" />} text={isFa ? "کانال مناسب در این بازار بر پایه‌ی trust ساخته می‌شود." : "The right channel in this market is trust-based."} />
                                    <MetaLine icon={<Network className="h-4 w-4" />} text={isFa ? "روایت pitch باید با منطق distribution align شود." : "The pitch narrative has to align with the distribution logic."} />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
}

function MetaCard({
    icon,
    label,
    value
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-stone-200 bg-white/85 p-4">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
                {icon}
                <span>{label}</span>
            </div>
            <div className="text-sm leading-6 text-stone-950">{value}</div>
        </div>
    );
}

function AuditPanel({
    title,
    items,
    accent = false
}: {
    title: string;
    items: string[];
    accent?: boolean;
}) {
    return (
        <div className={`rounded-[1.75rem] border p-7 md:p-8 ${accent ? "border-[#D97706]/20 bg-[#FFF2E3]" : "border-stone-200 bg-white/85"}`}>
            <div className="mb-5 text-xs font-mono uppercase tracking-[0.28em] text-stone-500">{title}</div>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-[#FFFDF9] p-4">
                        <div className={`mt-1 h-2 w-2 rounded-full ${accent ? "bg-[#D97706]" : "bg-stone-500"}`} />
                        <p className="font-mono text-sm leading-7 text-stone-700">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MetaLine({
    icon,
    text
}: {
    icon: ReactNode;
    text: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1 text-stone-500">{icon}</div>
            <p>{text}</p>
        </div>
    );
}
