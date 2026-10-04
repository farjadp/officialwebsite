// ============================================================================
// File Path: src/components/v3/reports/deep-time-pain/photos.ts
// Why: The photographs in report 02, each with the credit its licence asks
//      for. All come from Wikimedia Commons and are public domain or Creative
//      Commons; licences were read from each file page, not from search
//      snippets. CC BY-SA images were resized and re-encoded to WebP, which
//      the licence counts as a change, so their credit says so.
//
//      Two Commons titles are wrong and the captions here do not repeat them:
//      the Qafzeh 11 cast is labelled "Neandertal" (it is Homo sapiens), and
//      the Jebel Irhoud cast's Flickr title gives an outdated age.
// ============================================================================

import type { ReportPhoto } from "../photo"

const BY_SA_4 = { license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/" }
const BY_SA_2 = { license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" }
const PD = { license: "Public domain" }
const DIR = "/images/reports/deep-time-pain"

export const PHOTOS = {
  lamprey: {
    src: `${DIR}/lamprey.webp`,
    width: 1800,
    height: 1617,
    alt: {
      en: "The round, toothed sucker mouth of a sea lamprey, seen head-on",
      fa: "دهان مکنده‌ی گرد و دندانه‌دار لامپری دریایی از روبه‌رو",
    },
    caption: {
      en: "A sea lamprey's mouth. No jaw, just a disc of keratin teeth — and the same hormonal stress axis we carry.",
      fa: "دهان لامپری دریایی. بدون آرواره، فقط صفحه‌ای از دندانه‌های شاخی — و همان محور هورمونی استرسی که ما داریم.",
    },
    credit: "U.S. Fish and Wildlife Service – Midwest Region",
    ...PD,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lamprey_mouth_(28004177415).jpg",
  },
  cannon: {
    src: `${DIR}/cannon.webp`,
    width: 900,
    height: 1275,
    alt: { en: "Portrait of the physiologist Walter Cannon, around 1908", fa: "پرتره‌ی والتر کانن، فیزیولوژیست، حدود ۱۹۰۸" },
    caption: {
      en: "Walter Cannon, around 1908. He described the emergency response in 1915.",
      fa: "والتر کانن، حدود ۱۹۰۸. او واکنش اضطراری بدن را در ۱۹۱۵ توصیف کرد.",
    },
    credit: "Purdy & Co. / U.S. National Library of Medicine",
    ...PD,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Walter_Cannon,_American_physiologist.,_circa_1908.jpg",
  },
  anzio: {
    src: `${DIR}/anzio.webp`,
    width: 1800,
    height: 1481,
    alt: {
      en: "American infantry medics carrying a wounded soldier on a stretcher through scrub near Cisterna, Italy, 1944",
      fa: "امدادگران پیاده‌نظام آمریکا سربازی زخمی را با برانکارد از میان بوته‌زار نزدیک چیسترنا در ایتالیا می‌برند، ۱۹۴۴",
    },
    caption: {
      en: "Medics bring in the wounded near Cisterna during the Anzio breakout, 26 May 1944.",
      fa: "امدادگران زخمی‌ها را نزدیک چیسترنا، در جریان شکستن محاصره‌ی آنزیو، به عقب می‌آورند؛ ۲۶ مه ۱۹۴۴.",
    },
    credit: "U.S. Army Signal Corps",
    ...PD,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:American_infantry_medics_bring_in_the_wounded_either_by_stretcher_or_walking_to_aid_stations_near_the_front_lines_around_Cisterna,_Italy._26_May,_1944._(49347289468).jpg",
  },
  dmanisi: {
    src: `${DIR}/dmanisi.webp`,
    width: 1800,
    height: 1195,
    alt: { en: "Cast of the Dmanisi D3444 skull, with no teeth in the upper jaw", fa: "قالب جمجمه‌ی D3444 دمانیسی، بدون دندان در فک بالا" },
    caption: {
      en: "D3444, the toothless Dmanisi skull (museum cast). The tooth sockets had closed over long before death.",
      fa: "D3444، جمجمه‌ی بی‌دندان دمانیسی (قالب موزه). حفره‌های دندان مدت‌ها پیش از مرگ بسته شده بودند.",
    },
    credit: "Ryan Somma (resized)",
    ...BY_SA_2,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Dmanisi-D3444._Homo_erectus_or_Homo_georgicus.jpg",
  },
  maba: {
    src: `${DIR}/maba.webp`,
    width: 1488,
    height: 1116,
    alt: { en: "Cast of the Maba skullcap from southern China", fa: "قالب کاسه‌ی سر مابا از جنوب چین" },
    caption: {
      en: "The Maba skullcap (museum cast). The healed dent sits on the right side of the forehead.",
      fa: "کاسه‌ی سر مابا (قالب موزه). فرورفتگی جوش‌خورده در سمت راست پیشانی است.",
    },
    credit: "Ryan Somma (resized)",
    ...BY_SA_2,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Maba._Homo_heidelbergensis.jpg",
  },
  qafzeh: {
    src: `${DIR}/qafzeh.webp`,
    width: 1800,
    height: 1350,
    alt: {
      en: "Cast of the Qafzeh 11 burial: a child's skeleton lying on its side with deer antlers across the chest",
      fa: "قالب تدفین قفزه ۱۱: اسکلت کودکی به پهلو با شاخ گوزن روی سینه",
    },
    caption: {
      en: "Cast of the Qafzeh 11 burial, with the deer antlers in place. Qafzeh 11 was Homo sapiens.",
      fa: "قالب تدفین قفزه ۱۱، با شاخ‌های گوزن در جای خود. قفزه ۱۱ انسان خردمند بود.",
    },
    credit: "Eunostos (resized)",
    ...BY_SA_4,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Moulage_de_la_s%C3%A9pulture_de_l%27individu_%22Qafzeh_11%22_(avec_ramure_de_cervid%C3%A9),_homme_de_N%C3%A9andertal.jpg",
  },
  shanidar1: {
    src: `${DIR}/shanidar1.webp`,
    width: 1800,
    height: 1279,
    alt: { en: "The skull and bones of Shanidar 1 on display in the Iraq Museum", fa: "جمجمه و استخوان‌های شانیدار ۱ در موزه‌ی عراق" },
    caption: {
      en: "Shanidar 1's skull and skeleton, Iraq Museum, Baghdad. Note the damage around the left eye socket.",
      fa: "جمجمه و اسکلت شانیدار ۱، موزه‌ی عراق، بغداد. به آسیب اطراف کاسه‌ی چشم چپ دقت کنید.",
    },
    credit: "Osama Shukir Muhammed Amin FRCP(Glasg) (resized)",
    ...BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Shanidar_I_skull_and_skeleton,_c._60,000_to_45,00o_BCE._Iraq_Museum.jpg",
  },
  shanidarCave: {
    src: `${DIR}/shanidar-cave.webp`,
    width: 1800,
    height: 1200,
    alt: {
      en: "Looking out from inside Shanidar Cave across a valley in the Zagros mountains",
      fa: "نمایی از درون غار شانیدار رو به دره‌ای در کوه‌های زاگرس",
    },
    caption: {
      en: "Shanidar Cave in the Zagros mountains of Iraqi Kurdistan, looking out. His remains were found here.",
      fa: "غار شانیدار در کوه‌های زاگرس، کردستان عراق، رو به بیرون. بقایای نَندی همین‌جا پیدا شد.",
    },
    credit: "Hardscarf (resized)",
    ...BY_SA_4,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Shanidar_Cave_-_overview.jpg",
  },
} satisfies Record<string, ReportPhoto>
