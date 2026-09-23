// ============================================================================
// File: src/lib/perk-offer.ts
// Role: The one definition of the Astaneh perk-partner form — option lists and
//       the zod schema — shared by the form at /fa/lab/perks and /api/perk-offer.
// Why:  Client-side checks are a courtesy; the API runs this same schema so a
//       hand-written request cannot store anything the form would reject.
// Note: No secrets here. This file is bundled into the client.
// ============================================================================

import { z } from "zod"

export const DESCRIPTION_MAX = 600

/** Hidden field. Humans never see it; naive bots fill every input. */
export const HONEYPOT_FIELD = "company_fax"

export const COUNTRIES = [
    { value: "IR", label: "ایران" },
    { value: "CA", label: "کانادا" },
    { value: "US", label: "آمریکا" },
    { value: "AE", label: "امارات" },
    { value: "TR", label: "ترکیه" },
    { value: "DE", label: "آلمان" },
    { value: "GB", label: "انگلستان" },
    { value: "OTHER", label: "کشور دیگر" },
] as const

export const PERK_TYPES = [
    { value: "cloud", label: "اعتبار زیرساخت یا کلاد" },
    { value: "software", label: "دسترسی به ابزار نرم‌افزاری" },
    { value: "advisory", label: "جلسه‌ی مشاوره" },
    { value: "design", label: "طراحی و UX" },
    { value: "marketing", label: "مارکتینگ و رشد" },
    { value: "workspace", label: "فضای کار" },
    { value: "data", label: "دسترسی به داده" },
    { value: "other", label: "مورد دیگر" },
] as const

export const MARKETS = [
    { value: "IR", label: "ایران" },
    { value: "CA", label: "کانادا" },
    { value: "EU", label: "اتحادیه‌ی اروپا" },
    { value: "US", label: "آمریکا" },
    { value: "GLOBAL", label: "همه‌جا" },
] as const

type Option = { readonly value: string; readonly label: string }
const values = <T extends readonly Option[]>(list: T) =>
    list.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]]

export function labelOf(list: readonly Option[], value: string): string {
    return list.find((o) => o.value === value)?.label ?? value
}

const TOO_LONG = "متن این فیلد بیش از حد طولانی است"

const required = (message: string, max = 200, tooLong = TOO_LONG) =>
    z.string({ error: message }).trim().min(1, message).max(max, tooLong)

const optional = (max = 200) =>
    z.string().trim().max(max, TOO_LONG).optional().default("")

export const perkOfferSchema = z.object({
    companyName: required("نام شرکت را وارد کنید"),
    website: required("آدرس وب‌سایت را وارد کنید", 300)
        .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
        .pipe(z.url({ protocol: /^https?$/, hostname: /\./, error: "آدرس وب‌سایت معتبر نیست" })),
    contactName: required("نام رابط را وارد کنید"),
    email: required("ایمیل را وارد کنید", 254).pipe(z.email({ error: "ایمیل معتبر نیست" })),
    telegram: optional(64).refine(
        (v) => v === "" || /^@?[A-Za-z0-9_]{5,32}$/.test(v),
        "آیدی تلگرام معتبر نیست (مثلاً ‎@username‎)"
    ),
    country: z.enum(values(COUNTRIES), { error: "کشور محل ثبت شرکت را انتخاب کنید" }),
    perkType: z.enum(values(PERK_TYPES), { error: "نوع Perk را انتخاب کنید" }),
    description: required("توضیح Perk را بنویسید", DESCRIPTION_MAX, "توضیح حداکثر ۶۰۰ کاراکتر است"),
    valueEstimate: optional(120),
    markets: z
        .array(z.enum(values(MARKETS), { error: "بازار انتخاب‌شده معتبر نیست" }), { error: "دست‌کم یک بازار را انتخاب کنید" })
        .min(1, "دست‌کم یک بازار را انتخاب کنید")
        .transform((list) => [...new Set(list)]),
    validity: optional(120),
    consent: z.literal(true, { error: "برای ارسال، باید با تماس درباره‌ی این پیشنهاد موافقت کنید" }),
})

export type PerkOfferInput = z.input<typeof perkOfferSchema>
export type PerkOffer = z.output<typeof perkOfferSchema>
export type PerkOfferErrors = Partial<Record<keyof PerkOfferInput, string>>

/** First error message per field, in the shape both the API and the form use. */
export function fieldErrors(error: z.ZodError): PerkOfferErrors {
    const out: PerkOfferErrors = {}
    for (const issue of error.issues) {
        const key = issue.path[0] as keyof PerkOfferInput | undefined
        if (key && !out[key]) out[key] = issue.message
    }
    return out
}
