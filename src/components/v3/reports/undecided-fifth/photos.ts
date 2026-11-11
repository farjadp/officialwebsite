// ============================================================================
// File Path: src/components/v3/reports/undecided-fifth/photos.ts
// Why: The photographs in report 08, each with the credit its licence asks
//      for. All from Wikimedia Commons; licences were read from each file's
//      own extmetadata. The CC BY-SA one was cropped and re-encoded to WebP,
//      which the licence counts as a change, so the credit says so.
// ============================================================================

import type { ReportPhoto } from "../photo"

const DIR = "/images/reports/undecided-fifth"

export const PHOTOS = {
  hero: {
    src: `${DIR}/capitol.webp`,
    width: 2000,
    height: 762,
    alt: { en: "The west front of the United States Capitol under a blue sky", fa: "نمای غربی ساختمان کنگره‌ی آمریکا زیر آسمان آبی" },
    caption: {
      en: "The U.S. Capitol, west front. All 435 House seats were on the ballot on November 3, 2026.",
      fa: "ساختمان کنگره‌ی آمریکا، نمای غربی. هر ۴۳۵ کرسی مجلس نمایندگان در ۳ نوامبر ۲۰۲۶ به رأی گذاشته شد.",
    },
    credit: "Architect of the Capitol",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:United_States_Capitol_-_west_front.jpg",
  },
  stickers: {
    src: `${DIR}/i-voted.webp`,
    width: 1200,
    height: 1200,
    alt: { en: "A scattered pile of red I Voted stickers", fa: "انبوهی از برچسب‌های قرمز «رأی دادم» که روی هم ریخته‌اند" },
    caption: {
      en: "“I Voted” stickers at a polling station in Saint Paul, Minnesota. A registered voter and a voter are not the same person.",
      fa: "برچسب‌های «رأی دادم» در یک حوزه‌ی رأی‌گیری در سنت‌پل، مینه‌سوتا. رأی‌دهنده‌ی ثبت‌نام‌شده و رأی‌دهنده یک نفر نیستند.",
    },
    credit: "Funknendai",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pile_of_%22I_Voted%22_stickers.jpg",
  },
  line: {
    src: `${DIR}/early-voters.webp`,
    width: 1176,
    height: 882,
    alt: { en: "Early voters seated in a row inside a polling place, waiting their turn", fa: "رأی‌دهندگان زودهنگام که در یک ردیف داخل حوزه‌ی رأی‌گیری نشسته‌اند و منتظر نوبت‌اند" },
    caption: {
      en: "Early voters waiting their turn in Plantation, Florida. Turnout, not preference, decides who is in this room.",
      fa: "رأی‌دهندگان زودهنگام در پلنتیشن فلوریدا، منتظر نوبت. چه کسی در این اتاق باشد را مشارکت تعیین می‌کند، نه ترجیح.",
    },
    credit: "Alex Johnson (cropped)",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Early_voters_seated_inside_the_polling_place_waiting_(2965035649).jpg",
  },
} satisfies Record<string, ReportPhoto>
