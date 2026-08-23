# Email Marketing Suite

Self-hosted campaign engine at `/admin/newsletter`. Resend is the sending
transport; every event, contact and report lives in this project's own database.
Mailchimp is import-only.

## Setup

### 1. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | yes | Sending transport (already set) |
| `EMAIL_MARKETING_FROM` | yes | Campaign from-address, e.g. `hello@mail.farjadp.info`. **Must be a subdomain** so campaign reputation never touches password resets and receipts. |
| `RESEND_WEBHOOK_SECRET` | yes | Svix signing secret from Resend → Webhooks. Without it the webhook is **rejected in production** — unsigned events could be forged to poison the suppression list. |
| `CRON_SECRET` | yes | Shared secret for `/api/cron/email`. Vercel injects it as a bearer token. |
| `OPENAI_API_KEY` | yes | Every AI assist point. Absent → AI endpoints return 503, the rest works. |
| `EMAIL_POSTAL_ADDRESS` | yes | Physical address in the footer. CAN-SPAM and CASL require it. |
| `EMAIL_PUBLIC_URL` | no | Base URL for tracking links. Falls back to `NEXTAUTH_URL`. |
| `MAILCHIMP_API_KEY` | no | Enables the Mailchimp import path only. |
| `EMAIL_WARMUP_START` | no | Day-one send cap. Default `50`. |
| `EMAIL_DAILY_CAP` | no | Ceiling the warm-up ramp stops at. Default `20000`. |

### 2. DNS

`/admin/newsletter/deliverability` renders the exact records with copy buttons.
All four are required — Gmail and Yahoo have enforced SPF + DKIM + DMARC for bulk
senders since February 2024, and mail without them is throttled regardless of how
good the content is.

Start DMARC at `p=none`, read the aggregate reports for two weeks, then move to
`p=quarantine`.

### 3. Resend webhook

Point Resend → Webhooks at `https://<domain>/api/email/webhook` and subscribe to
`email.sent`, `email.delivered`, `email.bounced`, `email.complained`. Copy the
signing secret into `RESEND_WEBHOOK_SECRET`.

Without the webhook there is no bounce handling, no complaint suppression, and no
delivery data — the suite still sends, but flies blind.

### 4. Cron

`vercel.json` registers `/api/cron/email` every 10 minutes. Each tick drains
queued campaign mail within the day's warm-up cap, releases scheduled campaigns,
advances automations, and runs list hygiene once daily at 03:00 UTC.

## How sending works

1. **Build audience** — resolves the list/segment, drops anyone suppressed, and
   writes one `CampaignRecipient` row per contact. Materializing the queue makes
   sends resumable: a pause or crash picks up exactly where it stopped.
2. **Start sending** — flips the campaign to `SENDING`. Blocked if the
   deliverability score is under 40.
3. **Drain** — the cron sends throttled batches. A large campaign is *meant* to
   span days while the domain is young.

The daily cap grows 1.5× after a healthy day, holds flat after a slow one, and
halves after a day with excess bounces or any complaints.

## The editor

Blocks are the source of truth, not HTML. Layout lives in the block list;
formatting lives inside rich-text blocks as a constrained HTML subset that the
compiler rewrites into table-based, inline-styled markup Outlook understands.

That structure is what lets the AI edit a campaign surgically — "shorten the
intro", "add a CTA after the second paragraph" — instead of regenerating
everything.

Rich text supports bold/italic/underline/strike, text and highlight colour, font
family and size, headings, lists, blockquote, inline code, four alignments,
links, image upload, and full table editing.

## Merge tags

`{{first_name}}` · `{{last_name}}` · `{{full_name}}` · `{{email}}` ·
`{{company}}` · `{{unsubscribe_url}}` · `{{preferences_url}}` ·
`{{custom.<key>}}` for any imported column.

Fallbacks: `{{first_name|there}}`.

## Deliverability guarantees built in

- One-click unsubscribe headers (RFC 8058) on every message
- Plain-text alternative generated for every send
- Hard bounces and complaints auto-suppressed and excluded from all future sends
  **and all future imports**
- Preference centre offering "fewer emails" instead of only "none"
- Double opt-in available on every import path
- Sunset policy: silent 60 days → score decay, silent 180 days → archived
- First-party click tracking — no shared shortener domains
- Pre-flight audit blocks sends scoring under 40

## Files

| Path | Role |
|---|---|
| `src/lib/email/blocks.ts` | Block schema and theme tokens |
| `src/lib/email/render.ts` | Blocks → email-safe HTML + plain text |
| `src/lib/email/sanitize.ts` | Rich-text allow-list and style inlining |
| `src/lib/email/merge.ts` | Personalization and click-tracking rewrite |
| `src/lib/email/segment.ts` | Segment filter → Prisma query |
| `src/lib/email/spam.ts` | Deterministic deliverability audit |
| `src/lib/email/provider.ts` | Resend transport, warm-up, suppression |
| `src/lib/email/campaign-engine.ts` | Audience build, queue drain, A/B |
| `src/lib/email/automation-engine.ts` | Sequence enrollment and steps |
| `src/lib/email/tracking.ts` | Event recording, engagement scoring, sunset |
| `src/lib/email/import.ts` | CSV/Excel/Mailchimp/site-table import |
| `src/lib/email/ai.ts` | All AI assist points |
