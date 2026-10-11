// ============================================================================
// File Path: src/components/v3/reports/imessage-sms/photos.ts
// Why: The photographs in report 04, each with the credit its licence asks
//      for. Both from Wikimedia Commons; licences were read from each file's
//      own metadata. Both are CC BY-SA, resized and re-encoded to WebP, which
//      the licence counts as a change, so the credit says so.
// ============================================================================

import type { ReportPhoto } from "../photo"

const DIR = "/images/reports/imessage-sms"

export const PHOTOS = {
  hero: {
    src: `${DIR}/iphone.webp`,
    width: 1350,
    height: 1800,
    alt: {
      en: "An iPhone 16 Pro Max held in one hand, screen lit",
      fa: "آیفون ۱۶ پرو مکس در یک دست، با صفحه‌ی روشن",
    },
    caption: {
      en: "The text message leaves the phone before the owner has opened Messages at all.",
      fa: "پیامک پیش از آنکه صاحب گوشی اصلاً برنامه‌ی پیام‌ها را باز کند، فرستاده می‌شود.",
    },
    credit: "メイド理世 (resized)",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:IPhone_16_Pro_Max_(54252176424).jpg",
  },
  sim: {
    src: `${DIR}/sim.webp`,
    width: 1800,
    height: 1193,
    alt: {
      en: "A nano-SIM card resting on a fingertip",
      fa: "یک نانوسیم‌کارت روی نوک انگشت",
    },
    caption: {
      en: "The SIM, not the app, is what the operator bills. Every activation attempt is one international SMS on it.",
      fa: "اپراتور سیم‌کارت را حساب می‌کند، نه اپلیکیشن را. هر تلاش برای فعال‌سازی یک پیامک بین‌الملل روی همین سیم‌کارت است.",
    },
    credit: "Subhrajyoti07 (resized)",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Nano_Sim.jpg",
  },
} satisfies Record<string, ReportPhoto>
