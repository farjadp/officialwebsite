// ============================================================================
// File Path: src/components/v3/reports/synthetic-consumers/photos.ts
// Why: The photograph in report 10, with the credit its licence asks for.
//      From Wikimedia Commons; licence read from the file's own extmetadata.
//      Cropped and re-encoded to WebP, which CC BY-SA counts as a change, so
//      the credit says so.
// ============================================================================

import type { ReportPhoto } from "../photo"

const DIR = "/images/reports/synthetic-consumers"

export const PHOTOS = {
  hero: {
    src: `${DIR}/supermarket-aisle.webp`,
    width: 2000,
    height: 762,
    alt: { en: "A long supermarket aisle with shelves of jars and bottles on the left and refrigerated cases on the right", fa: "راهروی بلند یک سوپرمارکت با قفسه‌های شیشه و بطری در سمت چپ و یخچال‌ها در سمت راست" },
    caption: {
      en: "A supermarket aisle. Every product here was once a concept someone had to test on real people first.",
      fa: "راهروی یک سوپرمارکت. هر محصولی که این‌جاست روزی ایده‌ای بوده که باید اول روی آدم‌های واقعی آزمایش می‌شد.",
    },
    credit: "Wilfredor (cropped)",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Aisle_in_L_Intermarche_supermarket_in_Quebec_City.jpg",
  },
} satisfies Record<string, ReportPhoto>
