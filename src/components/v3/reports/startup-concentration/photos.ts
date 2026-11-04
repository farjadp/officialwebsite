// ============================================================================
// File Path: src/components/v3/reports/startup-concentration/photos.ts
// Why: The photographs in report 07, each with the credit its licence asks
//      for. All from Wikimedia Commons; licences were read from each file's
//      own extmetadata. The CC BY / BY-SA ones were resized and re-encoded to
//      WebP, which the licence counts as a change, so the credit says so.
// ============================================================================

import type { ReportPhoto } from "../photo"

const DIR = "/images/reports/startup-concentration"

export const PHOTOS = {
  hero: {
    src: `${DIR}/san-francisco.webp`,
    width: 2000,
    height: 750,
    alt: { en: "San Francisco's Financial District at dusk seen from Pier 7, with the Bay Bridge on the left", fa: "محله‌ی مالی سان‌فرانسیسکو هنگام غروب از اسکله‌ی ۷، با پل بی در سمت چپ" },
    caption: {
      en: "San Francisco from Pier 7. The Bay Area is StartupBlink's #1 city, and Silicon Valley is Startup Genome's #1 ecosystem.",
      fa: "سان‌فرانسیسکو از اسکله‌ی ۷. منطقه‌ی خلیج رتبه‌ی اول شهرهای استارتاپ‌بلینک است و سیلیکون‌ولی رتبه‌ی اول اکوسیستم‌های استارتاپ ژنوم.",
    },
    credit: "King of Hearts (resized)",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:San_Francisco_from_Pier_7_September_2013_panorama_edit.jpg",
  },
  sandHill: {
    src: `${DIR}/sand-hill-road.webp`,
    width: 1400,
    height: 1050,
    alt: { en: "A freeway sign reading Sand Hill Rd, 1 mile", fa: "تابلوی بزرگراه با نوشته‌ی Sand Hill Rd، یک مایل" },
    caption: {
      en: "Sand Hill Road, Menlo Park: the street of venture capital. Most new late-stage money in 2025 still ended up within reach of it.",
      fa: "سند هیل رود در منلو پارک؛ خیابان سرمایه‌گذاری خطرپذیر. بیشتر پول تازه‌ی مرحله‌ی رشد در ۲۰۲۵ باز هم به همین حوالی رسید.",
    },
    credit: "Aaron Parecki (resized)",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sand_Hill_Road_-_1_Mile.jpg",
  },
  singapore: {
    src: `${DIR}/singapore.webp`,
    width: 1600,
    height: 1067,
    alt: { en: "Singapore's Central Business District and Marina Bay at dusk", fa: "مرکز تجاری سنگاپور و خلیج مارینا هنگام غروب" },
    caption: {
      en: "Singapore, 4th in the world: it grew faster than the US and still fell further behind in absolute terms.",
      fa: "سنگاپور، رتبه‌ی چهارم جهان: سریع‌تر از آمریکا رشد کرد و باز به‌طور مطلق عقب‌تر افتاد.",
    },
    credit: "Basile Morin (resized)",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Skylines_of_the_Central_Business_District,_Singapore_at_dusk.jpg",
  },
  riyadh: {
    src: `${DIR}/riyadh.webp`,
    width: 1600,
    height: 1067,
    alt: { en: "Riyadh's skyline at sunset with the Kingdom Tower and the King Abdullah Financial District", fa: "افق ریاض هنگام غروب با برج المملکه و مرکز مالی ملک عبدالله" },
    caption: { en: "Riyadh: up 30 places to 42nd, past Dubai.", fa: "ریاض: ۳۰ پله صعود تا رتبه‌ی ۴۲، جلوتر از دبی." },
    credit: "B.alotaby (resized)",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Riyadh_Skyline_showing_the_King_Abdullah_Financial_District_(KAFD)_and_the_famous_Kingdom_Tower_.jpg",
  },
  wafer: {
    src: `${DIR}/wafer.webp`,
    width: 1400,
    height: 1050,
    alt: { en: "A silicon wafer of chips diffracting light into rainbow colours", fa: "یک ویفر سیلیکونی از تراشه‌ها که نور را به رنگ‌های رنگین‌کمان می‌شکند" },
    caption: { en: "Semiconductor depth is why Taiwan's climb looks structural.", fa: "عمق نیمه‌رسانا دلیل ساختاری بودن صعود تایوان است." },
    credit: "Windell Oskay (resized)",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Wafer_-_2.jpg",
  },
  drone: {
    src: `${DIR}/drone.webp`,
    width: 1400,
    height: 935,
    alt: { en: "A US airman holding a small quadcopter drone overhead before launching it", fa: "یک نظامی آمریکایی که پهپاد کوچک چهارپره‌ای را پیش از پرتاب بالای سرش گرفته" },
    caption: {
      en: "Launching a Skydio X10D, built by a venture-backed US drone company, in a drone-defence exercise. DefenseTech Series A value rose about 60%.",
      fa: "پرتاب یک پهپاد اسکای‌دیو، ساخت یک شرکت پهپادی آمریکایی با پشتوانه‌ی سرمایه‌ی خطرپذیر، در یک رزمایش پدافند پهپادی. ارزش سری A فناوری دفاعی حدود ۶۰٪ بالا رفت.",
    },
    credit: "U.S. Army photo by Pfc. Sydney Shank",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Joint_Forces_Conduct_Drone_Defense_Exercise_(9860055).jpg",
  },
} satisfies Record<string, ReportPhoto>
