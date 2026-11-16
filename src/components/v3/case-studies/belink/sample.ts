// ============================================================================
// File: src/components/v3/case-studies/belink/sample.ts
// Role: Ten sample rows for the spreadsheet view of the Belink case study.
// Farjad's decision (2026-11-16): company name, sector, founding year and
//       website in full; the company email and phone MASKED (first letters
//       and last two digits only). No founder/CEO names, no addresses, no
//       Hot/Cold scores. Picked as the first row per top-10 sector that has a
//       generic company mailbox (info@, sales@ …), a website and a year.
// ============================================================================

export type SampleRow = {
    name: string
    sector: string
    year: number
    website: string
    email: string
    phone: string
    social: ("linkedin" | "instagram" | "telegram")[]
}

export const SAMPLE_ROWS: SampleRow[] = [
    {
        "name": "ALWER",
        "sector": "تبلیغات، بازاریابی و فروش",
        "year": 2024,
        "website": "alwer.ir",
        "email": "i***@alwer.ir",
        "phone": "443-••••-90",
        "social": [
            "linkedin",
            "instagram",
            "telegram"
        ]
    },
    {
        "name": "ویزیسان",
        "sector": "سلامت",
        "year": 2022,
        "website": "vizisun.ir",
        "email": "i***@sarirai.com",
        "phone": "173-••••-22",
        "social": [
            "instagram",
            "telegram"
        ]
    },
    {
        "name": "سیمی نصر ماد",
        "sector": "تجارت",
        "year": 2012,
        "website": "snmaad.com",
        "email": "i***@siminasrmaad.com",
        "phone": "021-••••-93",
        "social": [
            "linkedin",
            "instagram"
        ]
    },
    {
        "name": "فضای کار اشتراکی فندک",
        "sector": "املاک",
        "year": 2024,
        "website": "fandak.space",
        "email": "i***@fandak.space",
        "phone": "937-••••-75",
        "social": [
            "linkedin"
        ]
    },
    {
        "name": "هزاره سوم",
        "sector": "خدمات مالی",
        "year": 2021,
        "website": "hz3.ir",
        "email": "i***@hz3.ir",
        "phone": "021-••••-52",
        "social": []
    },
    {
        "name": "دیجی پاورپوینت",
        "sector": "رسانه، هنر و سرگرمی",
        "year": 2020,
        "website": "digipptx.ir",
        "email": "i***@digipptx.ir",
        "phone": "091-••••-57",
        "social": [
            "instagram",
            "telegram"
        ]
    },
    {
        "name": "پلیمر آریا ساسول",
        "sector": "صنایع پتروشیمی و شیمیایی",
        "year": 2003,
        "website": "aryasasol.com",
        "email": "m***@aryasasol.com",
        "phone": "218-••••-00",
        "social": [
            "linkedin",
            "instagram",
            "telegram"
        ]
    },
    {
        "name": "کفسابی شاپرک",
        "sector": "خدمات حرفه ای",
        "year": 2011,
        "website": "kafsabishaparak.com",
        "email": "i***@kafsabishaparak.com",
        "phone": "092-••••-28",
        "social": [
            "instagram"
        ]
    },
    {
        "name": "تی جا",
        "sector": "سفر و گردشگری",
        "year": 2023,
        "website": "tijaa.net",
        "email": "i***@tijaa.net",
        "phone": "219-••••-78",
        "social": []
    },
    {
        "name": "ریزآموز",
        "sector": "آموزش",
        "year": 2023,
        "website": "reezamooz.ir",
        "email": "i***@reezamooz.ir",
        "phone": "214-••••-43",
        "social": [
            "linkedin",
            "instagram",
            "telegram"
        ]
    }
]
