// ============================================================================
// File Path: src/components/v3/reports/migrant-stock/copy.ts
// Why: Every word of report 05 in both locales, one structure for both. The
//      Persian follows Farjad's own draft (the "۳۰۴ میلیون" artifact) and
//      keeps its argument: count and share answer different questions. The
//      English says the same thing. Figures are UN DESA's; game explanations
//      are index-aligned with the pairs in ./data.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { RegionKey } from "./data"

type Copy = {
  hero: { kicker: string; lead: string; stats: { value: string; label: string }[]; asOf: string; scroll: string }
  paradox: {
    kicker: string
    title: string
    lead: string
    countTitle: string
    shareTitle: string
    countCap: string
    shareCap: string
    scrub: string
    million: string
    why: { title: string; body: string }
    math: { label: string; value: string }[]
  }
  hundred: {
    kicker: string
    title: string
    lead: string
    world: string
    migrant: string
    native: string
    sentence: (n: string, place: string) => string
    note: string
  }
  regions: { kicker: string; title: string; lead: string; names: Record<RegionKey, string>; ofWorld: string; ofPop: string; highIncome: string }
  flip: {
    kicker: string
    title: string
    lead: string
    byCount: string
    byShare: string
    note: string
    gulf: { title: string; body: string }
  }
  explorer: {
    kicker: string
    title: string
    lead: string
    search: string
    placeholder: string
    none: string
    stock: string
    share: string
    female: string
    since1990: string
    rankCount: (r: string) => string
    rankShare: (r: string) => string
    rankShareNone: string
    typeTitle: string
    types: Record<"B" | "C" | "R" | "I", string>
    quick: string
  }
  spot: {
    kicker: string
    title: string
    iran: { title: string; body: string[] }
    canada: { title: string; body: string[] }
  }
  gender: { kicker: string; title: string; lead: string; avg: string; caption: string; above: string; below: string }
  game: {
    kicker: string
    title: string
    lead: string
    rankLabel: string
    ranks: string[]
    of: string
    points: string
    next: (name: string, at: string) => string
    top: string
    reset: string
    resetConfirm: string
    level: string
    done: string
    question: (i: string, n: string) => string
    or: string
    right: (pts: string) => string
    wrong: string
    cont: string
    submit: string
    actual: string
    tryAgain: string
    streak: string
    levelDone: (name: string) => string
    badgeGot: (b: string) => string
    replayNote: string
    goNext: (name: string) => string
    again: string
    allDone: { title: string; body: string }
    levels: { name: string; sub: string; badge: string; ctx: string }[]
    why: { count: string[]; share: string[]; gender: string[] }
    est: Record<"worldPct" | "growth" | "female" | "uae", { q: string; why: string }>
  }
  passport: { title: string; hint: string; stamps: Record<StampKey, string>; complete: string; open: string; close: string }
  care: { kicker: string; title: string; items: { t: string; b: string }[] }
  method: { kicker: string; title: string; notes: string[]; sourcesTitle: string; sources: { label: string; href: string }[] }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
}

export type StampKey = "timeline" | "hundred" | "flip" | "explorer" | "gender" | "quiz"

const SOURCES = [
  {
    label: "UN DESA Population Division (2024). International Migrant Stock 2024. POP/DB/MIG/Stock/Rev.2024 (CC BY 3.0 IGO)",
    href: "https://www.un.org/development/desa/pd/content/international-migrant-stock",
  },
  {
    label: "UN DESA (2025). International Migrant Stock 2024: Key facts and figures",
    href: "https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/undesa_pd_2025_intlmigstock_2024_key_facts_and_figures_advance-unedited.pdf",
  },
  {
    label: "Richland, Kornell & Kao (2009). The pretesting effect. Journal of Experimental Psychology: Applied 15(3)",
    href: "https://doi.org/10.1037/a0016496",
  },
  {
    label: "UNHCR Refugee Data Finder: refugees hosted by Iran, end-2024",
    href: "https://api.unhcr.org/population/v1/population/?year=2024&coa=IRN&coo_all=true",
  },
]

export const COPY: Record<Locale, Copy> = {
  fa: {
    hero: {
      kicker: "گزارش‌ها",
      lead: "در سال ۲۰۲۴ حدود ۳۰۴ میلیون نفر در کشوری غیر از کشور تولدشان زندگی می‌کنند. این عدد از سال ۱۹۹۰ تقریباً دو برابر شده است؛ اما سهم مهاجران از جمعیت جهان فقط از ۲٫۹ به ۳٫۷ درصد رسیده. این صفحه نشان می‌دهد چرا این دو جمله با هم تناقض ندارند، و بعد از تو می‌خواهد حدس بزنی.",
      stats: [
        { value: "۳۰۴", label: "میلیون مهاجر بین‌المللی، نیمه‌ی ۲۰۲۴" },
        { value: "۳٫۷٪", label: "از جمعیت جهان" },
        { value: "۴۸٪", label: "زن" },
      ],
      asOf: "داده: سازمان ملل، بخش جمعیت (UN DESA)، International Migrant Stock 2024. همه‌ی ارقام مربوط به ۱ ژوئیه‌ی هر سال است.",
      scroll: "پاسپورتت را پر کن: با هر بخش تعاملی یک مهر می‌گیری.",
    },
    paradox: {
      kicker: "تناقض ظاهری",
      title: "دو برابر شد؛ اما هنوز کمتر از ۴ نفر از هر ۱۰۰ نفر",
      lead: "هر دو نمودار از صفر شروع می‌شوند. نوار زمان را بکش و ببین دو عدد چطور کنار هم حرکت می‌کنند.",
      countTitle: "تعداد مهاجران",
      shareTitle: "سهم از جمعیت جهان",
      countCap: "از ۱۵۴ میلیون به ۳۰۴ میلیون: تقریباً دو برابر.",
      shareCap: "از ۲٫۹ به ۳٫۷ درصد: کند و آرام.",
      scrub: "سال",
      million: "میلیون",
      why: {
        title: "چرا هر دو درست‌اند",
        body: "جمعیت جهان هم در همین دوره رشد کرده است: از ۵٫۳ به ۸٫۲ میلیارد نفر. وقتی صورت و مخرج هر دو بزرگ می‌شوند، نسبت آهسته جابه‌جا می‌شود. پس جمله‌ی «مهاجرت در حال انفجار است» با داده سازگار نیست؛ آنچه سریع رشد کرده اندازه‌ی مطلق است، نه سهم.",
      },
      math: [
        { label: "رشد مهاجران، ۱۹۹۰ تا ۲۰۲۴", value: "۱٫۹۸×" },
        { label: "رشد جمعیت جهان", value: "۱٫۵۳×" },
        { label: "سهم مهاجران", value: "۲٫۹٪ ← ۳٫۷٪" },
      ],
    },
    hundred: {
      kicker: "صد نفر",
      title: "اگر دنیا صد نفر بود",
      lead: "هر آدمک یک درصد جمعیت است. یک کشور را انتخاب کن و ببین از هر صد نفر ساکن آن، چند نفر جای دیگری به دنیا آمده‌اند.",
      world: "جهان",
      migrant: "مهاجر",
      native: "متولد همان کشور",
      sentence: (n, place) => `در ${place}، از هر ۱۰۰ نفر حدود ${n} نفر مهاجرند.`,
      note: "سهم‌ها گرد شده‌اند. برای کشورهایی که «تابعیت» را می‌شمارند (کد C)، عدد یعنی ساکنان با تابعیت خارجی.",
    },
    regions: {
      kicker: "کجا زندگی می‌کنند",
      title: "نیمی از مهاجران جهان در اروپا و آمریکای شمالی‌اند",
      lead: "تقسیم ۳۰۴ میلیون مهاجر میان مناطق مقصد. پهنای هر نوار، سهم آن منطقه از کل مهاجران جهان است.",
      names: {
        eu_na: "اروپا و آمریکای شمالی",
        nafr_wasia: "شمال آفریقا و غرب آسیا",
        ssa: "آفریقای جنوب صحرا",
        e_se_asia: "شرق و جنوب‌شرق آسیا",
        c_s_asia: "آسیای مرکزی و جنوبی",
        latam: "آمریکای لاتین و کارائیب",
        anz: "استرالیا و نیوزیلند",
        oceania: "باقی اقیانوسیه",
      },
      ofWorld: "از مهاجران جهان",
      ofPop: "از جمعیت منطقه",
      highIncome: "کشورهای پردرآمد میزبان ۶۵٫۵ درصد مهاجران جهان‌اند.",
    },
    flip: {
      kicker: "یک داده، دو رتبه‌بندی",
      title: "معیار را عوض کن، فهرست زیر و رو می‌شود",
      lead: "اگر بر اساس تعداد مرتب کنی، کشورهای بزرگ و ثروتمند بالا می‌آیند. اگر بر اساس سهم از جمعیت مرتب کنی، فهرست عوض می‌شود. هیچ‌کدام غلط نیست؛ این دو به دو پرسش متفاوت پاسخ می‌دهند.",
      byCount: "بیشترین تعداد",
      byShare: "بیشترین سهم از جمعیت",
      note: "رتبه‌بندی سهم فقط کشورها و مناطقی را می‌آورد که بیش از ۱۰۰ هزار مهاجر دارند. آمریکا با بزرگ‌ترین تعداد، در این فهرست رتبه‌ی ۳۳ است.",
      gulf: {
        title: "درصد بالا همیشه یعنی «جامعه‌ی مهاجرپذیر» نیست",
        body: "در کشورهای حاشیه‌ی خلیج فارس، بیشتر مهاجران نیروی کار موقت‌اند و اقامتشان به کارفرما (کفیل) بسته است. تابعیت روی کاغذ وجود دارد، اما گزینشی، سهمیه‌ای یا بسیار نادر است؛ پس در عمل راه عمومی برای شهروندی نیست. این از نظر ساختاری با کانادا یا استرالیا فرق دارد که مسیر اقامت دائم و شهروندی دارند. درصد یکسان، معنای یکسان ندارد.",
      },
    },
    explorer: {
      kicker: "کشور خودت را پیدا کن",
      title: "۲۳۳ کشور و منطقه، یک جست‌وجو",
      lead: "نام یک کشور را بنویس. عدد ۲۰۲۴، روند از ۱۹۹۰، سهم زنان و اینکه سازمان ملل دقیقاً چه چیزی را شمرده است.",
      search: "جست‌وجوی کشور",
      placeholder: "مثلاً ایران، کانادا، آلمان…",
      none: "چیزی پیدا نشد.",
      stock: "مهاجران، ۲۰۲۴",
      share: "سهم از جمعیت",
      female: "سهم زنان",
      since1990: "تغییر از ۱۹۹۰",
      rankCount: (r) => `رتبه‌ی ${r} در تعداد`,
      rankShare: (r) => `رتبه‌ی ${r} در سهم`,
      rankShareNone: "کمتر از ۱۰۰ هزار مهاجر",
      typeTitle: "این عدد چه می‌شمارد",
      types: {
        B: "متولدان خارج از کشور",
        C: "ساکنان با تابعیت خارجی",
        R: "پناهندگان و پناه‌جویان (به گزارش UNHCR) اضافه شده‌اند",
        I: "داده‌ای نبوده؛ برآورد شده",
      },
      quick: "پیشنهاد:",
    },
    spot: {
      kicker: "دو نگاه نزدیک",
      title: "ایران و کانادا",
      iran: {
        title: "ایران: منحنی U شکل",
        body: [
          "در ۱۹۹۰ حدود ۴٫۳ میلیون مهاجر در ایران زندگی می‌کردند؛ ۷٫۴ درصد جمعیت. تا ۲۰۰۰ این عدد به ۲٫۵ میلیون رسید و بعد دوباره بالا رفت: ۳٫۸ میلیون در ۲۰۲۴، یعنی ۴٫۲ درصد جمعیت.",
          "از ۲۰۲۰ تا ۲۰۲۴ بیش از یک میلیون نفر به این عدد اضافه شد؛ ششمین افزایش بزرگ جهان در این چهار سال.",
          "رقم ایران «تابعیت خارجی» را می‌شمارد (کد C)، نه محل تولد را، و پناهندگان در آن گنجانده شده‌اند (کد R). این فایل نمی‌گوید این افراد از کجا آمده‌اند.",
          "برای زمینه: کمیساریای پناهندگان سازمان ملل (UNHCR) در پایان ۲۰۲۴ حدود ۳٫۵ میلیون پناهنده در ایران شمرده که تقریباً همه افغانستانی‌اند؛ ایران بزرگ‌ترین میزبان پناهنده در جهان است. دولت ایران هم ورود بیش از یک میلیون نفر را پس از اوت ۲۰۲۱ اعلام کرده بود.",
        ],
      },
      canada: {
        title: "کانادا: دو برابر، با مسیر شهروندی",
        body: [
          "از ۴٫۳ میلیون در ۱۹۹۰ به ۸٫۸ میلیون در ۲۰۲۴. سهم از جمعیت: از ۱۵٫۳ به ۲۲٫۲ درصد؛ یعنی از هر ۹ نفر، دو نفر جای دیگری به دنیا آمده‌اند.",
          "در تعداد رتبه‌ی ۷ جهان است و در سهم، رتبه‌ی ۲۳ میان کشورهای بالای ۱۰۰ هزار مهاجر.",
          "رقم کانادا «متولد خارج» را می‌شمارد (کد B) و دانشجویان و کارگران موقت هم در آن هستند. اما مقیم دائم پس از ۳ سال حضور در ۵ سال می‌تواند تابعیت بگیرد؛ همان تفاوتی که در بخش خلیج فارس دیدیم.",
        ],
      },
    },
    gender: {
      kicker: "ترکیب جنسیتی",
      title: "میانگین ۴۸ درصد؛ دامنه از ۲۰ تا ۷۰",
      lead: "در سطح جهان نزدیک به نیمی از مهاجران زن‌اند. اما این میانگین تفاوت بزرگ میان مقصدها را پنهان می‌کند. روی هر نقطه برو تا عددش را ببینی.",
      avg: "میانگین جهان",
      caption: "مسیرهای کار خانگی بیشتر زنانه‌اند و مسیرهای ساخت‌وساز بیشتر مردانه. ترکیب جنسیتی، آینه‌ی بخش اقتصادی است که مهاجر را جذب می‌کند.",
      above: "بالاتر از میانگین",
      below: "پایین‌تر از میانگین",
    },
    game: {
      kicker: "بازی",
      title: "حدس بزن، بعد ببین",
      lead: "چهار مرحله. اول حدس می‌زنی، بعد عدد واقعی را می‌بینی. حدس زدن پیش از دیدن پاسخ، حتی حدس غلط، ماندگاری یادگیری را بالا می‌برد؛ به این اثر «پیش‌آزمون» می‌گویند.",
      rankLabel: "رتبه",
      ranks: ["تازه‌کار", "داده‌خوان", "تحلیل‌گر", "مرجع آمار"],
      of: "از",
      points: "امتیاز",
      next: (name, at) => `رتبه‌ی بعد: ${name} در ${at}`,
      top: "بالاترین رتبه",
      reset: "شروع دوباره",
      resetConfirm: "برای پاک کردن دوباره بزن",
      level: "مرحله",
      done: "کامل شد",
      question: (i, n) => `پرسش ${i} از ${n}`,
      or: "یا",
      right: (pts) => `درست است. +${pts}`,
      wrong: "نه. این کارت دوباره می‌آید.",
      cont: "ادامه",
      submit: "ثبت حدس",
      actual: "عدد واقعی",
      tryAgain: "دوباره تلاش کن",
      streak: "پشت سر هم",
      levelDone: (name) => `مرحله‌ی «${name}» کامل شد`,
      badgeGot: (b) => `نشان «${b}» را گرفتی.`,
      replayNote: "تمرین دوباره انجام شد. امتیاز فقط بار اول ثبت می‌شود.",
      goNext: (name) => `برو به «${name}»`,
      again: "تکرار این مرحله",
      allDone: {
        title: "همه‌ی مراحل تمام شد.",
        body: "حالا یک سؤال واقعی: برای مخاطب خودت، کدام معیار درست‌تر است؛ تعداد یا سهم از جمعیت؟ پاسخ به هدف تو بستگی دارد، نه به داده.",
      },
      levels: [
        { name: "تعداد مطلق", sub: "کدام مهاجر بیشتری دارد؟", badge: "شمارشگر", ctx: "موجودی مهاجران در ۲۰۲۴؛ کدام بیشتر است؟" },
        { name: "سهم از جمعیت", sub: "کدام نسبت بالاتری دارد؟", badge: "نسبت‌سنج", ctx: "مهاجران به‌عنوان درصدی از کل جمعیت، ۲۰۲۴؛ کدام بالاتر است؟" },
        { name: "تخمین", sub: "عدد را حدس بزن", badge: "برآوردگر", ctx: "لغزنده را روی حدس خودت بگذار. هرچه نزدیک‌تر، امتیاز بیشتر." },
        { name: "ترکیب جنسیتی", sub: "سهم زنان کجا بالاتر است؟", badge: "تحلیل‌گر", ctx: "سهم زنان از مهاجران، ۲۰۲۴؛ در کدام بالاتر است؟" },
      ],
      why: {
        count: [
          "هند یکی از بزرگ‌ترین کشورهای مبدأ مهاجرت است، اما مقصد بزرگی نیست. این جدول فقط مقصد را می‌شمارد. موجودی مهاجران هند از ۱۹۹۰ حدود ۲٫۴ میلیون نفر کم شده است.",
          "عربستان از بریتانیا بالاتر است. بخش بزرگی از این رقم نیروی کار قراردادی است، نه اقامت دائم.",
          "کانادا تقریباً چهار برابر قطر مهاجر دارد. مرحله‌ی بعد همین مقایسه را با معیار دیگری تکرار می‌کند.",
          "هر دو رقم پناهندگان را هم شامل می‌شوند (کد R در فایل سازمان ملل).",
          "چین با بیش از یک میلیارد جمعیت، کمتر از مالزی مهاجر دارد. جمعیت زیاد به معنی مهاجرپذیری زیاد نیست.",
          "روسیه هنوز یکی از ده مقصد بزرگ جهان است، هرچند موجودی مهاجرانش از ۱۹۹۰ حدود ۳٫۹ میلیون نفر کم شده.",
        ],
        share: [
          "بیش از سه‌چهارم ساکنان قطر متولد خارج‌اند. آمریکا بزرگ‌ترین تعداد را دارد، اما در نسبت رتبه‌ی ۳۳ است.",
          "نسبت عربستان تقریباً دو برابر کاناداست، با اینکه ساختار این دو کاملاً متفاوت است.",
          "نسبت امارات از ۱۹۹۰ تا امروز هیچ‌وقت زیر ۶۷ درصد نبوده است.",
          "استرالیا از نظر نسبت از همه‌ی کشورهای بزرگ اروپایی بالاتر است.",
          "نزدیک به نیمی از ساکنان سنگاپور متولد خارج‌اند.",
          "هر دو پایین‌تر از چیزی‌اند که معمولاً تصور می‌شود، چون مخرج، یعنی جمعیت کل، بزرگ است.",
        ],
        gender: [
          "اختلاف بیش از ۴۲ واحد درصد. کار خانگی در هنگ‌کنگ عمدتاً زنانه است و کار ساختمانی در عمان عمدتاً مردانه.",
          "در مسیرهای مبتنی بر خانواده و اقامت دائم، نسبت به تعادل نزدیک می‌شود.",
          "دو الگوی کاملاً متفاوت از مهاجرت کاری.",
          "نپال با حدود ۷۰ درصد، بالاترین سهم زنان را میان کشورهای بالای ۱۰۰ هزار مهاجر دارد.",
          "میانگین جهان ۴۸ درصد است؛ این دو در دو سوی آن ایستاده‌اند.",
        ],
      },
      est: {
        worldPct: {
          q: "چند درصد جمعیت جهان مهاجر بین‌المللی‌اند؟",
          why: "۳٫۷ درصد. یعنی بیش از ۹۶ درصد مردم جهان در کشور تولد خودشان زندگی می‌کنند. این عدد از ۱۹۹۰ فقط حدود ۰٫۸ واحد درصد بالا رفته است.",
        },
        growth: {
          q: "از ۱۹۹۰ تا ۲۰۲۴، تعداد مهاجران چند برابر شده است؟",
          why: "حدود دو برابر: از ۱۵۴ میلیون به ۳۰۴ میلیون. جمعیت جهان هم ۱٫۵ برابر شد، برای همین سهم آهسته بالا رفت.",
        },
        female: {
          q: "سهم زنان از کل مهاجران جهان چند درصد است؟",
          why: "۴۸ درصد؛ تقریباً نصف. اما این میانگین دامنه‌ی ۲۰ تا ۷۰ درصدی میان کشورها را پنهان می‌کند.",
        },
        uae: {
          q: "چند درصد ساکنان امارات متولد خارج یا تبعه‌ی خارجی‌اند؟",
          why: "۷۴ درصد. در این ساختار، اکثریت ساکنان کشور مهاجرند و در عمل راه عمومی شهروندی وجود ندارد.",
        },
      },
    },
    passport: {
      title: "پاسپورت داده",
      hint: "با هر بخش تعاملی یک مهر بگیر.",
      stamps: {
        timeline: "نوار زمان",
        hundred: "صد نفر",
        flip: "رتبه‌بندی وارونه",
        explorer: "سه کشور",
        gender: "ترکیب جنسیتی",
        quiz: "هر چهار مرحله",
      },
      complete: "پاسپورت کامل شد. حالا این عددها را بهتر از بیشتر تیترها می‌خوانی.",
      open: "باز کردن پاسپورت",
      close: "بستن",
    },
    care: {
      kicker: "پیش از نقل قول",
      title: "پیش از اینکه این عددها را جایی نقل کنی",
      items: [
        {
          t: "این «موجودی» است، نه «جریان»",
          b: "عدد هر سال تعداد کسانی است که در آن کشور زندگی می‌کنند و جای دیگری متولد شده‌اند؛ نه تعداد کسانی که آن سال مهاجرت کرده‌اند. تفاوت ۲۰۲۰ تا ۲۰۲۴ هم «ورودی» نیست؛ فوت، بازگشت و تغییر تابعیت هم در آن هست.",
        },
        {
          t: "همه‌ی کشورها یک چیز را نمی‌شمارند",
          b: "۱۸۰ کشور و منطقه «متولد خارج» را می‌شمارند (کد B). ۴۸ کشور، از جمله ایران و کشورهای خلیج فارس، «تابعیت خارجی» را (کد C). کسی که در یک کشور به دنیا آمده اما تابعیتش را ندارد، در گروه دوم مهاجر حساب می‌شود. مقایسه‌ی مستقیم این دو گروه دقیق نیست.",
        },
        {
          t: "پناهندگان در بیشتر رقم‌ها هستند",
          b: "کد R یعنی پناهندگان و پناه‌جویان به عدد اضافه شده‌اند؛ در ۱۵۹ کشور و منطقه. برای کشورهایی مثل اردن، ترکیه و ایران این بخش بزرگی از رقم است. این یک انتخاب روش‌شناختی است، نه خطا؛ اما تفسیر عدد را عوض می‌کند.",
        },
        {
          t: "درصد بالا همیشه «جامعه‌ی مهاجرپذیر» نیست",
          b: "در خلیج فارس سهم بالا عمدتاً نیروی کار موقت است. در کانادا و استرالیا مسیر اقامت دائم هست. درصد یکسان، معنای یکسان ندارد.",
        },
      ],
    },
    method: {
      kicker: "روش و منابع",
      title: "این گزارش چطور ساخته شد",
      notes: [
        "همه‌ی ارقام مستقیماً از جدول‌های ۱ تا ۴ فایل سازمان ملل (International Migrant Stock 2024: Destination) استخراج شده‌اند. ۲۳۳ کشور و منطقه، ۸ سال از ۱۹۹۰ تا ۲۰۲۴.",
        "سال مرجع ۱ ژوئیه است. «مهاجر بین‌المللی» یعنی کسی که در کشوری غیر از کشور تولدش زندگی می‌کند، یا در کشورهایی که داده‌ی تولد ندارند، تبعه‌ی خارجی.",
        "رتبه‌بندی سهم فقط کشورها و مناطقی با دست‌کم ۱۰۰ هزار مهاجر را می‌آورد تا کشورهای کوچک فهرست را پر نکنند.",
        "پیشرفت بازی و پاسپورت فقط در مرورگر خودت ذخیره می‌شود و جایی فرستاده نمی‌شود.",
      ],
      sourcesTitle: "منابع",
      sources: SOURCES,
    },
    colophon: {
      shareTitle: "۳۰۴ میلیون مهاجر؛ دو برابر، اما هنوز کمتر از ۴ درصد",
      disclaimer: "این گزارش تحلیل داده است، نه مشاوره‌ی مهاجرتی.",
      cta: "گفت‌وگو با فرجاد",
    },
  },

  en: {
    hero: {
      kicker: "Reports",
      lead: "In 2024, about 304 million people live in a country other than the one they were born in. That number has nearly doubled since 1990, yet migrants' share of the world's population has only moved from 2.9% to 3.7%. This page shows why both sentences are true, then asks you to guess.",
      stats: [
        { value: "304", label: "million international migrants, mid-2024" },
        { value: "3.7%", label: "of the world's population" },
        { value: "48%", label: "are women" },
      ],
      asOf: "Data: UN DESA Population Division, International Migrant Stock 2024. All figures are for 1 July of each year.",
      scroll: "Fill your passport: every interactive section gives you a stamp.",
    },
    paradox: {
      kicker: "The apparent paradox",
      title: "Doubled, yet still fewer than 4 in 100 people",
      lead: "Both charts start at zero. Drag the timeline and watch the two numbers move side by side.",
      countTitle: "Number of migrants",
      shareTitle: "Share of world population",
      countCap: "From 154 million to 304 million: almost twice as many.",
      shareCap: "From 2.9% to 3.7%: slow and steady.",
      scrub: "Year",
      million: "million",
      why: {
        title: "Why both are true",
        body: "The world's population grew over the same years, from 5.3 to 8.2 billion. When the numerator and the denominator both grow, the ratio moves slowly. So \"migration is exploding\" does not fit the data: what grew fast is the absolute size, not the share.",
      },
      math: [
        { label: "Growth in migrants, 1990–2024", value: "1.98×" },
        { label: "Growth in world population", value: "1.53×" },
        { label: "Migrants' share", value: "2.9% → 3.7%" },
      ],
    },
    hundred: {
      kicker: "One hundred people",
      title: "If the world were 100 people",
      lead: "Each figure is one percent of the population. Pick a country and see how many of every hundred residents were born somewhere else.",
      world: "World",
      migrant: "Migrant",
      native: "Born there",
      sentence: (n, place) => `In ${place}, about ${n} in every 100 people are migrants.`,
      note: "Shares are rounded. Where a country counts citizenship (code C), the figure means residents holding a foreign citizenship.",
    },
    regions: {
      kicker: "Where they live",
      title: "Half of the world's migrants live in Europe and North America",
      lead: "The 304 million split by region of destination. Each band's width is that region's share of all the world's migrants.",
      names: {
        eu_na: "Europe and Northern America",
        nafr_wasia: "Northern Africa and Western Asia",
        ssa: "Sub-Saharan Africa",
        e_se_asia: "Eastern and South-Eastern Asia",
        c_s_asia: "Central and Southern Asia",
        latam: "Latin America and the Caribbean",
        anz: "Australia and New Zealand",
        oceania: "Rest of Oceania",
      },
      ofWorld: "of the world's migrants",
      ofPop: "of the region's population",
      highIncome: "High-income countries host 65.5% of the world's migrants.",
    },
    flip: {
      kicker: "One dataset, two rankings",
      title: "Change the measure and the list turns over",
      lead: "Sort by number and the large, rich countries rise to the top. Sort by share of population and the list changes. Neither is wrong; they answer two different questions.",
      byCount: "Most migrants",
      byShare: "Highest share of population",
      note: "The share ranking includes only countries and areas with more than 100,000 migrants. The United States, first by number, is 33rd here.",
      gulf: {
        title: "A high share is not always a \"country of immigration\"",
        body: "In the Gulf states, most migrants are temporary contract workers whose residence is tied to an employer sponsor (kafala). Naturalisation exists in law but is discretionary, capped or very rare, so in practice there is no general route to citizenship. That is structurally different from Canada or Australia, which offer permanent residence and citizenship. The same percentage does not mean the same thing.",
      },
    },
    explorer: {
      kicker: "Find your country",
      title: "233 countries and areas, one search",
      lead: "Type a country. You get the 2024 figure, the trend since 1990, the share of women, and what exactly the UN counted.",
      search: "Search for a country",
      placeholder: "e.g. Canada, Iran, Germany…",
      none: "Nothing found.",
      stock: "Migrants, 2024",
      share: "Share of population",
      female: "Women",
      since1990: "Change since 1990",
      rankCount: (r) => `#${r} by number`,
      rankShare: (r) => `#${r} by share`,
      rankShareNone: "Under 100,000 migrants",
      typeTitle: "What this figure counts",
      types: {
        B: "People born abroad",
        C: "Residents with foreign citizenship",
        R: "Refugees and asylum seekers (UNHCR) added",
        I: "No data; imputed",
      },
      quick: "Try:",
    },
    spot: {
      kicker: "Two close-ups",
      title: "Iran and Canada",
      iran: {
        title: "Iran: a U-shaped curve",
        body: [
          "In 1990 about 4.3 million migrants lived in Iran, 7.4% of the population. By 2000 the figure had fallen to 2.5 million, then it rose again: 3.8 million in 2024, or 4.2% of the population.",
          "Between 2020 and 2024 it grew by more than one million, the sixth-largest increase in the world over those four years.",
          "Iran's figure counts foreign citizens (code C), not place of birth, and includes refugees (code R). This file does not say where these people came from.",
          "For context: UNHCR counted about 3.5 million refugees in Iran at the end of 2024, almost all of them Afghans, which makes Iran the largest refugee host in the world. Iran's government had estimated more than a million new arrivals after August 2021.",
        ],
      },
      canada: {
        title: "Canada: doubled, with a path to citizenship",
        body: [
          "From 4.3 million in 1990 to 8.8 million in 2024. As a share of the population, from 15.3% to 22.2%: about two in every nine residents were born elsewhere.",
          "7th in the world by number, and 23rd by share among countries with more than 100,000 migrants.",
          "Canada's figure counts the foreign-born (code B), temporary students and workers included. Permanent residents can apply for citizenship after three years of physical presence within five, which is the difference the Gulf section points to.",
        ],
      },
    },
    gender: {
      kicker: "Women and men",
      title: "An average of 48%, a range from 20 to 70",
      lead: "Worldwide, close to half of all migrants are women. The average hides very large differences between destinations. Hover or tap a dot to see its figure.",
      avg: "World average",
      caption: "Domestic-work routes are mostly female, construction routes mostly male. The gender split mirrors the sector that draws migrants in.",
      above: "Above average",
      below: "Below average",
    },
    game: {
      kicker: "The game",
      title: "Guess first, then look",
      lead: "Four levels. You guess, then you see the real number. Guessing before seeing the answer, even guessing wrong, makes learning stick better. This is called the pretesting effect.",
      rankLabel: "Rank",
      ranks: ["Rookie", "Data reader", "Analyst", "Statistician"],
      of: "of",
      points: "points",
      next: (name, at) => `Next rank: ${name} at ${at}`,
      top: "Top rank",
      reset: "Start over",
      resetConfirm: "Tap again to clear",
      level: "Level",
      done: "Done",
      question: (i, n) => `Question ${i} of ${n}`,
      or: "or",
      right: (pts) => `Correct. +${pts}`,
      wrong: "No. This card will come back.",
      cont: "Continue",
      submit: "Lock in my guess",
      actual: "Actual",
      tryAgain: "try again",
      streak: "in a row",
      levelDone: (name) => `Level "${name}" complete`,
      badgeGot: (b) => `You earned the "${b}" badge.`,
      replayNote: "Practice round done. Points count only the first time.",
      goNext: (name) => `Go to "${name}"`,
      again: "Replay this level",
      allDone: {
        title: "All levels complete.",
        body: "Now a real question: for your own audience, which measure is right, the number or the share of population? The answer depends on your purpose, not on the data.",
      },
      levels: [
        { name: "Absolute numbers", sub: "Which has more migrants?", badge: "Counter", ctx: "Migrant stock in 2024: which is larger?" },
        { name: "Share of population", sub: "Which has the higher ratio?", badge: "Ratio reader", ctx: "Migrants as a percentage of the total population, 2024: which is higher?" },
        { name: "Estimate", sub: "Guess the number", badge: "Estimator", ctx: "Set the slider on your guess. The closer, the more points." },
        { name: "Gender", sub: "Where is the share of women higher?", badge: "Analyst", ctx: "Women as a share of migrants, 2024: which is higher?" },
      ],
      why: {
        count: [
          "India is one of the largest countries of origin, not a large destination. This table counts destinations only. India's migrant stock has fallen by about 2.4 million since 1990.",
          "Saudi Arabia is ahead of the United Kingdom. Much of its figure is contract labour, not permanent residence.",
          "Canada has nearly four times as many migrants as Qatar. The next level repeats the comparison with another measure.",
          "Both figures include refugees (code R in the UN file).",
          "China, with more than a billion people, has fewer migrants than Malaysia. A large population does not mean a large migrant population.",
          "Russia is still among the world's ten largest destinations, even though its migrant stock has fallen by about 3.9 million since 1990.",
        ],
        share: [
          "More than three quarters of Qatar's residents were born abroad. The United States has the largest number but ranks 33rd by share.",
          "Saudi Arabia's ratio is nearly twice Canada's, though the two systems are entirely different.",
          "The UAE's share has not been below 67% at any point since 1990.",
          "By share, Australia is ahead of every large European country.",
          "Close to half of Singapore's residents were born abroad.",
          "Both are lower than people usually assume, because the denominator, the whole population, is large.",
        ],
        gender: [
          "A gap of more than 42 points. Domestic work in Hong Kong is mostly done by women; construction in Oman mostly by men.",
          "Family-based and permanent-residence routes bring the ratio close to even.",
          "Two entirely different patterns of labour migration.",
          "Nepal, at about 70%, has the highest share of women among destinations with more than 100,000 migrants.",
          "The world average is 48%; these two stand on either side of it.",
        ],
      },
      est: {
        worldPct: {
          q: "What percentage of the world's population are international migrants?",
          why: "3.7%. More than 96% of people live in the country they were born in. The figure has risen by only about 0.8 points since 1990.",
        },
        growth: {
          q: "From 1990 to 2024, how many times larger did the number of migrants become?",
          why: "About twice: from 154 million to 304 million. The world's population grew 1.5 times, so the share rose slowly.",
        },
        female: {
          q: "What share of the world's migrants are women?",
          why: "48%, nearly half. The average hides a range from about 20% to 70% between countries.",
        },
        uae: {
          q: "What percentage of UAE residents are foreign-born or foreign citizens?",
          why: "74%. Most of the country's residents are migrants, and in practice there is no general route to citizenship.",
        },
      },
    },
    passport: {
      title: "Data passport",
      hint: "Earn a stamp in every interactive section.",
      stamps: {
        timeline: "Timeline",
        hundred: "100 people",
        flip: "Flipped ranking",
        explorer: "Three countries",
        gender: "Gender split",
        quiz: "All four levels",
      },
      complete: "Passport complete. You now read these numbers better than most headlines do.",
      open: "Open passport",
      close: "Close",
    },
    care: {
      kicker: "Before you quote",
      title: "Before you quote these numbers",
      items: [
        {
          t: "This is a stock, not a flow",
          b: "Each year's figure is the number of people living in a country who were born elsewhere, not the number who moved that year. The change from 2020 to 2024 is not \"arrivals\" either: deaths, returns and naturalisation are in it too.",
        },
        {
          t: "Countries don't all count the same thing",
          b: "180 countries and areas count the foreign-born (code B). 48, including Iran and the Gulf states, count foreign citizens (code C). Someone born in a country without its citizenship is a migrant in the second group. Comparing the two groups directly is not exact.",
        },
        {
          t: "Refugees are in most figures",
          b: "Code R means refugees and asylum seekers were added to the estimate, in 159 countries and areas. For Jordan, Türkiye and Iran this is a large part of the figure. It is a method choice, not an error, but it changes what the number means.",
        },
        {
          t: "A high share is not always a \"country of immigration\"",
          b: "In the Gulf a high share is mostly temporary labour. Canada and Australia offer permanent residence. The same percentage does not mean the same thing.",
        },
      ],
    },
    method: {
      kicker: "Method and sources",
      title: "How this report was made",
      notes: [
        "Every figure is taken directly from Tables 1–4 of the UN file (International Migrant Stock 2024: Destination): 233 countries and areas, eight years from 1990 to 2024.",
        "The reference date is 1 July. An \"international migrant\" is someone living outside their country of birth or, where birthplace data are missing, a foreign citizen.",
        "The share ranking includes only countries and areas with at least 100,000 migrants, so very small places do not fill the list.",
        "Your game progress and passport are stored only in your own browser and are not sent anywhere.",
      ],
      sourcesTitle: "Sources",
      sources: SOURCES,
    },
    colophon: {
      shareTitle: "304 million migrants: doubled, yet still under 4%",
      disclaimer: "This report is data analysis, not immigration advice.",
      cta: "Talk to Farjad",
    },
  },
}
