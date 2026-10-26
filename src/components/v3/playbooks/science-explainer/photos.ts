// ============================================================================
// File Path: src/components/v3/playbooks/science-explainer/photos.ts
// Why: The photographs in playbook 02: the real Sun, Earth, night side,
//      Jupiter, the terminator, an aurora and an astronaut, set beside the
//      drawn versions. All NASA, all public domain, licences read from each
//      Wikimedia Commons file's own metadata on 2026-10-26.
// ============================================================================

import type { ReportPhoto } from "@/components/v3/reports/photo"

const DIR = "/images/playbooks/science-explainer"
const PD = "Public domain"

export const PHOTOS: Record<"astronaut" | "sun" | "earth" | "night" | "jupiter" | "terminator" | "aurora", ReportPhoto> = {
  astronaut: {
    src: `${DIR}/astronaut.webp`,
    width: 1600,
    height: 1600,
    alt: {
      en: "Bruce McCandless floating untethered in a white spacesuit above the blue Earth, 1984",
      fa: "بروس مک‌کندلس با لباس سفید فضایی، بدون طناب، بالای زمین آبی، ۱۹۸۴",
    },
    caption: {
      en: "Bruce McCandless, the first untethered spacewalk, 1984. The real astronaut; the one in the video is drawn from rounded rectangles.",
      fa: "بروس مک‌کندلس در اولین راهپیمایی فضایی بدون طناب، ۱۹۸۴. فضانورد واقعی؛ فضانورد ویدیو از چند مستطیل گرد کشیده می‌شود.",
    },
    credit: "NASA",
    license: PD,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bruce_McCandless_II_during_EVA_in_1984.jpg",
  },
  sun: {
    src: `${DIR}/sun.webp`,
    width: 1400,
    height: 1298,
    alt: { en: "The Sun in extreme ultraviolet, glowing orange with bright active regions", fa: "خورشید در نور فرابنفش دور، نارنجی با نواحی فعال روشن" },
    caption: { en: "The Sun at 304 Å, NASA's Solar Dynamics Observatory.", fa: "خورشید در طول موج ۳۰۴ آنگستروم، رصدخانه‌ی SDO ناسا." },
    credit: "NASA/SDO (AIA)",
    license: PD,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
  },
  earth: {
    src: `${DIR}/earth.webp`,
    width: 1400,
    height: 1401,
    alt: { en: "The Blue Marble: the whole Earth seen from Apollo 17, Africa and Antarctica visible", fa: "تیله‌ی آبی: کل زمین از آپولو ۱۷، با آفریقا و جنوبگان" },
    caption: { en: "The Blue Marble, Apollo 17, 1972.", fa: "تیله‌ی آبی، آپولو ۱۷، ۱۹۷۲." },
    credit: "NASA/Apollo 17 crew",
    license: PD,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Earth_seen_from_Apollo_17.jpg",
  },
  night: {
    src: `${DIR}/night.webp`,
    width: 1400,
    height: 1396,
    alt: { en: "The Americas at night: city lights as gold dots on a dark globe", fa: "قاره‌ی آمریکا در شب: چراغ شهرها مثل نقطه‌های طلایی روی کره‌ای تاریک" },
    caption: { en: "The Americas at night, NASA's Black Marble. The ~380 city lights in the prompt are a cartoon of this.", fa: "قاره‌ی آمریکا در شب، Black Marble ناسا. حدود ۳۸۰ چراغ شهر در پرامپت، کاریکاتوری از همین تصویر است." },
    credit: "NASA Earth Observatory",
    license: PD,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Black_Marble_Americas.jpg",
  },
  jupiter: {
    src: `${DIR}/jupiter.webp`,
    width: 1400,
    height: 1415,
    alt: { en: "Jupiter with its cream and rust bands and the Great Red Spot", fa: "مشتری با نوارهای کرم و زنگاری و لکه‌ی سرخ بزرگ" },
    caption: { en: "Jupiter, Hubble, June 2019: still lit for 67–87 minutes after our sky goes dark.", fa: "مشتری، هابل، ژوئن ۲۰۱۹: تا ۶۷ تا ۸۷ دقیقه بعد از تاریک شدن آسمان ما هنوز روشن است." },
    credit: "NASA, ESA, and A. Simon (NASA Goddard)",
    license: PD,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jupiter,_image_taken_by_NASA%27s_Hubble_Space_Telescope,_June_2019.png",
  },
  terminator: {
    src: `${DIR}/terminator.webp`,
    width: 1600,
    height: 1062,
    alt: { en: "Sunlit clouds fading into night along Earth's day–night line, seen from orbit", fa: "ابرهای آفتاب‌خورده که در امتداد مرز روز و شب زمین در تاریکی محو می‌شوند، از مدار" },
    caption: { en: "The terminator from the ISS. The coral band in the prompt is this line, drawn.", fa: "مرز روز و شب از ایستگاه فضایی. نوار مرجانی پرامپت، کشیده‌شده‌ی همین خط است." },
    credit: "ISS Crew, Earth Sciences and Image Analysis Lab, JSC, NASA",
    license: PD,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Earthterminator_iss002_full.jpg",
  },
  aurora: {
    src: `${DIR}/aurora.webp`,
    width: 1600,
    height: 1065,
    alt: { en: "A green and red aurora over Antarctica seen from the International Space Station", fa: "شفق قطبی سبز و قرمز بالای جنوبگان از ایستگاه فضایی بین‌المللی" },
    caption: { en: "Aurora australis from the ISS, Expedition 52.", fa: "شفق جنوبی از ایستگاه فضایی، مأموریت ۵۲." },
    credit: "NASA/Jack Fischer",
    license: PD,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:ISS-52_Aurora_australis_above_Antarctica.jpg",
  },
}
