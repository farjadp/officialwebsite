// ============================================================================
// File Path: src/components/v3/reports/vienna-1683/photos.ts
// Why: The images in report 06, each with the credit its licence asks for.
//      All from Wikimedia Commons; licences were read from each file's own
//      extmetadata. Paintings and engravings are public domain or CC0; the
//      three modern photographs are CC BY / CC BY-SA and were resized and
//      re-encoded to WebP, which the licence counts as a change.
// ============================================================================

import type { ReportPhoto } from "../photo"

const DIR = "/images/reports/vienna-1683"

export const PHOTOS = {
  hero: {
    src: `${DIR}/geffels-siege.webp`,
    width: 1920,
    height: 1271,
    alt: {
      en: "Painting of the siege of Vienna: the walled city in the plain, the Ottoman camp and tents in front, and the wooded hills of the Kahlenberg on the left",
      fa: "نقاشی محاصره‌ی وین: شهر حصاردار در دشت، اردو و چادرهای عثمانی در جلو، و تپه‌های جنگلی کالنبرگ در سمت چپ",
    },
    caption: {
      en: "Frans Geffels, painted within a decade of the siege. Look at the hills on the left: that is where the relief army came from.",
      fa: "فرانس گفلز، کمتر از ده سال پس از محاصره. به تپه‌های سمت چپ نگاه کنید: ارتش امدادی از همان‌جا آمد.",
    },
    credit: "Frans Geffels (1683–1694)",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vienna_Battle_1683.jpg",
  },
  battle: {
    src: `${DIR}/brandt-battle.webp`,
    width: 1920,
    height: 815,
    alt: {
      en: "Józef Brandt's panoramic painting of the Battle of Vienna: cavalry clashing in smoke under a wide sky",
      fa: "نقاشی پانورامای یوزف برانت از نبرد وین: سواره‌نظام در دود، زیر آسمانی باز",
    },
    caption: {
      en: "Józef Brandt, Battle of Vienna (1863). The charge came in the late afternoon of 12 September.",
      fa: "یوزف برانت، نبرد وین (۱۸۶۳). یورش سواره‌نظام در بعدازظهر ۱۲ سپتامبر انجام شد.",
    },
    credit: "Józef Brandt (1863)",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Battle_of_Vienna_(1683)_by_J%C3%B3zef_Brandt.PNG",
  },
  karaMustafa: {
    src: `${DIR}/kara-mustafa.webp`,
    width: 900,
    height: 1194,
    alt: { en: "Engraved portrait of Grand Vizier Kara Mustafa Pasha in a turban", fa: "پرتره‌ی حکاکی‌شده‌ی صدراعظم قره مصطفی پاشا با دستار" },
    caption: { en: "Kara Mustafa Pasha, Grand Vizier.", fa: "قره مصطفی پاشا، صدراعظم عثمانی." },
    credit: "Rijksmuseum, RP-P-1894-A-18289",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Portret_van_Kara_Mustafa_Pasha,_RP-P-1894-A-18289.jpg",
  },
  starhemberg: {
    src: `${DIR}/starhemberg.webp`,
    width: 534,
    height: 650,
    alt: { en: "Engraved oval portrait of Count Ernst Rüdiger von Starhemberg in a long wig", fa: "پرتره‌ی بیضی حکاکی‌شده‌ی کنت ارنست رودیگر فون اشتارهمبرگ با کلاه‌گیس بلند" },
    caption: { en: "Ernst Rüdiger von Starhemberg, commander of the city.", fa: "ارنست رودیگر فون اشتارهمبرگ، فرمانده‌ی شهر." },
    credit: "Engraving by J. le Pautre",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Graf_Ernst_Ruediger_von_Starhemberg2.png",
  },
  sobieski: {
    src: `${DIR}/sobieski.webp`,
    width: 900,
    height: 1094,
    alt: { en: "Painted portrait of King John III Sobieski in armour and a leopard skin", fa: "پرتره‌ی نقاشی‌شده‌ی یان سوم سوبیسکی، پادشاه لهستان، با زره و پوست پلنگ" },
    caption: { en: "John III Sobieski, King of Poland, who led the relief.", fa: "یان سوم سوبیسکی، پادشاه لهستان و فرمانده‌ی ارتش امدادی." },
    credit: "Attributed to Jan Tricius, c. 1680",
    license: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jan_Tricius_-_Portrait_of_John_III_Sobieski_(ca._1680)_-_Google_Art_Project.jpg",
  },
  plan: {
    src: `${DIR}/ottoman-plan.webp`,
    width: 1400,
    height: 1400,
    alt: {
      en: "A hand-drawn Ottoman plan of the 1683 siege: the walled city at the centre, ringed by trenches and coloured tents",
      fa: "نقشه‌ی دست‌کشیده‌ی عثمانی از محاصره‌ی ۱۶۸۳: شهر حصاردار در مرکز، در حلقه‌ی سنگرها و چادرهای رنگی",
    },
    caption: {
      en: "The siege as the Ottomans drew it (Wien Museum). The camp rings the city on a long outer line; the defenders hold a short inner one.",
      fa: "محاصره از نگاه خود عثمانی‌ها (موزه‌ی وین). اردو در یک خط بیرونی بلند دور شهر حلقه زده؛ مدافعان یک خط درونی کوتاه دارند.",
    },
    credit: "Wolfgang Sauber (resized)",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:WMK_-_Osmanischer_Plan_Wien_1683_1.jpg",
  },
  armour: {
    src: `${DIR}/hussar-armour.webp`,
    width: 1000,
    height: 1500,
    alt: { en: "A Polish winged hussar's armour and wings on a model horse in a museum", fa: "زره و بال‌های یک سوار هوسار لهستانی روی مدل اسب در موزه" },
    caption: { en: "Winged hussar armour. About 3,000 hussars rode at the centre of the charge.", fa: "زره هوسارهای بالدار. حدود ۳ هزار هوسار در مرکز یورش بودند." },
    credit: "Thomas Quine (resized)",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Polish_winged_armour_(29363797043).jpg",
  },
  heights: {
    src: `${DIR}/kahlenberg-view.webp`,
    width: 1600,
    height: 1200,
    alt: { en: "View from the Kahlenberg over Vienna and the Danube in the distance", fa: "نمای شهر وین و رود دانوب از بالای کالنبرگ" },
    caption: {
      en: "The view from the Kahlenberg today. Whoever holds these heights sees the whole plain, and the Ottomans never fortified them.",
      fa: "نمای امروزِ بالای کالنبرگ. هر کس این ارتفاعات را داشته باشد کل دشت را می‌بیند، و عثمانی‌ها هرگز آن را مستحکم نکردند.",
    },
    credit: "Sharon Hahn Darlin (resized)",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kahlenberg,_Wien_(Vienna),_Austria_%F0%9F%87%A6%F0%9F%87%B9_-_Vista.jpg",
  },
  cannonball: {
    src: `${DIR}/turkish-cannonball.webp`,
    width: 885,
    height: 1095,
    alt: { en: "A stone cannonball set into a niche on a building facade in Vienna's Sterngasse, with a plaque below", fa: "یک گلوله‌ی سنگی توپ در طاقچه‌ای روی نمای ساختمانی در خیابان اشترن‌گاسه‌ی وین، با یک لوح زیر آن" },
    caption: {
      en: "A \"Turkish ball\" still set into a wall in Vienna's Sterngasse. The Ottomans brought mostly light guns: they could hurt the city but not open it quickly.",
      fa: "یک «گلوله‌ی ترک» که هنوز در دیواری در اشترن‌گاسه‌ی وین است. عثمانی‌ها بیشتر توپ سبک آورده بودند: می‌توانستند به شهر آسیب بزنند، اما نمی‌توانستند سریع بازش کنند.",
    },
    credit: "Stefan Ivanovich",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Wien_Sterngasse,_boulet_turc_(2012).jpg",
  },
  kossak: {
    src: `${DIR}/kossak-hussars.webp`,
    width: 1800,
    height: 1234,
    alt: { en: "Wojciech Kossak's painting of Polish hussars riding past King Sobieski, with the Kahlenberg church on the hill behind", fa: "نقاشی وویچخ کوساک از هوسارهای لهستانی در حال گذر از برابر سوبیسکی، با کلیسای کالنبرگ روی تپه در پس‌زمینه" },
    caption: { en: "Wojciech Kossak (1924). The church on the hill is the Kahlenberg.", fa: "وویچخ کوساک (۱۹۲۴). کلیسای روی تپه، کالنبرگ است." },
    credit: "Wojciech Kossak, National Museum in Kraków",
    license: "Public domain",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wojciech_Kossak_-_Polish_Hussars_Parading_in_Front_of_King_John_III_Sobieski_-_MNK_II-b-268_-_National_Museum_Krak%C3%B3w.jpg",
  },
} satisfies Record<string, ReportPhoto>
