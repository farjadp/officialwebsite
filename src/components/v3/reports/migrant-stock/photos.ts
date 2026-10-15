// ============================================================================
// File Path: src/components/v3/reports/migrant-stock/photos.ts
// Why: The photographs in report 05, each with the credit its licence asks
//      for. All from Wikimedia Commons; licences were read from each file's
//      own extmetadata. The CC BY-SA ones were resized and re-encoded to WebP,
//      which the licence counts as a change, so the credit says so.
// ============================================================================

import type { ReportPhoto } from "../photo"

const DIR = "/images/reports/migrant-stock"

export const PHOTOS = {
  hero: {
    src: `${DIR}/ellis-island.webp`,
    width: 1536,
    height: 1180,
    alt: {
      en: "Women and men waiting behind railings in the immigration hall at Ellis Island, early twentieth century",
      fa: "زنان و مردانی پشت نرده‌های سالن مهاجرت جزیره‌ی الیس، اوایل قرن بیستم",
    },
    caption: {
      en: "Ellis Island, New York, in the 1900s. The United States is still the largest destination: 52.4 million migrants in 2024.",
      fa: "جزیره‌ی الیس، نیویورک، دهه‌ی ۱۹۰۰. آمریکا هنوز بزرگ‌ترین مقصد است: ۵۲٫۴ میلیون مهاجر در ۲۰۲۴.",
    },
    credit: "George Grantham Bain Collection, Library of Congress",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Immigrants_-_Ellis_Island_LCCN2001704437.jpg",
  },
  gulf: {
    src: `${DIR}/dubai-workers.webp`,
    width: 1229,
    height: 848,
    alt: {
      en: "Two construction workers in blue overalls and hard hats in front of the Burj Khalifa while it was being built",
      fa: "دو کارگر ساختمانی با لباس کار آبی و کلاه ایمنی، جلوی برج خلیفه در زمان ساخت",
    },
    caption: {
      en: "Dubai, 2008. In the UAE 74% of residents are migrants, and two in three of them are men.",
      fa: "دبی، ۲۰۰۸. در امارات ۷۴ درصد ساکنان مهاجرند و از هر سه نفرشان دو نفر مرد.",
    },
    credit: "Imre Solt (resized)",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Burj_Dubai_Construction_Workers_on_25_January_2008_Pict_2.jpg",
  },
  helpers: {
    src: `${DIR}/hong-kong-helpers.webp`,
    width: 1600,
    height: 1200,
    alt: {
      en: "Hundreds of foreign domestic workers sitting together on their day off under the HSBC building in Central, Hong Kong",
      fa: "صدها کارگر خانگی خارجی که روز تعطیل زیر ساختمان HSBC در محله‌ی سنترال هنگ‌کنگ کنار هم نشسته‌اند",
    },
    caption: {
      en: "Central, Hong Kong, on a Sunday. Domestic workers make Hong Kong one of the most female migrant populations: 62.6% women.",
      fa: "سنترال هنگ‌کنگ، یک یکشنبه. کار خانگی، هنگ‌کنگ را به یکی از زنانه‌ترین جمعیت‌های مهاجر تبدیل کرده: ۶۲٫۶ درصد زن.",
    },
    credit: "Mk2010 (resized)",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Foreign_domestic_helpers_(Hong_Kong).jpg",
  },
  canada: {
    src: `${DIR}/pearson-arrivals.webp`,
    width: 1600,
    height: 1200,
    alt: {
      en: "The international arrivals hall of Terminal 1 at Toronto Pearson airport, with a 'Welcome to Canada' sign",
      fa: "سالن ورودی پروازهای خارجی ترمینال ۱ فرودگاه پیرسون تورنتو، با تابلوی «به کانادا خوش آمدید»",
    },
    caption: {
      en: "Toronto Pearson, international arrivals. Canada's migrant population doubled between 1990 and 2024.",
      fa: "پیرسون تورنتو، سالن ورودی پروازهای خارجی. جمعیت مهاجر کانادا از ۱۹۹۰ تا ۲۰۲۴ دو برابر شد.",
    },
    credit: "OhanaUnited (resized)",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:YYZ_Terminal_1_international_arrival_hall.jpg",
  },
} satisfies Record<string, ReportPhoto>
