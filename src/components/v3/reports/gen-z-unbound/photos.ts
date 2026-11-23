// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/photos.ts
// Why: The hero photograph of each part of the Gen Z series, with the credit
//      its licence asks for. All three are from Wikimedia Commons; licences
//      read from each file's own extmetadata. Cropped to 21:8 and re-encoded
//      to WebP, which CC BY-SA counts as a change, so the credits say so.
// ============================================================================

import type { ReportPhoto } from "../photo"

const DIR = "/images/reports/gen-z-unbound"

export const PHOTOS = {
  part1: {
    src: `${DIR}/part1-crowd.webp`,
    width: 2000,
    height: 762,
    alt: {
      en: "First-year students in a tiered university lecture hall in Lyon, bent over their desks writing an exam",
      fa: "دانشجوهای سال اول در آمفی‌تئاتر پلکانی یک دانشگاه در لیون، خم‌شده روی میزها و در حال نوشتن امتحان",
    },
    caption: {
      en: "An exam hall in Lyon. Each student writes their own answer, the way young voters now pick their views one issue at a time.",
      fa: "سالن امتحان در لیون. هر دانشجو پاسخ خودش را می‌نویسد، همان‌طور که رأی‌دهنده‌های جوان حالا نظرشان را مسئله به مسئله انتخاب می‌کنند.",
    },
    credit: "Noé (cropped)",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Amphith%C3%A9%C3%A2tre_pendant_des_examens_universitaires.jpg",
  },
  part2: {
    src: `${DIR}/part2-concert.webp`,
    width: 2000,
    height: 762,
    alt: {
      en: "Wembley Stadium packed for a Harry Styles concert, the lit stage at the far end and tens of thousands of fans in the stands and on the pitch",
      fa: "ورزشگاه ومبلی پر از تماشاگر در کنسرت هری استایلز؛ صحنهٔ روشن در انتهای ورزشگاه و ده‌ها هزار نفر روی سکوها و زمین",
    },
    caption: {
      en: "Wembley, June 2022. The same songs fill arenas in all four countries, sung word for word by the same generation.",
      fa: "ومبلی، ژوئن ۲۰۲۲. همین ترانه‌ها سالن‌های هر چهار کشور را پر می‌کنند و یک نسل همه را کلمه به کلمه با هم می‌خواند.",
    },
    credit: "Myrtoulina (cropped)",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Audience_for_Harry_Styles_-_Wembley_Stadium,_Love_on_Tour_2022.jpg",
  },
  part3: {
    src: `${DIR}/part3-broadcast.webp`,
    width: 2000,
    height: 762,
    alt: {
      en: "Walter Cronkite at the CBS News anchor desk, photographed off a television screen in 1976",
      fa: "والتر کرانکایت پشت میز گویندهٔ خبر سی‌بی‌اس، عکسی که در سال ۱۹۷۶ از صفحهٔ تلویزیون گرفته شده",
    },
    caption: {
      en: "Walter Cronkite on CBS, 1976. One trusted face once told a whole country the news; that room has since emptied out.",
      fa: "والتر کرانکایت روی آنتن سی‌بی‌اس، ۱۹۷۶. روزی یک چهرهٔ مورد اعتماد خبر را به کل یک کشور می‌گفت؛ آن مجلس حالا خالی شده است.",
    },
    credit: "Thomas J. O'Halloran, U.S. News & World Report (cropped)",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Walter_Cronkite_on_television_1976.jpg",
  },
} satisfies Record<string, ReportPhoto>
