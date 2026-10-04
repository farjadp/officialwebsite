// ============================================================================
// File Path: src/components/v3/reports/direct-to-cell/photos.ts
// Why: The photographs in report 03, each with the credit its licence asks
//      for. All from Wikimedia Commons; licences were read from each file's
//      own metadata. The CC BY-SA and CC BY images were resized and
//      re-encoded to WebP, which the licences count as a change, so their
//      credit says so.
// ============================================================================

import type { ReportPhoto } from "../photo"

const DIR = "/images/reports/direct-to-cell"
const CC0 = { license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" }

export const PHOTOS = {
  hero: {
    src: `${DIR}/starlink-train.webp`,
    width: 1800,
    height: 1363,
    alt: {
      en: "A line of Starlink satellites crossing the night sky above the town hall in Tübingen, Germany",
      fa: "صفی از ماهواره‌های استارلینک در آسمان شب، بالای ساختمان شهرداری توبینگن در آلمان",
    },
    caption: {
      en: "A train of Starlink satellites over Tübingen, Germany. They pass over every country; the service does not.",
      fa: "قطاری از ماهواره‌های استارلینک بر فراز توبینگن آلمان. از بالای همه‌ی کشورها عبور می‌کنند؛ سرویس نه.",
    },
    credit: "Dktue",
    ...CC0,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Starlink_%C3%BCber_dem_Rathaus_in_T%C3%BCbingen.jpg",
  },
  tehran: {
    src: `${DIR}/tehran.webp`,
    width: 1280,
    height: 1280,
    alt: {
      en: "Tehran at night under a long-exposure sky of star trails, with the Milad Tower on the skyline",
      fa: "تهران در شب زیر آسمانی با رد ستاره‌ها در عکاسی نوردهی طولانی، با برج میلاد در افق",
    },
    caption: {
      en: "Tehran at night, under a sky the satellites cross every few minutes.",
      fa: "تهران در شب، زیر آسمانی که ماهواره‌ها هر چند دقیقه از آن عبور می‌کنند.",
    },
    credit: "رضاصاد (resized)",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tehran_Star_Trail.jpg",
  },
  tower: {
    src: `${DIR}/tower.webp`,
    width: 1800,
    height: 1350,
    alt: { en: "A lattice mobile-phone mast seen from above, in a field", fa: "دکل مشبک تلفن همراه از بالا، در یک مزرعه" },
    caption: {
      en: "What your phone was built to reach: a mast a few hundred metres or a few kilometres away — not a satellite 360 km up.",
      fa: "چیزی که گوشی شما برای رسیدن به آن ساخته شده: دکلی چندصد متر یا چند کیلومتر آن‌طرف‌تر؛ نه ماهواره‌ای در ۳۶۰ کیلومتری.",
    },
    credit: "Wikideas1",
    ...CC0,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lattice_cell_tower-2.jpg",
  },
  launch: {
    src: `${DIR}/launch.webp`,
    width: 1202,
    height: 1800,
    alt: { en: "A Falcon 9 rocket lifting off with a batch of Starlink satellites", fa: "پرتاب موشک فالکون ۹ با دسته‌ای از ماهواره‌های استارلینک" },
    caption: {
      en: "A Starlink launch from Vandenberg, May 2022. The second generation of Direct to Cell satellites is meant to fly on Starship.",
      fa: "پرتاب استارلینک از واندنبرگ، مه ۲۰۲۲. نسل دوم ماهواره‌های Direct to Cell قرار است با Starship پرتاب شود.",
    },
    credit: "U.S. Space Force photo by Michael Peterson",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Starlink_Mission_Launches_from_Vandenberg_(220513-F-IN231-1001).jpg",
  },
  kazakhstan: {
    src: `${DIR}/kazakhstan.webp`,
    width: 1800,
    height: 1350,
    alt: { en: "An empty road through the steppe in Zhambyl Province, Kazakhstan", fa: "جاده‌ای خالی در استپ استان ژامبیل قزاقستان" },
    caption: {
      en: "The steppe in Zhambyl Province: the kind of place the service is for — beyond the reach of masts.",
      fa: "استپ استان ژامبیل: همان جایی که این سرویس برایش ساخته شده؛ بیرون از برد دکل‌ها.",
    },
    credit: "Radosław Botev (resized)",
    license: "CC BY 3.0 PL",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/pl/deed.en",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kazakhstan_steppe_Zhambyl_Province_(1).jpg",
  },
} satisfies Record<string, ReportPhoto>
