// ============================================================================
// File Path: src/components/v3/reports/vienna-1683/copy.ts
// Why: Every word of report 06 in both locales, one structure for both. The
//      Persian follows Farjad's own analysis (a line from a strategic-thinking
//      class: "300,000 could not beat 12,000") and keeps its argument: power
//      is effective resources, not total resources. The fact-check corrected
//      the numbers before anything else, and the report says so up front.
//      The class and its teacher are not named.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { DilemmaKey, MultiplierKey, MythKey, TimelineKey } from "./data"

export type MedalKey = "numbers" | "clock" | "council" | "lines" | "myths" | "mirror"

type Copy = {
  hero: { kicker: string; quote: string; quoteBy: string; lead: string; stats: { value: string; label: string }[]; medals: string }
  numbers: {
    kicker: string
    title: string
    lead: string
    myth: string
    history: string
    perIcon: string
    sides: { ottoman: string; defenders: string; relief: string }
    notes: { claim: string; total: string; combat: string; defenders: string; relief: string }
    verdict: { title: string; body: string }
  }
  cast: { kicker: string; title: string; people: { name: string; role: string; aim: string; force: string }[] }
  resources: {
    kicker: string
    title: string
    lead: string
    cards: { name: string; state: string }[]
    conclusion: string
  }
  clock: {
    kicker: string
    title: string
    lead: string
    day: (d: string) => string
    before: string
    events: Record<TimelineKey, { date: string; title: string; body: string }>
    attacker: string
    defender: string
    attackerCost: string
    defenderCost: string
  }
  council: {
    kicker: string
    title: string
    lead: string
    youAre: string
    step: (i: string, n: string) => string
    history: string
    yourPick: string
    cost: string
    next: string
    finish: string
    restart: string
    meter: string
    dilemmas: Record<DilemmaKey, { q: string; options: [string, string]; cost: [string, string]; history: string }>
    result: (score: string, n: string) => string
    verdicts: [string, string, string]
    lesson: string
  }
  defence: {
    kicker: string
    title: string
    lead: string
    items: Record<MultiplierKey, { name: string; body: string }>
    lines: { title: string; threat: string; defenders: string; attackers: string; run: string; again: string; won: string }
    caveat: string
  }
  charge: { kicker: string; title: string; lead: string; beats: { time: string; text: string }[]; scale: string }
  myths: { kicker: string; title: string; lead: string; tap: string; claim: string; verdict: string; items: Record<MythKey, { claim: string; tag: string; truth: string }> }
  business: {
    kicker: string
    title: string
    lead: string
    rows: { big: string; small: string }[]
    bigLabel: string
    smallLabel: string
  }
  mirror: {
    kicker: string
    title: string
    lead: string
    projects: string
    share: string
    goal: string
    threat: string
    yes: string
    no: string
    starhemberg: { title: string; body: string }
    middle: { title: string; body: string }
    kara: { title: string; body: string }
    rule: string
    privacy: string
  }
  takeaway: { kicker: string; quote: string; tail: string }
  medals: { title: string; hint: string; names: Record<MedalKey, string>; complete: string; open: string; close: string }
  method: { kicker: string; title: string; notes: string[]; sourcesTitle: string; sources: { label: string; href: string }[] }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
}

const SOURCES = [
  { label: "John Stoye, The Siege of Vienna (1964; rev. Birlinn 2000)", href: "https://openlibrary.org/works/OL3930549W" },
  { label: "Andrew Wheatcroft, The Enemy at the Gate: Habsburgs, Ottomans and the Battle for Europe (2008)", href: "https://openlibrary.org/works/OL2504181W" },
  { label: "Encyclopaedia Britannica, Siege of Vienna (1683)", href: "https://www.britannica.com/event/Siege-of-Vienna-1683" },
  { label: "Encyclopaedia Britannica, Treaty of Karlowitz", href: "https://www.britannica.com/event/Treaty-of-Carlowitz" },
  { label: "John J. Mearsheimer, Assessing the Conventional Balance: The 3:1 Rule and Its Critics, International Security 13(4), 1989", href: "https://doi.org/10.2307/2538780" },
  { label: "Austria-Forum, Kaffeehaus (Johannes Diodato, 1685)", href: "https://austria-forum.org/af/AEIOU/Kaffeehaus_Caf%C3%A9" },
  { label: "Baki Tezcan, The Second Ottoman Empire (Cambridge University Press, 2010)", href: "https://openlibrary.org/works/OL18807346W" },
]

export const COPY: Record<Locale, Copy> = {
  fa: {
    hero: {
      kicker: "گزارش‌ها",
      quote: "این ۳۰۰ هزار نفر از پس آن ۱۲ هزار نفر برنیامدند.",
      quoteBy: "جمله‌ای که در یک کلاس تفکر استراتژیک شنیدم",
      lead: "تابستان ۱۶۸۳، بزرگ‌ترین ارتش عثمانی در دهه‌ها جلوی دیوارهای وین ایستاد و شصت روز بعد شکست خورد و رفت. چرا؟ جواب کوتاه این است: قدرت یعنی «منابع مؤثر»، نه «منابع کل». این صفحه همین را قدم‌به‌قدم نشان می‌دهد و در چند جا از تو می‌خواهد خودت تصمیم بگیری.",
      stats: [
        { value: "۶۰", label: "روز محاصره، از ۱۴ ژوئیه تا ۱۲ سپتامبر" },
        { value: "۱۶ هزار", label: "مدافع: ۱۱ هزار سرباز و ۵ هزار شهروند مسلح" },
        { value: "۶۵ تا ۸۰ هزار", label: "نیروی ارتش امدادی که کار را تمام کرد" },
      ],
      medals: "با هر بخش تعاملی یک نشان افتخار بگیر. شش نشان در این صفحه هست.",
    },
    numbers: {
      kicker: "اول، عددها",
      title: "۳۰۰ هزار؟ نه. و آن ۱۲ هزار نفر هم تنها نبودند",
      lead: "برای اینکه تحلیل محکم باشد، اول عددها را درست کنیم. کلید را بزن و ببین روایت کلاس با برآورد مورخان امروزی چه فرقی دارد. هر آدمک ۵ هزار نفر است.",
      myth: "روایت مشهور",
      history: "برآورد مورخان",
      perIcon: "هر آدمک = ۵ هزار نفر",
      sides: { ottoman: "ارتش عثمانی", defenders: "مدافعان وین", relief: "ارتش امدادی" },
      notes: {
        claim: "رقم جزوه‌های تبلیغاتی همان زمان؛ کارگر، خدمه و همراهان غیرنظامی را هم می‌شمارد.",
        total: "کل ارتشی که از بلگراد راه افتاد: ۱۰۰ تا ۱۵۰ هزار نفر.",
        combat: "نیروی جنگنده‌ی واقعی: حدود ۶۰ تا ۹۰ هزار. تا ۱۲ سپتامبر شاید ۵۰ تا ۶۰ هزار نفر مانده بودند.",
        defenders: "۱۱ هزار سرباز و ۵ هزار شهروند و داوطلب مسلح.",
        relief: "۶۵ تا ۸۰ هزار نفر به فرماندهی یان سوبیسکی؛ حدود یک‌چهارم تا یک‌سوم لهستانی.",
      },
      verdict: {
        title: "پس آن ۱۲ هزار نفر چه کردند؟",
        body: "عثمانی را شکست ندادند. کارشان این بود که شصت روز دوام بیاورند. شکست نهایی را ارتش امدادی در نبرد کالنبرگ رقم زد. خبر خوب این است که درس استراتژیک با این اصلاح قوی‌تر می‌شود، نه ضعیف‌تر: مدافع لازم نبود پیروز شود؛ فقط باید زمان می‌خرید.",
      },
    },
    cast: {
      kicker: "سه فرمانده",
      title: "سه نفر، سه هدف متفاوت",
      people: [
        { name: "قره مصطفی پاشا", role: "صدراعظم عثمانی، فرمانده‌ی محاصره", aim: "هدف: شهر را بگیرد، سالم و پرغنیمت، پیش از پاییز.", force: "۱۰۰ تا ۱۵۰ هزار نفر، بیشتر توپ سبک" },
        { name: "ارنست رودیگر فون اشتارهمبرگ", role: "فرمانده‌ی پادگان وین", aim: "هدف: فقط دوام بیاورد تا امداد برسد.", force: "۱۱ هزار سرباز، ۵ هزار شهروند، بیش از ۳۰۰ توپ" },
        { name: "یان سوم سوبیسکی", role: "پادشاه لهستان، فرمانده‌ی ارتش امدادی", aim: "هدف: از ارتفاعات بیاید و اردو را بشکند.", force: "۶۵ تا ۸۰ هزار نفر از لهستان و امپراتوری" },
      ],
    },
    resources: {
      kicker: "منابع مؤثر",
      title: "ارتش بزرگ، مصرف‌کننده‌ی بزرگ هم هست",
      lead: "اصل محدودیت منابع می‌گوید منابع کمیاب‌اند و هر انتخاب فرصت کار دیگری را می‌گیرد. اشتباه رایج این است که فکر کنیم ارتش بزرگ‌تر یعنی منابع بیشتر. قره مصطفی در همان منابعی کمبود داشت که تعیین‌کننده بودند.",
      cards: [
        { name: "زمان", state: "ارتش ۱۴ ژوئیه رسید. فصل جنگ کوتاه بود و ارتش باید پیش از زمستان برمی‌گشت." },
        { name: "توپ سنگین قلعه‌کوب", state: "برای حرکت سریع‌تر نیاورده بودند. حدود ۱۱۰ تا ۱۵۰ توپ داشتند که تقریباً همه سبک بودند." },
        { name: "آذوقه", state: "سیر کردن بیش از ۱۰۰ هزار نفر در خاک دشمن هر روز گران‌تر می‌شد." },
        { name: "توجه فرمانده", state: "بین محاصره، غارت اطراف و تهدید ارتش امدادی تقسیم شده بود." },
      ],
      conclusion: "هر روز تأخیر برای مهاجم بسیار گران‌تر از مدافع بود.",
    },
    clock: {
      kicker: "ساعت محاصره",
      title: "شصت روز، یک ساعت شنی",
      lead: "نوار را بکش. هر روزی که می‌گذرد، برای مدافع یک پیروزی کوچک است و برای مهاجم یک هزینه‌ی بزرگ.",
      day: (d) => `روز ${d}`,
      before: "پیش از محاصره",
      events: {
        leopold: { date: "۷ ژوئیه", title: "امپراتور شهر را ترک می‌کند", body: "لئوپولد اول شبانه به لینتس و بعد پاساو می‌رود. فرماندهی به اشتارهمبرگ می‌رسد." },
        begins: { date: "۱۴ ژوئیه", title: "محاصره آغاز می‌شود", body: "اردوی عثمانی شهر را در بر می‌گیرد. حمله‌ی اصلی روی دو سنگر «بورگ» و «لوبل» است." },
        breach: { date: "۴ سپتامبر", title: "مین زیر سنگر بورگ منفجر می‌شود", body: "دیوار شکاف برمی‌دارد و تا ۱۰ سپتامبر شکاف‌های تازه باز می‌شود. شهر به سقوط نزدیک است." },
        tulln: { date: "۶ تا ۹ سپتامبر", title: "امداد از دانوب می‌گذرد", body: "ارتش امدادی در تولن از رود عبور می‌کند. تاتارهای کریمه مقاومت جدی نمی‌کنند." },
        heights: { date: "۱۱ سپتامبر", title: "امداد روی ارتفاعات", body: "ارتش امدادی به کالنبرگ می‌رسد؛ ارتفاعاتی که عثمانی‌ها هرگز مستحکمش نکردند." },
        battle: { date: "۱۲ سپتامبر", title: "نبرد کالنبرگ", body: "در بعدازظهر، سواره‌نظام از تپه‌ها پایین می‌آید و اردوی عثمانی می‌شکند." },
      },
      attacker: "هزینه‌ی مهاجم",
      defender: "هدف مدافع",
      attackerCost: "آذوقه، بیماری، فصل رو به پایان",
      defenderCost: "روزهای خریده‌شده",
    },
    council: {
      kicker: "شورای جنگ",
      title: "تو جای قره مصطفی هستی",
      lead: "پنج تصمیم که او واقعاً گرفت. هر کدام را خودت بگیر و ببین چه فرصتی را از دست می‌دهی. بعد ببین تاریخ چه کرد.",
      youAre: "تو صدراعظمی. ارتش جلوی وین است و می‌دانی امداد در راه است.",
      step: (i, n) => `تصمیم ${i} از ${n}`,
      history: "قره مصطفی چه کرد",
      yourPick: "انتخاب تو",
      cost: "فرصتی که از دست می‌رود",
      next: "تصمیم بعد",
      finish: "نتیجه",
      restart: "دوباره",
      meter: "تمرکز روی منبع کمیاب",
      dilemmas: {
        guns: {
          q: "توپ‌های سنگین قلعه‌کوب را بیاوری یا سبک حرکت کنی؟",
          options: ["توپ سنگین را بیاور، حتی اگر کندتر برسی", "سبک حرکت کن، فقط توپ میدانی"],
          cost: ["چند هفته زمان در راه.", "توان شکستن سریع دیوارها."],
          history: "سبک آمد. حدود ۱۱۰ تا ۱۵۰ توپ، تقریباً همه سبک؛ بدون توپ قلعه‌کوب واقعی.",
        },
        method: {
          q: "حمله‌ی کامل و زودهنگام، یا محاصره‌ی آهسته با تونل‌زنی؟",
          options: ["از روزهای اول با همه‌ی نیرو حمله کن", "آهسته پیش برو و منتظر تسلیم بمان"],
          cost: ["جان سربازان، و احتمالاً غارت شهر به دست آن‌ها.", "زمان؛ یعنی کمیاب‌ترین منبع."],
          history: "محاصره‌ی آهسته. بعضی مورخان گفته‌اند می‌خواست شهر تسلیم شود تا ثروتش در یورش غارت نشود؛ نیت او مستند نیست.",
        },
        heights: {
          q: "ارتفاعات کالنبرگ و جنگل وین را مستحکم کنی؟",
          options: ["سنگر بزن و نیرو بگذار", "رهایش کن؛ امداد هنوز دور است"],
          cost: ["نیرو و کارگر از محاصره کم می‌شود.", "کنترل همان نقطه‌ای که دشمن از آن حمله خواهد کرد."],
          history: "رهایش کرد. چند دسته‌ی کوچک گذاشت، اما استحکام جدی نساخت.",
        },
        troops: {
          q: "بیشتر نیرو در سنگرهای محاصره بماند یا رو به ارتش امدادی بچرخد؟",
          options: ["نیروی اصلی را رو به امداد بچرخان", "بیشتر نیرو را در سنگرها نگه دار"],
          cost: ["فشار روی شهر کم می‌شود.", "تمرکز نیرو در برابر تهدید دوم."],
          history: "بیشتر نیرو را در سنگرها نگه داشت. در روز نبرد، اردو میان شهر و امداد گیر افتاد.",
        },
        danube: {
          q: "گذرگاه‌های دانوب را با بهترین نیروها ببندی؟",
          options: ["بهترین نیروها را سر پل بفرست", "راه‌بندی را به تاتارهای کریمه بسپار"],
          cost: ["نیرو از محاصره کم می‌شود.", "اینکه امداد بی‌دردسر از رود بگذرد."],
          history: "به تاتارها سپرد. ارتش امدادی در تولن تقریباً بدون مقاومت جدی از دانوب گذشت.",
        },
      },
      result: (score, n) => `${score} از ${n} انتخابِ تو از منبع کمیاب محافظت کرد.`,
      verdicts: [
        "تو هم مثل قره مصطفی همه چیز را با هم خواستی: شهر سالم، غنیمت، امنیت اردو و پیروزی بر امداد. کسی که اولویت‌بندی نکند، همه جا ضعیف می‌شود.",
        "بعضی جاها زمان را خریدی و بعضی جاها از دستش دادی. برنامه‌ات هنوز یک اولویت روشن ندارد.",
        "تو زمان و تهدید دوم را جدی گرفتی؛ دقیقاً همان دو چیزی که قره مصطفی نادیده گرفت. این تضمین پیروزی نیست، اما بازی را عوض می‌کند.",
      ],
      lesson: "این امتیاز معیار همین درس است، نه پیش‌بینی تاریخ جایگزین. هیچ‌کس نمی‌داند اگر قره مصطفی جور دیگری تصمیم می‌گرفت چه می‌شد.",
    },
    defence: {
      kicker: "چرا دوام آوردند",
      title: "کمبود، مدافعان را مجبور به تمرکز کرد",
      lead: "پنج دلیل که یک پادگان کوچک توانست شصت روز جلوی ارتشی چند برابر خودش دوام بیاورد. روی هر کدام بزن.",
      items: {
        goals: { name: "هدف ساده", body: "مدافع لازم نبود پیروز شود؛ فقط باید زمان بخرد. مهاجم باید پیروز می‌شد. همین عدم تقارن اهداف همه چیز را عوض می‌کند." },
        walls: { name: "اهرم دیوار", body: "دیوار و استحکامات «ضریب نیرو» هستند. یک قاعده‌ی سرانگشتی نظامی می‌گوید مهاجم در نقطه‌ی حمله حدود سه برابر نیرو لازم دارد. پس برتری عددی عثمانی کمتر از چیزی بود که به چشم می‌آمد." },
        lines: { name: "خطوط داخلی", body: "مدافعان در یک شهر کوچک بودند و می‌توانستند نیرو را سریع به نقطه‌ی خطر برسانند. عثمانی‌ها دور یک دایره‌ی بزرگ پخش بودند. پایین امتحانش کن." },
        focus: { name: "تمرکز روی نقطه‌ی حیاتی", body: "تونل‌زنی متقابل زیر زمین، حمله‌های غافلگیرانه از دروازه‌ها و دفاع از چند سنگر اصلی، به جای دفاع یکسان از همه جا." },
        command: { name: "فرماندهی واحد", body: "اشتارهمبرگ یک فرمان روشن داشت: تسلیم نمی‌شویم. در سمت عثمانی، همکاری با تاتارها ضعیف بود." },
      },
      lines: {
        title: "مسابقه‌ی خطوط داخلی",
        threat: "خطر در یک سنگر!",
        defenders: "مدافع از وسط شهر",
        attackers: "مهاجم دور حلقه",
        run: "یک حمله راه بینداز",
        again: "یک نقطه‌ی دیگر",
        won: "مدافع زودتر رسید",
      },
      caveat: "قاعده‌ی «سه به یک» یک قاعده‌ی سرانگشتی است، نه قانون تاریخ؛ برای نقطه‌ی حمله تعریف شده، نه کل میدان، و پشتوانه‌ی تجربی‌اش محل بحث است.",
    },
    charge: {
      kicker: "۱۲ سپتامبر",
      title: "یورش از کالنبرگ",
      lead: "صفحه را پایین بکش و یورش را دنبال کن.",
      beats: [
        { time: "صبح", text: "ارتش امدادی از ارتفاعات جنگل وین پایین می‌آید. جناح چپ، نیروهای امپراتوری به فرماندهی شارل لورن، اول درگیر می‌شوند." },
        { time: "ظهر", text: "عثمانی‌ها میان دو آتش‌اند: پشت سرشان شهری که هنوز نیفتاده، جلویشان ارتشی که از بالا می‌آید." },
        { time: "بعدازظهر", text: "حدود ۱۸ تا ۲۰ هزار سوار، با حدود ۳ هزار هوسار بالدار لهستانی در مرکز، از تپه‌ها پایین می‌تازند." },
        { time: "غروب", text: "اردوی عثمانی می‌شکند. چادر صدراعظم به دست مهاجمان می‌افتد و محاصره تمام می‌شود." },
      ],
      scale: "اغلب آن را «یکی از بزرگ‌ترین یورش‌های سواره‌نظام تاریخ» می‌نامند. «بزرگ‌ترین» ادعایی رایج اما اثبات‌نشدنی است.",
    },
    myths: {
      kicker: "نگاه انتقادی",
      title: "چهار روایت که باید با احتیاط گفت",
      lead: "هر کارت را برگردان تا ببینی مورخان چه می‌گویند.",
      tap: "برای دیدن پاسخ بزن",
      claim: "روایت",
      verdict: "مورخان",
      items: {
        europe: { claim: "«این نبرد اروپا را نجات داد.»", tag: "اغراق", truth: "وین نزدیک مرز توان لجستیک عثمانی بود. گرفتنش ضربه‌ی بزرگی بود، اما معنایش «سقوط اروپا» نبود. این تیتر، درام است نه تحلیل." },
        crusade: { claim: "«اروپای مسیحی در برابر عثمانی بود.»", tag: "نادرست", truth: "فرانسه‌ی لویی چهاردهم به امداد نپیوست و دیپلماسی‌اش در استانبول به نفع جنگ بود. شورشیان مجار به رهبری ایمره توکولی متحد عثمانی بودند." },
        decline: { claim: "«۱۶۸۳ سقوط عثمانی را رقم زد.»", tag: "محل بحث", truth: "از ۱۶۸۳ از دست رفتن پایدار سرزمین در اروپا شروع شد و پیمان کارلوویتس (۱۶۹۹) بیشتر مجارستان را از عثمانی گرفت. اما بیشتر مورخان امروز «زوال» را تصویر دقیقی نمی‌دانند و از «دگرگونی» حرف می‌زنند." },
        croissant: { claim: "«کروسان و اولین قهوه‌خانه‌ی وین از همین نبرد آمدند.»", tag: "افسانه", truth: "نان هلالی «کیپفرل» پیش از ۱۶۸۳ در اتریش بود و کروسان فرانسوی مال قرن نوزدهم است. اولین قهوه‌خانه‌ی مجاز وین را یوهانس دیوداتو در ۱۶۸۵ باز کرد؛ داستان کولچیتسکی بعدها ساخته شد." },
      },
    },
    business: {
      kicker: "انتقال به کسب‌وکار",
      title: "این همان داستان استارتاپ در برابر شرکت بزرگ است",
      lead: "شرکت بزرگ پول و نیرو دارد، اما تمرکزش بین ده هدف پخش است. استارتاپ کوچک یک هدف، یک بازار و یک مزیت دارد.",
      bigLabel: "قره مصطفی / شرکت بزرگ",
      smallLabel: "اشتارهمبرگ / استارتاپ",
      rows: [
        { big: "منابع زیاد، تمرکز پخش", small: "منابع کم، یک هدف" },
        { big: "می‌خواهد همه چیز را با هم داشته باشد", small: "می‌داند فقط چه چیزی باید بماند" },
        { big: "تهدید دوم را دست‌کم می‌گیرد", small: "از روز اول می‌داند امداد کی می‌رسد" },
        { big: "هر روز تأخیر گران‌تر می‌شود", small: "هر روز دوام، یک پیروزی است" },
      ],
    },
    mirror: {
      kicker: "آینه",
      title: "تو اشتارهمبرگی یا قره مصطفی؟",
      lead: "چهار سؤال درباره‌ی هفته‌ی کاری خودت. جواب‌ها فقط در مرورگر خودت می‌ماند.",
      projects: "چند پروژه را هم‌زمان پیش می‌بری؟",
      share: "چند درصد ساعت‌های هفته‌ات روی پروژه‌ی اصلی می‌رود؟",
      goal: "برای این فصل یک هدف نوشته‌شده داری؟",
      threat: "می‌دانی «ارتش امدادی» رقیبت از کجا می‌آید؟",
      yes: "بله",
      no: "نه",
      starhemberg: { title: "اشتارهمبرگ", body: "منابعت را در نقطه‌ی تعیین‌کننده جمع کرده‌ای. حالا مراقب باش فراوانیِ موفقیت تو را بی‌دقت نکند." },
      middle: { title: "در میانه‌ی میدان", body: "تمرکز داری، اما نه کامل. یک پروژه را انتخاب کن که اگر فقط همان بماند، باز هم راضی هستی." },
      kara: { title: "قره مصطفی", body: "منابعت (زمان، پول، توجه) بین پروژه‌های زیادی پخش است. طبق همین اصل، احتمالاً در هیچ‌کدام به نقطه‌ی تعیین‌کننده نمی‌رسی." },
      rule: "معیار ساده: اگر کمتر از نیمی از ساعت‌های هفته‌ات روی یک پروژه‌ی اصلی می‌رود، جای فکر دارد.",
      privacy: "چیزی ذخیره یا فرستاده نمی‌شود.",
    },
    takeaway: {
      kicker: "در یک جمله",
      quote: "پیروزی مال کسی نیست که منابع بیشتری دارد؛ مال کسی است که منابع کمیاب را در نقطه‌ی تعیین‌کننده و در زمان درست متمرکز می‌کند.",
      tail: "فراوانی، قره مصطفی را بی‌دقت کرد. کمبود، مدافعان را دقیق کرد.",
    },
    medals: {
      title: "نشان‌های افتخار",
      hint: "با هر بخش تعاملی یک نشان بگیر.",
      names: { numbers: "عددشناس", clock: "شصت روز", council: "شورای جنگ", lines: "خطوط داخلی", myths: "افسانه‌شکن", mirror: "آینه" },
      complete: "هر شش نشان را گرفتی. حالا این داستان را بهتر از بیشتر کسانی که تعریفش می‌کنند می‌دانی.",
      open: "باز کردن نشان‌ها",
      close: "بستن",
    },
    method: {
      kicker: "روش و منابع",
      title: "این گزارش چطور ساخته شد",
      notes: [
        "تحلیل از جمله‌ای شروع شد که در یک کلاس تفکر استراتژیک شنیدم. پیش از انتشار، همه‌ی عددها و تاریخ‌ها با منابع تاریخی بررسی شد و چند رقمِ مشهور اصلاح شد؛ مهم‌ترینش همان ۳۰۰ هزار نفر.",
        "اعداد نیروها بازه‌اند، چون مورخان هم بازه می‌دهند. تلفات هم برآورد است: پادگان حدود ۴ تا ۵ هزار سرباز از دست داد و عثمانی در روز نبرد حدود ۸ تا ۱۵ هزار کشته و زخمی.",
        "بازی «شورای جنگ» معیار همین درس را می‌سنجد، نه اینکه تاریخ جایگزین را پیش‌بینی کند.",
        "نشان‌ها در مرورگر خودت ذخیره می‌شوند و جواب‌های «آینه» هیچ‌جا ذخیره نمی‌شود.",
      ],
      sourcesTitle: "منابع",
      sources: SOURCES,
    },
    colophon: {
      shareTitle: "۳۰۰ هزار در برابر ۱۲ هزار؟ محاصره‌ی وین و قانون منابع کمیاب",
      disclaimer: "این گزارش یک تحلیل آموزشی است و ارقام تاریخی آن برآورد مورخان است.",
      cta: "گفت‌وگو با فرجاد",
    },
  },

  en: {
    hero: {
      kicker: "Reports",
      quote: "Those 300,000 could not get past those 12,000.",
      quoteBy: "A line I heard in a strategic-thinking class",
      lead: "In the summer of 1683 the largest Ottoman army in decades stood before the walls of Vienna. Sixty days later it was beaten and gone. Why? The short answer: power is effective resources, not total resources. This page shows that step by step, and at several points asks you to make the call yourself.",
      stats: [
        { value: "60", label: "days of siege, 14 July to 12 September" },
        { value: "16,000", label: "defenders: 11,000 soldiers and 5,000 armed citizens" },
        { value: "65–80k", label: "men in the relief army that finished it" },
      ],
      medals: "Earn a medal in every interactive section. There are six on this page.",
    },
    numbers: {
      kicker: "First, the numbers",
      title: "300,000? No. And the 12,000 were not alone",
      lead: "For the analysis to hold, fix the numbers first. Flip the switch to see how the classroom version differs from what historians estimate today. Each figure is 5,000 men.",
      myth: "The famous version",
      history: "What historians estimate",
      perIcon: "One figure = 5,000 men",
      sides: { ottoman: "Ottoman army", defenders: "Defenders of Vienna", relief: "Relief army" },
      notes: {
        claim: "The figure of the period's pamphlets; it counts labourers, crews and camp followers.",
        total: "The whole army that marched from Belgrade: 100,000–150,000.",
        combat: "Actual fighting troops: about 60,000–90,000. By 12 September perhaps 50,000–60,000 were left.",
        defenders: "11,000 soldiers plus 5,000 armed citizens and volunteers.",
        relief: "65,000–80,000 under John Sobieski, roughly a quarter to a third of them Polish.",
      },
      verdict: {
        title: "So what did the 12,000 do?",
        body: "They did not defeat the Ottomans. Their job was to last sixty days. The relief army won the decisive battle at the Kahlenberg. The good news is that the correction makes the strategic lesson stronger, not weaker: the defender did not need to win, only to buy time.",
      },
    },
    cast: {
      kicker: "Three commanders",
      title: "Three men, three different goals",
      people: [
        { name: "Kara Mustafa Pasha", role: "Ottoman Grand Vizier, commanding the siege", aim: "Goal: take the city, intact and rich, before autumn.", force: "100,000–150,000 men, mostly light guns" },
        { name: "Ernst Rüdiger von Starhemberg", role: "Commander of the Vienna garrison", aim: "Goal: just hold out until relief arrives.", force: "11,000 soldiers, 5,000 citizens, 300+ guns" },
        { name: "John III Sobieski", role: "King of Poland, commanding the relief", aim: "Goal: come down from the heights and break the camp.", force: "65,000–80,000 Polish and Imperial troops" },
      ],
    },
    resources: {
      kicker: "Effective resources",
      title: "A big army is also a big consumer",
      lead: "The principle of scarce resources says every resource is limited and every choice costs you another option. The common mistake is to think a bigger army means more resources. Kara Mustafa was short of exactly the resources that decided the outcome.",
      cards: [
        { name: "Time", state: "The army arrived on 14 July. The campaigning season was short and the army had to be home before winter." },
        { name: "Heavy siege guns", state: "Left behind to move faster. About 110–150 guns, almost all light." },
        { name: "Supplies", state: "Feeding more than 100,000 people on enemy ground cost more every day." },
        { name: "The commander's attention", state: "Split between the siege, raiding the countryside and the relief army's threat." },
      ],
      conclusion: "Every day of delay cost the attacker far more than the defender.",
    },
    clock: {
      kicker: "The siege clock",
      title: "Sixty days, one hourglass",
      lead: "Drag the slider. Every day that passes is a small win for the defender and a large cost for the attacker.",
      day: (d) => `Day ${d}`,
      before: "Before the siege",
      events: {
        leopold: { date: "7 July", title: "The emperor leaves the city", body: "Leopold I leaves by night for Linz, then Passau. Command passes to Starhemberg." },
        begins: { date: "14 July", title: "The siege begins", body: "The Ottoman camp closes around the city. The main attack falls on the Burg and Löbel bastions." },
        breach: { date: "4 September", title: "A mine goes off under the Burg bastion", body: "The wall is breached, with more breaches by 10 September. The city is close to falling." },
        tulln: { date: "6–9 September", title: "The relief crosses the Danube", body: "The relief army crosses at Tulln. The Crimean Tatars put up no serious resistance." },
        heights: { date: "11 September", title: "The relief on the heights", body: "The relief army reaches the Kahlenberg, heights the Ottomans never fortified." },
        battle: { date: "12 September", title: "The Battle of the Kahlenberg", body: "In the afternoon the cavalry comes down from the hills and the Ottoman camp breaks." },
      },
      attacker: "Attacker's cost",
      defender: "Defender's goal",
      attackerCost: "Supplies, disease, a season running out",
      defenderCost: "Days bought",
    },
    council: {
      kicker: "The war council",
      title: "You are Kara Mustafa",
      lead: "Five decisions he actually made. Make each one yourself and see what it costs you. Then see what history did.",
      youAre: "You are the Grand Vizier. Your army is before Vienna, and you know a relief army is coming.",
      step: (i, n) => `Decision ${i} of ${n}`,
      history: "What Kara Mustafa did",
      yourPick: "Your choice",
      cost: "The option you give up",
      next: "Next decision",
      finish: "See the result",
      restart: "Play again",
      meter: "Focus on the scarce resource",
      dilemmas: {
        guns: {
          q: "Bring the heavy siege guns, or travel light?",
          options: ["Bring the heavy guns, even if you arrive later", "Travel light, field guns only"],
          cost: ["Weeks of time on the march.", "The power to break the walls quickly."],
          history: "He travelled light: about 110–150 guns, almost all light, and no true siege pieces.",
        },
        method: {
          q: "A full early assault, or a slow siege by mining?",
          options: ["Attack with everything from the first days", "Go slowly and wait for surrender"],
          cost: ["Soldiers' lives, and probably the city sacked by them.", "Time, the scarcest resource of all."],
          history: "A slow siege. Some historians suggest he wanted the city to surrender so its wealth would not be sacked in a storm; his intent is not documented.",
        },
        heights: {
          q: "Fortify the Kahlenberg heights and the Vienna Woods?",
          options: ["Dig in and post troops there", "Leave them; the relief is still far away"],
          cost: ["Men and labour taken from the siege.", "Control of the very ground the enemy will attack from."],
          history: "He left them. A few small detachments, no serious fortification.",
        },
        troops: {
          q: "Keep most of the army in the siege trenches, or turn it to face the relief?",
          options: ["Turn the main force toward the relief", "Keep most of the troops in the trenches"],
          cost: ["Less pressure on the city.", "Concentrated strength against the second threat."],
          history: "He kept most of them in the trenches. On the day of battle the camp was caught between the city and the relief.",
        },
        danube: {
          q: "Hold the Danube crossings with your best troops?",
          options: ["Send your best troops to the bridges", "Leave the blocking to the Crimean Tatars"],
          cost: ["Troops taken from the siege.", "The relief army crossing the river unopposed."],
          history: "He left it to the Tatars. The relief army crossed at Tulln with no serious resistance.",
        },
      },
      result: (score, n) => `${score} of your ${n} choices protected the scarce resource.`,
      verdicts: [
        "Like Kara Mustafa, you wanted everything at once: an intact city, the plunder, a safe camp and victory over the relief. Whoever does not prioritise ends up weak everywhere.",
        "Sometimes you bought time and sometimes you spent it. Your plan still has no clear priority.",
        "You took time and the second threat seriously, the two things Kara Mustafa ignored. That does not guarantee victory, but it changes the game.",
      ],
      lesson: "This score measures this lesson, not an alternative history. Nobody knows what would have happened had Kara Mustafa decided differently.",
    },
    defence: {
      kicker: "Why they held",
      title: "Scarcity forced the defenders to focus",
      lead: "Five reasons a small garrison held for sixty days against an army several times its size. Tap each one.",
      items: {
        goals: { name: "A simple goal", body: "The defender did not have to win, only to buy time. The attacker had to win. That asymmetry of goals changes everything." },
        walls: { name: "The leverage of walls", body: "Walls and fortifications are a force multiplier. A military rule of thumb says the attacker needs about three times the defender's strength at the point of attack, so the Ottoman advantage was smaller than it looked." },
        lines: { name: "Interior lines", body: "The defenders were inside a small city and could move troops quickly to the point of danger. The Ottomans were spread around a large circle. Try it below." },
        focus: { name: "Focus on the vital point", body: "Counter-mining underground, sorties from the gates, and the defence of a few key bastions instead of an even defence everywhere." },
        command: { name: "Unity of command", body: "Starhemberg had one clear order: we do not surrender. On the Ottoman side, cooperation with the Tatars was weak." },
      },
      lines: {
        title: "The interior-lines race",
        threat: "A bastion is under attack!",
        defenders: "Defenders from the centre",
        attackers: "Attackers around the ring",
        run: "Launch an attack",
        again: "Another point",
        won: "The defenders got there first",
      },
      caveat: "\"Three to one\" is a rule of thumb, not a law of history: it is meant for the point of attack, not a whole battlefield, and the evidence for it is debated.",
    },
    charge: {
      kicker: "12 September",
      title: "The charge from the Kahlenberg",
      lead: "Scroll down and follow the charge.",
      beats: [
        { time: "Morning", text: "The relief army comes down from the heights of the Vienna Woods. On the left, Imperial troops under Charles of Lorraine engage first." },
        { time: "Midday", text: "The Ottomans are caught between two fires: behind them a city that has not fallen, in front of them an army coming from above." },
        { time: "Afternoon", text: "About 18,000–20,000 horsemen, with some 3,000 Polish winged hussars at the centre, ride down from the hills." },
        { time: "Evening", text: "The Ottoman camp breaks. The Grand Vizier's tent falls to the attackers and the siege is over." },
      ],
      scale: "It is often called one of the largest cavalry charges in history. \"The largest\" is a popular claim that cannot be proven.",
    },
    myths: {
      kicker: "A critical view",
      title: "Four stories to tell with care",
      lead: "Flip each card to see what historians say.",
      tap: "Tap to see the answer",
      claim: "The story",
      verdict: "Historians",
      items: {
        europe: { claim: "\"This battle saved Europe.\"", tag: "Overstated", truth: "Vienna was near the limit of Ottoman logistics. Taking it would have been a heavy blow, but it would not have meant \"Europe falls\". That headline is drama, not analysis." },
        crusade: { claim: "\"It was Christian Europe against the Ottomans.\"", tag: "False", truth: "Louis XIV's France stayed out of the relief, and its diplomacy in Constantinople favoured the war. Hungarian rebels under Imre Thököly were Ottoman allies." },
        decline: { claim: "\"1683 caused the Ottoman decline.\"", tag: "Debated", truth: "1683 began lasting territorial losses in Europe, and the Treaty of Karlowitz (1699) took most of Hungary. But most historians today reject \"decline\" as the right picture and speak of transformation." },
        croissant: { claim: "\"The croissant and Vienna's first coffee house came from this battle.\"", tag: "Legend", truth: "The crescent-shaped Kipferl existed in Austria before 1683, and the French croissant is a 19th-century pastry. Vienna's first licensed coffee house was opened by Johannes Diodato in 1685; the Kolschitzky story was invented later." },
      },
    },
    business: {
      kicker: "The business transfer",
      title: "This is the startup-versus-incumbent story",
      lead: "The big company has money and people, but its focus is spread across ten goals. The small startup has one goal, one market, one advantage.",
      bigLabel: "Kara Mustafa / the incumbent",
      smallLabel: "Starhemberg / the startup",
      rows: [
        { big: "Many resources, scattered focus", small: "Few resources, one goal" },
        { big: "Wants everything at once", small: "Knows the one thing that must survive" },
        { big: "Underestimates the second threat", small: "Knows from day one when the relief arrives" },
        { big: "Every day of delay costs more", small: "Every day held is a win" },
      ],
    },
    mirror: {
      kicker: "The mirror",
      title: "Are you Starhemberg or Kara Mustafa?",
      lead: "Four questions about your own working week. The answers stay in your browser.",
      projects: "How many projects are you running at once?",
      share: "What share of your weekly hours goes to your main project?",
      goal: "Do you have one written goal for this quarter?",
      threat: "Do you know where your rival's \"relief army\" will come from?",
      yes: "Yes",
      no: "No",
      starhemberg: { title: "Starhemberg", body: "Your resources are concentrated at the decisive point. Now make sure the abundance of success does not make you careless." },
      middle: { title: "Mid-field", body: "You have focus, but not all of it. Pick the one project you would still be happy with if it were the only one left." },
      kara: { title: "Kara Mustafa", body: "Your resources (time, money, attention) are spread across many projects. By this principle you probably reach the decisive point in none of them." },
      rule: "A simple test: if less than half of your weekly hours go to one main project, it is worth a second thought.",
      privacy: "Nothing is stored or sent.",
    },
    takeaway: {
      kicker: "In one sentence",
      quote: "Victory does not go to whoever has more resources; it goes to whoever concentrates scarce resources at the decisive point, at the right time.",
      tail: "Abundance made Kara Mustafa careless. Scarcity made the defenders precise.",
    },
    medals: {
      title: "Campaign medals",
      hint: "Earn a medal in every interactive section.",
      names: { numbers: "Number checker", clock: "Sixty days", council: "War council", lines: "Interior lines", myths: "Myth buster", mirror: "The mirror" },
      complete: "All six medals. You now know this story better than most people who tell it.",
      open: "Open medals",
      close: "Close",
    },
    method: {
      kicker: "Method and sources",
      title: "How this report was made",
      notes: [
        "The analysis began with a line I heard in a strategic-thinking class. Before publishing, every number and date was checked against historical sources and several famous figures were corrected, above all the 300,000.",
        "Forces are given as ranges because historians give ranges. Casualties are estimates too: the garrison lost some 4,000–5,000 soldiers, and the Ottomans about 8,000–15,000 killed and wounded on the day of the battle.",
        "The war-council game scores this lesson; it does not predict an alternative history.",
        "Medals are stored in your own browser, and the mirror's answers are not stored anywhere.",
      ],
      sourcesTitle: "Sources",
      sources: SOURCES,
    },
    colophon: {
      shareTitle: "300,000 against 12,000? The Siege of Vienna and the law of scarce resources",
      disclaimer: "This report is an educational analysis; its historical figures are historians' estimates.",
      cta: "Talk to Farjad",
    },
  },
}
