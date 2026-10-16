// ============================================================================
// File Path: src/components/v3/playbooks/content-team/copy.ts
// Why: Every sentence of playbook 01 in both locales, one structure for both.
//      The Persian is Farjad's own guide, set for the site; the English says
//      the same thing, with the Persian-specific advice framed for anyone
//      writing in a language other than English.
//
//      Where the fact-check of 2026-10-15 corrected the guide (star counts,
//      the HyperFrames tagline, Postiz self-hosting needing Temporal, the
//      Remotion licence, frontend-slides exporting landscape PDFs), the
//      correction is built into the text.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { StageId } from "./data"

type Row = string[]
type Callout = { title: string; body: string }

type Copy = {
  kicker: string
  hero: {
    lead: string
    specs: { outcome: string; level: string; cost: string; verified: string; tools: string; stages: string }
    note: Callout
    jump: string
  }
  map: { kicker: string; title: string; lead: string; gate: string; hint: string; stages: Record<StageId, { name: string; does: string }> }
  builder: {
    kicker: string
    title: string
    lead: string
    makeLabel: string
    langLabel: string
    langs: { fa: string; en: string; both: string }
    always: string
    toolsTitle: string
    keysTitle: string
    noKeys: string
    softwareTitle: string
    approvals: (n: number) => string
    promptTitle: string
    copy: string
    copied: string
    imageKey: string
    styleNote: string
    prompt: {
      intro: string
      chosen: string
      prereq: string
      security: string
      keys: string
      restart: string
      style: (humanizer: boolean) => string
      trial: string
      trialSteps: Partial<Record<StageId, string>>
      rule: string
    }
  }
  prereq: { kicker: string; title: string; lead: string; head: Row; security: { title: string; lead: string; rules: string[] } }
  step: string
  stepTitles: Record<StageId, string>
  steps: {
    topic: { lead: string; example: string; exampleLabel: string; sourcesTitle: string; head: Row; rows: Row[]; install: string; note: Callout }
    write: {
      lead: string
      ms: { body: string; head: Row; rows: Row[]; install: string }
      hz: { body: string }
      note: Callout
    }
    image: {
      lead: string
      baoyu: { body: string; head: Row; rows: Row[]; engine: string; install: string }
      slides: { body: string; fix: Callout; install: string }
    }
    video: {
      lead: string
      hf: { body: string; install: string; lessonsTitle: string; lessons: Callout[] }
      vu: { body: string; does: string[]; setup: string; install: string }
      remotion: { title: string; body: string }
    }
    voice: { lead: string; head: Row; rows: Row[]; install: string; notes: Callout[] }
    publish: { lead: string; head: Row; rows: Row[]; fix: Callout; human: Callout; install: string }
  }
  installLabel: string
  stars: (k: string) => string
  compare: {
    kicker: string
    title: string
    lead: string
    head: Row
    filters: { all: string; free: string; key: string; paid: string }
    flagsNote: string
    costLabels: { free: string; key: string; paid: string }
  }
  setup: { kicker: string; title: string; lead: string; text: string; why: Callout }
  moves: {
    kicker: string
    title: string
    lead: string
    which: { title: string; head: Row; rows: Row[] }
    groups: { camera: string; time: string; transition: string }
    play: string
    samplesTitle: string
    samples: string
    rule: string
  }
  pitfalls: { kicker: string; items: Callout[] }
  checklist: { kicker: string; title: string; lead: string; items: string[]; done: (n: number, of: number) => string; reset: string }
  method: { kicker: string; title: string; changelogTitle: string; corrections: string[]; sourcesTitle: string; verified: string }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
}

export const COPY: Record<Locale, Copy> = {
  fa: {
    kicker: "پلی‌بوک‌ها",
    hero: {
      lead:
        "این راهنما نشان می‌دهد چطور ۹ مجموعه اسکیل متن‌باز را به یک خط تولید تبدیل کنی که در هر مرحله، تأیید نهایی دست خودت بماند. همه‌ی اعداد و دستورهای نصب از صفحه‌ی گیت‌هاب هر پروژه بررسی شده‌اند، نه از روی شنیده‌ها.",
      specs: {
        outcome: "آخرش دستت است",
        level: "پیش‌نیاز",
        cost: "هزینه",
        verified: "آخرین بررسی",
        tools: "مجموعه اسکیل",
        stages: "مرحله",
      },
      note: {
        title: "یک نکته‌ی مهم قبل از شروع",
        body:
          "این «تیم» در واقع یک جلسه‌ی Claude Code روی لپ‌تاپ توست. اسکیل یعنی دستورالعملی که Claude می‌خواند، نه سرویسی که خودش کار کند. برای هفته‌ای دو تا سه محتوای باکیفیت عالی است؛ برای تولید روزانه بدون حضور خودت، ساختار دیگری لازم است که در بخش اشتباه‌های رایج به آن برمی‌گردیم.",
      },
      jump: "اول ابزارهای لازمت را پیدا کن",
    },
    map: {
      kicker: "تصویر کلی",
      title: "خط تولید در یک نگاه",
      lead:
        "شش مرحله پشت سر هم اجرا می‌شوند و بعد از هر کدام، Claude می‌ایستد تا تو تأیید کنی. به جز مرحله‌ی انتشار، هر مرحله را می‌توانی حذف کنی؛ کسی که ویدیو نمی‌سازد به مرحله‌های ۴ و ۵ نیاز ندارد.",
      gate: "تأیید تو",
      hint: "روی هر مرحله بزن تا به توضیحش بروی.",
      stages: {
        topic: { name: "موضوع", does: "چه چیزی داغ است" },
        write: { name: "نوشتن", does: "پیش‌نویس و ویرایش" },
        image: { name: "تصویر", does: "کاور، کاروسل، نمودار" },
        video: { name: "ویدیو", does: "از کد یا از فیلم خودت" },
        voice: { name: "صدا", does: "گویندگی، موسیقی، دوبله" },
        publish: { name: "انتشار", does: "پیش‌نویس در صف" },
      },
    },
    builder: {
      kicker: "خط تولید خودت",
      title: "همه را نصب نکن. فقط آن‌هایی که لازم داری.",
      lead:
        "بگو چه می‌سازی. این‌جا فقط ابزارهای لازمت، کلیدهایی که باید بگیری و پرامپت راه‌اندازی مخصوص خودت را می‌بینی. پیدا کردن موضوع همیشه روشن است؛ موضوع بد با بهترین تدوین هم نجات پیدا نمی‌کند.",
      makeLabel: "چه می‌سازی؟",
      langLabel: "به چه زبانی؟",
      langs: { fa: "فارسی", en: "انگلیسی", both: "هر دو" },
      always: "همیشه",
      toolsTitle: "ابزارهای تو",
      keysTitle: "کلیدها و لاگین‌ها",
      noKeys: "هیچ کلیدی لازم نیست.",
      softwareTitle: "نرم‌افزار لازم روی سیستم",
      approvals: (n) => `${n.toLocaleString("fa-IR")} نقطه‌ی تأیید`,
      promptTitle: "پرامپت راه‌اندازی تو",
      copy: "کپی پرامپت",
      copied: "کپی شد",
      imageKey: "کلید یک سرویس تصویر (OpenAI، Google و…)",
      styleNote: "برای فارسی، humanizer را نصب نمی‌کنیم؛ فایل سبک شخصی خودت کار بیشتری می‌کند.",
      prompt: {
        intro:
          "با استفاده از پلی‌بوک «تیم تولید محتوا در Claude Code»، یک خط تولید محتوا برای من راه‌اندازی کن. قانون کلی: هیچ چیزی بدون تأیید من نصب، زمان‌بندی یا منتشر نمی‌شود.",
        chosen: "## ۱. ابزارهایی که انتخاب کرده‌ام\nفقط همین‌ها را نصب کن، دقیقاً طبق README هر پروژه. دستورهای /plugin را فقط من می‌توانم بزنم؛ آن‌ها را آماده به من بده.",
        prereq: "## ۲. پیش‌نیازها\nچک کن این‌ها نصب هستند و اگر چیزی کم است، قبل از ادامه دستور نصبش را به من بده:",
        security:
          "## ۳. بررسی امنیتی قبل از نصب\nبرای هر ابزار، README و فایل‌های SKILL.md را بخوان و در دو خط بگو: چه دستورهایی اجرا می‌کند، به کدام سرویس بیرونی وصل می‌شود، و اگر چیز نگران‌کننده‌ای دیدی. بعد منتظر تأیید من بمان.",
        keys:
          "## ۴. کلیدها\nبرای هر کلید بگو از کجا بگیرم و در کدام متغیر محیطی بگذارم. مقدار را خودم وارد می‌کنم. تو فقط چک کن تنظیم شده یا نه؛ هرگز مقدارش را چاپ نکن و در هیچ فایلی که در گیت است ننویس.",
        restart: "## ۵. راه‌اندازی دوباره\nوقتی همه نصب شد، یادآوری کن Claude Code را ببندم و با claude --continue برگردم، بعد با /mcp اتصال‌ها را چک کنم.",
        style: (h) =>
          `## ۶. فایل سبک من\nقبل از اولین اجرا یک فایل STYLE.md بساز و از من بپرس: لحن، واژه‌های ممنوع، واژه‌های ترجیحی، امضا و خط کپی‌رایت. سه نمونه از نوشته‌های قبلی‌ام را هم بگیر. هر متن نهایی باید با این فایل چک شود${h ? " و برای متن انگلیسی، humanizer هم اجرا شود" : ""}.`,
        trial: "## ۷. اجرای آزمایشی، یک موضوع از اول تا آخر",
        trialSteps: {
          topic: "با last30days بحث‌های ۳۰ روز اخیر را درباره‌ی موضوعی که می‌دهم بررسی کن و سه زاویه با دلیل و منبع بده. من یکی را انتخاب می‌کنم.",
          write: "متن را بنویس و ویرایش کن، و با STYLE.md نهایی کن. هر ادعای عددی یا تاریخی باید منبع داشته باشد؛ بدون منبع حذفش کن.",
          image: "کاور و کاروسل را از همان متن نهایی بساز تا همه یک حرف بزنند.",
          video: "اگر ویدیو خواستم، یک نسخه‌ی عمودی ۳۰ تا ۴۵ ثانیه‌ای بساز و قبل از رندر hyperframes check را اجرا کن.",
          voice: "متن گویندگی را از همان متن نهایی بنویس و قبل از ساخت صدا، به من نشان بده.",
          publish: "همه را به صورت پیش‌نویس در Postiz ذخیره کن. زمان‌بندی نکن، منتشر نکن.",
        },
        rule: "## ۸. قانون تأیید\nبعد از هر مرحله نتیجه را نشان بده و منتظر تأیید من بمان. برای زمان‌بندی یا انتشار هر محتوایی، جداگانه اجازه بگیر.",
      },
    },
    prereq: {
      kicker: "پیش از نصب",
      title: "پیش‌نیازها، و یک هشدار",
      lead: "قبل از نصب هیچ اسکیلی، این‌ها باید روی سیستم باشد. بدون آن‌ها نیمی از ابزارها بی‌صدا شکست می‌خورند.",
      head: ["پیش‌نیاز", "برای کدام ابزار", "چطور چک کنی"],
      security: {
        title: "هشدار امنیتی",
        lead:
          "Claude Code به ترمینال و فایل‌های تو دسترسی دارد. وقتی ۹ مجموعه اسکیل از ۹ نویسنده‌ی مختلف نصب می‌کنی، یعنی به ۹ غریبه اجازه داده‌ای به Claude بگویند چه کند. سه قاعده‌ی ساده:",
        rules: [
          "پیش از نصب، فایل SKILL.md هر اسکیل را خودت بخوان، نه فقط README را.",
          "فقط اسکیل‌هایی را نصب کن که در دو هفته‌ی آینده استفاده می‌کنی. هر اسکیل اضافه، Context هر اجرا را پر می‌کند و دقت مدل را پایین می‌آورد.",
          "کلیدهای API را فقط در متغیر محیطی یا فایل ‎.env بگذار و آن فایل را هرگز commit نکن. از Claude بخواه فقط چک کند کلید تنظیم شده یا نه، نه این‌که مقدارش را نشان دهد.",
        ],
      },
    },
    step: "مرحله",
    stepTitles: {
      topic: "پیدا کردن موضوع داغ",
      write: "نوشتن",
      image: "تصویر",
      video: "ویدیو",
      voice: "صدا، موسیقی و دوبله",
      publish: "زمان‌بندی و انتشار",
    },
    steps: {
      topic: {
        lead:
          "last30days بحث‌های ۳۰ روز اخیر درباره‌ی یک موضوع را از چند شبکه جمع می‌کند، بر اساس تعامل واقعی رتبه می‌دهد و یک گزارش خلاصه تحویل می‌دهد. اولین قدم همین است، چون موضوع بد با بهترین تدوین هم نجات پیدا نمی‌کند.",
        exampleLabel: "نمونه‌ی درخواست",
        example: "چه موضوعاتی درباره‌ی AI Agents در ۳۰ روز اخیر داغ شده‌اند؟ ۵ تا ۱۰ زاویه با روند صعودی بده.",
        sourcesTitle: "منابع، و این‌که کدام کلید می‌خواهد",
        head: ["منبع", "بدون تنظیم؟", "چه لازم دارد"],
        rows: [
          ["Reddit (با کامنت‌ها)، Hacker News، GitHub، Polymarket", "بله", "هیچ"],
          ["arXiv، Techmeme", "بله", "ابزار خط فرمانش در اولین اجرا خودکار نصب می‌شود"],
          ["X / Twitter", "نه", "لاگین در مرورگر، یا XQUIK_API_KEY، XAI_API_KEY یا X_BEARER_TOKEN"],
          ["YouTube", "نه", "yt-dlp"],
          ["TikTok، Instagram، Threads، LinkedIn، Pinterest", "نه", "کلید ScrapeCreators (۱۰ هزار فراخوان رایگان، بعد پرداخت به ازای مصرف)"],
          ["Bluesky", "نه", "App password"],
          ["جست‌وجوی وب", "نه", "کلید Brave Search"],
          ["Perplexity", "نه", "کلید Perplexity یا OpenRouter"],
        ],
        install: "دو دستور، هر کدام در یک پیام جدا:",
        note: {
          title: "نکته برای محتوای فارسی",
          body:
            "منابع رایگان این ابزار (Reddit و HN) انگلیسی‌زبان‌اند. بحث‌های مخاطب فارسی‌زبان بیشتر در اینستاگرام، تلگرام و X فارسی است. برای این مخاطب، last30days را برای پیدا کردن روند جهانی به کار ببر و زاویه‌ی محلی را خودت اضافه کن.",
        },
      },
      write: {
        lead: "دو اسکیل این مرحله را در دو زمان متفاوت اجرا می‌کنی: اولی برای نوشتن پیش‌نویس، دومی در آخرین مرحله برای طبیعی کردن متن.",
        ms: {
          body: "marketingskills ۵۰ اسکیل بازاریابی دارد. برای تولید محتوا همین چهار مورد کافی است:",
          head: ["اسکیل", "نام دقیق در مخزن", "کاربرد"],
          rows: [
            ["کپی‌رایتینگ", "copywriting", "متن متقاعدکننده، قلاب و CTA"],
            ["ویرایش", "copy-editing", "کوتاه کردن، رفع ابهام، یکدست کردن لحن"],
            ["شبکه‌های اجتماعی", "social", "پست متناسب با هر پلتفرم"],
            ["استراتژی محتوا", "content-strategy", "برنامه‌ی موضوعی و مسیر تولید"],
          ],
          install: "دستور رسمی همه‌ی ۵۰ اسکیل را نصب می‌کند. اگر فقط چهار مورد بالا را می‌خواهی، از Claude بخواه بقیه را از پوشه‌ی اسکیل‌ها حذف کند.",
        },
        hz: {
          body:
            "humanizer بر پایه‌ی راهنمای «نشانه‌های نوشتار هوش مصنوعی» ویکی‌پدیا ساخته شده و ۲۶ الگو در ۶ دسته را بررسی می‌کند. اگر ۲ یا ۳ پاراگراف از نوشته‌های خودت را به آن بدهی، ریتم و واژگان تو را دنبال می‌کند.",
        },
        note: {
          title: "نکته‌ی مهم برای فارسی",
          body:
            "هر ۲۶ الگوی humanizer برای انگلیسی نوشته شده‌اند، مثل استفاده‌ی زیاد از خط تیره‌ی بلند یا سه‌تایی کردن صفت‌ها. نشانه‌های ماشینی خاص فارسی (نیم‌فاصله‌ی غلط، «می‌باشد»، جمله‌های ترجمه‌ای) در آن نیست. برای فارسی یک فایل سبک کوتاه بساز (واژه‌های ممنوع، واژه‌های ترجیحی، لحن) و از Claude بخواه در مرحله‌ی آخر متن را با آن چک کند. این ده خط برای فارسی بیشتر از humanizer کار می‌کند.",
        },
      },
      image: {
        lead:
          "تصویر دو نوع است و هر کدام ابزار خودش را می‌خواهد: تصویری که مدل هوش مصنوعی می‌سازد (کاور، اینفوگرافیک) و تصویری که Claude با کد می‌کشد (نمودار، اسلاید). دومی رایگان است و کلید نمی‌خواهد.",
        baoyu: {
          body: "baoyu-skills مجموعه‌ای از اسکیل‌های محتوای بصری است. سه مورد به کار تولید محتوا می‌آید:",
          head: ["اسکیل", "خروجی", "مدل تصویر لازم دارد؟"],
          rows: [
            ["baoyu-cover-image", "کاور مقاله و پست", "بله"],
            ["baoyu-infographic", "اینفوگرافیک", "بله"],
            ["baoyu-diagram", "نمودار و دیاگرام (SVG)", "نه؛ Claude خودش کد SVG می‌نویسد"],
          ],
          engine:
            "موتور تصویرسازی این مجموعه baoyu-image-gen است و از چند سرویس پشتیبانی می‌کند: OpenAI، Azure OpenAI، Google، OpenRouter، Replicate و چند سرویس چینی. برای هر کدام کلید همان سرویس را در متغیر محیطی بگذار. اگر کلید OpenAI داری، ساده‌ترین راه همان است. خود نویسنده توصیه می‌کند فقط اسکیل‌های لازم را نصب کنی.",
          install: "یا از راه پلاگین: /plugin marketplace add JimLiu/baoyu-skills",
        },
        slides: {
          body:
            "frontend-slides اسلاید را به شکل یک فایل HTML می‌سازد (CSS و JS داخل همان فایل، بدون وابستگی) و می‌تواند یک فایل PowerPoint موجود را هم تبدیل کند. خروجی PDF یک اسکریپت جداگانه است که با Playwright از هر اسلاید عکس می‌گیرد.",
          fix: {
            title: "اصلاح نسبت به پست اصلی",
            body:
              "README این پروژه چیزی درباره‌ی کاروسل LinkedIn نمی‌گوید؛ این تجربه‌ی نویسنده‌ی پست است. کار هم می‌کند، چون LinkedIn پست سندی را با PDF چندصفحه‌ای می‌پذیرد. ولی خروجی PDF این ابزار افقی و ۱۹۲۰×۱۰۸۰ است. برای اینستاگرام از Claude بخواه اندازه‌ی اسلاید را ۱۰۸۰×۱۳۵۰ (نسبت ۴ به ۵) بگذارد و از هر صفحه جدا عکس بگیرد.",
          },
          install: "دو پیام جدا، با آدرس کامل HTTPS، نه فرم کوتاه:",
        },
      },
      video: {
        lead:
          "دو مسیر کاملاً متفاوت وجود دارد. HyperFrames ویدیو را از صفر با کد می‌سازد (متن متحرک، نمودار، معرفی محصول). video-use فیلمی را که خودت جلوی دوربین گرفته‌ای تدوین می‌کند. بیشتر تولیدکننده‌ها فقط یکی را لازم دارند.",
        hf: {
          body:
            "HyperFrames، ساخته‌ی HeyGen، HTML و CSS و انیمیشن را به فایل MP4 تبدیل می‌کند. شعارش این است: «HTML بنویس. ویدیو رندر کن. ساخته‌شده برای ایجنت‌ها.» هر صحنه یک بلوک HTML با زمان شروع و مدت است و انیمیشن‌ها با GSAP نوشته می‌شوند. رندر محلی هزینه ندارد و سقف استفاده‌ی تجاری هم ندارد.",
          install: "این دستور مجموعه‌ی اصلی اسکیل‌ها را نصب می‌کند، نه همه‌ی ۲۱ اسکیل را:",
          lessonsTitle: "سه درس از تجربه‌ی عملی که در هیچ README نیست",
          lessons: [
            {
              title: "برای فارسی، هرگز dir=\"rtl\" را روی تگ html نگذار.",
              body: "خروجی یک ویدیوی سیاه می‌شود، بدون هیچ خطایی. به جای آن direction: rtl را روی کانتینر اصلی بگذار.",
            },
            {
              title: "قبل از رندر، hyperframes check را اجرا کن.",
              body: "اشتباه‌هایی را می‌گیرد که در مرورگر دیده نمی‌شوند ولی در ویدیو لرزش می‌دهند، مثل انیمیشن روی left به جای transform.",
            },
            {
              title: "فونت و کتابخانه را کنار پروژه بگذار، نه از CDN.",
              body: "رندر باید بدون اینترنت هم دقیقاً همان خروجی را بدهد.",
            },
          ],
        },
        vu: {
          body: "video-use برای کسی است که خودش فیلم می‌گیرد. فیلم‌های خام را در یک پوشه می‌گذاری، با Claude Code حرف می‌زنی و یک final.mp4 تحویل می‌گیری. کارهایی که می‌کند:",
          does: [
            "حذف مکث‌ها، تپق‌ها و فضای خالی بین برداشت‌ها",
            "اصلاح رنگ هر بخش (پریست یا زنجیره‌ی ffmpeg دلخواه)",
            "زیرنویس سوخته روی تصویر (پیش‌فرض دو کلمه با حروف بزرگ، قابل تغییر)",
            "بازبینی خودکار هر برش بعد از رندر، و رفع مشکل قبل از نشان دادن پیش‌نمایش",
          ],
          setup:
            "برای تبدیل گفتار به متن از ElevenLabs Scribe استفاده می‌کند، پس ELEVENLABS_API_KEY لازم دارد. ffmpeg الزامی است و yt-dlp اختیاری.",
          install: "نصب دستی است: مخزن را clone کن و یک symlink در پوشه‌ی اسکیل‌های Claude بساز. بقیه‌ی وابستگی‌ها در README آمده.",
        },
        remotion: {
          title: "اگر با React راحت‌تری: Remotion",
          body:
            "اسکیل‌های رسمی Remotion را با npx skills add remotion-dev/skills نصب کن. مجوز Remotion برای افراد، سازمان‌های غیرانتفاعی و شرکت‌های تا ۳ کارمند رایگان است؛ بالاتر از آن مجوز شرکتی لازم است. پست اصلی این شرط را طوری نوشته بود که به HyperFrames هم خوانده می‌شد؛ HyperFrames چنین محدودیتی ندارد.",
        },
      },
      voice: {
        lead:
          "اسکیل‌های رسمی ElevenLabs تازه‌اند و ستاره‌ی کمی دارند، ولی چون خود شرکت نگهشان می‌دارد، با API هماهنگ می‌مانند. ۱۰ اسکیل دارد؛ این‌ها به کار محتوا می‌آیند:",
        head: ["اسکیل", "کار"],
        rows: [
          ["text-to-speech", "گویندگی متن"],
          ["music", "ساخت موسیقی"],
          ["sound-effects", "افکت صوتی"],
          ["dubbing", "دوبله‌ی ویدیو به زبان دیگر با حفظ صدای گوینده"],
          ["voice-isolator", "حذف نویز پس‌زمینه"],
          ["speech-to-text، voice-changer، agents و…", "سایر"],
        ],
        install: "همان ELEVENLABS_API_KEY که برای video-use گذاشتی این‌جا هم کار می‌کند. سهمیه‌ی رایگان محدود است و بعد از آن هر دقیقه هزینه دارد.",
        notes: [
          {
            title: "کیفیت فارسی را خودت بسنج",
            body: "README این مخزن چیزی درباره‌ی کیفیت فارسی نمی‌گوید. قبل از هر تصمیم، یک تست ۳۰ ثانیه‌ای با متن خودت بگیر و به تلفظ نیم‌فاصله‌ها و کسره‌ی اضافه گوش بده.",
          },
          {
            title: "موسیقی ریلز لزوماً مدل نمی‌خواهد",
            body: "یک قطعه‌ی ساده‌ی پیانو را می‌شود با چند خط Python (numpy) ساخت، بدون مسئله‌ی کپی‌رایت و بدون هزینه. برای اینستاگرام حتی بهتر است ویدیو را بی‌صدا بسازی و موسیقی ترند را داخل خود اپ اضافه کنی؛ الگوریتم ریلز به آن وزن می‌دهد.",
          },
        ],
      },
      publish: {
        lead:
          "Postiz ابزار زمان‌بندی و انتشار متن‌باز است و سرور MCP دارد، یعنی Claude Code می‌تواند مستقیم در آن پیش‌نویس بسازد. شبکه‌ها: Instagram، YouTube، LinkedIn، TikTok، X، Facebook، Threads، Reddit، Pinterest، Bluesky، Mastodon، Dribbble، Slack و Discord.",
        head: ["", "Postiz Cloud (ابری)", "Self-hosted (سرور خودت)"],
        rows: [
          ["راه‌اندازی", "چند دقیقه؛ یک دستور و لاگین", "Docker با Postgres و Redis و Temporal"],
          ["اپلیکیشن توسعه‌دهنده‌ی هر شبکه", "از قبل تأیید شده", "باید خودت بسازی؛ تأیید Meta، YouTube و TikTok ممکن است هفته‌ها طول بکشد"],
          ["هزینه", "۷ روز آزمایشی، بعد از ۲۹ دلار در ماه", "نرم‌افزار رایگان، هزینه‌ی سرور با خودت"],
          ["کنترل داده", "روی سرور Postiz", "کامل"],
        ],
        fix: {
          title: "اصلاح نسبت به پست اصلی",
          body: "نسخه‌ی ابری «شروع رایگان دائمی» ندارد؛ فقط یک دوره‌ی آزمایشی ۷ روزه دارد. نسخه‌ی خودمیزبان هم علاوه بر Postgres و Redis، به Temporal نیاز دارد.",
        },
        human: {
          title: "توصیه‌ی خود سازندگان را جدی بگیر",
          body: "نظارت انسانی در همه‌ی مراحل انتشار. در عمل یعنی Claude فقط پیش‌نویس می‌سازد و دکمه‌ی زمان‌بندی یا انتشار را خودت می‌زنی. یک پست اشتباه روی حساب اصلی، از هر اتوماسیونی گران‌تر تمام می‌شود.",
        },
        install: "نسخه‌ی ابری، با لاگین OAuth و بدون کلید API:",
      },
    },
    installLabel: "نصب در Claude Code",
    stars: (k) => `${k} هزار ستاره`,
    compare: {
      kicker: "مقایسه",
      title: "۹ ابزار کنار هم",
      lead: "ستاره‌ها در ۲۴ مهر ۱۴۰۵ (۱۵ اکتبر ۲۰۲۶) از گیت‌هاب خوانده شده‌اند. ستاره هر روز عوض می‌شود و معیار کیفیت هم نیست.",
      head: ["ابزار", "مرحله", "نقش", "ستاره (هزار)", "مجوز", "کلید یا هزینه"],
      filters: { all: "همه", free: "رایگان", key: "رایگان، با کلید اختیاری", paid: "هزینه دارد" },
      flagsNote: "دستور npx skills add را با ‎-g -a claude-code بزن تا اسکیل در مسیر سراسری Claude Code نصب شود، نه در پوشه‌ای که Claude آن را نمی‌خواند.",
      costLabels: { free: "رایگان", key: "کلید اختیاری", paid: "پولی" },
    },
    setup: {
      kicker: "پرامپت کامل",
      title: "پرامپت راه‌اندازی، برای همه‌ی ۹ ابزار",
      lead:
        "اگر سازنده‌ی بالا را نزدی، این نسخه‌ی کامل است. همراه لینک همین صفحه به Claude Code بده (مدل Opus یا قوی‌تر). نسبت به پست اصلی سه چیز اصلاح شده: دستورهای نصب با README هر پروژه تطبیق داده شده، یک مرحله‌ی بررسی امنیتی اضافه شده، و برای محتوای فارسی فایل سبک شخصی جای humanizer را گرفته.",
      text: `با استفاده از پلی‌بوک «تیم تولید محتوا در Claude Code»، یک خط تولید محتوا برای من راه‌اندازی کن. قانون کلی: هیچ چیزی بدون تأیید من نصب، زمان‌بندی یا منتشر نمی‌شود.

## ۱. نیازسنجی
اول از من بپرس:
- در کدام پلتفرم‌ها منتشر می‌کنم و به چه زبانی؟
- آیا ویدیو می‌سازم؟ از فیلم خودم یا از صفر با کد؟
- آیا گویندگی یا دوبله لازم دارم؟
فقط ابزارهایی را پیشنهاد کن که با جواب من می‌خواند، و فهرست نهایی را قبل از نصب به من نشان بده.

## ۲. پیش‌نیازها
چک کن Node.js 18+، Python 3 و ffmpeg نصب هستند. اگر چیزی کم است، قبل از ادامه به من بگو و دستور نصبش را بده.

## ۳. بررسی امنیتی قبل از نصب
برای هر ابزار، README و فایل‌های SKILL.md را بخوان و در دو خط به من بگو: چه دستورهایی اجرا می‌کند، به کدام سرویس بیرونی وصل می‌شود، و اگر چیز نگران‌کننده‌ای دیدی. بعد منتظر تأیید من بمان.

## ۴. نصب (دقیقاً طبق README هر پروژه)
- last30days: با /plugin marketplace add و /plugin install. چون دستورهای /plugin را فقط من می‌توانم بزنم، آن‌ها را آماده به من بده.
- humanizer و frontend-slides: همین‌طور، با /plugin.
- marketingskills و baoyu-skills: با npx skills add و گزینه‌های -g -a claude-code؛ بعد از نصب، اسکیل‌هایی را که در مرحله‌ی ۱ انتخاب نکردیم حذف کن.
- HyperFrames: npx hyperframes skills update (فقط مجموعه‌ی اصلی).
- video-use: clone و symlink به ~/.claude/skills/video-use طبق README.
- ElevenLabs: npx skills add elevenlabs/skills -g -a claude-code.
- Postiz: claude mcp add --transport http postiz https://mcp.postiz.com/mcp-oauth-dynamic؛ لاگین را خودم انجام می‌دهم.

## ۵. کلیدها
برای هر کلید لازم (ELEVENLABS_API_KEY، کلید سرویس تصویر و…) بگو از کجا بگیرم و در کدام متغیر محیطی بگذارم. مقدار را خودم وارد می‌کنم. تو فقط چک کن کلید تنظیم شده یا نه؛ هرگز مقدارش را چاپ نکن و در هیچ فایلی که در گیت است ننویس.

## ۶. راه‌اندازی دوباره
وقتی همه نصب شد، یادآوری کن Claude Code را ببندم و با claude --continue برگردم، بعد با /mcp اتصال Postiz را چک کنم.

## ۷. فایل سبک من
قبل از اولین اجرا، یک فایل STYLE.md بساز و از من بپرس: لحن، واژه‌های ممنوع، واژه‌های ترجیحی، امضا و خط کپی‌رایت. سه نمونه از نوشته‌های قبلی‌ام را هم بگیر. هر متن نهایی باید با این فایل چک شود (برای متن انگلیسی، humanizer هم اجرا شود).

## ۸. اجرای آزمایشی، یک موضوع از اول تا آخر
1. با last30days بحث‌های ۳۰ روز اخیر را درباره‌ی موضوعی که می‌دهم بررسی کن و سه زاویه با دلیل و منبع بده. من یکی را انتخاب می‌کنم.
2. متن را با copywriting و social بنویس، با copy-editing ویرایش کن، با STYLE.md (و humanizer برای انگلیسی) نهایی کن. هر ادعای عددی یا تاریخی باید منبع داشته باشد؛ بدون منبع حذفش کن.
3. کاور، کاروسل، سناریوی ویدیو و متن گویندگی را از همان متن نهایی بساز تا همه یک حرف بزنند.
4. اگر ویدیو خواستم، یک نسخه‌ی عمودی ۳۰ تا ۴۵ ثانیه‌ای بساز و قبل از رندر حتماً hyperframes check را اجرا کن.
5. همه را به صورت پیش‌نویس در Postiz ذخیره کن. زمان‌بندی نکن، منتشر نکن.

## ۹. قانون تأیید
بعد از هر مرحله نتیجه را نشان بده و منتظر تأیید من بمان. برای زمان‌بندی یا انتشار هر محتوایی، جداگانه اجازه بگیر.`,
      why: {
        title: "چرا فایل سبک؟",
        body: "در عمل بیشتر اشتباه‌های محتوای ماشینی از ابزار نیست، از نبودن یک مرجع سبک است. یک فایل ده‌خطی که می‌گوید «این واژه هرگز، این واژه همیشه، این امضا در انتها» جلوی تکرار همان اصلاح‌ها را در هر اجرا می‌گیرد.",
      },
    },
    moves: {
      kicker: "۲۴ حرکت دوربین",
      title: "در پرامپت، نام حرکت را ببر",
      lead:
        "ویدیوی ماشینی وقتی شبیه اسلایدشو می‌شود که دوربین ثابت است و فقط متن عوض می‌شود. راه حل ساده است: حرکت دوربین را با نام سینمایی‌اش بخواه و زمان و سرعتش را هم بگو. به جای «دوربین به سوژه نزدیک شود» بنویس: «دالی به داخل، ۳ ثانیه، آهسته، به سمت چهره.»",
      which: {
        title: "برای کدام ابزار کار می‌کند؟",
        head: ["نوع ابزار", "مثال", "نام حرکت در پرامپت چه می‌کند"],
        rows: [
          ["مدل تولید ویدیو (متن به فیلم)", "Higgsfield، Veo، Kling، Sora", "مستقیم اجرا می‌شود؛ این مدل‌ها روی فیلم واقعی آموزش دیده‌اند و واژگان سینما را می‌فهمند"],
          ["ویدیو از کد", "HyperFrames، Remotion", "مستقیم نه، ولی Claude هر حرکت را با انیمیشن GSAP می‌سازد: دالی یعنی بزرگ‌نمایی آرام، پن یعنی حرکت افقی، رک فوکوس یعنی جابه‌جایی blur بین دو لایه"],
          ["تدوین فیلم خام", "video-use", "فقط برش‌ها (جامپ کات، J-cut، L-cut) معنی دارند؛ حرکت دوربین را باید موقع فیلم‌برداری گرفته باشی"],
        ],
      },
      groups: { camera: "حرکت دوربین", time: "نحوه‌ی فیلم‌برداری و جریان زمان", transition: "انتقال از یک نما به نمای بعد" },
      play: "هر کارت حرکت خودش را نشان می‌دهد.",
      samplesTitle: "سه نمونه پرامپت",
      samples: `نمای ۱: میز کار خالی، نور صبح. دالی به داخل، ۴ ثانیه، خیلی آهسته، به سمت لپ‌تاپ. در ثانیه‌ی ۳ رک فوکوس از فنجان قهوه به صفحه‌ی لپ‌تاپ.

نمای ۲: از نمای ۱ با match cut روی شکل دایره (فنجان به ساعت دیواری). تایم‌لپس ۲ ثانیه‌ای از صبح تا شب.

نمای ۳: J-cut؛ صدای شهر یک ثانیه قبل از تصویر شروع شود. بعد نمای پهپادی FPV از بین ساختمان‌ها، ۳ ثانیه، سریع، با رمپ سرعت به اسلوموشن در لحظه‌ی رسیدن به پنجره.`,
      rule: "قاعده‌ی طلایی: در هر نما یک حرکت، نه سه تا. سه حرکت هم‌زمان در ۵ ثانیه نتیجه‌اش سرگیجه است، نه سینما.",
    },
    pitfalls: {
      kicker: "اشتباه‌های رایج",
      items: [
        { title: "همه را یک‌جا نصب کردن", body: "۹ مجموعه یعنی بیش از ۱۰۰ اسکیل. هر کدام در شروع هر جلسه خوانده می‌شود و جای فکر کردن مدل را می‌گیرد. با ۳ تا ۴ اسکیل شروع کن." },
        { title: "این یک «تیم» نیست، یک جلسه‌ی ترمینال است", body: "تا Claude Code را باز نکنی، هیچ اتفاقی نمی‌افتد. برای تولید روزانه بدون حضور خودت، باید همین مراحل را روی یک سرور بگذاری؛ مثلاً سرویس رندری که از JSON ویدیو می‌سازد و برای تأیید به تلگرام می‌فرستد. آن کار سخت‌تر است و پلی‌بوک جداگانه‌ای می‌خواهد." },
        { title: "ستاره را با کیفیت اشتباه گرفتن", body: "اسکیل‌های ElevenLabs حدود ۵۰۰ ستاره دارند و رسمی و دقیق‌اند؛ بعضی مخزن‌های ۵۰ هزار ستاره‌ای در چند ماه اخیر با موج هیجان بزرگ شده‌اند. تاریخ آخرین commit و تعداد issueهای باز را هم نگاه کن." },
        { title: "بی‌منبع منتشر کردن", body: "مدل عدد و تاریخ را با اطمینان می‌نویسد، حتی وقتی غلط است. در پرامپت بخواه هر ادعای عددی لینک منبع داشته باشد و بدون منبع حذف شود. همین پلی‌بوک چند عدد پست اصلی را اصلاح کرد." },
        { title: "نداشتن معیار سنجش", body: "قبل از تولید دومین محتوا، سه عدد اولی را ثبت کن: نرخ نگه‌داشت ۳ ثانیه‌ی اول، میانگین زمان تماشا و نرخ ذخیره یا اشتراک‌گذاری. بدون این اعداد، خط تولید فقط سریع‌تر محتوای متوسط می‌سازد." },
        { title: "فارسی را مثل انگلیسی فرض کردن", body: "ابزارهای موضوع‌یابی و humanizer برای انگلیسی ساخته شده‌اند. در ویدیو هم فونت فارسی (مثل Vazirmatn) باید کنار پروژه باشد و جهت متن روی کانتینر تنظیم شود، نه روی تگ html." },
      ],
    },
    checklist: {
      kicker: "چک‌لیست",
      title: "اجرای اول",
      lead: "تیک‌ها در همین مرورگر می‌مانند؛ فردا که برگردی، از همان‌جا ادامه می‌دهی.",
      items: [
        "Node.js، Python و ffmpeg نصب و چک شده‌اند",
        "پلتفرم‌ها و زبان محتوا مشخص شده و ابزارها به ۳ تا ۵ مورد محدود شده",
        "README و SKILL.md هر ابزار قبل از نصب خوانده شده",
        "کلیدها در متغیر محیطی‌اند، نه در فایلی داخل گیت",
        "فایل STYLE.md با واژه‌های ممنوع، لحن، امضا و کپی‌رایت ساخته شده",
        "Claude Code دوباره راه‌اندازی شده و ‎/mcp اتصال Postiz را نشان می‌دهد",
        "یک موضوع از last30days انتخاب شده",
        "متن نهایی با منبع برای هر عدد و چک سبک آماده است",
        "کاور و کاروسل از همان متن ساخته شده",
        "ویدیو از hyperframes check گذشته و روی گوشی دیده شده",
        "همه به صورت پیش‌نویس در Postiz ذخیره شده، زمان‌بندی نشده",
        "بعد از انتشار دستی: نگه‌داشت ۳ ثانیه، میانگین زمان تماشا و ذخیره‌ها ثبت شده",
      ],
      done: (n, of) => `${n.toLocaleString("fa-IR")} از ${of.toLocaleString("fa-IR")} انجام شده`,
      reset: "پاک کردن تیک‌ها",
    },
    method: {
      kicker: "روش",
      title: "بررسی‌ها، اصلاح‌ها و منابع",
      changelogTitle: "تاریخچه‌ی تغییرات",
      corrections: [
        "ستاره‌ها از API گیت‌هاب خوانده شد و چند عدد پست اصلی به‌روز شد: last30days ۶۴٫۴ هزار، frontend-slides ۳۰٫۷ هزار، Postiz ۳۷٫۲ هزار، Remotion ۵٫۲ هزار.",
        "شعار HyperFrames دقیقاً «Write HTML. Render video. Built for agents.» است.",
        "نسخه‌ی خودمیزبان Postiz به Temporal هم نیاز دارد، نه فقط Postgres و Redis. نسخه‌ی ابری از ۲۹ دلار در ماه شروع می‌شود و رایگانِ دائمی ندارد.",
        "مجوز رایگان Remotion شرکت‌های تا ۳ کارمند و سازمان‌های غیرانتفاعی را هم پوشش می‌دهد.",
        "خروجی PDF ابزار frontend-slides افقی است؛ برای کاروسل اینستاگرام باید اندازه‌ی اسلاید را عوض کرد.",
        "README ابزار last30days برای X، علاوه بر لاگین مرورگر، X_BEARER_TOKEN را هم می‌پذیرد.",
      ],
      sourcesTitle: "منابع، خوانده‌شده در ۱۵ اکتبر ۲۰۲۶",
      verified: "آخرین بررسی",
    },
    colophon: {
      shareTitle: "تیم تولید محتوا در Claude Code: پلی‌بوک فرجاد",
      disclaimer: "این پلی‌بوک تبلیغ هیچ‌کدام از ابزارها نیست و هیچ لینک همکاری در فروش ندارد. قیمت‌ها و دستورها عوض می‌شوند؛ تاریخ آخرین بررسی بالای صفحه است.",
      cta: "برای راه‌اندازی خط تولید خودت جلسه بگذار",
    },
  },

  en: {
    kicker: "Playbooks",
    hero: {
      lead:
        "How to turn nine open-source skill sets into one pipeline where the final say at every stage stays with you. Every number and install command was checked against the project's own GitHub page, not taken on hearsay.",
      specs: {
        outcome: "You end up with",
        level: "You need",
        cost: "Cost",
        verified: "Last checked",
        tools: "skill sets",
        stages: "stages",
      },
      note: {
        title: "One thing before you start",
        body:
          "This \"team\" is really one Claude Code session on your laptop. A skill is a set of instructions Claude reads, not a service that works on its own. It is excellent for two or three strong pieces a week; daily output without you at the keyboard needs a different setup, which the mistakes section comes back to.",
      },
      jump: "Find the tools you need first",
    },
    map: {
      kicker: "The whole line",
      title: "The pipeline at a glance",
      lead:
        "Six stages run in order, and after each one Claude stops for your approval. Every stage except publishing is optional: if you don't make video, you don't need stages 4 and 5.",
      gate: "You approve",
      hint: "Click a stage to jump to it.",
      stages: {
        topic: { name: "Topic", does: "What is rising" },
        write: { name: "Write", does: "Draft and edit" },
        image: { name: "Images", does: "Cover, carousel, diagram" },
        video: { name: "Video", does: "From code or your footage" },
        voice: { name: "Voice", does: "Narration, music, dubbing" },
        publish: { name: "Publish", does: "Drafts in the queue" },
      },
    },
    builder: {
      kicker: "Your pipeline",
      title: "Don't install everything. Install what you need.",
      lead:
        "Say what you make. You get only the tools you need, the keys you'll have to get, and a setup prompt written for you. Topic research is always on: a weak topic can't be saved by the best edit.",
      makeLabel: "What do you make?",
      langLabel: "In which language?",
      langs: { fa: "Persian", en: "English", both: "Both" },
      always: "Always",
      toolsTitle: "Your tools",
      keysTitle: "Keys and logins",
      noKeys: "No keys needed.",
      softwareTitle: "Software on your machine",
      approvals: (n) => `${n} approval ${n === 1 ? "point" : "points"}`,
      promptTitle: "Your setup prompt",
      copy: "Copy prompt",
      copied: "Copied",
      imageKey: "An image-model key (OpenAI, Google, …)",
      styleNote: "For non-English writing we skip humanizer: your own style file does more.",
      prompt: {
        intro:
          "Using the playbook \"A Content Team Inside Claude Code\", set up a content pipeline for me. The ground rule: nothing gets installed, scheduled or published without my approval.",
        chosen: "## 1. The tools I chose\nInstall only these, exactly as each project's README says. Only I can run /plugin commands; give them to me ready to paste.",
        prereq: "## 2. Prerequisites\nCheck these are installed. If anything is missing, give me the install command before going on:",
        security:
          "## 3. Security review before installing\nFor each tool, read the README and the SKILL.md files and tell me in two lines what commands it runs, which outside services it connects to, and anything that worries you. Then wait for my approval.",
        keys:
          "## 4. Keys\nFor each key, tell me where to get it and which environment variable to put it in. I enter the value myself. You only check whether it is set; never print it and never write it to a file tracked by git.",
        restart: "## 5. Restart\nWhen everything is installed, remind me to quit Claude Code, come back with claude --continue, and check the connections with /mcp.",
        style: (h) =>
          `## 6. My style file\nBefore the first run, create STYLE.md and ask me for: tone, banned words, preferred words, sign-off and copyright line. Take three samples of my past writing too. Check every final text against this file${h ? ", and run humanizer on English text" : ""}.`,
        trial: "## 7. A trial run, one topic end to end",
        trialSteps: {
          topic: "Use last30days to review the last 30 days of discussion on a topic I give you and propose three angles with reasons and sources. I pick one.",
          write: "Write and edit the text, then finalise it against STYLE.md. Every number or date needs a source; cut anything without one.",
          image: "Make the cover and the carousel from that same final text, so everything says the same thing.",
          video: "If I ask for video, make a vertical 30 to 45 second cut and always run hyperframes check before rendering.",
          voice: "Write the voice-over script from the same final text and show it to me before generating audio.",
          publish: "Save everything as drafts in Postiz. Do not schedule, do not publish.",
        },
        rule: "## 8. The approval rule\nAfter every stage, show me the result and wait for my approval. Ask separately before scheduling or publishing anything.",
      },
    },
    prereq: {
      kicker: "Before installing",
      title: "Prerequisites, and a warning",
      lead: "Have these on your machine before installing any skill. Without them, half the tools fail silently.",
      head: ["Prerequisite", "For which tools", "How to check"],
      security: {
        title: "A security warning",
        lead:
          "Claude Code can reach your terminal and your files. Installing nine skill sets from nine different authors means letting nine strangers tell Claude what to do. Three simple rules:",
        rules: [
          "Read each skill's SKILL.md yourself before installing, not just the README.",
          "Install only the skills you will use in the next two weeks. Every extra skill fills the context of every run and makes the model less precise.",
          "Keep API keys in environment variables or a .env file, and never commit that file. Ask Claude only to check that a key is set, never to show its value.",
        ],
      },
    },
    step: "Stage",
    stepTitles: {
      topic: "Find the topic that is rising",
      write: "Write",
      image: "Images",
      video: "Video",
      voice: "Voice, music and dubbing",
      publish: "Schedule and publish",
    },
    steps: {
      topic: {
        lead:
          "last30days gathers the last 30 days of discussion on a topic from several networks, ranks it by real engagement and hands back a summary. It comes first because a weak topic can't be saved by the best edit.",
        exampleLabel: "Example request",
        example: "Which topics about AI agents heated up in the last 30 days? Give me 5 to 10 angles that are rising.",
        sourcesTitle: "Sources, and which ones need a key",
        head: ["Source", "Works without setup?", "What it needs"],
        rows: [
          ["Reddit (with comments), Hacker News, GitHub, Polymarket", "Yes", "Nothing"],
          ["arXiv, Techmeme", "Yes", "Its command-line tool installs itself on first run"],
          ["X / Twitter", "No", "Browser login, or XQUIK_API_KEY, XAI_API_KEY or X_BEARER_TOKEN"],
          ["YouTube", "No", "yt-dlp"],
          ["TikTok, Instagram, Threads, LinkedIn, Pinterest", "No", "A ScrapeCreators key (10,000 free calls, then pay as you go)"],
          ["Bluesky", "No", "An app password"],
          ["Web search", "No", "A Brave Search key"],
          ["Perplexity", "No", "A Perplexity or OpenRouter key"],
        ],
        install: "Two commands, each in its own message:",
        note: {
          title: "For audiences outside English",
          body:
            "The free sources (Reddit and HN) are English-speaking. Persian-speaking audiences talk mostly on Instagram, Telegram and Persian X, and other languages have their own places. Use last30days to find the global trend and add the local angle yourself.",
        },
      },
      write: {
        lead: "The two skills here run at different times: the first to draft, the second at the very end to make the text sound like a person.",
        ms: {
          body: "marketingskills has 50 marketing skills. For content, these four are enough:",
          head: ["Skill", "Exact name in the repo", "What it does"],
          rows: [
            ["Copywriting", "copywriting", "Persuasive copy, hooks and CTAs"],
            ["Editing", "copy-editing", "Cutting, clarifying, evening out the tone"],
            ["Social", "social", "A post shaped for each platform"],
            ["Content strategy", "content-strategy", "A topic plan and a production path"],
          ],
          install: "The official command installs all 50. If you want only the four above, ask Claude to delete the rest from the skills folder.",
        },
        hz: {
          body:
            "humanizer is built on Wikipedia's \"Signs of AI writing\" guide and checks 26 patterns in 6 categories. Give it two or three paragraphs of your own writing and it follows your rhythm and vocabulary.",
        },
        note: {
          title: "If you write in another language",
          body:
            "All 26 humanizer patterns are written for English: overused em dashes, adjectives in threes. The machine tells of other languages are not in it; in Persian, for instance, wrong half-spaces, «می‌باشد» and translated sentence shapes. Write a short style file instead (banned words, preferred words, tone) and have Claude check the final text against it. Those ten lines do more than humanizer outside English.",
        },
      },
      image: {
        lead:
          "There are two kinds of image and each needs its own tool: images a model generates (covers, infographics) and images Claude draws in code (diagrams, slides). The second kind is free and needs no key.",
        baoyu: {
          body: "baoyu-skills is a set of visual-content skills. Three of them suit content work:",
          head: ["Skill", "Output", "Needs an image model?"],
          rows: [
            ["baoyu-cover-image", "Article and post covers", "Yes"],
            ["baoyu-infographic", "Infographics", "Yes"],
            ["baoyu-diagram", "Charts and diagrams (SVG)", "No; Claude writes the SVG itself"],
          ],
          engine:
            "Its image engine, baoyu-image-gen, supports several services: OpenAI, Azure OpenAI, Google, OpenRouter, Replicate and a few Chinese providers. Put the key for whichever you use in an environment variable. If you already have an OpenAI key, that is the simplest path. The author recommends installing only the skills you need.",
          install: "Or as a plugin: /plugin marketplace add JimLiu/baoyu-skills",
        },
        slides: {
          body:
            "frontend-slides builds slides as one HTML file (CSS and JS inline, no dependencies) and can convert an existing PowerPoint. PDF export is a separate script that uses Playwright to screenshot each slide.",
          fix: {
            title: "A correction to the original post",
            body:
              "The README says nothing about LinkedIn carousels; that use is the post author's own. It works, because LinkedIn accepts a multi-page PDF as a document post. But the PDF comes out landscape at 1920×1080. For Instagram, ask Claude to set the slide size to 1080×1350 (4:5) and screenshot each page separately.",
          },
          install: "Two separate messages, with the full HTTPS address, not the short form:",
        },
      },
      video: {
        lead:
          "There are two very different routes. HyperFrames builds video from scratch in code (moving type, charts, product intros). video-use edits footage you shot yourself. Most creators need only one.",
        hf: {
          body:
            "HyperFrames, made by HeyGen, turns HTML, CSS and animation into an MP4. Its line is \"Write HTML. Render video. Built for agents.\" Each scene is a block of HTML with a start time and a duration, and the animation is written in GSAP. Local rendering costs nothing and has no commercial-use cap.",
          install: "This installs the core skills, not all 21:",
          lessonsTitle: "Three lessons from practice that no README mentions",
          lessons: [
            {
              title: "For right-to-left text, never put dir=\"rtl\" on the html tag.",
              body: "You get a black video and no error. Put direction: rtl on the main container instead.",
            },
            {
              title: "Run hyperframes check before rendering.",
              body: "It catches mistakes that look fine in a browser but jitter on video, like animating left instead of transform.",
            },
            {
              title: "Keep fonts and libraries in the project, not on a CDN.",
              body: "A render should give exactly the same output with no internet connection.",
            },
          ],
        },
        vu: {
          body: "video-use is for people who film themselves. Put the raw clips in a folder, talk to Claude Code, and get a final.mp4 back. What it does:",
          does: [
            "Cuts pauses, stumbles and dead air between takes",
            "Colour-grades each section (a preset or your own ffmpeg chain)",
            "Burns in subtitles (two uppercase words at a time by default, adjustable)",
            "Reviews every cut after rendering and fixes problems before showing you the preview",
          ],
          setup: "It transcribes with ElevenLabs Scribe, so it needs ELEVENLABS_API_KEY. ffmpeg is required; yt-dlp is optional.",
          install: "Installation is manual: clone the repo and symlink it into Claude's skills folder. The remaining dependencies are in the README.",
        },
        remotion: {
          title: "If you prefer React: Remotion",
          body:
            "Install Remotion's official skills with npx skills add remotion-dev/skills. Remotion's licence is free for individuals, non-profits and companies of up to 3 employees; larger companies need a company licence. The original post worded this so it read as if it applied to HyperFrames too. HyperFrames has no such limit.",
        },
      },
      voice: {
        lead:
          "ElevenLabs' official skills are new and have few stars, but the company maintains them, so they stay in step with the API. There are 10; these suit content work:",
        head: ["Skill", "What it does"],
        rows: [
          ["text-to-speech", "Voice-over"],
          ["music", "Music"],
          ["sound-effects", "Sound effects"],
          ["dubbing", "Dubs video into another language in the speaker's own voice"],
          ["voice-isolator", "Removes background noise"],
          ["speech-to-text, voice-changer, agents, …", "Others"],
        ],
        install: "The ELEVENLABS_API_KEY you set for video-use works here too. The free quota is limited; after it, every minute costs.",
        notes: [
          {
            title: "Test your language yourself",
            body: "The README says nothing about quality outside English. Before deciding, generate 30 seconds of your own text and listen for the details your language gets wrong; in Persian, half-spaces and the ezafe.",
          },
          {
            title: "Reels music doesn't need a model",
            body: "A simple piano loop takes a few lines of Python (numpy): no copyright problem, no cost. For Instagram it is even better to export silent and add a trending track in the app, which the Reels algorithm favours.",
          },
        ],
      },
      publish: {
        lead:
          "Postiz is an open-source scheduler with an MCP server, so Claude Code can write drafts straight into it. Networks: Instagram, YouTube, LinkedIn, TikTok, X, Facebook, Threads, Reddit, Pinterest, Bluesky, Mastodon, Dribbble, Slack and Discord.",
        head: ["", "Postiz Cloud", "Self-hosted"],
        rows: [
          ["Setup", "Minutes: one command and a login", "Docker with Postgres, Redis and Temporal"],
          ["A developer app per network", "Already approved", "You build your own; Meta, YouTube and TikTok approval can take weeks"],
          ["Cost", "7-day trial, then from $29 a month", "Free software, you pay for the server"],
          ["Data", "On Postiz's servers", "Fully yours"],
        ],
        fix: {
          title: "A correction to the original post",
          body: "The cloud version has no free-forever tier, only a 7-day trial. Self-hosting needs Temporal as well as Postgres and Redis.",
        },
        human: {
          title: "Take the makers' advice seriously",
          body: "Human oversight at every publishing step. In practice, Claude only writes drafts and you press schedule or publish. One wrong post on your main account costs more than any automation saves.",
        },
        install: "The cloud version, with an OAuth login and no API key:",
      },
    },
    installLabel: "Install in Claude Code",
    stars: (k) => `${k}k stars`,
    compare: {
      kicker: "Side by side",
      title: "The nine tools",
      lead: "Stars were read from GitHub on 15 October 2026. They change daily and are not a measure of quality.",
      head: ["Tool", "Stage", "Role", "Stars (k)", "Licence", "Keys or cost"],
      filters: { all: "All", free: "Free", key: "Free, optional keys", paid: "Costs money" },
      flagsNote: "Run npx skills add with -g -a claude-code so the skill lands in Claude Code's global path, not in a folder Claude never reads.",
      costLabels: { free: "Free", key: "Optional key", paid: "Paid" },
    },
    setup: {
      kicker: "The full prompt",
      title: "The setup prompt, for all nine tools",
      lead:
        "If you skipped the builder above, this is the complete version. Give it to Claude Code with a link to this page (Opus or stronger). Three things are fixed against the original post: install commands match each README, a security review step is added, and for non-English content a personal style file takes humanizer's place.",
      text: `Using the playbook "A Content Team Inside Claude Code", set up a content pipeline for me. The ground rule: nothing gets installed, scheduled or published without my approval.

## 1. Needs
Ask me first:
- Which platforms do I publish on, and in which language?
- Do I make video? From my own footage, or from scratch in code?
- Do I need voice-over or dubbing?
Suggest only the tools that fit my answers, and show me the final list before installing.

## 2. Prerequisites
Check that Node.js 18+, Python 3 and ffmpeg are installed. If anything is missing, tell me before going on and give me the install command.

## 3. Security review before installing
For each tool, read the README and the SKILL.md files and tell me in two lines what commands it runs, which outside services it connects to, and anything that worries you. Then wait for my approval.

## 4. Install (exactly as each README says)
- last30days: with /plugin marketplace add and /plugin install. Only I can run /plugin commands, so give them to me ready to paste.
- humanizer and frontend-slides: the same, with /plugin.
- marketingskills and baoyu-skills: with npx skills add and -g -a claude-code; afterwards, remove the skills we did not choose in step 1.
- HyperFrames: npx hyperframes skills update (core set only).
- video-use: clone and symlink to ~/.claude/skills/video-use as the README says.
- ElevenLabs: npx skills add elevenlabs/skills -g -a claude-code.
- Postiz: claude mcp add --transport http postiz https://mcp.postiz.com/mcp-oauth-dynamic; I will log in myself.

## 5. Keys
For each key needed (ELEVENLABS_API_KEY, an image-service key, …) tell me where to get it and which environment variable to use. I enter the value myself. You only check whether it is set; never print it and never write it to a file tracked by git.

## 6. Restart
When everything is installed, remind me to quit Claude Code, come back with claude --continue, and check the Postiz connection with /mcp.

## 7. My style file
Before the first run, create STYLE.md and ask me for: tone, banned words, preferred words, sign-off and copyright line. Take three samples of my past writing. Check every final text against this file (and run humanizer on English text).

## 8. A trial run, one topic end to end
1. Use last30days to review the last 30 days of discussion on a topic I give you, and propose three angles with reasons and sources. I pick one.
2. Write with copywriting and social, edit with copy-editing, finalise against STYLE.md (and humanizer for English). Every number or date needs a source; cut anything without one.
3. Make the cover, the carousel, the video script and the voice-over from that same final text, so everything says the same thing.
4. If I ask for video, make a vertical 30 to 45 second cut and always run hyperframes check before rendering.
5. Save everything as drafts in Postiz. Do not schedule, do not publish.

## 9. The approval rule
After every stage, show me the result and wait for my approval. Ask separately before scheduling or publishing anything.`,
      why: {
        title: "Why a style file?",
        body: "In practice most mistakes in machine-made content don't come from the tools; they come from having no style reference. A ten-line file that says \"never this word, always this one, this sign-off at the end\" stops you making the same corrections on every run.",
      },
    },
    moves: {
      kicker: "24 camera moves",
      title: "Name the move in the prompt",
      lead:
        "Machine-made video looks like a slideshow when the camera stands still and only the text changes. The fix is simple: ask for the move by its film name, and give it a duration and a speed. Instead of \"the camera gets closer\", write: \"dolly in, 3 seconds, slow, toward the face.\"",
      which: {
        title: "Which tools understand it?",
        head: ["Kind of tool", "Examples", "What the move's name does in a prompt"],
        rows: [
          ["Video-generation models (text to film)", "Higgsfield, Veo, Kling, Sora", "Runs directly: these models trained on real footage and know film vocabulary"],
          ["Video from code", "HyperFrames, Remotion", "Not directly, but Claude can build each move in GSAP: a dolly is a slow scale-up, a pan a horizontal slide, a rack focus a blur shifting between two layers"],
          ["Editing raw footage", "video-use", "Only cuts mean anything (jump cut, J-cut, L-cut); the camera moves had to be shot on the day"],
        ],
      },
      groups: { camera: "Camera moves", time: "How it is shot, and time", transition: "From one shot to the next" },
      play: "Each card plays its own move.",
      samplesTitle: "Three sample prompts",
      samples: `Shot 1: An empty desk, morning light. Dolly in, 4 seconds, very slow, toward the laptop. At second 3, rack focus from the coffee cup to the laptop screen.

Shot 2: From shot 1, a match cut on the circle (cup to wall clock). A 2-second time-lapse from morning to night.

Shot 3: J-cut: the city sound starts one second before the picture. Then an FPV drone shot between the buildings, 3 seconds, fast, speed-ramping into slow motion as it reaches the window.`,
      rule: "The golden rule: one move per shot, not three. Three moves at once in five seconds is vertigo, not cinema.",
    },
    pitfalls: {
      kicker: "Common mistakes",
      items: [
        { title: "Installing everything at once", body: "Nine sets is more than 100 skills. Each is read at the start of every session and takes room the model would think in. Start with three or four." },
        { title: "It isn't a team, it's a terminal session", body: "Nothing happens until you open Claude Code. For daily output without you there, the same stages have to run on a server, such as a render service that builds video from JSON and sends it to Telegram for approval. That is harder, and a playbook of its own." },
        { title: "Mistaking stars for quality", body: "ElevenLabs' skills have about 500 stars and are official and precise; some 50,000-star repos grew on a wave of hype in the past few months. Look at the last commit date and the open issues too." },
        { title: "Publishing without sources", body: "A model writes numbers and dates with confidence even when they are wrong. Ask in the prompt for a source link on every figure, and cut any figure without one. This playbook corrected several numbers in the original post." },
        { title: "No way to measure", body: "Before your second piece, record three numbers from the first: 3-second retention, average watch time and save or share rate. Without them, the pipeline just makes average content faster." },
        { title: "Treating every language like English", body: "The topic tools and humanizer are built for English. In video, a non-Latin font (Vazirmatn for Persian, say) has to ship with the project, and text direction is set on the container, not on the html tag." },
      ],
    },
    checklist: {
      kicker: "Checklist",
      title: "Your first run",
      lead: "Ticks stay in this browser; come back tomorrow and pick up where you left off.",
      items: [
        "Node.js, Python and ffmpeg are installed and checked",
        "Platforms and language decided, tools cut to three to five",
        "Each tool's README and SKILL.md read before installing",
        "Keys are in environment variables, not in any file in git",
        "STYLE.md written with banned words, tone, sign-off and copyright",
        "Claude Code restarted, and /mcp shows the Postiz connection",
        "A topic chosen from last30days",
        "Final text ready, with a source for every number and a style check",
        "Cover and carousel made from the same text",
        "Video passed hyperframes check and was watched on a phone",
        "Everything saved as drafts in Postiz, nothing scheduled",
        "After publishing by hand: 3-second retention, watch time and saves recorded",
      ],
      done: (n, of) => `${n} of ${of} done`,
      reset: "Clear ticks",
    },
    method: {
      kicker: "Method",
      title: "Checks, corrections and sources",
      changelogTitle: "Changelog",
      corrections: [
        "Stars were read from the GitHub API and several of the original post's numbers updated: last30days 64.4k, frontend-slides 30.7k, Postiz 37.2k, Remotion 5.2k.",
        "HyperFrames' line is exactly \"Write HTML. Render video. Built for agents.\"",
        "Self-hosted Postiz needs Temporal, not only Postgres and Redis. The cloud version starts at $29 a month and has no free-forever tier.",
        "Remotion's free licence also covers companies of up to 3 employees and non-profits.",
        "frontend-slides exports landscape PDFs; an Instagram carousel needs a different slide size.",
        "last30days also accepts X_BEARER_TOKEN for X, besides a browser login.",
      ],
      sourcesTitle: "Sources, read on 15 October 2026",
      verified: "Last checked",
    },
    colophon: {
      shareTitle: "A Content Team Inside Claude Code: a playbook by Farjad",
      disclaimer: "This playbook promotes none of these tools and carries no affiliate links. Prices and commands change; the date of the last check is at the top of the page.",
      cta: "Book a session to set up your own pipeline",
    },
  },
}
