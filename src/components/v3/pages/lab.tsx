// ============================================================================
// File Path: src/components/v3/pages/lab.tsx
// Why: /lab and /fa/lab (Founder Development Lab, cohort one: Astaneh) in the
//      v3 "Light" look, one component for both locales. Every word is carried
//      over from the v2 pages; only the look changed. The Persian page keeps
//      its Persian-only artefacts (the Telegram channel cards); the English
//      page keeps its own (the channel note and the perk-partners card).
//      Not carried over: the logo-lockup PNG under the form — dark navy line
//      art on a transparent ground, invisible on the v3 ink.
// Env / Identity: React Server Component; client leaves in ../motion and the
//      application form.
// ============================================================================

import Image from "next/image"
import type { ReactNode } from "react"
import { CheckCircle2, Gift, Linkedin, Send, Youtube } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { ApplicationForm } from "@/components/lab/application-form"
import {
  Arrow,
  Card,
  Checklist,
  CountUp,
  Headline,
  Lead,
  LightRule,
  PageHero,
  Parallax,
  Reveal,
  Section,
  V3Button,
  V3Page,
} from "@/components/v3/kit"

type Social = { label: string; href: string; icon: "telegram" | "youtube" | "linkedin" }
type Row = [string, string]

type Copy = {
  hero: {
    kicker: string
    title: string
    accent: string
    p1: string
    p2: ReactNode
    apply: string
    terms: string
    portraitAlt: string
    name: string
    record: string[]
    socials: Social[]
  }
  strip: { to?: number; value?: string; label: string }[]
  mentoring: { title: ReactNode; intro: string; rows: Row[]; note: ReactNode | null }
  channel: {
    title: ReactNode
    lead: string
    link: string
    author: string
    date: string
    poll: { question: string; yes: string; no: string; yesPct: number; noPct: number; votes: number; votesLabel: string }
    post: string
  } | null
  terms: { title: ReactNode; lead: string; rows: Row[] }
  weeks: {
    title: string
    lead: string
    output: string
    titleDir?: "ltr"
    items: { n: string; title: string; desc: string; out: string }[]
    after: string
  }
  lens: { title: ReactNode; lead: string; questions: string[]; after: string }
  fit: { yesTitle: string; yes: string[]; noTitle: string; no: string[] }
  photos: { title: string; lead: string; items: { src: string; alt: string; caption: string; span?: string }[] }
  perks: { title: string; body: string; cta: string } | null
  apply: { closedTitle: string; closedBody: string; title: string; lead: string; footer: string }
}

const Strong = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-v3-bone">{children}</strong>
const Muted = ({ children }: { children: ReactNode }) => <span className="text-v3-mute">{children}</span>

const TELEGRAM = "https://t.me/Heros_Journey"

const PHOTO_SPAN = "col-span-2 md:col-span-2 md:row-span-2"

const COPY: Record<Locale, Copy> = {
  en: {
    hero: {
      kicker: "Founder Development Lab · from idea to evidence",
      title: "A startup is not",
      accent: "four pages of business plan and a pitch deck.",
      p1: "After all these years working with founders — and my own time inside a startup — I have come to one conclusion: you cannot pull a startup out of books and frameworks. Filling in a lean canvas is not the same as having a startup.",
      p2: (
        <>
          So I set up something small: <Strong>eight weeks, five teams, free.</Strong> Every week we sit down and work on your startup&apos;s real problem — no lectures, no certificate. At the end you either continue with evidence, or you learn from evidence that you should not. Both are progress.
        </>
      ),
      apply: "Application form",
      terms: "Terms",
      portraitAlt: "Farjad Pourmohammad",
      name: "Farjad Pourmohammad",
      record: [
        "Over twenty years in Iran's IT industry",
        "Over seven years alongside Iranian startups",
        "Three years in Canada's startup ecosystem",
        "Mentored more than 50 startup teams",
        "Helped raise over $10M in micro-funding for startup teams",
      ],
      socials: [
        { label: "Telegram — A Mentor's Hero Journey", href: TELEGRAM, icon: "telegram" },
        { label: "YouTube — Farjad Talks", href: "https://youtube.com/@FarjadTalks", icon: "youtube" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/farjadpourmohammad/", icon: "linkedin" },
      ],
    },
    strip: [
      { to: 8, label: "weeks" },
      { to: 5, label: "teams" },
      { value: "free", label: "" },
    ],
    mentoring: {
      title: (
        <>
          Mentoring is not <Muted>answering questions</Muted>.
        </>
      ),
      intro:
        "Someone answering all of your questions is no guarantee that you reach the right outcome. Answering questions is the job of a consultant or an expert. What I do in these eight weeks is something else:",
      rows: [
        ["Spotting the wrong problem", "before you spend six months on it"],
        ["Asking the right question", "the one you do not ask yourself"],
        ["Seeing the pattern", "what you are seeing for the first time, I am seeing for the hundredth"],
        ["Designing the experiment", "the cheapest way to find the truth"],
        ["Creating accountability", "next week I will ask whether you did it"],
        ["Pressure on execution", "ideas are cheap; execution is everything"],
      ],
      note: (
        <>
          I wrote all of this on my Telegram channel before this page existed. It is in Persian, and it is{" "}
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="text-v3-bone underline decoration-v3-light underline-offset-8 transition-colors hover:text-v3-light"
          >
            open to read
          </a>
          .
        </>
      ),
    },
    channel: null,
    terms: {
      title: (
        <>
          Terms, <Muted>plainly.</Muted>
        </>
      ),
      lead: "The same thing I wrote on the channel; no more, no less.",
      rows: [
        ["Capacity", "Five teams. No more, because I spend real time."],
        ["Length", "Eight weeks."],
        ["Group session", "90 minutes each week — 20 minutes concept, 50 minutes hot seat, 20 minutes decisions and next steps."],
        ["Private session", "1:1 with each team every second week — weeks 2, 4, 6 and 8."],
        ["Cost", "Free. No money and no equity changes hands during these eight weeks."],
        ["After week eight", "If I see growth, I enter a 12-month engagement with three teams — that is where 2.5% equity is agreed."],
        ["Demo Day", "There isn't one. There is a Decision Day — the day you decide, not the day you perform."],
      ],
    },
    weeks: {
      title: "What we do, week by week",
      lead: "Every week at least one important uncertainty gets smaller — even when progress means discovering a mistake. Each team also writes a weekly Founder Journal: what I believed, what evidence challenged it, which decision changed, and what I avoided doing.",
      output: "Output:",
      items: [
        { n: "1", title: "The Founder & The Thesis", desc: "Separating what we know, what we believe, and what we still do not know.", out: "Venture Thesis v0.1" },
        { n: "2", title: "Problem Deconstruction", desc: "Breaking the problem into trigger, frequency, severity and cost.", out: "Problem Map + 5 critical assumptions" },
        { n: "3", title: "Customer Discovery", desc: "Talking to real customers properly, instead of asking questions that invite a yes.", out: "Customer Hypothesis + Evidence Log" },
        { n: "4", title: "Market Reality", desc: "Seeing the market as it is — competitors, alternatives, and doing nothing.", out: "Market Map + Thesis v0.2" },
        { n: "5", title: "Solution & Value", desc: "The smallest solution that makes the core value testable.", out: "Solution Hypothesis + what we will not build" },
        { n: "6", title: "Business Model & Kill Risks", desc: "Who pays, why, how much — and the three risks that could kill all of it.", out: "Kill-Risk Map" },
        { n: "7", title: "The Critical Experiment", desc: "The cheapest valid experiment for the riskiest assumption.", out: "Experiment + Evidence" },
        { n: "8", title: "Founder Decision Board", desc: "What we believed, what we learned, what was wrong — and the decision for the next 90 days.", out: "Decision + 90-day plan" },
      ],
      after:
        "Some weeks deliberately put a real action in the middle: talking to a real person, cutting your favourite feature, or running an experiment that may show the core assumption was wrong. The goal is not artificial pressure — it is seeing how you behave in a real situation.",
    },
    lens: {
      title: (
        <>
          I do not only <Muted>look at the idea.</Muted>
        </>
      ),
      lead: "If I am going to stay beside a team for a year, the quality of the founder matters more than how attractive the idea is. Over these eight weeks I am looking for answers to these questions:",
      questions: [
        "How does this person think?",
        "How do they decide?",
        "What do they do when their own hypothesis turns out to be wrong?",
        "What do they do when the market does not answer?",
        "What do they do when they disagree with a co-founder?",
        "Do they execute?",
        "Do they make excuses?",
        "Do they manipulate the data?",
        "Do they understand the customer?",
        "Are they simply in love with their own product — with their eyes shut?",
      ],
      after: "I wrote these on the channel at the time too — even if you never work with me, they are a good starting point on your own.",
    },
    fit: {
      yesTitle: "Come, if…",
      yes: [
        "You are at idea, validation or pre-MVP stage.",
        "You have a clear idea but the path is not clear.",
        "You are ready to put your assumptions under question — really.",
        "You work between the sessions, not only during them.",
      ],
      noTitle: "Do not come, if…",
      no: [
        "You are after a certificate or a motivational session.",
        "You expect a mentor to bring you customers.",
        "You only want someone to approve your idea.",
      ],
    },
    photos: {
      title: "I actually do this work.",
      lead: "Not an online course recorded once. For several years I have done this beside teams — in the weekly session, in the York Region council chamber, and behind a microphone.",
      items: [
        { src: "/images/lab/council.jpg", alt: "Presenting programme results to York Regional Council", caption: "York Regional Council — presenting the teams' results", span: PHOTO_SPAN },
        { src: "/images/lab/online-session.jpg", alt: "Online mentorship session with Iranian founders", caption: "An online session with Iranian founders" },
        { src: "/images/lab/cohort.jpg", alt: "Cohort teams at the York Region building", caption: "The last day of a cohort" },
        { src: "/images/lab/panel.jpg", alt: "Closing panel of the Digital Transformation programme", caption: "Closing panel — Toronto" },
        { src: "/images/lab/accelerator.jpg", alt: "End-of-programme celebration with the accelerator team", caption: "End of a cohort, with the accelerator team" },
      ],
    },
    perks: {
      title: "Are you a company, not a founder?",
      body: "Offer a perk to the Astaneh teams — infrastructure credits, tool access, an advisory session — and get real users with honest, structured feedback. No equity, no cost.",
      cta: "Perk partners",
    },
    apply: {
      closedTitle: "Cohort one — Astaneh — is closed",
      closedBody:
        "Five teams were accepted and the work has started. If you fill in the form below, you will be among my priorities for the next cohort — when it opens, you will hear from me first.",
      title: "Apply for the next cohort",
      lead: "It takes five minutes, and an honest answer matters more than a complete one. When the next cohort opens these forms are reviewed first — this is not the final application.",
      footer: "Cohort ’26 · Toronto / Online ·",
    },
  },
  fa: {
    hero: {
      kicker: "Founder Development Lab · از ایده تا شواهد",
      title: "استارتاپ،",
      accent: "چهار صفحه بیزینس‌پلن و یک پیچ‌دک نیست.",
      p1: "بعد از این‌همه سال سر و کله زدن با فاندرها — و تجربه‌ی خودم توی استارتاپ — به یک چیز رسیده‌ام: راه انداختن استارتاپ را نمی‌شود از لابه‌لای کتاب‌ها و فریمورک‌ها درآورد. لین کانواس پر کردن، استارتاپ داشتن نیست.",
      p2: (
        <>
          برای همین یک دوره‌ی کوچک گذاشته‌ام: <Strong>۸ هفته، ۵ تیم، رایگان.</Strong> هر هفته می‌نشینیم روی مسئله‌ی واقعیِ استارتاپ شما کار می‌کنیم — نه سخنرانی، نه مدرک. آخرش یا با شواهد ادامه می‌دهید، یا با شواهد می‌فهمید که نباید ادامه دهید. هر دو پیشرفت است.
        </>
      ),
      apply: "فرم درخواست",
      terms: "شرایط دوره",
      portraitAlt: "فرجاد پورمحمد",
      name: "فرجاد پورمحمد",
      record: [
        "بیش از بیست سال در صنعت آی‌تی ایران",
        "بیش از هفت سال کنار استارتاپ‌های ایران",
        "سه سال در اکوسیستم استارتاپی کانادا",
        "منتورشیپ بیش از ۵۰ تیم استارتاپی",
        "ریزفاند بیش از ۱۰ میلیون دلار برای تیم‌های استارتاپی",
      ],
      socials: [
        { label: "کانال تلگرام — سفر قهرمانی یک منتور", href: TELEGRAM, icon: "telegram" },
        { label: "یوتیوب — Farjad Talks", href: "https://youtube.com/@FarjadTalks", icon: "youtube" },
        { label: "لینکدین", href: "https://www.linkedin.com/in/farjadpourmohammad/", icon: "linkedin" },
      ],
    },
    strip: [
      { to: 8, label: "هفته" },
      { to: 5, label: "تیم" },
      { value: "رایگان", label: "" },
    ],
    mentoring: {
      title: (
        <>
          منتورینگ، <Muted>answering questions</Muted> نیست.
        </>
      ),
      intro:
        "اینکه یک نفر به همه‌ی سؤال‌های شما جواب بدهد، دلیل نمی‌شود نتیجه‌ی درستی بگیرید. جواب دادن به سؤال، کارِ مشاور و کارشناس است. کار من در این ۸ هفته چیز دیگری است:",
      rows: [
        ["تشخیص مسئله‌ی اشتباه", "قبل از اینکه شش ماه رویش وقت بگذارید"],
        ["پرسیدن سؤال درست", "همان‌که خودتان از خودتان نمی‌پرسید"],
        ["دیدن pattern", "چیزی که بار اول است می‌بینید، من بار صدم است"],
        ["طراحی آزمایش", "ارزان‌ترین راهِ فهمیدنِ حقیقت"],
        ["ایجاد accountability", "هفته‌ی بعد می‌پرسم انجامش دادید یا نه"],
        ["فشار روی execution", "ایده ارزان است؛ اجرا همه‌چیز است"],
      ],
      note: null,
    },
    channel: {
      title: (
        <>
          این حرف‌ها <Muted>تازه نیست.</Muted>
        </>
      ),
      lead: "قبل از اینکه این صفحه وجود داشته باشد، همه‌اش را توی کانالم نوشته بودم.",
      link: "سفر قهرمانی یک منتور",
      author: "Farjad A Startup Geek :)",
      date: "۹ آگوست",
      poll: {
        question:
          "دوره‌ی خصوصی منتورشیپ بذارم؟ ماکسیمم ۵ تیم. دوره‌ی ۸ هفته‌ای. هر هفته ۹۰ دقیقه. هر دو هفته یک جلسه‌ی اضافه‌ی خصوصی منتورشیپ ۱:۱ برای هر تیم…",
        yes: "آره حتماً. ما شرکت می‌کنیم",
        no: "جذابیتی نداره!",
        yesPct: 71,
        noPct: 29,
        votes: 21,
        votesLabel: "رأی · نظرسنجی کانال",
      },
      post: "پاسخ به سؤال اساساً وظیفه‌ی مشاور و کارشناس است! اینکه یک نفر به همه‌ی سؤالات شما جواب بدهد، دلیل بر این نمی‌شود که نتیجه‌ی درستی برایتان کسب بشود. در مواجهه با آدم‌ها این دو تا را از هم جدا کنید: Credibility و Competency.",
    },
    terms: {
      title: (
        <>
          شرایط، <Muted>رک و راست.</Muted>
        </>
      ),
      lead: "همان‌چیزی که توی کانال نوشتم؛ نه کمتر، نه بیشتر.",
      rows: [
        ["ظرفیت", "۵ تیم. بیشتر نمی‌گیرم، چون وقت واقعی می‌گذارم."],
        ["طول دوره", "۸ هفته."],
        ["جلسه‌ی گروهی", "هر هفته ۹۰ دقیقه — ۲۰ دقیقه Concept، ۵۰ دقیقه Hot Seat، ۲۰ دقیقه تصمیم و قدم بعد."],
        ["جلسه‌ی خصوصی", "هر دو هفته یک‌بار، ۱:۱ با هر تیم — هفته‌های ۲، ۴، ۶ و ۸."],
        ["هزینه", "رایگان. در این ۸ هفته هیچ پولی و هیچ سهامی رد و بدل نمی‌شود."],
        ["بعد از هفته‌ی هشتم", "اگر رشد ببینم، با ۳ تیم وارد همکاری ۱۲ ماهه می‌شویم — آنجا ۲.۵٪ سهام قرارداد می‌شود."],
        ["Demo Day", "نداریم. Decision Day داریم — روزی که تصمیم می‌گیرید، نه روزی که اجرا می‌روید."],
      ],
    },
    weeks: {
      title: "هفته به هفته چه می‌کنیم؟",
      lead: "هر هفته حداقل یک عدم‌قطعیت مهم کم می‌شود — حتی اگر پیشرفت به معنی کشف یک اشتباه باشد. هر تیم هفته‌ای یک Founder Journal هم می‌نویسد: چه باور داشتم، چه شواهدی به چالشش کشید، چه تصمیمی عوض شد، از چه کاری فرار کردم.",
      output: "خروجی:",
      titleDir: "ltr",
      items: [
        { n: "۱", title: "The Founder & The Thesis", desc: "تفکیک آنچه می‌دانیم، آنچه باور داریم و آنچه هنوز نمی‌دانیم.", out: "Venture Thesis v0.1" },
        { n: "۲", title: "Problem Deconstruction", desc: "شکستن مسئله به Trigger، Frequency، Severity و Cost.", out: "Problem Map + ۵ فرض بحرانی" },
        { n: "۳", title: "Customer Discovery", desc: "گفت‌وگوی درست با مشتری واقعی، به‌جای سؤال‌های تأییدی.", out: "Customer Hypothesis + Evidence Log" },
        { n: "۴", title: "Market Reality", desc: "دیدن بازار همان‌طور که هست — رقبا، جایگزین‌ها، و Doing Nothing.", out: "Market Map + Thesis v0.2" },
        { n: "۵", title: "Solution & Value", desc: "کوچک‌ترین راه‌حلی که ارزش اصلی را قابل آزمایش کند.", out: "Solution Hypothesis + آنچه نمی‌سازیم" },
        { n: "۶", title: "Business Model & Kill Risks", desc: "چه کسی پول می‌دهد، چرا، چقدر — و سه ریسکی که می‌تواند همه‌چیز را بکشد.", out: "Kill-Risk Map" },
        { n: "۷", title: "The Critical Experiment", desc: "ارزان‌ترین آزمایش معتبر برای پرریسک‌ترین فرض.", out: "Experiment + Evidence" },
        { n: "۸", title: "Founder Decision Board", desc: "چه باور داشتیم، چه یاد گرفتیم، چه اشتباه بود — و تصمیم ۹۰ روز بعد.", out: "Decision + برنامه ۹۰ روزه" },
      ],
      after:
        "بعضی هفته‌ها عمداً یک اقدام واقعی وسط است: صحبت با آدم واقعی، حذف feature محبوب‌تان، یا آزمایشی که ممکن است نشان بدهد فرض اصلی غلط بوده. هدف فشار مصنوعی نیست — دیدن رفتار شما در موقعیت واقعی است.",
    },
    lens: {
      title: (
        <>
          فقط به ایده <Muted>نگاه نمی‌کنم.</Muted>
        </>
      ),
      lead: "اگر قرار باشد یک سال کنار تیمی بمانم، کیفیت فاندر از جذابیت ایده مهم‌تر است. توی این ۸ هفته دنبال جواب این سؤال‌ها هستم:",
      questions: [
        "این آدم چطور فکر می‌کند؟",
        "چطور تصمیم می‌گیرد؟",
        "وقتی hypothesis خودش غلط از آب درمی‌آید، چه می‌کند؟",
        "وقتی market جواب نمی‌دهد، چه می‌کند؟",
        "وقتی با co-founder اختلاف دارد، چه می‌کند؟",
        "آیا execute می‌کند؟",
        "آیا excuse می‌آورد؟",
        "آیا data را manipulate می‌کند؟",
        "آیا مشتری را می‌فهمد؟",
        "آیا فقط عاشق product خودش است — و چشم‌هایش بسته؟",
      ],
      after: "این‌ها را همان موقع توی کانال هم نوشتم — حتی اگر هیچ‌وقت با من همکاری نکنید، برای شروعِ خودتان سرنخ خوبی است.",
    },
    fit: {
      yesTitle: "بیایید، اگر…",
      yes: [
        "در مرحله‌ی Idea، Validation یا Pre-MVP هستید.",
        "ایده‌ی مشخصی دارید ولی مسیر روشن نیست.",
        "آماده‌اید فرض‌هایتان را زیر سؤال ببرید — واقعاً.",
        "بین جلسات کار می‌کنید، نه فقط توی جلسات.",
      ],
      noTitle: "نیایید، اگر…",
      no: ["دنبال مدرک یا جلسه‌ی انگیزشی هستید.", "انتظار دارید منتور برایتان مشتری بیاورد.", "فقط می‌خواهید کسی ایده‌تان را تأیید کند."],
    },
    photos: {
      title: "این کار را واقعاً انجام می‌دهم.",
      lead: "نه یک دوره‌ی آنلاین که یک‌بار ضبط شده باشد. این چند سال، همین کار را کنار تیم‌ها کرده‌ام — در جلسه‌ی هفتگی، در اتاق شورای منطقه‌ای یورک، و پشت میکروفون.",
      items: [
        { src: "/images/lab/council.jpg", alt: "ارائه‌ی نتایج برنامه در صحن شورای منطقه‌ای یورک", caption: "شورای منطقه‌ای یورک — ارائه‌ی نتایج تیم‌ها", span: PHOTO_SPAN },
        { src: "/images/lab/online-session.jpg", alt: "جلسه‌ی آنلاین منتورشیپ با فاندرهای ایرانی", caption: "جلسه‌ی آنلاین با فاندرهای ایرانی" },
        { src: "/images/lab/cohort.jpg", alt: "تیم‌های دوره در ساختمان منطقه‌ی یورک", caption: "روز آخر یک Cohort" },
        { src: "/images/lab/panel.jpg", alt: "پنل پایانی برنامه‌ی Digital Transformation", caption: "پنل پایانی — تورنتو" },
        { src: "/images/lab/accelerator.jpg", alt: "جشن پایان دوره با تیم شتاب‌دهنده", caption: "آخر دوره، با تیم شتاب‌دهنده" },
      ],
    },
    perks: null,
    apply: {
      closedTitle: "کوهورت اول — آستانه — بسته شد",
      closedBody:
        "۵ تیم پذیرش شدند و کار شروع شده. اگر فرم زیر را پر کنید، برای دوره‌ی بعدی جزو اولویت‌های من خواهید بود — وقتی باز شود، اول از همه با شما تماس می‌گیرم.",
      title: "فرم درخواست برای دوره‌ی بعدی",
      lead: "پنج دقیقه وقت می‌گیرد و جواب صادقانه مهم‌تر از جواب کامل است. دوره‌ی بعدی که باز شود، این فرم‌ها اول بررسی می‌شوند — این فرم اپلیکیشن نهایی نیست.",
      footer: "Cohort ’26 · Toronto / Online ·",
    },
  },
}

const SOCIAL_ICONS = { telegram: Send, youtube: Youtube, linkedin: Linkedin } as const

const BODY = "text-lg leading-relaxed text-v3-soft rtl:leading-loose"
const STICKY = "flex flex-col gap-5 lg:sticky lg:top-28 lg:col-span-4 lg:self-start"

export function LabPage({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const href = (p: string) => localePath(locale, p)

  return (
    <V3Page>
      <PageHero
        kicker={t.hero.kicker}
        title={t.hero.title}
        accent={t.hero.accent}
        lead={
          <>
            <span className="block">{t.hero.p1}</span>
            <span className="mt-5 block">{t.hero.p2}</span>
          </>
        }
        actions={
          <>
            <V3Button href="#apply" locale={locale}>
              {t.hero.apply}
            </V3Button>
            <V3Button href="#terms" variant="secondary" locale={locale}>
              {t.hero.terms}
            </V3Button>
          </>
        }
        aside={
          <figure className="flex flex-col gap-6 sm:flex-row lg:flex-col">
            <div className="relative aspect-[3/4] w-full max-w-xs shrink-0 overflow-hidden rounded-sm bg-v3-raise sm:w-56 lg:w-full lg:max-w-sm">
              <Image
                src="/images/farjad-portrait.jpg"
                alt={t.hero.portraitAlt}
                fill
                priority
                sizes="(max-width: 1024px) 20rem, 24rem"
                className="v3-drift object-cover object-[center_30%] grayscale"
              />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-v3-ink/70 via-transparent to-transparent" />
            </div>
            <figcaption className="flex flex-col gap-5">
              <span className="font-v3-display text-2xl text-v3-bone">{t.hero.name}</span>
              <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-v3-soft rtl:leading-loose">
                {t.hero.record.map((r) => (
                  <li key={r} className="border-s border-v3-light/60 ps-3">
                    {r}
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col text-sm">
                {t.hero.socials.map(({ label, href: url, icon }) => {
                  const Icon = SOCIAL_ICONS[icon]
                  return (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2.5 text-v3-mute transition-colors hover:text-v3-light"
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        {label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </figcaption>
          </figure>
        }
      />

      {/* ── Eight weeks, five teams, free ───────────────────────────── */}
      <section className="border-b border-v3-line/70">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-3 px-5 md:px-10 lg:px-14">
          {t.strip.map((s, i) => (
            <Reveal
              key={i}
              delay={i * 0.08}
              className={`flex items-baseline gap-3 py-10 md:py-14 ${i > 0 ? "border-s border-v3-line/70 ps-5 md:ps-10" : ""}`}
            >
              {s.to !== undefined ? (
                <CountUp to={s.to} locale={locale} className="font-v3-display text-5xl font-light text-v3-bone md:text-7xl" />
              ) : (
                <span className="font-v3-display text-3xl font-light text-v3-light md:text-5xl">{s.value}</span>
              )}
              {s.label && <span className="text-v3-mute md:text-lg">{s.label}</span>}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── What mentoring is not ───────────────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className={STICKY}>
            <Headline>{t.mentoring.title}</Headline>
          </Reveal>
          <div className="flex flex-col gap-10 lg:col-span-8">
            <Reveal>
              <p className={`max-w-2xl ${BODY} md:text-xl`}>{t.mentoring.intro}</p>
            </Reveal>
            <ul className="flex flex-col border-t border-v3-line/70">
              {t.mentoring.rows.map(([title, detail], i) => (
                <li key={title} className="border-b border-v3-line/70">
                  <Reveal
                    delay={(i % 3) * 0.06}
                    className="group flex flex-col gap-1 py-5 transition-[padding] duration-500 hover:ps-3 md:flex-row md:items-baseline md:justify-between md:gap-8"
                  >
                    <span className="font-v3-display text-2xl text-v3-bone transition-colors group-hover:text-v3-light">{title}</span>
                    <span className="text-v3-mute md:text-end">{detail}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
            {t.mentoring.note && (
              <Reveal>
                <p className={`max-w-2xl ${BODY}`}>{t.mentoring.note}</p>
              </Reveal>
            )}
          </div>
        </div>
      </Section>

      {/* ── From the Telegram channel (Persian only) ────────────────── */}
      {t.channel && (
        <Section className="bg-v3-raise/60">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal className={STICKY}>
              <Headline>{t.channel.title}</Headline>
              <p className={BODY}>{t.channel.lead}</p>
              <a
                href={TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2.5 self-start font-medium text-v3-light transition-colors hover:text-v3-bone"
              >
                <Send className="h-4 w-4" aria-hidden />
                {t.channel.link}
              </a>
            </Reveal>
            <div className="flex max-w-2xl flex-col gap-5 lg:col-span-8">
              <Reveal>
                <article className="flex flex-col gap-5 rounded-2xl rounded-ss-md border border-v3-line bg-v3-ink p-6 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/50 md:p-7">
                  <header className="flex items-baseline justify-between gap-4">
                    <span dir="ltr" className="font-medium text-v3-light">
                      {t.channel.author}
                    </span>
                    <time className="shrink-0 text-xs text-v3-mute">{t.channel.date}</time>
                  </header>
                  <p className="leading-loose text-v3-bone">{t.channel.poll.question}</p>
                  <div className="flex flex-col gap-4 text-sm">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between gap-4 font-medium text-v3-bone">
                        <span>{t.channel.poll.yes}</span>
                        <CountUp to={t.channel.poll.yesPct} prefix="٪" locale={locale} className="font-semibold text-v3-light" />
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-v3-line">
                        <div className="h-full w-[71%] rounded-full bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.6)]" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between gap-4 text-v3-mute">
                        <span>{t.channel.poll.no}</span>
                        <CountUp to={t.channel.poll.noPct} prefix="٪" locale={locale} />
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-v3-line">
                        <div className="h-full w-[29%] rounded-full bg-v3-mute/60" />
                      </div>
                    </div>
                    <p className="pt-1 text-xs text-v3-mute">
                      <CountUp to={t.channel.poll.votes} locale={locale} /> {t.channel.poll.votesLabel}
                    </p>
                  </div>
                </article>
              </Reveal>
              <Reveal delay={0.1}>
                <article className="flex flex-col gap-3 rounded-2xl rounded-ss-md border border-v3-line bg-v3-ink p-6 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/50 md:p-7">
                  <header className="flex items-baseline justify-between gap-4">
                    <span dir="ltr" className="font-medium text-v3-light">
                      {t.channel.author}
                    </span>
                    <time className="shrink-0 text-xs text-v3-mute">{t.channel.date}</time>
                  </header>
                  <p className="leading-loose text-v3-bone">{t.channel.post}</p>
                </article>
              </Reveal>
            </div>
          </div>
        </Section>
      )}

      {/* ── Terms ───────────────────────────────────────────────────── */}
      <Section id="terms" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className={STICKY}>
            <Headline>{t.terms.title}</Headline>
            <p className={BODY}>{t.terms.lead}</p>
          </Reveal>
          <dl className="flex flex-col border-t border-v3-line/70 lg:col-span-8">
            {t.terms.rows.map(([term, detail], i) => (
              <Reveal
                key={term}
                delay={(i % 3) * 0.06}
                className="grid grid-cols-1 gap-2 border-b border-v3-line/70 py-6 transition-colors duration-500 hover:bg-v3-raise/60 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6 sm:px-3 md:grid-cols-[12rem_1fr]"
              >
                <dt className="text-sm font-medium text-v3-light">{term}</dt>
                <dd className="text-lg leading-relaxed text-v3-bone rtl:leading-loose">{detail}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </Section>

      {/* ── Week by week ────────────────────────────────────────────── */}
      <Section title={t.weeks.title} lead={t.weeks.lead}>
        <div className="max-w-4xl">
          <LightRule>
            <ol className="flex flex-col">
              {t.weeks.items.map((w) => (
                <li key={w.n} className="relative grid grid-cols-[4.5rem_1fr] gap-6 py-7 md:grid-cols-[7.5rem_1fr] md:gap-10">
                  <span className="font-v3-display text-3xl font-light tabular-nums text-v3-mute md:text-4xl">{w.n}</span>
                  <span
                    aria-hidden
                    className="absolute start-[4.5rem] top-[2.6rem] h-2 w-2 -translate-x-1/2 rounded-full bg-v3-ink ring-1 ring-v3-light md:start-[7.5rem] md:top-[2.9rem] rtl:translate-x-1/2"
                  />
                  <Reveal className="flex flex-col gap-2 ps-6 md:ps-10">
                    <h3 dir={t.weeks.titleDir} className="self-start font-v3-display text-2xl leading-snug text-v3-bone">
                      {w.title}
                    </h3>
                    <p className="max-w-xl leading-relaxed text-v3-soft rtl:leading-loose">{w.desc}</p>
                    <p className="mt-1 text-sm font-medium text-v3-light">
                      {t.weeks.output} {w.out}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </LightRule>
          <Reveal>
            <p className={`mt-10 max-w-3xl ${BODY}`}>{t.weeks.after}</p>
          </Reveal>
        </div>
      </Section>

      {/* ── The lens ────────────────────────────────────────────────── */}
      <Section className="bg-v3-raise">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className={STICKY}>
            <Headline>{t.lens.title}</Headline>
            <p className={BODY}>{t.lens.lead}</p>
          </Reveal>
          <div className="lg:col-span-8">
            <ul className="flex flex-col">
              {t.lens.questions.map((q, i) => (
                <li key={i} className="border-b border-v3-line/70 last:border-b-0">
                  <Reveal
                    delay={(i % 4) * 0.05}
                    className="py-5 font-v3-display text-2xl leading-snug text-v3-bone transition-colors duration-300 hover:text-v3-light md:text-3xl rtl:leading-relaxed"
                  >
                    {q}
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal>
              <p className={`mt-10 max-w-2xl ${BODY}`}>{t.lens.after}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ── Who it is for ───────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Card tone="lit" className="transition-transform duration-500 hover:-translate-y-1">
              <Headline size="card">{t.fit.yesTitle}</Headline>
              <Checklist items={t.fit.yes} />
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="transition-transform duration-500 hover:-translate-y-1">
              <Headline size="card" className="text-v3-soft">
                {t.fit.noTitle}
              </Headline>
              <Checklist items={t.fit.no} tone="no" />
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── Photos ──────────────────────────────────────────────────── */}
      <Section title={t.photos.title} lead={t.photos.lead}>
        <div className="grid auto-rows-[10rem] grid-cols-2 gap-3 md:auto-rows-[14rem] md:grid-cols-4">
          {t.photos.items.map((p, i) => (
            <Reveal key={p.src} delay={(i % 4) * 0.08} className={p.span ?? ""}>
              <figure className="group relative h-full overflow-hidden rounded-2xl bg-v3-raise">
                <Parallax className="h-full">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes={p.span ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                    className="object-cover grayscale transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                </Parallax>
                <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-v3-ink/90 via-v3-ink/50 to-transparent p-4 pt-12 text-xs font-medium text-v3-bone md:text-sm">
                  {p.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Perk partners (English page) ────────────────────────────── */}
      {t.perks && (
        <Section>
          <Reveal>
            <Card href={href("/lab/perks")} tone="lit" className="md:flex-row md:items-center md:justify-between md:gap-10 md:p-10">
              <div className="flex max-w-2xl items-start gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-v3-light/50 text-v3-light">
                  <Gift className="h-5 w-5" aria-hidden />
                </span>
                <div className="flex flex-col gap-2">
                  <Headline size="card" className="transition-colors group-hover:text-v3-light">
                    {t.perks.title}
                  </Headline>
                  <p className="leading-relaxed text-v3-soft">{t.perks.body}</p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 font-medium text-v3-light">
                {t.perks.cta}
                <Arrow locale={locale} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
            </Card>
          </Reveal>
        </Section>
      )}

      {/* ── Application ─────────────────────────────────────────────── */}
      <Section id="apply" className="scroll-mt-24" bordered={false}>
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <Reveal>
            <Card tone="lit">
              <div className="flex items-start gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-v3-light/50 text-v3-light">
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                </span>
                <div className="flex flex-col gap-2">
                  <p className="font-v3-display text-xl text-v3-bone md:text-2xl">{t.apply.closedTitle}</p>
                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">{t.apply.closedBody}</p>
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal className="flex flex-col gap-4">
            <Headline>{t.apply.title}</Headline>
            <Lead className="mt-2">{t.apply.lead}</Lead>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-v3-line/80 p-6 md:p-10">
              <ApplicationForm locale={locale} />
            </div>
          </Reveal>

          <p className="text-center text-sm text-v3-mute">
            {t.apply.footer}{" "}
            <a
              href="mailto:its@farjadp.info"
              dir="ltr"
              className="text-v3-soft underline decoration-v3-line underline-offset-4 transition-colors hover:text-v3-light hover:decoration-v3-light"
            >
              its@farjadp.info
            </a>
          </p>
        </div>
      </Section>
    </V3Page>
  )
}
