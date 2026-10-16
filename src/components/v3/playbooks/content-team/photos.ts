// ============================================================================
// File Path: src/components/v3/playbooks/content-team/photos.ts
// Why: The photographs in playbook 01: one for the hero, one per stage and
//      one for the camera moves, each the craft the stage replaces or
//      borrows from. All from Wikimedia Commons, licences read from each
//      file's own metadata on 2026-10-15. Resized and re-encoded to WebP,
//      which CC licences count as a change, so those credits say so.
// ============================================================================

import type { ReportPhoto } from "@/components/v3/reports/photo"
import type { StageId } from "./data"

const DIR = "/images/playbooks/content-team"
const BY_SA_2 = "https://creativecommons.org/licenses/by-sa/2.0/"
const BY_SA_3 = "https://creativecommons.org/licenses/by-sa/3.0/"
const BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0/"
const BY_4 = "https://creativecommons.org/licenses/by/4.0/"

export const HERO: ReportPhoto = {
  src: `${DIR}/newsroom-1942.webp`,
  width: 1400,
  height: 1517,
  alt: {
    en: "Two copyreaders in shirtsleeves editing at the foreign desk of the New York Times newsroom, 1942",
    fa: "دو ویراستار با پیراهن آستین‌کوتاه پشت میز خبر خارجی تحریریه‌ی نیویورک تایمز، ۱۹۴۲",
  },
  caption: {
    en: "The New York Times newsroom, 1942: copyreaders at the foreign desk. Work that took a room of people now starts in one terminal. The last call still belongs to a person.",
    fa: "تحریریه‌ی نیویورک تایمز، ۱۹۴۲: ویراستارهای میز خبر خارجی. کاری که یک اتاق آدم انجام می‌داد، حالا از یک ترمینال شروع می‌شود. تصمیم آخر هنوز با یک آدم است.",
  },
  credit: "Marjory Collins / Library of Congress (cropped)",
  license: "Public domain",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Newsroom_of_the_New_York_Times_newspaper._8d22684v.jpg",
}

export const STAGE_PHOTOS: Record<StageId, ReportPhoto> = {
  topic: {
    src: `${DIR}/newsstand.webp`,
    width: 1100,
    height: 1650,
    alt: {
      en: "Men in suits leaning over a long table of newspapers and magazines at a street stand in Erbil",
      fa: "مردانی با کت‌وشلوار که روی میز بلند روزنامه‌ها و مجله‌ها در یک دکه‌ی خیابانی در اربیل خم شده‌اند",
    },
    caption: {
      en: "A newspaper stand in Erbil, Iraq. Before writing anything, see what people actually pick up and read.",
      fa: "روزنامه‌فروشی در اربیل، عراق. پیش از نوشتن، ببین مردم واقعاً چه چیزی را برمی‌دارند و می‌خوانند.",
    },
    credit: "Adam Jones, Ph.D. (resized)",
    license: "CC BY-SA 3.0",
    licenseUrl: BY_SA_3,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Browsing_at_a_Newspaper_Stand_-_Erbil_-_Iraq.jpg",
  },
  write: {
    src: `${DIR}/typewriter.webp`,
    width: 1400,
    height: 1050,
    alt: { en: "The keyboard of a vintage Adler electric typewriter", fa: "صفحه‌کلید یک ماشین تحریر برقی قدیمی Adler" },
    caption: {
      en: "An Adler typewriter. The tools changed; editing still mostly means cutting.",
      fa: "ماشین تحریر Adler. ابزار عوض شده، ولی ویرایش هنوز بیشتر یعنی کوتاه کردن.",
    },
    credit: "Maksym Kozlenko (resized)",
    license: "CC BY-SA 4.0",
    licenseUrl: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Adler_Typewriter_Keyboard_Close-up.jpg",
  },
  image: {
    src: `${DIR}/contact-sheet.webp`,
    width: 1134,
    height: 755,
    alt: {
      en: "A black-and-white 35mm contact sheet of motorcycle racing, with frames marked in blue pencil",
      fa: "کانتکت شیت سیاه‌وسفید فیلم ۳۵ میلی‌متری از مسابقه‌ی موتورسواری، با قاب‌هایی که با مداد آبی علامت خورده‌اند",
    },
    caption: {
      en: "A 35mm contact sheet with the picks marked in pencil. A model makes dozens of frames; choosing one is still your job.",
      fa: "کانتکت شیت فیلم ۳۵ میلی‌متری با انتخاب‌هایی که با مداد علامت خورده‌اند. مدل ده‌ها تصویر می‌سازد؛ انتخاب یکی‌شان هنوز کار توست.",
    },
    credit: "Si Griffiths (resized)",
    license: "CC BY-SA 3.0",
    licenseUrl: BY_SA_3,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:B%26W_35mm_Film_Contact_Sheet._Surrey_UK.jpg",
  },
  video: {
    src: `${DIR}/cinema-camera.webp`,
    width: 1600,
    height: 1067,
    alt: {
      en: "A camera operator looking through the eyepiece of a cinema camera rigged with a matte box",
      fa: "فیلم‌بردار در حال نگاه از چشمی یک دوربین سینمایی با مت‌باکس",
    },
    caption: {
      en: "Saverio Guarna behind the camera on the set of the Italian series Tutti pazzi per amore. HyperFrames builds this kind of shot in code; video-use edits the footage you shot yourself.",
      fa: "ساوریو گوارنا پشت دوربین، سر صحنه‌ی سریال ایتالیایی Tutti pazzi per amore. HyperFrames این جنس تصویر را با کد می‌سازد؛ video-use فیلمی را که خودت گرفته‌ای تدوین می‌کند.",
    },
    credit: "Saverio Guarna (resized)",
    license: "CC BY-SA 4.0",
    licenseUrl: BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Saverio_Guarna_in_camera..jpg",
  },
  voice: {
    src: `${DIR}/microphone.webp`,
    width: 1600,
    height: 1067,
    alt: { en: "A Neumann U87 condenser microphone in its cradle in a recording studio", fa: "میکروفون کندانسور Neumann U87 روی پایه‌اش در یک استودیوی ضبط" },
    caption: {
      en: "A Neumann U87 at In Your Ear Studios, Richmond. Test 30 seconds before you generate a whole voice-over.",
      fa: "میکروفون Neumann U87 در استودیوی In Your Ear، ریچموند. قبل از ساختن کل گویندگی، ۳۰ ثانیه آزمایش کن.",
    },
    credit: "Will Fisher (resized)",
    license: "CC BY-SA 2.0",
    licenseUrl: BY_SA_2,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Neumann_U87_Condenser_Microphone_-_Studio_A,_In_Your_Ear_Studios.jpg",
  },
  publish: {
    src: `${DIR}/press.webp`,
    width: 1600,
    height: 1027,
    alt: { en: "An engraving of a double-octuple newspaper printing press", fa: "حکاکی یک ماشین چاپ روزنامه‌ی بزرگ از نوع Double Octuple" },
    caption: {
      en: "A double-octuple newspaper press, from Webster's New Illustrated Dictionary. Once the press runs, a mistake can't be taken back, so the publish button stays yours.",
      fa: "ماشین چاپ روزنامه، از فرهنگ مصور وبستر. وقتی چاپ شروع شد، اشتباه پس‌گرفتنی نیست؛ برای همین دکمه‌ی انتشار دست خودت می‌ماند.",
    },
    credit: "Webster's New Illustrated Dictionary, scan by Sue Clark",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Double_Octuple_Newspaper_Press.jpg",
  },
}

export const CAMERA: ReportPhoto = {
  src: `${DIR}/camera-crane.webp`,
  width: 1600,
  height: 1067,
  alt: {
    en: "A film crew raising a tall camera crane on a city street lined with stone buildings",
    fa: "گروه فیلم‌برداری در حال بالا بردن یک کرین بلند دوربین در خیابانی با ساختمان‌های سنگی",
  },
  caption: {
    en: "Raising a camera crane on Broad Street, Bristol, during Doctor Who filming in June 2022. \"Crane up\" in a prompt asks for exactly this move.",
    fa: "بالا بردن کرین دوربین در خیابان براد، بریستول، هنگام فیلم‌برداری Doctor Who در ژوئن ۲۰۲۲. «کرین» در پرامپت دقیقاً همین حرکت را می‌خواهد.",
  },
  credit: "Captain Galaxy (resized)",
  license: "CC BY 4.0",
  licenseUrl: BY_4,
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Doctor_Who_The_Giggle_June_2022_filming_-_Raising_Camera_Crane_on_Broad_Street.jpg",
}
