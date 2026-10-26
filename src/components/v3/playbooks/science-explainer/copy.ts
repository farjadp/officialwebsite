// ============================================================================
// File Path: src/components/v3/playbooks/science-explainer/copy.ts
// Why: Every sentence of playbook 02 in both locales, one structure for both.
//      The Persian follows Farjad's own walkthrough of the prompt; the English
//      says the same. Fact-check corrections from 2026-10-26 are built in:
//      ElevenLabs timings are per character, headless browsers start without
//      the GPU, -14 LUFS is Spotify's stated target (YouTube's is measured,
//      not published), and the temperature drop is a one-year estimate.
// ============================================================================

import type { Locale } from "@/lib/nav"

type Callout = { title: string; body: string }

type Copy = {
  kicker: string
  hero: { lead: string; specs: { outcome: string; level: string; cost: string; verified: string }; stats: { fps: string; res: string; beats: string }; note: Callout; jump: string }
  player: { kicker: string; title: string; lead: string; caveat: string }
  flow: { kicker: string; title: string; lead: string; gate: string }
  look: { kicker: string; title: string; lead: string; copyHint: string; copied: string; realVsDrawn: string; sunBody: string; earthBody: string; rules: Callout }
  type: { kicker: string; title: string; lead: string; rise: string; fade: string; replay: string; mascot: Callout; points: string[] }
  story: { kicker: string; title: string; lead: string; zoom: string; night: Callout }
  voice: { kicker: string; title: string; lead: string; cost: string; timing: string; demoTitle: string; demoHint: string; play: string; rules: string[]; fix: Callout }
  arch: { kicker: string; title: string; lead: string; code: string; clocks: { title: string; lead: string; ambient: string; story: string; rewind: string; bad: string; good: string }; spring: { title: string; lead: string; damping: string; freq: string; ok: string; tooBouncy: string; tooFlat: string; replay: string } }
  render: { kicker: string; title: string; lead: string; steps: { name: string; does: string }[]; gpu: Callout; crf: Callout; commands: string }
  sound: { kicker: string; title: string; lead: string; under: string; loud: Callout; sfx: string }
  science: { kicker: string; title: string; lead: string; verdicts: { true: string; approx: string; estimate: string }; source: string }
  gotchas: { kicker: string; title: string; items: Callout[] }
  prompt: { kicker: string; title: string; lead: string; why: Callout }
  checklist: { kicker: string; title: string; lead: string; items: string[]; done: (n: number, of: number) => string; reset: string }
  method: { kicker: string; title: string; changelogTitle: string; corrections: string[]; sourcesTitle: string; photos: string }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
}

export const COPY: Record<Locale, Copy> = {
  fa: {
    kicker: "پلی‌بوک‌ها",
    hero: {
      lead:
        "این پرامپت فقط نمی‌گوید «یک ویدیوی زیبا بساز». رنگ‌ها، کاراکتر، حرکت دوربین، هماهنگی نریشن با تصویر، صدا و رندر را با جزئیات مشخص می‌کند و از Claude Code می‌خواهد یک سیستم انیمیشن کدنویسی‌شده بسازد. این‌جا قدم‌به‌قدم بازش کرده‌ام و یک نسخه‌ی کوچکش را همین‌جا، زنده، ساخته‌ام.",
      specs: { outcome: "آخرش دستت است", level: "پیش‌نیاز", cost: "هزینه", verified: "آخرین بررسی" },
      stats: { fps: "فریم در ثانیه", res: "رزولوشن", beats: "ضرب‌آهنگ در ۳۰ ثانیه" },
      note: {
        title: "انتظار درست",
        body: "این یک دستورالعمل فنی بسیار دقیق است، نه تضمین این‌که Claude در ده دقیقه یک ویدیوی بی‌نقص تحویل بدهد. WebGL، رندر با GPU، نصب وابستگی‌ها، ساخت صدا و رفع خطاها چند دور اصلاح می‌خواهند. برای همین پرامپت دو بار می‌ایستد تا تو تأیید کنی.",
      },
      jump: "اول نسخه‌ی زنده را ببین",
    },
    player: {
      kicker: "همین‌جا، زنده",
      title: "اگر خورشید ناپدید می‌شد؟",
      lead: "این ۳۰ ثانیه با همان روش پرامپت کشیده شده: یک Canvas، و تابعی که هر فریم را فقط از روی زمان می‌سازد. برای همین می‌توانی هر جای آن بپری، عقب بروی یا متوقفش کنی و همیشه همان تصویر را ببینی.",
      caveat: "نسخه‌ی ساده‌شده است: زمین یک دایره‌ی دوبعدی است نه کره‌ی WebGL، و صدا و Motion Blur ندارد. ویدیوی واقعی را خود پرامپت می‌سازد.",
    },
    flow: {
      kicker: "مسیر کار",
      title: "سه سؤال، دو تأیید، یک رندر",
      lead: "Claude اول سه سؤال می‌پرسد، بعد نریشن و زمان‌بندی اتفاق‌ها را نشانت می‌دهد، و قبل از رندر نهایی یک کانتکت شیت از همه‌ی صحنه‌ها. دو جایی که کار متوقف می‌شود، ارزان‌ترین جا برای عوض کردن نظرت است.",
      gate: "توقف برای تأیید",
    },
    look: {
      kicker: "۱ · طراحی بصری",
      title: "رنگ‌ها را با عدد بده، نه با صفت",
      lead: "پرامپت به جای «فضای زیبا» می‌گوید گرادیان از #081d2c تا #102348، پنج توده‌ی سحابی با شفافیت مشخص، و سه لایه ستاره در عمق‌های ۰٫۱۲، ۰٫۳۵ و ۰٫۶. همین دقت است که خروجی را از «یک انیمیشن» به «یک سبک» می‌رساند. روی هر رنگ بزن تا کدش کپی شود.",
      copyHint: "برای کپی کد رنگ بزن",
      copied: "کپی شد",
      realVsDrawn: "واقعی و کشیده‌شده",
      sunBody: "خورشید واقعی در نور فرابنفش، از رصدخانه‌ی SDO ناسا. نسخه‌ی کشیده‌شده عمداً ساده است: یک گرادیان سه‌رنگ، چهار حلقه‌ی هاله و هیچ زبانه‌ای روی لبه.",
      earthBody: "زمین واقعی از آپولو ۱۷. در نسخه‌ی کشیده‌شده هر خشکی یک رنگ تخت دارد و نور هر فریم از جای خورشید حساب می‌شود.",
      rules: {
        title: "دو قانون که پرامپت روی آن‌ها پافشاری می‌کند",
        body: "روی لبه‌ی خورشید هیچ زبانه‌ی نوری نکش؛ در عمل شبیه قلاب سفید دیده می‌شود. و از تصویر یا ویدیوی ساخته‌ی هوش مصنوعی استفاده نکن؛ همه‌چیز با کد کشیده می‌شود.",
      },
    },
    type: {
      kicker: "۲ · کاراکتر و تایپوگرافی",
      title: "نوشته از پشت یک برش بالا می‌آید، محو نمی‌شود",
      lead: "همه‌ی نوشته‌ها با فونت Fredoka در وزن ۶۰۰ و ۷۰۰، حروف بزرگ، فاصله‌ی ۳ تا ۶ پیکسل و داخل کپسول‌های گرد. هر خط به اندازه‌ی ۱٫۳ برابر ارتفاع خودش از پشت یک برش بالا می‌آید. تفاوت را کنار هم ببین:",
      rise: "بالا آمدن از برش",
      fade: "محو شدن ساده",
      replay: "دوباره",
      mascot: {
        title: "فضانورد کوچک",
        body: "حدود ۱۸۰ پیکسل، ساخته از مستطیل‌های گرد. لباس سفید، چکمه‌ی نارنجی، کلاه شیشه‌ای تیره و چشم‌های فیروزه‌ای که به هر چیزی که مهم است نگاه می‌کنند. شناور است، پلک می‌زند، چراغ آنتنش چشمک می‌زند و در هر تغییر حالت کمی فشرده و کشیده می‌شود.",
      },
      points: [
        "کاراکتر باید مال خودت باشد. پرامپت صریحاً کپی کردن کاراکترهای کانال‌های دیگر را ممنوع می‌کند.",
        "روی متن‌های تصویر نقطه‌ی پایان جمله نگذار.",
        "در پایان: وینیت ملایم و ۶٪ نویز فیلم که ۲۴ بار در ثانیه عوض می‌شود.",
      ],
    },
    story: {
      kicker: "۳ · روایت و دوربین",
      title: "یک شکل روایت که برای هر موضوعی کار می‌کند",
      lead: "سناریوی خورشید فقط مثال است. چیزی که باید نگه داری، شکل آن است: اتفاق روی کلمه‌ی خودش، عقب رفتن برای مقیاس، شیرجه به سمت «تو»، دوباره عقب، پیامدها با یک شمارنده‌ی زنده، تشدید، یک شوخی، بازگشت به تصویر قبلی و عنوان. خط زیر، بزرگ‌نمایی دوربین در هر قدم است.",
      zoom: "بزرگ‌نمایی",
      night: {
        title: "چرا چراغ شهرها؟",
        body: "وقتی تاریکی به زمین می‌رسد، چراغ‌های شهر روشن می‌شوند. از نظر علمی شاعرانه است، چون چراغ‌ها شب همیشه روشن‌اند. ولی همین لحظه است که «تاریکی» را برای بیننده واقعی می‌کند.",
      },
    },
    voice: {
      kicker: "۴ · هماهنگی نریشن و انیمیشن",
      title: "هر اتفاق روی یک کلمه",
      lead: "قانون اصلی: هر جمله‌ی نریشن با یک حرکت دوربین یا تغییر تصویر همراه است و تصویر هیچ‌وقت طولانی بی‌حرکت نمی‌ماند. برای این کار زمان دقیق هر کلمه لازم است، و دو راه برای گرفتنش هست.",
      cost: "هزینه",
      timing: "زمان‌بندی",
      demoTitle: "کلمه‌ها، و اتفاقی که هر کدام راه می‌اندازد",
      demoHint: "خط زرد زمان است؛ کلمه‌هایی که زیرشان اتفاق نوشته شده، رویدادی در تصویر را صدا می‌زنند.",
      play: "پخش",
      rules: [
        "حدود ۱۶۵ کلمه در دقیقه.",
        "۰٫۲۴ ثانیه مکث بین جمله‌ها.",
        "۰٫۳۶ ثانیه مکث قبل از افشای اصلی.",
        "اگر خواندن طول کشید، متن را کوتاه کن؛ صدا را برای جا شدن در تصویر کش نده.",
      ],
      fix: {
        title: "اصلاح نسبت به پست اصلی",
        body: "API زمان‌بندی ElevenLabs زمان شروع و پایان هر کاراکتر را می‌دهد، نه هر کلمه را. Claude باید کاراکترها را خودش به کلمه تبدیل کند. مدل eleven_v4 و تنظیمات پیش‌فرض stability ۰٫۵ و similarity ۰٫۷۵ درست‌اند.",
      },
    },
    arch: {
      kicker: "۵ · معماری فنی",
      title: "هر فریم، تابعی از زمان",
      lead: "کل پروژه یک فایل HTML است و یک تابع: window.seek(t) فریم t را می‌کشد. هیچ تایمر یا انیمیشن CSS مستقلی وجود ندارد، پس رندر هر فریم تکرارپذیر است و می‌شود هر ثانیه را جدا بازسازی کرد. پخش‌کننده‌ی بالای همین صفحه دقیقاً همین‌طور کار می‌کند.",
      code: `// هر چیزی که روی تصویر است، فقط از t می‌آید
window.seek = (t) => {
  const st = storyTime(t)      // ساعت داستان، که می‌تواند عقب برود
  const cam = camera(st)       // دوربین با easeInOutCubic، زوم در فضای لگاریتمی
  drawSpace(t, cam)            // ستاره‌ها روی ساعت محیط
  drawSun(st)
  drawEarth(st, t)
  drawCaptions(t)
}`,
      clocks: {
        title: "دو ساعت جدا",
        lead: "ستاره‌ها، چرخش زمین و شناور بودن فضانورد روی «ساعت محیط» حرکت می‌کنند و همیشه جلو می‌روند. اتفاق‌های داستان روی «ساعت داستان». وقتی داستان ۰٫۸ ثانیه به عقب برمی‌گردد، اگر یک ساعت باشد، ستاره‌ها هم عقب می‌پرند و تصویر می‌لرزد.",
        ambient: "ساعت محیط",
        story: "ساعت داستان",
        rewind: "برگشت",
        bad: "یک ساعت: همه‌چیز عقب می‌پرد",
        good: "دو ساعت: فقط داستان برمی‌گردد",
      },
      spring: {
        title: "فنر میرا برای هر ضربه",
        lead: "حرکت دوربین با easeInOutCubic نرم است، ولی هر «پاپ» (شمارنده‌ای که با ضربه می‌آید، سنجاقی که فرود می‌آید) با یک فنر میرا ساخته می‌شود. پرامپت میرایی ۰٫۴۲ تا ۰٫۵ و فرکانس ۱۲ تا ۱۶ را می‌خواهد. خودت امتحان کن:",
        damping: "میرایی",
        freq: "فرکانس",
        ok: "در محدوده‌ی پرامپت",
        tooBouncy: "زیادی فنری",
        tooFlat: "بی‌جان",
        replay: "دوباره",
      },
    },
    render: {
      kicker: "۶ · رندر",
      title: "از HTML تا MP4",
      lead: "Playwright مرورگر Edge را بدون پنجره باز می‌کند، هر فریم را با seek(t) می‌کشد و عکس می‌گیرد. برای Motion Blur دو زیرفریم با شاتر ۰٫۶ با هم ترکیب می‌شوند. ffmpeg فریم‌ها را با کدک H.264 کنار هم می‌گذارد.",
      steps: [
        { name: "seek(t)", does: "۹۰۰ فریم برای ۳۰ ثانیه" },
        { name: "Playwright + Edge", does: "بدون پنجره، با GPU" },
        { name: "دو زیرفریم", does: "شاتر ۰٫۶ برای Motion Blur" },
        { name: "libx264", does: "Master با CRF 16، تحویلی با CRF 20" },
        { name: "میکس صدا", does: "منفی ۱۴ LUFS" },
      ],
      gpu: {
        title: "اصلاح: GPU خودبه‌خود روشن نیست",
        body: "Chrome و Edge در حالت بدون پنجره به‌طور پیش‌فرض GPU را خاموش می‌کنند و WebGL را با نرم‌افزار (SwiftShader) می‌کشند: کند، و گاهی با ظاهر متفاوت. باید با فلگ‌های GPU اجرا شود و درایور درست نصب باشد. از Claude بخواه رشته‌ی renderer در WebGL را چک کند و اگر نرم‌افزاری بود، صادقانه بگوید.",
      },
      crf: {
        title: "CRF یعنی چه؟",
        body: "عدد کیفیت x264: هرچه کمتر، کیفیت بیشتر و فایل بزرگ‌تر. پیش‌فرض ۲۳ است. ۱۶ برای نسخه‌ی اصلی که بعداً دوباره ویرایش می‌شود، ۲۰ برای نسخه‌ای که آپلود می‌کنی.",
      },
      commands: "نمونه‌ی دو دستور آخر",
    },
    sound: {
      kicker: "۷ · موسیقی، افکت و میکس",
      title: "صدا را هم با عدد بده",
      lead: "یک موسیقی فضایی آرام و بدون حق امتیاز، ۷ دسی‌بل زیر نریشن، که پایان طبیعی‌اش با عنوان پایانی بخواند. برای هر نوع اتفاق یک افکت، دقیقاً روی فریم خودش و ۴ تا ۱۰ دسی‌بل زیر صدا. مجوز هر فایل صوتی را قبل از استفاده چک کن.",
      under: "نسبت به نریشن",
      loud: {
        title: "اصلاح: منفی ۱۴ LUFS",
        body: "منفی ۱۴ LUFS هدف رسمی Spotify است. یوتیوب عدد رسمی منتشر نکرده؛ اندازه‌گیری‌ها حدود همان منفی ۱۴ را نشان می‌دهند، و یوتیوب فقط صدای بلند را کم می‌کند، صدای آرام را بلند نمی‌کند. سقف True Peak منفی ۲٫۲ دسی‌بل انتخاب امنی است.",
      },
      sfx: "افکت‌ها، یکی برای هر نوع اتفاق",
    },
    science: {
      kicker: "علم پشت سناریو",
      title: "سناریوی نمونه چقدر درست است؟",
      lead: "پرامپت درباره‌ی ساختن است، نه علم. ولی وقتی ویدیوی علمی می‌سازی، عددها باید درست باشند. هر ادعای سناریوی خورشید را با منبع چک کردم:",
      verdicts: { true: "درست", approx: "شاعرانه", estimate: "تخمین" },
      source: "منبع",
    },
    gotchas: {
      kicker: "نکته‌هایی که پرامپت رویشان تأکید می‌کند",
      title: "جاهایی که معمولاً خراب می‌شود",
      items: [
        { title: "لبه‌ی زمین بریده می‌شود", body: "Canvas کره‌ی زمین در نماهای نزدیک باید دست‌کم ۲ × شعاع × زوم × ۱٫۱۸ پیکسل باشد، وگرنه لبه‌ها قطع می‌شوند." },
        { title: "قلاب‌های سفید روی خورشید", body: "هر زبانه‌ای روی لبه‌ی خورشید در ویدیو مثل قلاب سفید دیده می‌شود. اصلاً نکش." },
        { title: "صدای کش‌آمده", body: "اگر نریشن طولانی شد، متن را فشرده کن. صدا را برای جا شدن در تصویر کش نده." },
        { title: "تاریکی که تمام نمی‌شود", body: "مرز تاریکی باید نزدیک زمین تند شود؛ از حدود ۴۷ به ۷۰۰ پیکسل در ثانیه، تا عبورش از زمین ۰٫۷ ثانیه طول بکشد." },
        { title: "برگشتی که همه‌چیز را به هم می‌ریزد", body: "ساعت محیط و ساعت داستان را جدا نگه دار تا برگشت در زمان ستاره‌ها و چرخش زمین را خراب نکند." },
        { title: "رندر بدون پیش‌نمایش", body: "قبل از رندر نهایی، یک کانتکت شیت از همه‌ی ضرب‌آهنگ‌ها ببین. رندر کامل طولانی است و اشتباه دیر پیدا می‌شود." },
      ],
    },
    prompt: {
      kicker: "پرامپت کامل",
      title: "پرامپت، آماده‌ی کپی",
      lead: "پرامپت به انگلیسی است، چون Claude با همین دقت بهتر کار می‌کند و رنگ‌ها و عددها باید دست‌نخورده بمانند. نسبت به نسخه‌ای که دست‌به‌دست شده، چند چیز اصلاح شده (پایین صفحه فهرستشان هست). آن را در Claude Code بچسبان؛ اول سه سؤال می‌پرسد.",
      why: {
        title: "چرا این‌قدر جزئی؟",
        body: "چون «یک ویدیوی زیبا بساز» به Claude اجازه می‌دهد هر تصمیمی را خودش بگیرد. وقتی رنگ، زمان، منحنی حرکت و سطح صدا عدد دارند، خروجی تکرارپذیر می‌شود و می‌توانی دقیقاً بگویی چه چیزی را عوض کند.",
      },
    },
    checklist: {
      kicker: "چک‌لیست",
      title: "اجرای اول",
      lead: "تیک‌ها در همین مرورگر می‌مانند.",
      items: [
        "Node، Python، ffmpeg و Microsoft Edge نصب‌اند",
        "Playwright نصب شده و Edge را باز می‌کند (npx playwright install msedge)",
        "رشته‌ی renderer در WebGL چک شد: GPU یا نرم‌افزار؟",
        "مسیر صدا انتخاب شد: کلید ElevenLabs یا kokoro-onnx محلی",
        "موضوع به شکل «اگر … چه می‌شد؟» و طول ویدیو مشخص است",
        "نریشن و جدول زمان‌بندی اتفاق‌ها تأیید شد",
        "عددهای علمی سناریو با منبع چک شد",
        "کانتکت شیت همه‌ی ضرب‌آهنگ‌ها دیده و تأیید شد",
        "مجوز موسیقی و افکت‌ها چک شد",
        "خروجی Master با CRF 16 و نسخه‌ی تحویلی با CRF 20 ساخته شد",
        "بلندی صدا حدود منفی ۱۴ LUFS و True Peak زیر منفی ۲ دسی‌بل است",
        "ویدیو روی گوشی دیده شد",
      ],
      done: (n, of) => `${n.toLocaleString("fa-IR")} از ${of.toLocaleString("fa-IR")} انجام شده`,
      reset: "پاک کردن تیک‌ها",
    },
    method: {
      kicker: "روش",
      title: "بررسی‌ها، اصلاح‌ها و منابع",
      changelogTitle: "تاریخچه‌ی تغییرات",
      corrections: [
        "در متنی که دست‌به‌دست شده، window.seek(t) به لینک تبدیل شده بود («http://window.seek(t)»). درستش یک تابع جاوااسکریپت است.",
        "زمان‌بندی ElevenLabs کاراکتری است، نه کلمه‌ای؛ به پرامپت اضافه شد.",
        "Chrome و Edge بدون پنجره، GPU را پیش‌فرض خاموش می‌کنند؛ پرامپت حالا می‌خواهد renderer چک و گزارش شود.",
        "منفی ۱۴ LUFS هدف رسمی Spotify است؛ برای یوتیوب عددی اندازه‌گیری‌شده است، نه منتشرشده.",
        "افت دما از ۱۵ به منفی ۷۰ درجه تخمینی برای حدود یک سال است، نه چند ثانیه؛ پرامپت حالا می‌خواهد روی تصویر برچسب بخورد.",
        "پرامپت اصلی هم «موسیقی ممنوع» می‌گفت و هم یک موسیقی زمینه می‌خواست. نسخه‌ی این‌جا «موسیقی با کلام» را ممنوع می‌کند.",
      ],
      sourcesTitle: "منابع، خوانده‌شده در ۲۶ اکتبر ۲۰۲۶",
      photos: "عکس‌ها همه از ناسا و در مالکیت عمومی‌اند.",
    },
    colophon: {
      shareTitle: "ویدیوی انیمیشنی علمی با Claude Code: پلی‌بوک فرجاد",
      disclaimer: "این پلی‌بوک از سبک کانال‌های توضیحی الهام می‌گیرد و هیچ کاراکتر یا دارایی آن‌ها را کپی نمی‌کند. Kurzgesagt کانال استودیوی kurzgesagt GmbH در مونیخ است و این صفحه هیچ ارتباطی با آن ندارد.",
      cta: "برای ساخت ویدیوی توضیحی خودت جلسه بگذار",
    },
  },

  en: {
    kicker: "Playbooks",
    hero: {
      lead:
        "This prompt doesn't say \"make a beautiful video\". It specifies the colours, the character, the camera, how narration lines up with the picture, the sound and the render, and has Claude Code build a coded animation system. Here it is taken apart step by step, with a small version of it running live on this page.",
      specs: { outcome: "You end up with", level: "You need", cost: "Cost", verified: "Last checked" },
      stats: { fps: "frames per second", res: "resolution", beats: "beats in 30 seconds" },
      note: {
        title: "The right expectation",
        body: "This is a very precise technical brief, not a promise of a flawless video in ten minutes. WebGL, GPU rendering, dependencies, voice generation and bug fixing take a few rounds. That is why the prompt stops twice for your approval.",
      },
      jump: "See the live version first",
    },
    player: {
      kicker: "Live, on this page",
      title: "What if the Sun vanished?",
      lead: "These 30 seconds are drawn the way the prompt says: one canvas and a function that builds each frame from the time alone. So you can jump anywhere, go back or pause, and always get the same picture.",
      caveat: "A simplified version: Earth is a 2D disc rather than a WebGL sphere, and there is no audio or motion blur. The prompt builds the real thing.",
    },
    flow: {
      kicker: "The workflow",
      title: "Three questions, two approvals, one render",
      lead: "Claude asks three questions, shows you the narration and the event timeline, and before the final render a contact sheet of every scene. The two stops are the cheapest places to change your mind.",
      gate: "Stops for approval",
    },
    look: {
      kicker: "1 · The look",
      title: "Give colours as numbers, not adjectives",
      lead: "Instead of \"a beautiful space\", the prompt asks for a gradient from #081d2c to #102348, five nebula blobs at set opacities, and three star layers at depths .12, .35 and .6. That precision is what turns \"an animation\" into a style. Click any colour to copy it.",
      copyHint: "Click to copy the hex",
      copied: "Copied",
      realVsDrawn: "Real and drawn",
      sunBody: "The real Sun in extreme ultraviolet, from NASA's Solar Dynamics Observatory. The drawn one is deliberately simple: a three-colour gradient, four halo rings, nothing on the edge.",
      earthBody: "The real Earth from Apollo 17. In the drawn one each land type is a flat colour, and the light is recomputed from the Sun's position every frame.",
      rules: {
        title: "Two rules the prompt insists on",
        body: "Never draw prominences on the Sun's edge; in practice they read as white hooks. And no AI-generated images or video: everything is drawn in code.",
      },
    },
    type: {
      kicker: "2 · Character and type",
      title: "Text rises through a clip; it never just fades",
      lead: "All on-screen text is Fredoka 600 and 700, uppercase, 3 to 6 px letter spacing, in rounded pills. Each line rises 1.3 times its own height through a clip. See the difference side by side:",
      rise: "Rising through a clip",
      fade: "A plain fade",
      replay: "Replay",
      mascot: {
        title: "The little astronaut",
        body: "About 180 px tall, built from rounded rectangles. White suit, orange boots, a dark visor and cyan eyes that look at whatever matters. It floats, blinks, its antenna light flashes, and it squashes and stretches on every pose.",
      },
      points: [
        "The character must be your own. The prompt explicitly forbids copying other channels' characters.",
        "No full stops in on-screen text.",
        "To finish: a soft vignette and 6% film grain, re-randomised 24 times a second.",
      ],
    },
    story: {
      kicker: "3 · Story and camera",
      title: "A narrative shape that works for any topic",
      lead: "The Sun script is only an example. What to keep is its shape: the event on its word, pull back for scale, dive in to \"you\", pull back out, consequences on a live counter, escalate, a joke, a callback and the title. The line below is the camera's zoom at each step.",
      zoom: "Zoom",
      night: {
        title: "Why the city lights?",
        body: "When the dark reaches Earth, the city lights come on. Scientifically that is poetic, since the lights are always on at night. But it is the moment that makes the dark feel real.",
      },
    },
    voice: {
      kicker: "4 · Narration and picture",
      title: "Every event on a word",
      lead: "The core rule: every sentence comes with a camera move or a change in the picture, and nothing stays still for long. That needs the exact time of each word, and there are two ways to get it.",
      cost: "Cost",
      timing: "Timing",
      demoTitle: "The words, and what each one triggers",
      demoHint: "The gold line is time; words with an event under them fire something on screen.",
      play: "Play",
      rules: [
        "About 165 words a minute.",
        "0.24 s between sentences.",
        "A 0.36 s beat before the big reveal.",
        "If the read runs long, cut the script; never stretch the voice to fit the picture.",
      ],
      fix: {
        title: "A correction to the original post",
        body: "ElevenLabs' timestamp API gives the start and end of every character, not every word, so Claude has to group characters into words itself. The eleven_v4 model and the default stability 0.5 and similarity 0.75 are right.",
      },
    },
    arch: {
      kicker: "5 · Architecture",
      title: "Every frame, a function of time",
      lead: "The whole project is one HTML file and one function: window.seek(t) draws frame t. No timers, no CSS animations, so every frame is reproducible and any second can be rebuilt on its own. The player at the top of this page works exactly this way.",
      code: `// Everything on screen comes from t alone
window.seek = (t) => {
  const st = storyTime(t)      // the story clock, which can run backwards
  const cam = camera(st)       // easeInOutCubic, zoom in log space
  drawSpace(t, cam)            // stars on the ambient clock
  drawSun(st)
  drawEarth(st, t)
  drawCaptions(t)
}`,
      clocks: {
        title: "Two separate clocks",
        lead: "Stars, Earth's spin and the astronaut's bob run on an ambient clock that only goes forward. Story events run on a story clock. When the story rewinds 0.8 s, a single clock would snap the stars back too and the picture would stutter.",
        ambient: "ambient clock",
        story: "story clock",
        rewind: "Rewind",
        bad: "One clock: everything jumps back",
        good: "Two clocks: only the story rewinds",
      },
      spring: {
        title: "A damped spring for every pop",
        lead: "Camera moves glide on easeInOutCubic, but every pop (a counter slamming in, a pin dropping) is a damped spring. The prompt asks for damping .42 to .5 and frequency 12 to 16. Try it:",
        damping: "Damping",
        freq: "Frequency",
        ok: "Inside the prompt's range",
        tooBouncy: "Too bouncy",
        tooFlat: "Lifeless",
        replay: "Replay",
      },
    },
    render: {
      kicker: "6 · Render",
      title: "From HTML to MP4",
      lead: "Playwright opens Edge without a window, draws each frame with seek(t) and screenshots it. For motion blur, two subframes are blended with a 0.6 shutter. ffmpeg puts the frames together as H.264.",
      steps: [
        { name: "seek(t)", does: "900 frames for 30 seconds" },
        { name: "Playwright + Edge", does: "Headless, with the GPU" },
        { name: "Two subframes", does: "Shutter 0.6 for motion blur" },
        { name: "libx264", does: "Master CRF 16, delivery CRF 20" },
        { name: "Mix", does: "-14 LUFS" },
      ],
      gpu: {
        title: "Correction: the GPU isn't on by itself",
        body: "Headless Chrome and Edge disable the GPU by default and render WebGL in software (SwiftShader): slow, and sometimes different-looking. Launch with GPU flags and the right drivers. Have Claude check the WebGL renderer string and say so honestly if it is software.",
      },
      crf: {
        title: "What does CRF mean?",
        body: "x264's quality number: lower is better quality and a bigger file. The default is 23. Use 16 for a master you will edit again, 20 for the file you upload.",
      },
      commands: "The last two commands, as an example",
    },
    sound: {
      kicker: "7 · Music, effects and mix",
      title: "Give the sound as numbers too",
      lead: "A calm, royalty-free space music bed 7 dB under the voice, with its natural ending landing on the final title. One effect per event type, peaking on its own frame, 4 to 10 dB under the voice. Check every audio file's licence before use.",
      under: "relative to the voice",
      loud: {
        title: "Correction: -14 LUFS",
        body: "-14 LUFS is Spotify's stated target. YouTube publishes no number; measurements put it around -14 too, and YouTube only turns loud audio down, never quiet audio up. A -2.2 dB true-peak ceiling is a safe choice.",
      },
      sfx: "The effects, one per event type",
    },
    science: {
      kicker: "The science in the script",
      title: "How true is the sample script?",
      lead: "The prompt is about building, not science. But a science video has to get its numbers right, so each claim in the Sun script was checked against a source:",
      verdicts: { true: "True", approx: "Poetic", estimate: "Estimate" },
      source: "source",
    },
    gotchas: {
      kicker: "What the prompt insists on",
      title: "Where it usually breaks",
      items: [
        { title: "Earth's edge gets clipped", body: "In close-ups the globe canvas must be at least 2 × radius × zoom × 1.18 px, or the edges are cut off." },
        { title: "White hooks on the Sun", body: "Anything on the Sun's edge reads as a white hook on video. Don't draw it at all." },
        { title: "A stretched voice", body: "If the narration runs long, tighten the script. Never stretch the voice to fit the picture." },
        { title: "Darkness that never arrives", body: "The darkness front must speed up near Earth, from about 47 to 700 px/s, so it crosses the planet in 0.7 s." },
        { title: "A rewind that breaks everything", body: "Keep ambient and story time apart so a rewind doesn't wreck the stars and the spin." },
        { title: "Rendering blind", body: "Look at a contact sheet of every beat before the final render. A full render is slow and mistakes surface late." },
      ],
    },
    prompt: {
      kicker: "The full prompt",
      title: "The prompt, ready to copy",
      lead: "It is in English, because Claude follows this level of precision best there and the colours and numbers must stay untouched. A few things are fixed against the version that circulated (listed at the end). Paste it into Claude Code; it starts with three questions.",
      why: {
        title: "Why so detailed?",
        body: "Because \"make a beautiful video\" lets Claude make every decision itself. When colour, timing, motion curves and levels have numbers, the result is repeatable and you can say exactly what to change.",
      },
    },
    checklist: {
      kicker: "Checklist",
      title: "Your first run",
      lead: "Ticks stay in this browser.",
      items: [
        "Node, Python, ffmpeg and Microsoft Edge are installed",
        "Playwright is installed and opens Edge (npx playwright install msedge)",
        "WebGL renderer string checked: GPU or software?",
        "Voice path chosen: an ElevenLabs key or local kokoro-onnx",
        "Topic phrased as \"What if…?\", length decided",
        "Narration and event timeline approved",
        "The script's science checked against sources",
        "Contact sheet of every beat seen and approved",
        "Music and effect licences checked",
        "Master at CRF 16 and delivery at CRF 20 rendered",
        "Loudness near -14 LUFS, true peak under -2 dB",
        "Watched on a phone",
      ],
      done: (n, of) => `${n} of ${of} done`,
      reset: "Clear ticks",
    },
    method: {
      kicker: "Method",
      title: "Checks, corrections and sources",
      changelogTitle: "Changelog",
      corrections: [
        "In the version that circulated, window.seek(t) had been turned into a link (\"http://window.seek(t)\"). It is a JavaScript function.",
        "ElevenLabs timings are per character, not per word; the prompt now says so.",
        "Headless Chrome and Edge start with the GPU off; the prompt now asks for the renderer to be checked and reported.",
        "-14 LUFS is Spotify's stated target; for YouTube it is a measured figure, not a published one.",
        "The drop from 15 to -70°C is an estimate over about a year, not seconds; the prompt now asks for it to be labelled on screen.",
        "The original said \"no music\" and also asked for a music bed. The version here forbids music with vocals.",
      ],
      sourcesTitle: "Sources, read on 26 October 2026",
      photos: "All photographs are NASA's and in the public domain.",
    },
    colophon: {
      shareTitle: "Animated science videos with Claude Code: a playbook by Farjad",
      disclaimer: "This playbook takes inspiration from explainer channels and copies none of their characters or assets. Kurzgesagt is the channel of kurzgesagt GmbH in Munich; this page is not affiliated with it.",
      cta: "Book a session to build your own explainer",
    },
  },
}
