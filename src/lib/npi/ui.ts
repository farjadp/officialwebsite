// ============================================================================
// UI strings for the NPI personal brand tool, per locale.
// English strings are copied verbatim out of the component; Persian is the
// house voice (formal but human).
// ============================================================================

import { NpiLocale } from "./data";

export interface NpiAction {
  title: string;
  desc: string;
}

export interface NpiUiStrings {
  // progress
  progressLabels: string[];

  // intro
  pillarBadges: [string, string, string];
  introTitle: string;
  introLead: string;
  introRows: { mark: string; name: string; rest: string }[];
  introRowSeparator: string;
  introButton: string;
  introMeta: string;

  // question steps
  steps: { badge: string; subtitle: string; desc: string }[];
  choiceHint: (max: number, selected: number) => string;

  // navigation
  back: string;
  next: string;
  almostDone: string;
  submitCta: string;
  submitCtaLoading: string;

  // lead step
  leadKicker: string;
  leadTitle: string;
  leadBody: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  roleLabel: string;
  roleOptional: string;
  rolePlaceholder: string;
  consent: string;
  consentRequired: string;

  // validation / errors
  nameRequired: string;
  emailInvalid: string;
  saveFailed: string;
  submitError: string;

  // plan
  planKicker: string;
  planHeading: (firstName: string) => string;
  planFallbackName: string;
  planBuiltWith: string;
  dateLocale: string;
  brandStatement: (audience: string, problem: string, knownFor: string) => string;
  knownForJoiner: string;

  narrativeHeading: string;
  presenceHeading: string;
  impactHeading: string;
  actionsHeading: string;

  rowAudience: string;
  rowKnownFor: string;
  rowThemes: string;
  rowPlatforms: string;
  rowFrequency: string;
  rowFormats: string;
  rowRhythm: string;
  rowGoal: string;
  rowTarget: string;
  rowMetrics: string;

  // result logic
  rhythmMap: Record<string, string>;
  metricsMap: Record<string, string[]>;
  metricsFallback: string[];
  challengeActions: Record<string, NpiAction>;
  platformAction: (platform: string) => NpiAction;
  defaultPlatform: string;
  goalActions: Record<string, NpiAction>;
  consistencyActions: Record<string, NpiAction>;
  fallbackAction: NpiAction;

  // download
  downloadHeading: string;
  downloadBody: string;
  downloadButton: string;

  // footer
  footerLead: string;
  footerName: string;
  footerRole: string;
  footerCta: string;
}

const en: NpiUiStrings = {
  progressLabels: ["Intro", "Narrative", "Presence", "Impact", "Plan"],

  pillarBadges: ["N · Narrative", "P · Presence", "I · Impact"],
  introTitle: "Build Your Personal Brand Plan in 5 Minutes",
  introLead:
    "Answer 12 questions. Get a free personalized NPI plan — your narrative, your presence system, and your impact targets — in an Excel file you can use starting today.",
  introRows: [
    { mark: "N", name: "Narrative", rest: "your brand statement, audience, and core themes" },
    { mark: "P", name: "Presence", rest: "your weekly visibility system based on your reality" },
    { mark: "I", name: "Impact", rest: "the metrics that actually matter for your goal" },
  ],
  introRowSeparator: " — ",
  introButton: "Start Building My Plan →",
  introMeta: "Used by consultants, founders, and professionals in Canada",

  steps: [
    {
      badge: "N · Narrative",
      subtitle: "Define what you stand for",
      desc: "These 4 questions build your brand statement and core themes.",
    },
    {
      badge: "P · Presence",
      subtitle: "How you show up consistently",
      desc: "These answers build your personal presence system.",
    },
    {
      badge: "I · Impact",
      subtitle: "Define the results that matter",
      desc: "These answers determine what you should measure — and what success actually looks like.",
    },
  ],
  choiceHint: (max, selected) => `(Choose up to ${max}. Selected: ${selected}/${max})`,

  back: "← Back",
  next: "Next →",
  almostDone: "Almost Done →",
  submitCta: "Get My Free NPI Plan →",
  submitCtaLoading: "Building your plan...",

  leadKicker: "Get Your Plan",
  leadTitle: "Your personalized NPI plan is ready.",
  leadBody: "Enter your name and email to access your free Excel plan. You will also receive a copy by email.",
  nameLabel: "Full Name *",
  namePlaceholder: "Your full name",
  emailLabel: "Email Address *",
  emailPlaceholder: "your@email.com",
  roleLabel: "Your Current Role ",
  roleOptional: "(optional)",
  rolePlaceholder: "e.g. Founder, Consultant",
  consent:
    "I agree to receive occasional insights and updates from Farjad Pourmohammad. No spam. Unsubscribe anytime.",
  consentRequired: "Please tick the box so we can send you the plan.",

  nameRequired: "Name is required",
  emailInvalid: "Invalid email address",
  saveFailed: "Failed to save. Please try again.",
  submitError: "Error submitting. Please check your connection.",

  planKicker: "Your NPI Plan",
  planHeading: (firstName) => `${firstName}’s Personal Brand Plan`,
  planFallbackName: "Your",
  planBuiltWith: "Built with the NPI Framework · ",
  dateLocale: "en-CA",
  brandStatement: (audience, problem, knownFor) =>
    `"I help ${audience || "..."} ${problem} through ${knownFor}."`,
  knownForJoiner: " and ",

  narrativeHeading: "N · NARRATIVE — What you stand for",
  presenceHeading: "P · PRESENCE — How you show up",
  impactHeading: "I · IMPACT — What you measure",
  actionsHeading: "⚡ YOUR NEXT 3 ACTIONS — Start this week",

  rowAudience: "Target Audience",
  rowKnownFor: "Known For",
  rowThemes: "Core Themes",
  rowPlatforms: "Main Platforms",
  rowFrequency: "Frequency",
  rowFormats: "Formats",
  rowRhythm: "Weekly Rhythm",
  rowGoal: "Primary Goal",
  rowTarget: "90-Day Target",
  rowMetrics: "Key Metrics",

  rhythmMap: {
    "Every day (aggressive mode)": "Post daily: rotate short post → story → insight → engagement → repeat.",
    "3–4 times per week (recommended)": "Week structure: 2 short posts + 1 long-form + 5 meaningful comments.",
    "1–2 times per week (sustainable)": "1 strong post per week + 3–5 thoughtful comments on relevant content.",
    "A few times per month (starter)": "2 posts per month minimum + consistent engagement in your community.",
  },
  metricsMap: {
    "Get more consulting or freelance clients": [
      "Qualified inbound DMs / week",
      "Discovery calls booked / month",
      "Referrals received / month",
    ],
    "Attract investors or partnerships": [
      "Investor intro conversations / month",
      "Partnership meetings / month",
      "Warm introductions through content",
    ],
    "Get speaking invitations": [
      "Speaking invitations / month",
      "Event applications submitted",
      "Podcast / guest appearances",
    ],
    "Build a community or audience": [
      "Newsletter subscribers (qualified)",
      "Engaged comments per post",
      "Community members who DM you",
    ],
    "Find a better job or career opportunity": [
      "Recruiter / hiring manager outreach",
      "Profile views increase",
      "Job referrals from network",
    ],
    "Launch and sell a product or service": [
      "Content-to-purchase conversions",
      "Waitlist signups",
      "DMs about your offer",
    ],
    "Become a recognized thought leader": [
      "Media mentions / month",
      "Invitation to contribute / publish",
      "Peer recognition signals",
    ],
  },
  metricsFallback: ["Inbound opportunities / month", "Content engagement quality", "Network growth (qualified)"],

  challengeActions: {
    "I do not know what to say or stand for": {
      title: "Use your brand statement as your LinkedIn headline.",
      desc: " The statement in your plan above — put it on your profile today. Not tomorrow. Today.",
    },
    "I do not show up consistently enough": {
      title: "Commit to one post this week — just one.",
      desc: " Forget streaks and consistency goals for now. Publish one strong thing. Build the habit from there.",
    },
    "I get attention but no real results": {
      title: "Add a clear call to action to your next 3 posts.",
      desc: " End each post with one sentence that invites a specific response: a DM, a comment, a booking.",
    },
    "I do not have time": {
      title: "Block 45 minutes every Sunday for your NPI review.",
      desc: " That is all you need. Plan the week's content in 20 minutes. Update your tracker in 15. Reflect in 10.",
    },
    "I am starting from zero": {
      title: "Start by documenting, not creating.",
      desc: " Share what you are learning and doing. You do not need expertise to start — you need honesty.",
    },
  },
  platformAction: (platform) => ({
    title: "Pick one platform and commit to it for 60 days.",
    desc: ` Based on your answers, start with ${platform}. Master one before adding another.`,
  }),
  defaultPlatform: "LinkedIn",
  goalActions: {
    "Get more consulting or freelance clients": {
      title: "Reach out to 3 warm contacts this week.",
      desc: " No pitch. Just a genuine check-in or share something relevant to them. Relationship before transaction.",
    },
    "Attract investors or partnerships": {
      title: "Write one post about a real problem you are solving.",
      desc: " Not your solution — the problem. Investors and partners lean in when they recognize the pain.",
    },
    "Get speaking invitations": {
      title: "Comment thoughtfully on 5 event organizer or host posts this week.",
      desc: " Be visible in the right spaces before you ask to be on stage.",
    },
    "Build a community or audience": {
      title: "Reply to every comment you get for the next 30 days.",
      desc: " Community is built in the replies, not in the posts.",
    },
  },
  consistencyActions: {
    "Very consistent — I posted regularly": {
      title: "Your next step is quality over quantity.",
      desc: " You show up — good. Now ask: does each piece of content tie directly to one of your 5 themes?",
    },
    "Inconsistent — I started and stopped": {
      title: "Lower the bar to make consistency possible.",
      desc: " A system you keep for 9 months beats a sprint that lasts 9 days. Cut your target in half if needed.",
    },
    "Not active — I am starting now": {
      title: "Publish your first post this week.",
      desc: " Share your brand statement from this plan as a LinkedIn post. Say who you help and why it matters. That is post one.",
    },
  },
  fallbackAction: {
    title: "Open your NPI Excel plan and fill in your Pipeline sheet.",
    desc: " List every warm contact you have. Then identify the top 3 people.",
  },

  downloadHeading: "📥 Download Your Personalized NPI Excel Plan",
  downloadBody:
    "Get your complete NPI operating system — Narrative, Weekly Tracker, Impact Log, and Pipeline — pre-filled with your answers.",
  downloadButton: "Download My NPI Plan (.xlsx)",

  footerLead: "Built on the NPI Framework by ",
  footerName: "Farjad Pourmohammad",
  footerRole: " — Business Consultant, Toronto",
  footerCta: " · Book a free strategy session",
};

/** Shown when an answer is missing, so the sentence still reads. */
const faMissing = "\u2026";

/** Latin digits → Persian digits, for numbers that appear inside Persian prose. */
function fd(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

const fa: NpiUiStrings = {
  progressLabels: ["آغاز", "روایت", "حضور", "اثر", "برنامه"],

  pillarBadges: ["N · روایت", "P · حضور", "I · اثر"],
  introTitle: "برنامه‌ی برند شخصی‌تان را در ۵ دقیقه بسازید",
  introLead:
    "به ۱۲ پرسش پاسخ دهید و یک برنامه‌ی اختصاصی NPI رایگان بگیرید: روایت شما، نظام حضورتان و هدف‌های اثرتان، در یک فایل اکسل که از همین امروز می‌توانید به‌کار ببرید.",
  introRows: [
    { mark: "N", name: "روایت", rest: "جمله‌ی برند، مخاطب و موضوع‌های اصلی شما" },
    { mark: "P", name: "حضور", rest: "نظام هفتگی دیده‌شدن، متناسب با واقعیت زندگی شما" },
    { mark: "I", name: "اثر", rest: "سنجه‌هایی که برای هدف شما واقعاً اهمیت دارند" },
  ],
  introRowSeparator: ": ",
  introButton: "ساخت برنامه را شروع کن",
  introMeta: "مشاوران، بنیان‌گذاران و متخصصان در کانادا از آن استفاده می‌کنند",

  steps: [
    {
      badge: "N · روایت",
      subtitle: "روشن کنید بر سر چه می‌ایستید",
      desc: "این ۴ پرسش، جمله‌ی برند و موضوع‌های اصلی شما را می‌سازد.",
    },
    {
      badge: "P · حضور",
      subtitle: "چگونه پیوسته حاضر می‌شوید",
      desc: "این پاسخ‌ها نظام حضور شخصی شما را می‌سازد.",
    },
    {
      badge: "I · اثر",
      subtitle: "نتیجه‌هایی که اهمیت دارند",
      desc: "این پاسخ‌ها تعیین می‌کند چه چیزی را باید بسنجید و موفقیت واقعاً چه شکلی است.",
    },
  ],
  choiceHint: (max, selected) => `(حداکثر ${fd(max)} مورد. انتخاب‌شده: ${fd(selected)} از ${fd(max)})`,

  back: "بازگشت",
  next: "بعدی",
  almostDone: "نزدیک پایان",
  submitCta: "برنامه‌ی رایگان NPI من",
  submitCtaLoading: "در حال ساخت برنامه‌ی شما...",

  leadKicker: "دریافت برنامه",
  leadTitle: "برنامه‌ی اختصاصی NPI شما آماده است.",
  leadBody:
    "برای دریافت فایل اکسل رایگان، نام و ایمیل‌تان را وارد کنید. یک نسخه هم با ایمیل برایتان فرستاده می‌شود.",
  nameLabel: "نام و نام خانوادگی *",
  namePlaceholder: "نام کامل شما",
  emailLabel: "نشانی ایمیل *",
  emailPlaceholder: "your@email.com",
  roleLabel: "سمت فعلی شما ",
  roleOptional: "(اختیاری)",
  rolePlaceholder: "مثال: بنیان‌گذار، مشاور",
  consent:
    "موافقم که هرازگاهی نکته‌ها و به‌روزرسانی‌های فرجاد را دریافت کنم. بدون اسپم. هر زمان خواستید لغو اشتراک کنید.",
  consentRequired: "برای اینکه برنامه را برایتان بفرستیم، این گزینه را تأیید کنید.",

  nameRequired: "وارد کردن نام لازم است",
  emailInvalid: "نشانی ایمیل معتبر نیست",
  saveFailed: "ذخیره نشد. لطفاً دوباره تلاش کنید.",
  submitError: "خطا در ارسال. لطفاً اتصال اینترنت‌تان را بررسی کنید.",

  planKicker: "برنامه‌ی NPI شما",
  planHeading: (firstName) => `برنامه‌ی برند شخصی ${firstName}`,
  planFallbackName: "شما",
  planBuiltWith: "ساخته‌شده با چارچوب NPI · ",
  dateLocale: "fa-IR",
  brandStatement: (audience, problem, knownFor) =>
    `«مخاطب من ${audience || faMissing} است. مسئله‌ای که حل می‌کنم: ${problem} و آنچه کار مرا متمایز می‌کند، ${knownFor} است.»`,
  knownForJoiner: " و ",

  narrativeHeading: "N · روایت: بر سر چه می‌ایستید",
  presenceHeading: "P · حضور: چگونه حاضر می‌شوید",
  impactHeading: "I · اثر: چه چیزی را می‌سنجید",
  actionsHeading: "⚡ سه کار بعدی شما: از همین هفته",

  rowAudience: "مخاطب هدف",
  rowKnownFor: "شناخته‌شده برای",
  rowThemes: "موضوع‌های اصلی",
  rowPlatforms: "بسترهای اصلی",
  rowFrequency: "تناوب انتشار",
  rowFormats: "قالب‌ها",
  rowRhythm: "ریتم هفتگی",
  rowGoal: "هدف اصلی",
  rowTarget: "هدف ۹۰ روزه",
  rowMetrics: "سنجه‌های کلیدی",

  rhythmMap: {
    "هر روز (حالت پرشتاب)":
      "هر روز منتشر کنید: پست کوتاه، روایت، یک بینش، تعامل و دوباره از آغاز.",
    "۳ تا ۴ بار در هفته (پیشنهادی)":
      "ساختار هفته: ۲ پست کوتاه، ۱ مطلب بلند و ۵ کامنت معنادار.",
    "۱ تا ۲ بار در هفته (پایدار)":
      "هفته‌ای ۱ پست قوی، به‌علاوه‌ی ۳ تا ۵ کامنت سنجیده روی محتوای مرتبط.",
    "چند بار در ماه (نقطه‌ی شروع)":
      "دست‌کم ماهی ۲ پست، به‌علاوه‌ی حضور پیوسته در جمع مخاطبانتان.",
  },
  metricsMap: {
    "جذب مشتری بیشتر برای مشاوره یا کار آزاد": [
      "پیام مستقیم واجد شرایط در هفته",
      "جلسه‌ی آشنایی رزروشده در ماه",
      "معرفی‌های دریافتی در ماه",
    ],
    "جلب سرمایه‌گذار یا شریک": [
      "گفت‌وگوی آشنایی با سرمایه‌گذار در ماه",
      "جلسه‌ی شراکت در ماه",
      "معرفی‌های گرم از مسیر محتوا",
    ],
    "دریافت دعوت برای سخنرانی": [
      "دعوت به سخنرانی در ماه",
      "درخواست‌های ارسال‌شده به رویدادها",
      "حضور در پادکست یا برنامه‌ی مهمان",
    ],
    "ساختن اجتماع یا مخاطب": [
      "مشترکان واجد شرایط خبرنامه",
      "کامنت‌های معنادار در هر پست",
      "اعضایی که به شما پیام مستقیم می‌دهند",
    ],
    "یافتن شغل یا فرصت شغلی بهتر": [
      "تماس از سوی جذب نیرو یا مدیر استخدام",
      "رشد بازدید نمایه",
      "معرفی شغلی از شبکه‌ی ارتباطی",
    ],
    "عرضه و فروش یک محصول یا خدمت": [
      "تبدیل محتوا به خرید",
      "ثبت‌نام در فهرست انتظار",
      "پیام‌های مستقیم درباره‌ی پیشنهاد شما",
    ],
    "شناخته‌شدن به‌عنوان مرجع فکری": [
      "ارجاع رسانه‌ای در ماه",
      "دعوت به نوشتن یا انتشار",
      "نشانه‌های اعتبار نزد هم‌صنفان",
    ],
  },
  metricsFallback: ["فرصت‌های ورودی در ماه", "کیفیت تعامل با محتوا", "رشد شبکه‌ی ارتباطی واجد شرایط"],

  challengeActions: {
    "نمی‌دانم چه بگویم یا بر سر چه بایستم": {
      title: "جمله‌ی برندتان را تیتر نمایه‌ی لینکدین کنید.",
      desc: " همان جمله‌ای که بالاتر در برنامه‌تان آمده است. همین امروز روی نمایه‌تان بگذارید، نه فردا.",
    },
    "به‌اندازه‌ی کافی پیوسته حاضر نمی‌شوم": {
      title: "این هفته فقط به یک پست متعهد شوید.",
      desc: " فعلاً رکورد و هدف‌های پیوستگی را کنار بگذارید. یک چیز قوی منتشر کنید و عادت را از همان‌جا بسازید.",
    },
    "دیده می‌شوم اما نتیجه‌ی واقعی نمی‌گیرم": {
      title: "به سه پست بعدی‌تان یک دعوت روشن به اقدام اضافه کنید.",
      desc: " هر پست را با یک جمله تمام کنید که پاسخی مشخص می‌خواهد: یک پیام، یک کامنت، یک رزرو جلسه.",
    },
    "وقت ندارم": {
      title: "هر یکشنبه ۴۵ دقیقه برای مرور NPI کنار بگذارید.",
      desc: " همین کافی است. ۲۰ دقیقه برای برنامه‌ی محتوای هفته، ۱۵ دقیقه برای به‌روزرسانی جدول پیگیری و ۱۰ دقیقه برای مرور.",
    },
    "از صفر شروع می‌کنم": {
      title: "به‌جای خلق کردن، از مستند کردن شروع کنید.",
      desc: " آنچه را می‌آموزید و انجام می‌دهید به اشتراک بگذارید. برای شروع به تخصص نیاز ندارید، به صداقت نیاز دارید.",
    },
  },
  platformAction: (platform) => ({
    title: "یک بستر را انتخاب کنید و ۶۰ روز به آن پایبند بمانید.",
    desc: ` بر اساس پاسخ‌هایتان، از ${platform} شروع کنید. پیش از افزودن بستر دوم، در یکی استاد شوید.`,
  }),
  defaultPlatform: "LinkedIn",
  goalActions: {
    "جذب مشتری بیشتر برای مشاوره یا کار آزاد": {
      title: "این هفته با ۳ آشنای نزدیک تماس بگیرید.",
      desc: " بدون پیشنهاد فروش. فقط یک احوال‌پرسی واقعی یا به اشتراک گذاشتن چیزی مرتبط با کارشان. رابطه پیش از معامله.",
    },
    "جلب سرمایه‌گذار یا شریک": {
      title: "یک پست درباره‌ی مسئله‌ی واقعی‌ای که حل می‌کنید بنویسید.",
      desc: " نه درباره‌ی راه‌حل‌تان، بلکه درباره‌ی خود مسئله. سرمایه‌گذار و شریک وقتی جذب می‌شوند که درد را بشناسند.",
    },
    "دریافت دعوت برای سخنرانی": {
      title: "این هفته زیر ۵ پست برگزارکنندگان و میزبانان رویدادها کامنت سنجیده بگذارید.",
      desc: " پیش از آنکه صحنه را بخواهید، در فضای درست دیده شوید.",
    },
    "ساختن اجتماع یا مخاطب": {
      title: "تا ۳۰ روز آینده به هر کامنتی که می‌گیرید پاسخ دهید.",
      desc: " اجتماع در پاسخ‌ها ساخته می‌شود، نه در پست‌ها.",
    },
  },
  consistencyActions: {
    "بسیار پیوسته: منظم منتشر کرده‌ام": {
      title: "گام بعدی شما کیفیت است، نه تعداد.",
      desc: " پیوسته حاضر می‌شوید و این خوب است. حالا بپرسید: هر محتوا مستقیماً به یکی از ۵ موضوع اصلی شما وصل است؟",
    },
    "ناپیوسته: شروع کرده‌ام و رها کرده‌ام": {
      title: "سقف انتظار را پایین بیاورید تا پیوستگی ممکن شود.",
      desc: " نظامی که ۹ ماه ادامه دهید از دوی سرعتی که ۹ روز طول می‌کشد بهتر است. اگر لازم است هدف‌تان را نصف کنید.",
    },
    "فعال نبوده‌ام: تازه شروع می‌کنم": {
      title: "نخستین پست‌تان را همین هفته منتشر کنید.",
      desc: " جمله‌ی برند همین برنامه را به‌صورت یک پست در لینکدین بگذارید. بگویید به چه کسانی کمک می‌کنید و چرا اهمیت دارد. این می‌شود پست شماره‌ی یک.",
    },
  },
  fallbackAction: {
    title: "فایل اکسل NPI را باز کنید و برگه‌ی Pipeline را پر کنید.",
    desc: " هر آشنای نزدیکی که دارید بنویسید. بعد ۳ نفر نخست را مشخص کنید.",
  },

  downloadHeading: "📥 برنامه‌ی اکسل اختصاصی NPI خود را دانلود کنید",
  downloadBody:
    "سامانه‌ی کامل NPI خود را بگیرید: روایت، جدول پیگیری هفتگی، دفتر اثر و خط لوله‌ی فرصت‌ها، از پیش با پاسخ‌های شما پر شده است.",
  downloadButton: "دانلود برنامه‌ی NPI من (.xlsx)",

  footerLead: "ساخته‌شده بر پایه‌ی چارچوب NPI، از ",
  footerName: "فرجاد",
  footerRole: "، مشاور کسب‌وکار، تورنتو",
  footerCta: " · رزرو جلسه‌ی استراتژی رایگان",
};

export function getNpiUiStrings(locale: NpiLocale): NpiUiStrings {
  return locale === "fa" ? fa : en;
}
