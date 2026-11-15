// ============================================================================
// File Path: src/components/v3/reports/language-energy/photos.ts
// Why: The photographs in report 09, each with the credit its licence asks
//      for. All from Wikimedia Commons; licences were read from each file's
//      own extmetadata. The CC BY one was cropped and re-encoded to WebP,
//      which the licence counts as a change, so the credit says so.
// ============================================================================

import type { ReportPhoto } from "../photo"

const DIR = "/images/reports/language-energy"

export const PHOTOS = {
  hero: {
    src: `${DIR}/server-racks.webp`,
    width: 2000,
    height: 762,
    alt: { en: "Rows of black server racks in a data centre with a raised perforated floor", fa: "ردیف‌های قفسه‌ی سرور سیاه در یک مرکز داده با کف مشبک" },
    caption: {
      en: "A data centre. Every answer a language model gives is drawn from racks like these, and the paper measured the electricity per answer, language by language.",
      fa: "یک مرکز داده. هر جوابی که یک مدل زبانی می‌دهد از قفسه‌هایی مثل این‌ها بیرون می‌آید، و مقاله برق هر جواب را زبان به زبان اندازه گرفته است.",
    },
    credit: "Carl Lender (cropped)",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Datacenter_Server_Racks_(22370909788).jpg",
  },
  nastaliq: {
    src: `${DIR}/nastaliq.webp`,
    width: 1200,
    height: 1200,
    alt: { en: "A page of Persian poetry in nasta'liq calligraphy inside decorated borders", fa: "صفحه‌ای از شعر فارسی به خط نستعلیق در میان حاشیه‌های تذهیب‌شده" },
    caption: {
      en: "Persian verses in nasta'liq by Shah Mahmud Nishapuri, 16th century. The script is old; how a tokenizer cuts it is a much newer question.",
      fa: "بیت‌های فارسی به خط نستعلیق شاه‌محمود نیشابوری، سده‌ی شانزدهم میلادی. خط کهن است؛ این‌که توکنایزر چطور آن را خرد می‌کند پرسشی بسیار تازه‌تر است.",
    },
    credit: "Shah Mahmud Nishapuri",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Various_verses_of_poetry._Calligraphy_by_Shah_Mahmud_Nishapuri.jpg",
  },
  sign: {
    src: `${DIR}/multilingual-sign.webp`,
    width: 1200,
    height: 900,
    alt: { en: "Three metal plaques on a building wall giving the same town-hall name in Romanian, Hungarian and German", fa: "سه تابلوی فلزی روی دیوار یک ساختمان که نام شهرداری را به رومانیایی، مجاری و آلمانی می‌گویند" },
    caption: {
      en: "One sign, three languages, in Carei, Romania. Same meaning, different lengths: the starting point of the token gap.",
      fa: "یک تابلو، سه زبان، در کارِی رومانی. یک معنا با طول‌های متفاوت؛ نقطه‌ی شروعِ شکاف توکن.",
    },
    credit: "Mieresch",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Multilingual_signs_in_Carei,_Romania.jpg",
  },
} satisfies Record<string, ReportPhoto>
