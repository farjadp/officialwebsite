// ============================================================================
// File Path: src/components/v3/pages/book-club.tsx
// Why: /fa/book-club (دورهمی کتاب‌خوانی مشروطه) in the v3 "Light" look.
//      Persian only; there is no English page. The copy is the v2 page's own,
//      carried over word for word; only the look changed. Decorative emoji
//      and flag glyphs were dropped (they brought their own colours).
//      Data (sessions, books) is fetched by the route and passed in.
// Env / Identity: React Server Component
// ============================================================================

import { localDigits } from "@/lib/digits"
import { BookOpen, CalendarDays, ExternalLink, Video } from "lucide-react"
import { BookClubJoinForm } from "@/components/book-club/join-form"
import {
  Card,
  Headline,
  Kicker,
  LightRule,
  PageHero,
  Parallax,
  Reveal,
  Section,
  V3Page,
} from "@/components/v3/kit"

export type BookClubSessionView = {
  id: string
  title: string
  sessionDate: Date
  readingAssignment: string | null
  summary: string | null
}

export type BookClubBookView = {
  id: string
  title: string
  author: string | null
  description: string | null
  link: string | null
  coverUrl: string | null
}

// ── Formatting ────────────────────────────────────────────────────────────

function formatFaDate(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

function formatFaTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(date)
}

const index = (i: number) => localDigits(String(i + 1).padStart(2, "0"), "fa")

// ── Copy (verbatim from the v2 page) ──────────────────────────────────────

// شهرها/مناطقی که اعضای دورهمی معمولاً از آن‌جا وصل می‌شوند
const SESSION_TIMEZONES = [
  { label: "ایران", zone: "Asia/Tehran" },
  { label: "کانادا (تورنتو)", zone: "America/Toronto" },
  { label: "غرب آمریکا", zone: "America/Los_Angeles" },
  { label: "اروپا (مرکزی)", zone: "Europe/Berlin" },
]

const TIMELINE: { date: string; title: string; text: string; image?: string; caption?: string }[] = [
  {
    date: "۱۲۷۰ خورشیدی — ۱۸۹۱ میلادی",
    title: "جنبش تنباکو",
    text: "ناصرالدین‌شاه امتیاز انحصار توتون و تنباکو را به یک کمپانی انگلیسی می‌فروشد. فتوای تحریم تنباکو از سوی میرزای شیرازی، شاه را به عقب‌نشینی وا می‌دارد — نخستین بار که «اراده عمومی» در ایران پیروز می‌شود و تمرینی برای مشروطه.",
  },
  {
    date: "آذر ۱۲۸۴ — دسامبر ۱۹۰۵",
    title: "به چوب بستن بازرگانان و آغاز اعتراض‌ها",
    text: "حاکم تهران بازرگانان قند را به بهانه گرانی به فلک می‌بندد. بازار می‌بندد، علما و مردم در حرم شاه عبدالعظیم بست می‌نشینند (مهاجرت صغری) و خواسته‌ای تازه سر بر می‌آورد: «عدالت‌خانه».",
  },
  {
    date: "تابستان ۱۲۸۵ — ۱۹۰۶",
    title: "مهاجرت کبری و تحصن بزرگ",
    text: "علما به قم مهاجرت می‌کنند و هزاران تن از مردم تهران در باغ سفارت انگلیس بست می‌نشینند. این‌بار خواسته صریح است: مجلس شورای ملی.",
  },
  {
    date: "۱۳ مرداد ۱۲۸۵ — ۵ اوت ۱۹۰۶",
    title: "امضای فرمان مشروطیت",
    text: "مظفرالدین‌شاه قاجار، بیمار و در واپسین ماه‌های عمر، فرمان مشروطیت را امضا می‌کند. ایران نخستین کشور آسیایی‌ست که با جنبشی مردمی صاحب قانون اساسی و پارلمان می‌شود.",
    image: "/book-club/farman-mashrutiyat.jpg",
    caption: "دست‌خط فرمان مشروطیت، مرداد ۱۲۸۵",
  },
  {
    date: "۱۴ مهر ۱۲۸۵ — اکتبر ۱۹۰۶",
    title: "گشایش نخستین مجلس شورای ملی",
    text: "مجلس اول در عمارت بهارستان گشوده می‌شود؛ بازرگانان و روحانیون و اصناف کنار هم. قانون اساسی تدوین و چند روز پیش از مرگ شاه امضا می‌شود. مطبوعات آزاد جان می‌گیرند — از جمله «صور اسرافیل» با قلم تند و طنز درخشان علی‌اکبر دهخدا.",
    image: "/book-club/majles-aval.jpg",
    caption: "نمایندگان نخستین مجلس شورای ملی",
  },
  {
    date: "۲ تیر ۱۲۸۷ — ۲۳ ژوئن ۱۹۰۸",
    title: "به توپ بستن مجلس",
    text: "محمدعلی‌شاه، دشمن مشروطه، به فرماندهی کلنل لیاخوف روسی مجلس را به توپ می‌بندد. میرزا جهانگیرخان صور اسرافیل و شماری از آزادی‌خواهان در باغشاه کشته می‌شوند. «استبداد صغیر» آغاز می‌شود.",
    image: "/book-club/bombardment-majles.jpg",
    caption: "عمارت بهارستان پس از گلوله‌باران بریگاد قزاق، ۱۲۸۷",
  },
  {
    date: "۱۲۸۷–۱۲۸۸ — ۱۹۰۸–۱۹۰۹",
    title: "ایستادگی تبریز",
    text: "در حالی که تهران خاموش شده، تبریز یازده ماه در محاصره می‌ایستد. ستارخان (سردار ملی) و باقرخان (سالار ملی) از محله‌های امیرخیز و خیابان، پرچم مشروطه را برافراشته نگه می‌دارند.",
    image: "/book-club/sattar-bagher.jpg",
    caption: "ستارخان و باقرخان در میان مجاهدان تبریز",
  },
  {
    date: "۲۵ تیر ۱۲۸۸ — ۱۶ ژوئیه ۱۹۰۹",
    title: "فتح تهران و بازگشت مشروطه",
    text: "مجاهدان گیلان و سواران بختیاری تهران را می‌گشایند. محمدعلی‌شاه به سفارت روسیه پناه می‌برد و از سلطنت خلع می‌شود. مجلس دوم گشوده می‌شود — و پرسشی که هنوز با ماست آغاز می‌شود: با قانون چه باید کرد؟",
  },
]

const LESSONS = [
  {
    title: "تنباکو؛ نخستین تجربه اراده ملی",
    text: "جنبش تنباکو نخستین باری بود که ایرانیان دریافتند می‌توانند اراده قدرت سیاسی را تغییر دهند. واقعه، به تجربه بدل شد و تجربه، به معنا — و همین حافظه بود که پانزده سال بعد راه مشروطه را هموار کرد.",
  },
  {
    title: "ظلم؛ از شخص تا ساختار",
    text: "میرزا رضا کرمانی می‌پنداشت با کشتن شاه، ظلم برمی‌افتد. شکست این راه، درس بزرگ مشروطه شد: ظلم صفتِ یک شخص نیست، یک ساختار است — و پاسخ ساختار، نه ترور که «قانون» و «عدالت‌خانه» است.",
  },
  {
    title: "سیر آگاهی ملی؛ از آزادی تا دولت",
    text: "دغدغه جمعی ایرانیان مرحله‌به‌مرحله پوست انداخت: ۱۲۸۵ آزادی (حریت)، ۱۲۹۰ حفظ مشروطه، ۱۲۹۵ بقای ایران، و ۱۳۰۰ به بعد ضرورت دولت مقتدر. در نوزده سال، بیش از پنجاه کابینه آمد و رفت — و آگاهی جمعی آموخت که بدون دولت توانمند، قانون اجرا نمی‌شود.",
  },
  {
    title: "روشنفکر مشروطه؛ نهادساز بود",
    text: "روشنفکر مشروطه می‌پرسید «چگونه بسازیم؟» — قانون، عدلیه، مدرسه، ارتش، مجلس. رویکردش ایجابی بود و امر ملی را واحد رهایی می‌دانست؛ از مستشارالدوله و «یک کلمه»‌اش تا کسروی که می‌گفت نهادها را باید اصلاح کرد، نه ویران.",
  },
  {
    title: "حافظه تاریخی؛ توشه راه آینده",
    text: "حافظه تاریخی یعنی توانایی یک ملت برای حمل تجربه‌هایش به آینده. نهادی که تاریخ تأسیس خود را فراموش کند، حافظه‌اش را می‌بلعد. مشروطه را می‌خوانیم تا این حافظه، گسسته نشود.",
  },
  {
    title: "انقلابی نخبگانی، مسئله‌ای همگانی",
    text: "مشروطه اساساً انقلابی نخبگانی بود؛ روشنفکران و علما و بازرگانان پیش‌قراولش بودند و نقش توده مردم کمرنگ‌تر. اما پرسشی که پیش کشید — نسبت ما با قانون — همچنان پرسش همه ماست.",
  },
]

const QUESTIONS = [
  {
    n: "۱",
    q: "آیا مشروطه واکنشی ناگهانی بود، یا پروژه‌ای چهل‌ساله؟",
    a: "مستشارالدوله در «یک کلمه» (۱۲۴۹ ش) نوشت که آن یک کلمه، «قانون» است — و حتی پیشنهاد کرد حفظ قانون به «مجلسی مخصوص و مستقل» سپرده شود. یعنی طرح مجلس، چهل سال پیش از مجلس، روی کاغذ بود.",
  },
  {
    n: "۲",
    q: "چرا سه روایت متضاد به یک نتیجهٔ مشترک می‌رسند؟",
    a: "کسروی از موضع ضددینی، آدمیت از موضع سکولار ملی، و مقدمهٔ ۱۳۷۱ بر «بیداری ایرانیان» از موضعی کاملاً مخالف — هر سه از ناسازگاری ساختاری مشروطه و شریعت می‌گویند. در حالی که نائینی و آخوند خراسانی از درون همان سنت، این را انکار می‌کنند.",
  },
  {
    n: "۳",
    q: "خلع محمدعلی‌شاه زور بود یا حق؟",
    a: "اصل ۳۵ متمم قانون اساسی: «سلطنت ودیعه‌ای است که از جانب ملت به شخص تفویض می‌شود» — و ملت می‌تواند پس بگیرد. مشروطه‌خواهان در ۱۲۸۸ به متنی استناد کردند که خودشان دو سال پیش‌تر نوشته بودند.",
  },
  {
    n: "۴",
    q: "پرسش درست چیست؟ «چرا مشروطه شکست خورد» نیست.",
    a: "در آذر ۱۲۸۶ شاه با حدود ۷٬۰۰۰ نیرو به مجلس حمله کرد و در برابر ۱٬۵۰۰ مدافع باخت. شش ماه بعد، با نیروی کمتر، برد و مجلس را به توپ بست. پس بپرسیم: در آن شش ماه چه چیزی عوض شد؟",
  },
]

const GLOSSARY = [
  ["آخشیج", "ضد"],
  ["سکالیدن", "شور کردن، مشورت"],
  ["هناییدن", "تأثیر کردن"],
  ["پیکره", "عکس"],
  ["دستینه", "امضا"],
]

const ABOUT_BOOK = [
  {
    q: "کجا آغاز و کجا تمام می‌شود؟",
    a: "از زمینه‌های پیش از مشروطه تا سال ۱۲۸۸. فتح تهران و آنچه پس از آن آمد در کتاب دیگر او، «تاریخ هجده‌سالهٔ آذربایجان»، دنبال می‌شود.",
  },
  {
    q: "از کدام زاویه نوشته شده؟",
    a: "کسروی مشروطه‌خواه است و پنهانش نمی‌کند. این نه عیب کتاب است و نه فضیلتش — فقط باید بدانیم داریم ماجرا را از کدام پنجره می‌بینیم.",
  },
  {
    q: "چطور بخوانیم؟",
    a: "آرام و با تقویم کنار دست. تاریخ‌ها در متن گاه قمری‌اند و گاه خورشیدی؛ همین یک نکته جلوی بیشترِ سردرگمی‌ها را می‌گیرد.",
  },
]

const REFERENCE_BOOKS = [
  { title: "تاریخ مشروطه ایران", author: "احمد کسروی", note: "روایت کلاسیک و دست‌اول؛ کسروی خود شاهد وقایع تبریز بود." },
  {
    title: "تاریخ بیداری ایرانیان",
    author: "ناظم‌الاسلام کرمانی",
    note: "وقایع‌نگاری روزبه‌روز مشروطه به قلم کسی که خودش در میانه ماجرا بود؛ از مهم‌ترین اسناد دست‌اول این دوره.",
  },
  { title: "مشروطه ایرانی", author: "ماشاءالله آجودانی", note: "چرا مفهوم «مشروطه» در ترجمه به فرهنگ ما دگرگون شد؟" },
  { title: "ایدئولوژی نهضت مشروطیت ایران", author: "فریدون آدمیت", note: "ریشه‌های فکری مشروطه و اندیشه ترقی." },
  { title: "تبریز مه‌آلود", author: "محمدسعید اردوبادی", note: "رمانی درباره ایستادگی تبریز؛ برای آن‌که تاریخ را قصه‌وار بخواند." },
  {
    title: "The Iranian Constitutional Revolution",
    author: "Janet Afary",
    note: "نگاه پژوهشی به نقش شوراها، زنان و دموکراسی مردمی (انگلیسی).",
    ltr: true,
  },
]

const ONLINE_LINKS = [
  {
    title: "جنبش مشروطه ایران — ویکی‌پدیای فارسی",
    href: "https://fa.wikipedia.org/wiki/%D8%AC%D9%86%D8%A8%D8%B4_%D9%85%D8%B4%D8%B1%D9%88%D8%B7%D9%87_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86",
    note: "نقطه شروع خوب با ارجاع‌های فراوان.",
  },
  {
    title: "Constitutional Revolution — Encyclopædia Iranica",
    href: "https://www.iranicaonline.org/articles/constitutional-revolution-index/",
    note: "مجموعه مقالات پژوهشی معتبر (انگلیسی).",
    ltr: true,
  },
  {
    title: "The Persian Revolution of 1905–1909 — Edward Browne",
    href: "https://archive.org/details/persianrevolutio00browuoft",
    note: "گزارش دست‌اول ادوارد براون؛ متن کامل و رایگان در Internet Archive.",
    ltr: true,
  },
  {
    title: "اسناد و عکس‌های مشروطه — Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/Category:Persian_Constitutional_Revolution",
    note: "آرشیو عکس‌ها و اسناد اصل دوره مشروطه.",
  },
  {
    title: "روزنامه صور اسرافیل — نسخه‌های اصل",
    href: "https://fa.wikipedia.org/wiki/%D8%B5%D9%88%D8%B1_%D8%A7%D8%B3%D8%B1%D8%A7%D9%81%DB%8C%D9%84",
    note: "درباره روزنامه و «چرند و پرند» دهخدا.",
  },
]

const SIDE_READINGS = [
  {
    title: "Iran Under the Safavids",
    author: "Roger Savory",
    note: "ایران عصر صفوی؛ ریشه‌های دولت متمرکز و پیوند دین و سلطنت که مشروطه با میراثش دست‌وپنجه نرم کرد (انگلیسی).",
    ltr: true,
  },
  {
    title: "تاریخ ایران مدرن",
    author: "یرواند آبراهامیان",
    note: "نگاه فشرده به دو قرن اخیر؛ جای مشروطه را در قاب بزرگ‌تر تاریخ معاصر نشان می‌دهد.",
  },
]

// ── Shared styles ─────────────────────────────────────────────────────────

const LIFT =
  "transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise"
const BODY = "leading-relaxed text-v3-soft rtl:leading-loose"
const PHOTO = "w-full object-cover object-top grayscale-[0.35]"

function TimezoneRow({ date }: { date: Date }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-v3-line/70 bg-v3-line/70 md:grid-cols-4">
      {SESSION_TIMEZONES.map((tz) => (
        <div key={tz.zone} className="flex flex-col gap-1.5 bg-v3-ink p-5 transition-colors duration-500 hover:bg-v3-raise">
          <dt className="text-sm text-v3-mute">{tz.label}</dt>
          <dd className="font-v3-display text-2xl text-v3-bone">{formatFaTime(date, tz.zone)}</dd>
        </div>
      ))}
    </dl>
  )
}

function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-v3-line/80 bg-v3-raise">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className={`max-h-96 ${PHOTO}`} />
      <figcaption className="border-t border-v3-line/70 px-4 py-3 text-xs text-v3-mute">{caption}</figcaption>
    </figure>
  )
}

function ReadingItem({ title, author, note, ltr }: { title: string; author: string; note: string; ltr?: boolean }) {
  return (
    <li className="border-s-2 border-v3-light/40 ps-4">
      <strong className="font-semibold text-v3-bone">
        {ltr ? <bdi dir="ltr">{title}</bdi> : title}
      </strong>{" "}
      <span className="text-v3-soft">— {ltr ? <bdi dir="ltr">{author}</bdi> : author}</span>
      <p className="mt-1 text-sm leading-relaxed text-v3-mute rtl:leading-loose">{note}</p>
    </li>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export function BookClubPage({
  nextSession,
  pastSessions,
  books,
}: {
  nextSession?: BookClubSessionView
  pastSessions: BookClubSessionView[]
  books: BookClubBookView[]
}) {
  return (
    <V3Page>
      {/* ── Hero + signup ──────────────────────────────────────────── */}
      <PageHero
        kicker={
          <span className="inline-flex items-center gap-2">
            <BookOpen className="h-4 w-4" aria-hidden />
            دورهمی کتاب‌خوانی — آنلاین و رایگان
          </span>
        }
        title="خوانشِ"
        accent="مشروطه"
        lead="صد و اندی سال پیش، مردمی برای «قانون» به پا خاستند. ما دور هم جمع می‌شویم تا آن قصه را — کتاب به کتاب — دوباره بخوانیم و درباره‌اش گفت‌وگو کنیم."
        aside={
          <Card tone="lit" className="gap-5">
            <div className="flex flex-col gap-2">
              <Headline size="card">به جمع ما بپیوند</Headline>
              <p className={BODY}>ایمیلت را بگذار تا دعوت جلسه بعدی مستقیم به تقویمت بیاید.</p>
            </div>
            <BookClubJoinForm />
            <p className="border-t border-v3-line/70 pt-4 text-sm leading-relaxed text-v3-mute rtl:leading-loose">
              تمامی جلسات کتاب‌خوانی ضبط می‌شوند و خلاصه هر جلسه در گروه تلگرامی «مشروطه‌خوانی» قرار می‌گیرد.
            </p>
          </Card>
        }
      />

      {/* ── Next session ───────────────────────────────────────────── */}
      {nextSession && (
        <Section
          kicker={
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" aria-hidden />
              جلسه بعدی
            </span>
          }
          title={nextSession.title}
          lead={formatFaDate(nextSession.sessionDate)}
        >
          <div className="flex flex-col gap-8">
            <Reveal>
              <TimezoneRow date={nextSession.sessionDate} />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="flex items-center gap-3 text-v3-soft">
                <Video className="h-5 w-5 shrink-0 text-v3-light" aria-hidden />
                لینک Google Meet با دعوت‌نامه کلندر برایت ارسال می‌شود.
              </p>
            </Reveal>
            {nextSession.readingAssignment && (
              <Reveal delay={0.16}>
                <Card tone="raised" className="max-w-3xl">
                  <Kicker>برای این جلسه بخوانید</Kicker>
                  <p className="text-xl leading-relaxed text-v3-bone rtl:leading-loose">
                    {nextSession.readingAssignment}
                  </p>
                  <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">
                    این صفحه‌ها را با همان <strong className="font-semibold text-v3-bone">نگاه محافظه‌کارانه</strong>‌ای بررسی می‌کنیم که در کارگاه‌های دکتر داروین صبوری آموختیم: تاریخ به‌مثابهٔ تداوم، نه گسست.
                  </p>
                </Card>
              </Reveal>
            )}
            <Reveal delay={0.2}>
              <p className="text-sm text-v3-mute">
                همه جلسات ضبط می‌شوند و خلاصه هر جلسه در گروه تلگرامی «مشروطه‌خوانی» منتشر می‌شود.
              </p>
            </Reveal>
          </div>
        </Section>
      )}

      {/* ── The story, as a timeline ───────────────────────────────── */}
      <Section
        title="داستان مشروطه، به کوتاهی"
        lead={
          <>
            مشروطه فقط یک «واقعه» نبود؛ نخستین بار بود که ایرانیان از پادشاه نه نان، که{" "}
            <strong className="font-semibold text-v3-light">قانون</strong> خواستند. این خط زمانی، نقشه راه گفت‌وگوهای ماست.
          </>
        }
      >
        <LightRule className="max-w-4xl">
          <ol className="flex flex-col">
            {TIMELINE.map((event, i) => (
              <li
                key={event.title}
                className="relative grid grid-cols-[4.5rem_1fr] gap-6 py-8 md:grid-cols-[7.5rem_1fr] md:gap-10"
              >
                <span className="font-v3-display text-base tabular-nums text-v3-mute md:text-lg">{index(i)}</span>
                <span
                  aria-hidden
                  className="absolute start-[4.5rem] top-[2.6rem] h-2 w-2 -translate-x-1/2 rounded-full bg-v3-ink ring-1 ring-v3-light md:start-[7.5rem] rtl:translate-x-1/2"
                />
                <Reveal className="flex flex-col gap-2 ps-6 md:ps-10">
                  <p className="text-sm text-v3-light">{event.date}</p>
                  <h3 className="font-v3-display text-2xl leading-snug text-v3-bone">{event.title}</h3>
                  <p className={`max-w-2xl ${BODY}`}>{event.text}</p>
                  {event.image && event.caption && (
                    <div className="mt-4 max-w-2xl">
                      <Figure
                        src={event.image}
                        alt={event.caption}
                        caption={`${event.caption} — آرشیو ویکی‌مدیا (مالکیت عمومی)`}
                      />
                    </div>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </LightRule>
      </Section>

      {/* ── Sur-e Esrafil masthead ─────────────────────────────────── */}
      <section className="border-b border-v3-line/70 bg-v3-raise">
        <Reveal className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-5 px-5 py-16 text-center md:px-10 lg:px-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/book-club/soure-esrafil.jpg"
            alt="سرلوحه روزنامه صور اسرافیل"
            loading="lazy"
            className="w-full max-w-xl opacity-80 mix-blend-screen grayscale invert"
          />
          <p className="max-w-xl text-sm leading-relaxed text-v3-mute rtl:leading-loose">
            سرلوحه «صور اسرافیل» — پرخواننده‌ترین روزنامه عصر مشروطه؛ جایی که «چرند و پرند» دهخدا نثر فارسی را برای همیشه عوض کرد.
          </p>
        </Reveal>
      </section>

      {/* ── Lessons ────────────────────────────────────────────────── */}
      <Section title="آموزه‌های مشروطه" lead="جان‌مایه گفت‌وگوهای ما — از دل جلسات و درس‌گفتارهای دوره">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {LESSONS.map((card, i) => (
            <Reveal key={card.title} delay={(i % 3) * 0.08}>
              <Card className={LIFT}>
                <span className="font-v3-display text-lg text-v3-mute">{index(i)}</span>
                <Headline as="h3" size="card">{card.title}</Headline>
                <p className={BODY}>{card.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-10 text-sm text-v3-mute">
            برگرفته از یادداشت‌های جلسات دوره «زوال و زایش آگاهی ملی» در کارگاه‌های دکتر داروین صبوری
          </p>
        </Reveal>
      </Section>

      {/* ── Our books ──────────────────────────────────────────────── */}
      {books.length > 0 && (
        <Section title="کتاب‌های ما">
          <div className="grid gap-4 md:grid-cols-2">
            {books.map((book, i) => (
              <Reveal key={book.id} delay={(i % 2) * 0.08}>
                <div className={`flex h-full gap-5 rounded-2xl border border-v3-line/80 p-6 md:p-7 ${LIFT}`}>
                  {book.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      loading="lazy"
                      className="h-32 w-24 shrink-0 rounded-lg border border-v3-line object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-24 shrink-0 items-center justify-center rounded-lg border border-v3-line bg-v3-raise">
                      <BookOpen className="h-8 w-8 text-v3-light" aria-hidden />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-v3-display text-xl leading-snug text-v3-bone">{book.title}</h3>
                    {book.author && <p className="text-sm text-v3-mute">{book.author}</p>}
                    {book.description && (
                      <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{book.description}</p>
                    )}
                    {book.link && (
                      <a
                        href={book.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-v3-light underline decoration-v3-line underline-offset-8 transition-colors hover:decoration-v3-light"
                      >
                        دریافت کتاب
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* ── Past sessions ──────────────────────────────────────────── */}
      {pastSessions.length > 0 && (
        <Section title="آنچه گذشت" lead="خلاصه گفت‌وگوهای جلسات پیشین">
          <LightRule className="max-w-4xl">
            <ol className="flex flex-col">
              {pastSessions.map((session, i) => (
                <li
                  key={session.id}
                  className="relative grid grid-cols-[4.5rem_1fr] gap-6 py-8 md:grid-cols-[7.5rem_1fr] md:gap-10"
                >
                  <span className="font-v3-display text-base tabular-nums text-v3-mute md:text-lg">
                    {index(pastSessions.length - 1 - i)}
                  </span>
                  <span
                    aria-hidden
                    className="absolute start-[4.5rem] top-[2.6rem] h-2 w-2 -translate-x-1/2 rounded-full bg-v3-ink ring-1 ring-v3-light md:start-[7.5rem] rtl:translate-x-1/2"
                  />
                  <Reveal delay={Math.min(i, 3) * 0.06} className="flex flex-col gap-3 ps-6 md:ps-10">
                    <p className="text-sm text-v3-light">{formatFaDate(session.sessionDate)}</p>
                    <h3 className="font-v3-display text-2xl leading-snug text-v3-bone">{session.title}</h3>
                    {session.summary ? (
                      <div
                        className="prose prose-invert max-w-none text-v3-soft rtl:leading-loose prose-headings:font-v3-display prose-headings:font-light prose-headings:text-v3-bone prose-p:text-v3-soft prose-strong:text-v3-bone prose-a:text-v3-light prose-li:text-v3-soft prose-li:marker:text-v3-mute prose-blockquote:border-v3-line prose-blockquote:text-v3-soft prose-hr:border-v3-line"
                        dangerouslySetInnerHTML={{ __html: session.summary }}
                      />
                    ) : (
                      <p className="text-v3-mute">خلاصه این جلسه به‌زودی منتشر می‌شود.</p>
                    )}
                  </Reveal>
                </li>
              ))}
            </ol>
          </LightRule>
        </Section>
      )}

      {/* ── Questions we follow ────────────────────────────────────── */}
      <Section title="پرسش‌هایی که دنبال می‌کنیم" lead="خواندن با پرسش پیش می‌رود، نه با جمع‌آوری اطلاعات">
        <ol className="flex max-w-4xl flex-col border-t border-v3-line/70">
          {QUESTIONS.map((item, i) => (
            <li key={item.n} className="border-b border-v3-line/70">
              <Reveal
                delay={i * 0.06}
                className="grid grid-cols-[3rem_1fr] gap-5 py-8 transition-colors duration-500 hover:bg-v3-raise md:grid-cols-[4rem_1fr] md:px-4"
              >
                <span className="font-v3-display text-3xl text-v3-light">{item.n}</span>
                <div className="flex flex-col gap-3">
                  <h3 className="font-v3-display text-2xl leading-snug text-v3-bone">{item.q}</h3>
                  <p className={BODY}>{item.a}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Our narrator: Kasravi ──────────────────────────────────── */}
      <Section title="راوی ما کیست؟" lead="پیش از آنکه کتاب را باز کنید، با نویسنده‌اش آشنا شوید">
        <div className="flex flex-col gap-5">
          <Reveal>
            <Card tone="raised" className="grid items-center gap-8 md:grid-cols-[220px_1fr]">
              <figure className="mx-auto w-full max-w-[220px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/book-club/kasravi.jpg"
                  alt="احمد کسروی، تاریخ‌نگار"
                  loading="lazy"
                  className={`rounded-2xl border border-v3-line ${PHOTO}`}
                />
                <figcaption className="mt-3 text-center text-xs text-v3-mute">
                  احمد کسروی (۱۲۶۹–۱۳۲۴) — آرشیو ویکی‌مدیا
                </figcaption>
              </figure>
              <div className="flex flex-col gap-4">
                <Headline as="h3" size="card">احمد کسروی</Headline>
                <p className={BODY}>
                  تاریخ‌نگار، زبان‌شناس و حقوقدان اهل تبریز. هنگام مشروطه نوجوانی بود که ایستادگی یازده‌ماههٔ شهرش را با چشم خود دید — و همین، «تاریخ مشروطهٔ ایران» را از یک کتاب تاریخ معمولی جدا می‌کند.
                </p>
                <p className={BODY}>
                  او برای نوشتن کتاب به روزنامه‌های همان سال‌ها، اسناد انجمن‌ها و گفت‌وگو با شاهدان زنده تکیه کرد. نثرش تند و داوری‌هایش صریح است؛ کسروی پنهان نمی‌کند که کجا ایستاده.
                </p>
              </div>
            </Card>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <Card className={LIFT}>
                <Headline as="h3" size="card">واژه‌های کسروی</Headline>
                <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">
                  کسروی به پالایش زبان فارسی باور داشت و واژه‌های خودساخته به کار می‌برد. اگر جایی در متن گیر کردید، احتمالاً یکی از این‌هاست:
                </p>
                <dl className="flex flex-col">
                  {GLOSSARY.map(([word, meaning]) => (
                    <div key={word} className="flex items-baseline gap-3 border-b border-v3-line/60 py-3 last:border-b-0">
                      <dt className="font-semibold text-v3-light">{word}</dt>
                      <span aria-hidden className="text-sm text-v3-mute">←</span>
                      <dd className="text-v3-soft">{meaning}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </Reveal>
            <Reveal delay={0.08}>
              <Card className={LIFT}>
                <Headline as="h3" size="card">دربارهٔ این کتاب</Headline>
                <ul className="flex flex-col gap-5">
                  {ABOUT_BOOK.map((item) => (
                    <li key={item.q} className="flex flex-col gap-1">
                      <strong className="font-semibold text-v3-bone">{item.q}</strong>
                      <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{item.a}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>

          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-v3-line/80">
              <figure>
                <Parallax className="h-72 bg-v3-raise md:h-[420px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/book-club/nouri-behbahani.jpg"
                    alt="شیخ فضل‌الله نوری و سید عبدالله بهبهانی"
                    loading="lazy"
                    className={`h-full ${PHOTO}`}
                  />
                </Parallax>
                <figcaption className="border-t border-v3-line/70 px-6 py-3 text-center text-xs text-v3-mute">
                  شیخ فضل‌الله نوری و سید عبدالله بهبهانی، ۱۲۸۵ — آرشیو ویکی‌مدیا (مالکیت عمومی)
                </figcaption>
              </figure>
              <div className="flex flex-col items-center gap-3 border-t border-v3-line/70 p-7 text-center md:p-10">
                <Headline as="h3" size="card">دو روحانی، دو راه</Headline>
                <p className={`max-w-2xl ${BODY}`}>
                  هر دو از علمای بزرگ پایتخت بودند و هر دو در آغاز، همراه جنبش. اما یکی («مشروطهٔ مشروعه») در برابر متمم قانون اساسی ایستاد و دیگری تا پایان کنار مشروطه ماند. فهمِ این دوراهی — نه محکوم کردن یک طرف — کار ماست.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Sources and links ──────────────────────────────────────── */}
      <Section title="منابع و لینک‌های مفید" lead="برای آنکه پیش از هر جلسه، عمیق‌تر بیاییم">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Card>
              <Headline as="h3" size="card">کتاب‌های مرجع</Headline>
              <ul className="flex flex-col gap-5">
                {REFERENCE_BOOKS.map((b) => (
                  <ReadingItem key={b.title} {...b} />
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card>
              <Headline as="h3" size="card">آنلاین بخوانید</Headline>
              <ul className="flex flex-col gap-5">
                {ONLINE_LINKS.map((link) => (
                  <li key={link.href} className="border-s-2 border-v3-light/40 ps-4">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-v3-bone underline decoration-v3-line underline-offset-8 transition-colors hover:text-v3-light hover:decoration-v3-light"
                    >
                      {link.ltr ? <bdi dir="ltr">{link.title}</bdi> : link.title}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    </a>
                    <p className="mt-1 text-sm leading-relaxed text-v3-mute rtl:leading-loose">{link.note}</p>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-dashed border-v3-line p-7 md:p-8">
            <Headline as="h3" size="card">خواندنی‌های جانبی</Headline>
            <p className="text-sm text-v3-mute">
              مستقیم درباره مشروطه نیستند، اما زمینه تاریخی گفت‌وگوهای ما را کامل می‌کنند.
            </p>
            <ul className="grid gap-5 md:grid-cols-2">
              {SIDE_READINGS.map((b) => (
                <ReadingItem key={b.title} {...b} />
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* ── Epigraph ───────────────────────────────────────────────── */}
      <Section bordered={false}>
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <blockquote className="font-v3-display text-3xl font-light leading-snug text-v3-bone md:text-4xl rtl:leading-relaxed">
            «هر کس باید بداند که حق چیست و <em className="text-v3-light not-italic">قانون</em> کدام است.»
          </blockquote>
          <p className="text-sm text-v3-mute">— از روزنامه‌های عصر مشروطه</p>
        </Reveal>
      </Section>
    </V3Page>
  )
}
