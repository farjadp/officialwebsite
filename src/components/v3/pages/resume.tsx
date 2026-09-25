// ============================================================================
// File Path: src/components/v3/pages/resume.tsx
// Why: /resume and /fa/resume in the v3 "Light" look, one component for both
//      locales. Every role, date, bullet and credential is carried over word
//      for word from the v2 pages; only the look changed.
//
//      PRINT: this page is printed / saved as PDF (globals.css holds the A4
//      @media print rules and keeps #resume-content). On screen it is the
//      dark v3 page; in print every surface is forced white and every text
//      dark, decorations (beam, spotlight, light rail, dots) drop out, and
//      all motion is neutralised on #resume-content (`print:**:opacity-100!`
//      and `print:**:transform-none!`) so Reveal content that was never
//      scrolled into view still prints fully visible.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
import { Globe, Mail, MapPin, Phone } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { DownloadResumeButton } from "@/app/(public)/resume/download-button"
import { Beam, CtaBand, Headline, LightRule, Reveal, Spotlight, V3Button } from "@/components/v3/kit"

// ─── Types ──────────────────────────────────────────────────────────────────

type Job = { company: string; location: string; period: string; duration: string; role: string; bullets: string[] }
type Edu = { degree: string; institution: string; year: string; notes: string[] }
type Course = { title: string; institution: string; date: string }

type Copy = {
  bar: { name: string; tagline: string; hire: string; download: string }
  header: { monogram: string; name: string; title: string; location: string; phone: string; email: string; site: string }
  photoCaption: string
  labels: {
    about: string
    skills: string
    languages: string
    links: string
    experience: string
    education: string
    certification: string
    courses: string
  }
  about: string[]
  skills: string[]
  languages: { name: string; level: string; percent: number }[]
  links: { label: string; value: string; href: string }[]
  jobs: Job[]
  education: Edu[]
  courses: Course[]
  iso: { title: string; institution: string; year: string; bullets: string[] }
  printFooter: string
  cta: { title: string; body: string; book: string }
}

// ─── Copy ───────────────────────────────────────────────────────────────────

const PRINT_FOOTER = "farjadp.info · farjadp@live.com · +1 437 661 1674 · linkedin.com/in/farjadpourmohammad"

const COPY: Record<Locale, Copy> = {
  en: {
    bar: { name: "Farjad P.D.", tagline: "— Strategy Thinker & Systems Builder", hire: "Hire Me", download: "Download PDF" },
    header: {
      monogram: "F | P",
      name: "FARJAD P.D",
      title: "Strategy Thinker",
      location: "Newmarket, ON, Canada",
      phone: "+1 437 661 1674",
      email: "farjadp@live.com",
      site: "farjadp.info",
    },
    photoCaption: "Farjad Pour Mohammad",
    labels: {
      about: "About Me",
      skills: "Skills",
      languages: "Languages",
      links: "Links",
      experience: "Work Experience",
      education: "Education",
      certification: "Professional Certification",
      courses: "Courses & Continuous Learning",
    },
    about: [
      "With 22+ years of experience, my career has evolved from foundational IT roles to leading organizations as Founder, CTO & CSO. I hold dual Masters in Software Engineering and Anthropology — a rare combination that shapes how I build systems and lead people.",
      "I've mentored 25+ startups, co-founded 4 companies across Iran and Canada, and helped raise $3M+ for teams I believed in. I build with clarity, systems, and brutal honesty.",
    ],
    skills: [
      "Problem Solving",
      "Critical Thinking",
      "Conflict Resolution",
      "Adaptability",
      "Leadership",
      "Communication",
      "Brand Management",
      "Technical Leadership",
      "Product Development",
      "Web Development",
      "Project Management",
      "Startup Mentorship",
      "Strategic Thinking",
      "Software Architecture",
      "AI & Automation",
      "Digital Transformation",
    ],
    languages: [
      { name: "Farsi", level: "Native", percent: 100 },
      { name: "English", level: "Professional", percent: 75 },
    ],
    links: [
      { label: "LinkedIn", value: "farjadpourmohammad", href: "https://www.linkedin.com/in/farjadpourmohammad/" },
      { label: "Website", value: "farjadp.info", href: "https://farjadp.info" },
      { label: "Twitter/X", value: "FarjadTalks", href: "https://twitter.com/FarjadTalks" },
      { label: "Telegram", value: "FarjadTalks", href: "https://t.me/FarjadTalks" },
      { label: "GitHub", value: "Farjadp", href: "https://github.com/Farjadp" },
      { label: "YouTube", value: "Farjadtalks", href: "https://youtube.com/@Farjadtalks" },
    ],
    jobs: [
      {
        company: "AshaVid",
        location: "Toronto, ON",
        period: "Jun 2025 – Present",
        duration: "Current",
        role: "Founder & CSO",
        bullets: [
          "Defined and refined the long-term scientific vision to align with overall company strategy and evolving market needs.",
          "Led the design and execution of the R&D roadmap, prioritizing programs based on scientific merit and commercial potential.",
          "Built, mentored, and retained high-performing scientific teams across multiple disciplines and geographies.",
          "Established and managed strategic collaborations with academic institutions, biotech and pharma companies, and technology partners.",
        ],
      },
      {
        company: "DPF (Farjad Data Processing Company)",
        location: "Tehran",
        period: "Mar 2006 – Jan 2023",
        duration: "16 yrs 11 mos",
        role: "Founder and Director",
        bullets: [
          "Founded Iran's first dedicated website design and programming company, pioneering the organization's entry into a new digital market.",
          "Built strong, trust-based client relationships, positioning the company as a reliable long-term technology partner.",
          "Recruited, mentored, and developed a high-caliber technical team, fostering a collaborative and high-performance culture.",
          "Led the company's growth through strategic planning, effective leadership, and hands-on operational guidance.",
          "Transitioned into the role of board director, contributing to governance and strategic direction as former employees assumed ownership.",
        ],
      },
      {
        company: "HoFin",
        location: "Toronto, ON",
        period: "Jan 2020 – Present",
        duration: "6 yrs 2 mos",
        role: "Co-Founder",
        bullets: [
          "Founded a startup focused on providing mental health support solutions.",
          "Led the design and development of the initial product version released on the Apple Store.",
          "Defined the go-to-market approach and prepared marketing initiatives for the Canadian market.",
          "Oversaw core business activities, including product vision, basic operations, and early-stage brand positioning.",
        ],
      },
      {
        company: "VisaRoads",
        location: "Remote",
        period: "Jan 2022 – Present",
        duration: "4 yrs 2 mos",
        role: "Mentor",
        bullets: [
          "Assisted startup teams in identifying suitable accelerator programs aligned with their stage, industry, and strategic objectives.",
          "Guided founders in defining and building an optimal MVP, focusing on core features, user needs, and resource constraints.",
          "Helped teams assess product-market fit through user feedback, iterative testing, and analysis of market signals.",
          "Supported startups in securing initial clients by refining value propositions, prospecting strategies, and sales narratives.",
          "Conducted market analysis to clarify competitive landscapes, target segments, and positioning opportunities.",
          "Advised on team structure, roles, and collaboration practices to improve operational efficiency and execution capacity.",
          "Collaborated with founders to establish a go-to-market strategy, including channel selection, pricing approach, and launch planning.",
        ],
      },
      {
        company: "NFTsShip",
        location: "Tehran",
        period: "Jan 2022 – Feb 2026",
        duration: "4 yrs 2 mos",
        role: "Founder",
        bullets: [
          "Founded Iran's first NFT platform, overseeing product vision, strategy and overall operations.",
          "Organized and led Iran's first NFT-focused event, building awareness and education around digital art and blockchain technology.",
          "Attracted and onboarded well-known artists to the platform, positioning it as a credible space for NFT creation and trading.",
          "Navigated complex market, regulatory and social conditions until suspension of operations due to internal team issues and the national uprising.",
        ],
      },
      {
        company: "First Iranian Cloud Computing Company (Gov-Backed)",
        location: "Tehran",
        period: "Jan 2017 – Jan 2020",
        duration: "3 yrs 1 mo",
        role: "CTO",
        bullets: [
          "Served as CTO, establishing and leading the technical team from inception.",
          "Managed network infrastructure and ensured reliable connectivity and operations.",
          "Facilitated collaboration between R&D, software development, and network teams to align on technical solutions.",
          "Oversaw system design and architecture for multiple organizational platforms.",
          "Coordinated end-to-end technical delivery of the project and supervised its handover to Abararvan company.",
        ],
      },
      {
        company: "Rayan Andishan Faraz (RAF)",
        location: "Tehran",
        period: "Jan 2010 – Dec 2010",
        duration: "1 yr",
        role: "IT Department Manager",
        bullets: [
          "Managed the IT department and ensured day-to-day operational continuity and service delivery.",
          "Led and coordinated a team of IT staff, organizing tasks and responsibilities across the department.",
          "Identified and addressed initial team cooperation issues, implementing actions to improve collaboration.",
          "Facilitated communication within the team to resolve conflicts and align members on common objectives.",
          "Worked closely with team members to support their work, provide guidance, and maintain a productive environment.",
        ],
      },
      {
        company: "Ministry of Industry of Iran",
        location: "Tehran",
        period: "Jan 2008 – Dec 2009",
        duration: "2 yrs",
        role: "Cooperation with Ministry of Industry of Iran",
        bullets: [
          "Identified timing issues and lack of coordination that led to energy wastage within projects.",
          "Managed projects with a focus on improving scheduling, coordination and resource efficiency.",
          "Regularly updated knowledge of project management methods and best practices to enhance project outcomes.",
        ],
      },
      {
        company: "Fibo Group",
        location: "Remote",
        period: "Jan 2005 – Jun 2005",
        duration: "6 mos",
        role: "Supporter of Farsi Language Website",
        bullets: ["Supported the website of the Farsi language department of the English company Fibo Group."],
      },
    ],
    education: [
      { degree: "PhD (Partially Completed) in Anthropology", institution: "Tehran Azad University, Center", year: "2019", notes: [] },
      {
        degree: "BBA — Doctor of Business Administration",
        institution: "Brand Academy of Iran",
        year: "2019",
        notes: [
          "Doctor of Business Administration (DBA) with a focus on Brand Management",
          "Specialized in Sensory Branding to enhance brand perception and customer engagement",
          "Experienced in developing and implementing brand-building strategies",
        ],
      },
      { degree: "Master of Anthropology", institution: "Tehran Azad University, Center", year: "2016", notes: [] },
      { degree: "Master's Degree in Software Engineering", institution: "Azad University, Roudhen Branch", year: "2014", notes: [] },
      { degree: "BA in Anthropology", institution: "Azad University, Tehran Branch", year: "2014", notes: [] },
      { degree: "Diploma in Mathematics", institution: "Tehran", year: "2008", notes: [] },
    ],
    courses: [
      { title: "Digital Transformation", institution: "York University", date: "Mar 2026" },
      { title: "Venture Talent Masterclass", institution: "Schulich", date: "Dec 2024 – Mar 2025" },
      { title: "Fundamentals of Digital Marketing", institution: "Google", date: "Feb 2023 – Nov 2023" },
      { title: "Business Model", institution: "marsdd", date: "Oct 2023" },
      { title: "Digital Strategy", institution: "LinkedIn", date: "Jan 2022 – Oct 2022" },
      { title: "Chief Technology Officer Career Guide", institution: "LinkedIn", date: "Jan 2020" },
      { title: "Metaverse and NFTs for Marketing", institution: "LinkedIn", date: "Mar 2019 – Jul 2019" },
      { title: "Blockchain Basics", institution: "LinkedIn", date: "Feb 2019" },
      { title: "Scrum: The Basics", institution: "LinkedIn", date: "Jan 2018 – May 2018" },
    ],
    iso: {
      title: "International Chief Auditor of Information Security Management System",
      institution: "International Standard Institute",
      year: "2018",
      bullets: [
        "Holder of ISO 27001 Lead Implementer certification",
        "Holder of ISO 27001 Lead Auditor certification",
        "Certified Chief Information Security Officer (CISO) ISO 27001",
        "Expertise in implementing and auditing Information Security Management Systems (ISMS)",
        "Proven capability in managing information security risks aligned with internationally recognized ISO 27001 standards",
      ],
    },
    printFooter: PRINT_FOOTER,
    cta: {
      title: "Ready to work together?",
      body: "Whether you need a strategic partner, a technical co-founder, or a startup mentor — let's talk.",
      book: "Book a Strategy Call",
    },
  },
  fa: {
    bar: { name: "فرجاد پورمحمد", tagline: "استراتژیست و سازنده‌ی سیستم", hire: "همکاری با من", download: "دریافت PDF" },
    header: {
      monogram: "F | P",
      name: "فرجاد پورمحمد",
      title: "استراتژیست",
      location: "نیومارکت، انتاریو، کانادا",
      phone: "+1 437 661 1674",
      email: "farjadp@live.com",
      site: "farjadp.info",
    },
    photoCaption: "فرجاد پورمحمد",
    labels: {
      about: "درباره‌ی من",
      skills: "مهارت‌ها",
      languages: "زبان‌ها",
      links: "پیوندها",
      experience: "سوابق کاری",
      education: "تحصیلات",
      certification: "گواهی‌نامه‌ی حرفه‌ای",
      courses: "دوره‌ها و یادگیری مستمر",
    },
    about: [
      "با بیش از ۲۲ سال تجربه، مسیرم از نقش‌های پایه‌ی فناوری اطلاعات تا رهبری سازمان‌ها به‌عنوان بنیان‌گذار، مدیر ارشد فنی و مدیر ارشد استراتژی رسیده است. دو کارشناسی ارشد دارم، مهندسی نرم‌افزار و انسان‌شناسی؛ ترکیبی کمیاب که شکل سیستم‌سازی و رهبری کردنم را تعیین می‌کند.",
      "بیش از ۲۵ استارتاپ را منتور کرده‌ام، در ایران و کانادا ۴ شرکت هم‌بنیان‌گذاری کرده‌ام و به تیم‌هایی که به آن‌ها باور داشتم کمک کرده‌ام بیش از ۳ میلیون دلار جذب کنند. با شفافیت، سیستم و صداقت بی‌تعارف می‌سازم.",
    ],
    skills: [
      "حل مسئله",
      "تفکر انتقادی",
      "حل تعارض",
      "انطباق‌پذیری",
      "رهبری",
      "ارتباط مؤثر",
      "مدیریت برند",
      "رهبری فنی",
      "توسعه‌ی محصول",
      "توسعه‌ی وب",
      "مدیریت پروژه",
      "منتورشیپ استارتاپ",
      "تفکر استراتژیک",
      "معماری نرم‌افزار",
      "هوش مصنوعی و خودکارسازی",
      "تحول دیجیتال",
    ],
    languages: [
      { name: "فارسی", level: "زبان مادری", percent: 100 },
      { name: "انگلیسی", level: "حرفه‌ای", percent: 75 },
    ],
    links: [
      { label: "لینکدین", value: "farjadpourmohammad", href: "https://www.linkedin.com/in/farjadpourmohammad/" },
      { label: "وب‌سایت", value: "farjadp.info", href: "https://farjadp.info" },
      { label: "ایکس", value: "FarjadTalks", href: "https://twitter.com/FarjadTalks" },
      { label: "تلگرام", value: "FarjadTalks", href: "https://t.me/FarjadTalks" },
      { label: "گیت‌هاب", value: "Farjadp", href: "https://github.com/Farjadp" },
      { label: "یوتیوب", value: "Farjadtalks", href: "https://youtube.com/@Farjadtalks" },
    ],
    jobs: [
      {
        company: "AshaVid",
        location: "تورنتو، انتاریو",
        period: "ژوئن ۲۰۲۵ تا اکنون",
        duration: "فعلی",
        role: "بنیان‌گذار و مدیر ارشد استراتژی",
        bullets: [
          "تعریف و پالایش چشم‌انداز علمی بلندمدت، هم‌راستا با استراتژی کلی شرکت و نیازهای در حال تغییر بازار.",
          "هدایت طراحی و اجرای نقشه‌ی راه تحقیق و توسعه، با اولویت‌بندی برنامه‌ها بر اساس اعتبار علمی و پتانسیل تجاری.",
          "ساختن، منتور کردن و نگه داشتن تیم‌های علمی پرکار در چند رشته و چند جغرافیا.",
          "ایجاد و مدیریت همکاری‌های استراتژیک با نهادهای دانشگاهی، شرکت‌های بیوتک و دارویی و شرکای فناوری.",
        ],
      },
      {
        company: "DPF (شرکت پردازش داده‌ی فرجاد)",
        location: "تهران",
        period: "مارس ۲۰۰۶ تا ژانویه‌ی ۲۰۲۳",
        duration: "۱۶ سال و ۱۱ ماه",
        role: "بنیان‌گذار و مدیر",
        bullets: [
          "بنیان‌گذاری نخستین شرکت تخصصی طراحی و برنامه‌نویسی وب‌سایت در ایران و ورود پیشگامانه به یک بازار دیجیتال تازه.",
          "ساختن رابطه‌های مبتنی بر اعتماد با مشتریان و تثبیت شرکت به‌عنوان شریک فناوری قابل‌اتکا و بلندمدت.",
          "جذب، منتور کردن و پرورش یک تیم فنی توانمند و شکل دادن فرهنگی مشارکتی و پربازده.",
          "هدایت رشد شرکت از راه برنامه‌ریزی استراتژیک، رهبری مؤثر و راهنمایی عملیاتی مستقیم.",
          "گذار به نقش عضو هیئت‌مدیره و مشارکت در حاکمیت و جهت‌گیری استراتژیک، پس از انتقال مالکیت به کارکنان پیشین.",
        ],
      },
      {
        company: "HoFin",
        location: "تورنتو، انتاریو",
        period: "ژانویه‌ی ۲۰۲۰ تا اکنون",
        duration: "۶ سال و ۲ ماه",
        role: "هم‌بنیان‌گذار",
        bullets: [
          "بنیان‌گذاری استارتاپی با تمرکز بر راه‌حل‌های پشتیبانی سلامت روان.",
          "هدایت طراحی و توسعه‌ی نسخه‌ی اولیه‌ی محصول، منتشرشده روی اپ‌استور.",
          "تعریف رویکرد ورود به بازار و آماده‌سازی برنامه‌های بازاریابی برای بازار کانادا.",
          "نظارت بر فعالیت‌های اصلی کسب‌وکار، از چشم‌انداز محصول و عملیات پایه تا جایگاه‌سازی اولیه‌ی برند.",
        ],
      },
      {
        company: "VisaRoads",
        location: "دورکاری",
        period: "ژانویه‌ی ۲۰۲۲ تا اکنون",
        duration: "۴ سال و ۲ ماه",
        role: "منتور",
        bullets: [
          "کمک به تیم‌های استارتاپی در شناسایی برنامه‌های شتاب‌دهی متناسب با مرحله، صنعت و هدف‌های استراتژیک‌شان.",
          "راهنمایی بنیان‌گذاران در تعریف و ساخت MVP بهینه، با تمرکز بر قابلیت‌های اصلی، نیاز کاربر و محدودیت منابع.",
          "کمک به تیم‌ها در سنجش تناسب محصول و بازار از راه بازخورد کاربران، آزمون تکرارشونده و تحلیل سیگنال‌های بازار.",
          "پشتیبانی از استارتاپ‌ها برای جذب مشتریان اول، با پالایش ارزش پیشنهادی، استراتژی جست‌وجوی مشتری و روایت فروش.",
          "تحلیل بازار برای روشن کردن فضای رقابتی، بخش‌های هدف و فرصت‌های جایگاه‌سازی.",
          "مشاوره درباره‌ی ساختار تیم، نقش‌ها و شیوه‌های همکاری برای بالا بردن کارایی عملیاتی و ظرفیت اجرا.",
          "همکاری با بنیان‌گذاران برای تدوین استراتژی ورود به بازار، از انتخاب کانال و رویکرد قیمت‌گذاری تا برنامه‌ریزی عرضه.",
        ],
      },
      {
        company: "NFTsShip",
        location: "تهران",
        period: "ژانویه‌ی ۲۰۲۲ تا فوریه‌ی ۲۰۲۶",
        duration: "۴ سال و ۲ ماه",
        role: "بنیان‌گذار",
        bullets: [
          "بنیان‌گذاری نخستین پلتفرم NFT ایران و نظارت بر چشم‌انداز محصول، استراتژی و کل عملیات.",
          "برگزاری و هدایت نخستین رویداد متمرکز بر NFT در ایران، برای آگاهی‌بخشی و آموزش درباره‌ی هنر دیجیتال و بلاک‌چین.",
          "جذب و همراه کردن هنرمندان شناخته‌شده با پلتفرم و تثبیت آن به‌عنوان فضایی معتبر برای خلق و مبادله‌ی NFT.",
          "عبور از شرایط پیچیده‌ی بازار، مقررات و جامعه، تا توقف فعالیت به دلیل مسائل داخلی تیم و خیزش سراسری.",
        ],
      },
      {
        company: "نخستین شرکت رایانش ابری ایران (با پشتوانه‌ی دولتی)",
        location: "تهران",
        period: "ژانویه‌ی ۲۰۱۷ تا ژانویه‌ی ۲۰۲۰",
        duration: "۳ سال و ۱ ماه",
        role: "مدیر ارشد فنی",
        bullets: [
          "ایفای نقش مدیر ارشد فنی و ساختن و هدایت تیم فنی از نقطه‌ی صفر.",
          "مدیریت زیرساخت شبکه و تضمین اتصال و عملیات پایدار.",
          "تسهیل همکاری میان تیم‌های تحقیق و توسعه، توسعه‌ی نرم‌افزار و شبکه برای هم‌راستایی روی راه‌حل‌های فنی.",
          "نظارت بر طراحی و معماری سیستم برای چند پلتفرم سازمانی.",
          "هماهنگی تحویل فنی سرتاسری پروژه و سرپرستی واگذاری آن به شرکت ابرآروان.",
        ],
      },
      {
        company: "رایان اندیشان فراز (RAF)",
        location: "تهران",
        period: "ژانویه‌ی ۲۰۱۰ تا دسامبر ۲۰۱۰",
        duration: "۱ سال",
        role: "مدیر واحد فناوری اطلاعات",
        bullets: [
          "مدیریت واحد فناوری اطلاعات و تضمین تداوم عملیات روزانه و ارائه‌ی خدمات.",
          "هدایت و هماهنگی تیم فناوری اطلاعات و سازمان‌دهی وظایف و مسئولیت‌ها در واحد.",
          "شناسایی و رفع مشکلات اولیه‌ی همکاری در تیم و اجرای اقدام‌هایی برای بهبود هم‌افزایی.",
          "تسهیل ارتباط درون تیم برای حل تعارض‌ها و هم‌راستا کردن اعضا روی هدف‌های مشترک.",
          "کار نزدیک با اعضای تیم برای پشتیبانی از کارشان، راهنمایی و حفظ محیطی پربازده.",
        ],
      },
      {
        company: "وزارت صنایع ایران",
        location: "تهران",
        period: "ژانویه‌ی ۲۰۰۸ تا دسامبر ۲۰۰۹",
        duration: "۲ سال",
        role: "همکاری با وزارت صنایع ایران",
        bullets: [
          "شناسایی مشکلات زمان‌بندی و نبود هماهنگی که به هدررفت انرژی در پروژه‌ها می‌انجامید.",
          "مدیریت پروژه‌ها با تمرکز بر بهبود زمان‌بندی، هماهنگی و کارایی منابع.",
          "به‌روز نگه داشتن دانش روش‌ها و بهترین شیوه‌های مدیریت پروژه برای بهبود نتایج.",
        ],
      },
      {
        company: "Fibo Group",
        location: "دورکاری",
        period: "ژانویه‌ی ۲۰۰۵ تا ژوئن ۲۰۰۵",
        duration: "۶ ماه",
        role: "پشتیبان وب‌سایت بخش فارسی",
        bullets: ["پشتیبانی از وب‌سایت بخش زبان فارسی شرکت انگلیسی Fibo Group."],
      },
    ],
    education: [
      { degree: "دکتری انسان‌شناسی (ناتمام)", institution: "دانشگاه آزاد تهران مرکز", year: "۲۰۱۹", notes: [] },
      {
        degree: "DBA، دکتری مدیریت کسب‌وکار",
        institution: "آکادمی برند ایران",
        year: "۲۰۱۹",
        notes: [
          "دکتری مدیریت کسب‌وکار (DBA) با تمرکز بر مدیریت برند",
          "تخصص در برندسازی حسی برای تقویت ادراک برند و تعامل مشتری",
          "تجربه در تدوین و اجرای استراتژی‌های برندسازی",
        ],
      },
      { degree: "کارشناسی ارشد انسان‌شناسی", institution: "دانشگاه آزاد تهران مرکز", year: "۲۰۱۶", notes: [] },
      { degree: "کارشناسی ارشد مهندسی نرم‌افزار", institution: "دانشگاه آزاد، واحد رودهن", year: "۲۰۱۴", notes: [] },
      { degree: "کارشناسی انسان‌شناسی", institution: "دانشگاه آزاد، واحد تهران", year: "۲۰۱۴", notes: [] },
      { degree: "دیپلم ریاضی", institution: "تهران", year: "۲۰۰۸", notes: [] },
    ],
    courses: [
      { title: "تحول دیجیتال", institution: "دانشگاه یورک", date: "مارس ۲۰۲۶" },
      { title: "مسترکلاس استعداد ونچر", institution: "شولیک", date: "دسامبر ۲۰۲۴ تا مارس ۲۰۲۵" },
      { title: "مبانی بازاریابی دیجیتال", institution: "Google", date: "فوریه تا نوامبر ۲۰۲۳" },
      { title: "مدل کسب‌وکار", institution: "MaRS", date: "اکتبر ۲۰۲۳" },
      { title: "استراتژی دیجیتال", institution: "LinkedIn", date: "ژانویه تا اکتبر ۲۰۲۲" },
      { title: "راهنمای مسیر شغلی مدیر ارشد فنی", institution: "LinkedIn", date: "ژانویه‌ی ۲۰۲۰" },
      { title: "متاورس و NFT برای بازاریابی", institution: "LinkedIn", date: "مارس تا ژوئیه‌ی ۲۰۱۹" },
      { title: "مبانی بلاک‌چین", institution: "LinkedIn", date: "فوریه‌ی ۲۰۱۹" },
      { title: "اسکرام: مبانی", institution: "LinkedIn", date: "ژانویه تا مه ۲۰۱۸" },
    ],
    iso: {
      title: "سرممیز بین‌المللی سیستم مدیریت امنیت اطلاعات",
      institution: "International Standard Institute",
      year: "۲۰۱۸",
      bullets: [
        "دارنده‌ی گواهی‌نامه‌ی ISO 27001 Lead Implementer",
        "دارنده‌ی گواهی‌نامه‌ی ISO 27001 Lead Auditor",
        "مدیر ارشد امنیت اطلاعات (CISO) گواهی‌شده بر پایه‌ی ISO 27001",
        "تخصص در پیاده‌سازی و ممیزی سیستم‌های مدیریت امنیت اطلاعات (ISMS)",
        "توانایی اثبات‌شده در مدیریت ریسک‌های امنیت اطلاعات هم‌راستا با استاندارد بین‌المللی ISO 27001",
      ],
    },
    printFooter: PRINT_FOOTER,
    cta: {
      title: "آماده‌ی همکاری هستید؟",
      body: "چه به شریک استراتژیک نیاز داشته باشید، چه هم‌بنیان‌گذار فنی، چه منتور استارتاپ؛ با هم حرف بزنیم.",
      book: "رزرو جلسه‌ی استراتژی",
    },
  },
}

// ─── Print helpers ──────────────────────────────────────────────────────────
// Screen colours are v3 tokens only; these are the print-only overrides that
// turn the dark page into dark-on-white paper.

const P_INK = "print:text-black"
const P_SOFT = "print:text-neutral-700"
const P_MUTE = "print:text-neutral-500"
const P_LINE = "print:border-neutral-300"
const P_DOT = "print:bg-neutral-700 print:shadow-none"

/** Language level → bar width. Classes, not inline style. */
const BAR_WIDTH: Record<number, string> = { 100: "w-full", 75: "w-3/4" }

const WRAP = "mx-auto w-full max-w-[1600px] px-5 md:px-10 lg:px-14 print:max-w-none print:px-0"

// ─── Pieces ─────────────────────────────────────────────────────────────────

/** A sidebar / main block. Lifts its border to the light on hover; flat white paper in print. */
function Block({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section
      className={`group/block rounded-2xl border border-v3-line/70 bg-v3-raise/40 p-6 transition-colors duration-500 hover:border-v3-light/40 hover:bg-v3-raise md:p-8 print:rounded-none print:border-0 print:bg-white print:p-0 ${className ?? ""}`}
    >
      <h2
        className={`mb-6 border-b border-v3-line/70 pb-3 text-sm font-medium text-v3-light transition-colors duration-500 group-hover/block:border-v3-light/40 print:mb-3 print:pb-1.5 print:text-xs print:font-bold print:uppercase print:tracking-widest ${P_INK} print:border-neutral-400 rtl:print:normal-case rtl:print:tracking-normal`}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function Dot() {
  return <span aria-hidden className={`mt-2.5 h-1 w-1 shrink-0 rounded-full bg-v3-light print:mt-1.5 ${P_DOT}`} />
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2 print:gap-1">
      {items.map((b, i) => (
        <li key={i} className={`flex items-start gap-3 leading-relaxed text-v3-soft rtl:leading-loose print:gap-2 print:text-[10.5px] print:leading-snug ${P_SOFT}`}>
          <Dot />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export function ResumePage({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const href = (p: string) => localePath(locale, p)

  return (
    <div className="min-h-screen overflow-x-hidden bg-v3-ink font-v3-body text-v3-bone selection:bg-v3-light selection:text-v3-ink print:min-h-0 print:overflow-visible print:bg-white print:text-black">
      {/* ── Action bar (screen only). Sticks under the h-20 site header. ── */}
      <div className="sticky top-20 z-40 border-b border-v3-line/70 bg-v3-ink/85 backdrop-blur-md print:hidden">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-5 py-3 md:px-10 lg:px-14">
          <div className="flex min-w-0 items-center gap-3">
            <span className="font-v3-display text-lg text-v3-bone">{t.bar.name}</span>
            <span className="hidden truncate text-sm text-v3-mute sm:block">{t.bar.tagline}</span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <V3Button href={href("/contact")} variant="quiet" locale={locale} className="hidden sm:inline-flex">
              {t.bar.hire}
            </V3Button>
            <DownloadResumeButton label={t.bar.download} />
          </div>
        </div>
      </div>

      {/* ── The printable resume ─────────────────────────────────────── */}
      <div id="resume-content" className="print:**:opacity-100! print:**:transform-none!">
        {/* Header */}
        <div className="relative isolate overflow-hidden border-b border-v3-line/70 print:mb-5 print:overflow-visible print:border-neutral-400">
          <Beam className="print:hidden" />
          <Spotlight className="-z-10 print:hidden" />
          <div className={`${WRAP} grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:items-end print:grid-cols-[1fr_auto] print:items-end print:gap-6 print:py-0 print:pb-4`}>
            <div className="flex flex-col gap-6 lg:col-span-7 print:gap-2">
              <Reveal immediate>
                <span dir="ltr" className={`inline-block font-mono text-sm tracking-[0.4em] text-v3-light print:text-xs ${P_MUTE}`}>
                  {t.header.monogram}
                </span>
              </Reveal>
              <Reveal immediate delay={0.08}>
                <Headline as="h1" size="hero" className={`print:text-4xl print:leading-tight ${P_INK}`}>
                  {t.header.name}
                </Headline>
              </Reveal>
              <Reveal immediate delay={0.16} className="flex items-center gap-4">
                <span aria-hidden className="h-px w-12 bg-v3-light print:bg-neutral-700" />
                <span className={`text-lg text-v3-light print:text-sm print:font-semibold ${P_INK}`}>{t.header.title}</span>
              </Reveal>
            </div>

            <Reveal immediate delay={0.24} className="flex flex-col gap-6 lg:col-span-5 print:gap-0">
              <ul className={`grid gap-3 text-v3-soft sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 print:grid-cols-1 print:gap-1 print:text-[11px] ${P_SOFT}`}>
                <ContactItem icon={<MapPin className="h-4 w-4" />}>{t.header.location}</ContactItem>
                <ContactItem icon={<Phone className="h-4 w-4" />} ltr>
                  {t.header.phone}
                </ContactItem>
                <ContactItem icon={<Mail className="h-4 w-4" />} ltr>
                  {t.header.email}
                </ContactItem>
                <ContactItem icon={<Globe className="h-4 w-4" />} ltr>
                  {t.header.site}
                </ContactItem>
              </ul>
              <div className="flex flex-wrap items-center gap-3 print:hidden">
                <DownloadResumeButton label={t.bar.download} />
                <V3Button href={href("/contact")} variant="secondary" locale={locale} className="py-2.5 text-sm">
                  {t.bar.hire}
                </V3Button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Two columns */}
        <div className={`${WRAP} grid grid-cols-1 gap-6 py-16 md:py-20 lg:grid-cols-[320px_1fr] lg:gap-8 print:grid-cols-[200px_1fr] print:gap-6 print:py-0`}>
          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-6 print:gap-4">
            <Reveal>
              <div className="group/photo flex flex-col items-center gap-4 rounded-2xl border border-v3-line/70 bg-v3-raise/40 p-6 transition-colors duration-500 hover:border-v3-light/40 print:gap-2 print:rounded-none print:border-0 print:bg-white print:p-0">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-v3-light/40 bg-v3-ink shadow-[0_0_60px_-20px_rgba(232,196,138,0.5)] transition-transform duration-500 group-hover/photo:-translate-y-0.5 print:h-16 print:w-16 print:border-neutral-400 print:bg-white print:shadow-none">
                  <span className={`font-v3-display text-5xl font-light text-v3-light print:text-3xl ${P_INK}`}>F</span>
                </div>
                <p className={`text-center text-sm tracking-wide text-v3-mute print:text-[10px] ${P_MUTE}`}>{t.photoCaption}</p>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <Block title={t.labels.about}>
                <div className="flex flex-col gap-4 print:gap-2">
                  {t.about.map((p, i) => (
                    <p key={i} className={`leading-relaxed text-v3-soft rtl:leading-loose print:text-[10.5px] print:leading-snug ${P_SOFT}`}>
                      {p}
                    </p>
                  ))}
                </div>
              </Block>
            </Reveal>

            <Reveal delay={0.12}>
              <Block title={t.labels.skills}>
                <ul className="flex flex-wrap gap-2 print:gap-1">
                  {t.skills.map((s) => (
                    <li
                      key={s}
                      className={`rounded-full border border-v3-line px-3 py-1.5 text-[13px] text-v3-soft transition-colors duration-300 hover:border-v3-light/60 hover:text-v3-bone print:rounded print:px-1.5 print:py-0.5 print:text-[9.5px] ${P_LINE} ${P_SOFT}`}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </Block>
            </Reveal>

            <Reveal delay={0.18}>
              <Block title={t.labels.languages}>
                <ul className="flex flex-col gap-5 print:gap-2">
                  {t.languages.map((l) => (
                    <li key={l.name} className="flex flex-col gap-2 print:gap-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`text-v3-bone print:text-[11px] print:font-semibold ${P_INK}`}>{l.name}</span>
                        <span className={`text-sm text-v3-mute print:text-[10px] ${P_MUTE}`}>{l.level}</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-v3-line print:bg-neutral-200">
                        <div className={`h-full rounded-full bg-v3-light print:bg-neutral-700 ${BAR_WIDTH[l.percent] ?? "w-full"}`} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Block>
            </Reveal>

            <Reveal delay={0.24}>
              <Block title={t.labels.links}>
                <ul className="flex flex-col gap-2.5 print:gap-1">
                  {t.links.map((link) => (
                    <li key={link.label} className="flex items-baseline gap-3 print:gap-2">
                      <span className={`w-20 shrink-0 text-sm text-v3-mute print:w-14 print:text-[10px] ${P_MUTE}`}>{link.label}</span>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        className={`break-all text-v3-bone underline decoration-v3-line underline-offset-4 transition-colors hover:text-v3-light hover:decoration-v3-light print:text-[10px] print:no-underline ${P_INK}`}
                      >
                        {link.value}
                      </a>
                    </li>
                  ))}
                </ul>
              </Block>
            </Reveal>
          </aside>

          {/* ── Main ── */}
          <div className="flex min-w-0 flex-col gap-6 print:gap-5">
            {/* Work experience: the light rule draws down the record. */}
            <Reveal>
              <Block title={t.labels.experience}>
                <LightRule className="print:[&>div:first-child]:hidden">
                  <ol className="flex flex-col">
                    {t.jobs.map((job, i) => (
                      <li
                        key={`${job.company}-${job.period}`}
                        className="group group/job relative grid grid-cols-[4.5rem_1fr] gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[7.5rem_1fr] md:gap-8 print:grid-cols-[5.5rem_1fr] print:gap-3 print:py-2.5"
                      >
                        <span className={`pt-0.5 text-xs leading-snug tabular-nums text-v3-mute md:text-sm print:text-[10px] ${P_MUTE}`}>
                          {job.period}
                        </span>
                        <span
                          aria-hidden
                          className="absolute start-[4.5rem] top-8 h-2 w-2 -translate-x-1/2 rounded-full bg-v3-ink ring-1 ring-v3-light transition-shadow duration-500 group-first/job:top-2 group-hover/job:shadow-[0_0_12px_rgba(232,196,138,0.8)] md:start-[7.5rem] rtl:translate-x-1/2 print:hidden"
                        />
                        <Reveal delay={Math.min(i, 3) * 0.04} className="flex min-w-0 flex-col gap-3 ps-4 md:ps-8 print:gap-1.5 print:ps-0">
                          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                            <div className="flex min-w-0 flex-col gap-1">
                              <h3
                                className={`font-v3-display text-2xl leading-snug text-v3-bone transition-colors duration-300 group-hover/job:text-v3-light print:font-v3-body print:text-[12.5px] print:font-bold ${P_INK}`}
                              >
                                {job.company}
                              </h3>
                              <p className={`text-sm text-v3-mute print:text-[10px] ${P_MUTE}`}>
                                {job.location} · {job.duration}
                              </p>
                            </div>
                            <span
                              className={`rounded-full border border-v3-line px-3 py-1 text-[13px] text-v3-soft transition-colors duration-300 group-hover/job:border-v3-light/60 group-hover/job:text-v3-light print:rounded print:px-1.5 print:py-0 print:text-[10px] print:font-semibold ${P_LINE} ${P_INK}`}
                            >
                              {job.role}
                            </span>
                          </div>
                          <Bullets items={job.bullets} />
                        </Reveal>
                      </li>
                    ))}
                  </ol>
                </LightRule>
              </Block>
            </Reveal>

            {/* Education */}
            <Reveal>
              <Block title={t.labels.education}>
                <ol className="flex flex-col">
                  {t.education.map((e, i) => (
                    <li
                      key={e.degree}
                      className={`border-b border-v3-line/60 py-5 first:pt-0 last:border-b-0 last:pb-0 print:py-1.5 ${P_LINE}`}
                    >
                      <Reveal delay={(i % 3) * 0.06} className="flex flex-col gap-1.5 print:gap-0.5">
                        <h3 className={`font-v3-display text-xl leading-snug text-v3-bone print:font-v3-body print:text-[11.5px] print:font-bold ${P_INK}`}>
                          {e.degree}
                        </h3>
                        <p className={`text-sm text-v3-mute print:text-[10px] ${P_MUTE}`}>
                          {e.institution} / <span className="tabular-nums">{e.year}</span>
                        </p>
                        {e.notes.length > 0 && (
                          <div className="mt-2 print:mt-1">
                            <Bullets items={e.notes} />
                          </div>
                        )}
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </Block>
            </Reveal>

            {/* ISO certification */}
            <Reveal>
              <Block title={t.labels.certification}>
                <div className="flex flex-col gap-1.5 print:gap-0.5">
                  <h3 className={`font-v3-display text-xl leading-snug text-v3-bone print:font-v3-body print:text-[11.5px] print:font-bold ${P_INK}`}>
                    {t.iso.title}
                  </h3>
                  <p className={`text-sm text-v3-mute print:text-[10px] ${P_MUTE}`}>
                    {t.iso.institution} / <span className="tabular-nums">{t.iso.year}</span>
                  </p>
                </div>
                <div className="mt-4 print:mt-1.5">
                  <Bullets items={t.iso.bullets} />
                </div>
              </Block>
            </Reveal>

            {/* Courses */}
            <Reveal>
              <Block title={t.labels.courses}>
                <ul className="grid gap-px overflow-hidden rounded-xl border border-v3-line/60 bg-v3-line/60 sm:grid-cols-2 print:grid-cols-2 print:gap-x-4 print:gap-y-1.5 print:rounded-none print:border-0 print:bg-white">
                  {t.courses.map((c, i) => (
                    <li key={c.title} className="bg-v3-ink transition-colors duration-500 hover:bg-v3-raise print:bg-white">
                      <Reveal delay={(i % 2) * 0.06} className="flex h-full flex-col gap-1 p-5 print:gap-0 print:p-0">
                        <span className={`leading-snug text-v3-bone print:text-[10.5px] print:font-semibold ${P_INK}`}>{c.title}</span>
                        <span className={`text-sm text-v3-light print:text-[10px] ${P_SOFT}`}>{c.institution}</span>
                        <span className={`text-sm tabular-nums text-v3-mute print:text-[10px] ${P_MUTE}`}>{c.date}</span>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </Block>
            </Reveal>
          </div>
        </div>

        {/* Print footer */}
        <div dir="ltr" className="hidden border-t border-neutral-300 pt-3 text-center font-mono text-[9px] text-neutral-500 print:mt-6 print:block">
          {t.printFooter}
        </div>
      </div>

      {/* ── Closing (screen only) ────────────────────────────────────── */}
      <div className="border-t border-v3-line/70 print:hidden">
        <CtaBand
          title={t.cta.title}
          body={t.cta.body}
          action={
            <div className="flex flex-wrap items-center gap-3">
              <V3Button href={href("/contact")} locale={locale}>
                {t.cta.book}
              </V3Button>
              <DownloadResumeButton variant="outline" label={t.bar.download} className="min-h-12 px-7 py-4 text-base" />
            </div>
          }
        />
      </div>
    </div>
  )
}

function ContactItem({ icon, children, ltr = false }: { icon: ReactNode; children: ReactNode; ltr?: boolean }) {
  return (
    <li className="flex items-center gap-3 print:gap-1.5">
      <span aria-hidden className="shrink-0 text-v3-light print:text-neutral-700 print:[&_svg]:h-3 print:[&_svg]:w-3">
        {icon}
      </span>
      <span dir={ltr ? "ltr" : undefined}>{children}</span>
    </li>
  )
}
