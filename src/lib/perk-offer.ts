// ============================================================================
// File: src/lib/perk-offer.ts
// Role: The one definition of the perk-partner form — option lists, messages
//       and the zod schema — shared by /lab/perks, /fa/lab/perks and the API.
// Why:  Client-side checks are a courtesy; the API runs this same schema so a
//       hand-written request cannot store anything the form would reject.
//       Options and messages carry both locales so the two language versions
//       and the English admin page cannot drift apart.
// Note: No secrets here. This file is bundled into the client.
// ============================================================================

import { z } from "zod"

export type Locale = "en" | "fa"

export const DESCRIPTION_MAX = 600

/** Hidden field. Humans never see it; naive bots fill every input. */
export const HONEYPOT_FIELD = "company_fax"

/** Review states for an offer. The DB default is the first one. */
export const PERK_STATUSES = ["NEW", "CONTACTED", "ACCEPTED", "DECLINED"] as const

export const COUNTRIES = [
    { value: "IR", en: "Iran", fa: "ایران" },
    { value: "CA", en: "Canada", fa: "کانادا" },
    { value: "US", en: "United States", fa: "آمریکا" },
    { value: "AE", en: "UAE", fa: "امارات" },
    { value: "TR", en: "Turkey", fa: "ترکیه" },
    { value: "DE", en: "Germany", fa: "آلمان" },
    { value: "GB", en: "United Kingdom", fa: "انگلستان" },
    { value: "OTHER", en: "Another country", fa: "کشور دیگر" },
] as const

export const PERK_TYPES = [
    { value: "cloud", en: "Infrastructure or cloud credits", fa: "اعتبار زیرساخت یا کلاد" },
    { value: "software", en: "Software tool access", fa: "دسترسی به ابزار نرم‌افزاری" },
    { value: "advisory", en: "Advisory session", fa: "جلسه‌ی مشاوره" },
    { value: "design", en: "Design and UX", fa: "طراحی و UX" },
    { value: "marketing", en: "Marketing and growth", fa: "مارکتینگ و رشد" },
    { value: "workspace", en: "Workspace", fa: "فضای کار" },
    { value: "data", en: "Data access", fa: "دسترسی به داده" },
    { value: "other", en: "Something else", fa: "مورد دیگر" },
] as const

export const MARKETS = [
    { value: "IR", en: "Iran", fa: "ایران" },
    { value: "CA", en: "Canada", fa: "کانادا" },
    { value: "EU", en: "European Union", fa: "اتحادیه‌ی اروپا" },
    { value: "US", en: "United States", fa: "آمریکا" },
    { value: "GLOBAL", en: "Anywhere", fa: "همه‌جا" },
] as const

type Option = { readonly value: string; readonly en: string; readonly fa: string }

const values = <T extends readonly Option[]>(list: T) =>
    list.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]]

/** Human label for a stored value. Defaults to English, which the admin UI uses. */
export function labelOf(list: readonly Option[], value: string, locale: Locale = "en"): string {
    return list.find((o) => o.value === value)?.[locale] ?? value
}

/** Every validation message, in both locales. */
const MESSAGES = {
    en: {
        tooLong: "This field is too long",
        companyName: "Enter your company name",
        website: "Enter your website address",
        websiteInvalid: "That website address is not valid",
        contactName: "Enter the contact person's name",
        email: "Enter an email address",
        emailInvalid: "That email address is not valid",
        telegramInvalid: "That Telegram handle is not valid (for example @username)",
        country: "Select where the company is registered",
        perkType: "Select a perk type",
        description: "Describe the perk",
        descriptionLong: `Keep the description under ${DESCRIPTION_MAX} characters`,
        markets: "Select at least one market",
        marketInvalid: "That market is not valid",
        consent: "To submit, please agree to be contacted about this offer",
    },
    fa: {
        tooLong: "متن این فیلد بیش از حد طولانی است",
        companyName: "نام شرکت را وارد کنید",
        website: "آدرس وب‌سایت را وارد کنید",
        websiteInvalid: "آدرس وب‌سایت معتبر نیست",
        contactName: "نام رابط را وارد کنید",
        email: "ایمیل را وارد کنید",
        emailInvalid: "ایمیل معتبر نیست",
        telegramInvalid: "آیدی تلگرام معتبر نیست (مثلاً ‎@username‎)",
        country: "کشور محل ثبت شرکت را انتخاب کنید",
        perkType: "نوع Perk را انتخاب کنید",
        description: "توضیح Perk را بنویسید",
        descriptionLong: "توضیح حداکثر ۶۰۰ کاراکتر است",
        markets: "دست‌کم یک بازار را انتخاب کنید",
        marketInvalid: "بازار انتخاب‌شده معتبر نیست",
        consent: "برای ارسال، باید با تماس درباره‌ی این پیشنهاد موافقت کنید",
    },
} as const satisfies Record<Locale, Record<string, string>>

/**
 * Build the schema for one locale. A factory rather than a constant because the
 * error messages have to come back in the language the visitor is reading.
 */
export function perkOfferSchema(locale: Locale = "fa") {
    const m = MESSAGES[locale]

    const required = (message: string, max = 200, tooLong: string = m.tooLong) =>
        z.string({ error: message }).trim().min(1, message).max(max, tooLong)

    const optional = (max = 200) => z.string().trim().max(max, m.tooLong).optional().default("")

    return z.object({
        companyName: required(m.companyName),
        website: required(m.website, 300)
            .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
            .pipe(z.url({ protocol: /^https?$/, hostname: /\./, error: m.websiteInvalid })),
        contactName: required(m.contactName),
        email: required(m.email, 254).pipe(z.email({ error: m.emailInvalid })),
        telegram: optional(64).refine(
            (v) => v === "" || /^@?[A-Za-z0-9_]{5,32}$/.test(v),
            m.telegramInvalid
        ),
        country: z.enum(values(COUNTRIES), { error: m.country }),
        perkType: z.enum(values(PERK_TYPES), { error: m.perkType }),
        description: required(m.description, DESCRIPTION_MAX, m.descriptionLong),
        valueEstimate: optional(120),
        markets: z
            .array(z.enum(values(MARKETS), { error: m.marketInvalid }), { error: m.markets })
            .min(1, m.markets)
            .transform((list) => [...new Set(list)]),
        validity: optional(120),
        consent: z.literal(true, { error: m.consent }),
    })
}

export type PerkOfferInput = z.input<ReturnType<typeof perkOfferSchema>>
export type PerkOffer = z.output<ReturnType<typeof perkOfferSchema>>
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
