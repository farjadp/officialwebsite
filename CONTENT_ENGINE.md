# Content Engine

Multi-agent article pipeline at `/admin/content`. Scouts trends from external
feeds, writes a bilingual article in Farjad's voice, audits it for SEO/AEO/GEO,
adversarially reviews it, generates its imagery, and publishes it — all driven by
cron, with state in this project's own database.

This document is the **spec**. The implementation plan lives at
`docs/superpowers/plans/2026-09-25-content-engine.md`.

---

## 1. What already exists

Roughly half of this pipeline is built. The engine wraps and sequences it; it
does not replace it.

| Capability | Location | Reuse |
|---|---|---|
| Article writer: HTML body, title, excerpt, SEO fields, category from a fixed taxonomy | `src/app/api/ai/generate-post/route.ts` | Extracted into `src/lib/content/writer.ts`, made brief-driven |
| SEO / GEO / AEO prompt guides | same file, `OPTIMIZATION_GUIDES` | Moved into `src/lib/content/seo-audit.ts` as audit criteria |
| Verified bio, used to stop invented numbers | same file, `VERIFIED_BIO` | Becomes the reviewer's fact table |
| Cover + 1–2 body images via FLUX, watermarked | same file + `src/lib/image-watermark.ts` | Extracted into `src/lib/content/art.ts` |
| Distribution: article → LinkedIn / Telegram / X | `src/app/api/ai/content-waterfall/route.ts`, `src/lib/social-publisher.ts` | Called on publish, unchanged |
| Article storage with DRAFT status and an admin editor | `Post` in `prisma/schema.prisma`, `/admin/posts` | Extended with `locale` + `translationGroupId` |
| Canonical + hreflang helper for locale pairs | `src/lib/seo.ts` → `localeAlternates()` | Used by the new `/fa/blog` routes |
| Cron authorisation pattern (`CRON_SECRET` bearer) | `src/app/api/cron/email/route.ts` | Copied verbatim |

What does not exist: any external input, any brief step, any independent
auditor, any review loop, any job state, any Persian blog.

---

## 2. Non-negotiable decisions

These were settled during brainstorming on 2026-09-25 and are not open for
re-litigation by an implementer.

1. **Runs inside the site, on cron.** No external orchestrator, no dependency on
   a laptop. State lives in Postgres; one cron tick performs exactly one state
   transition, because a Vercel function cannot hold the whole chain.
2. **Both locales auto-publish**, with a higher bar for Persian. English
   threshold and Persian threshold are separate, editable settings.
3. **Persian is written, not translated.** A separate writer produces the
   Persian article from the same brief, with its own examples and its own
   keywords. A translation step is explicitly forbidden.
4. **The reviewer must not be the writer's model.** Provider and model are
   selectable per agent from the admin UI across OpenAI, Google and Anthropic.
5. **Volume is 2–3 articles per week.** This is low enough that the review loop
   can be strict; do not optimise for throughput.
6. **A deterministic Persian gate can veto publication** regardless of any model
   score. See §7.

---

## 3. Data model

New models in `prisma/schema.prisma`. One migration:
`prisma/migrations/<date>_add_content_engine`.

```prisma
enum ContentSourceKind {
  RSS       // Medium tag feeds, Substack publications, any Atom/RSS URL
  HN        // Hacker News Algolia API
  REDDIT    // subreddit .json listing
  URL       // a single page Farjad wants read as reference material
  PDF       // an uploaded document, reference material only
}

enum ContentJobState {
  SCOUTED BRIEFED DRAFTED SEO_PASS REVIEW REVISING
  FA_DRAFT FA_REVIEW ART READY PUBLISHED
  NEEDS_HUMAN FAILED
}

model ContentSource {
  id            String            @id @default(cuid())
  kind          ContentSourceKind
  label          String            // "Medium · AI", "Lenny's Newsletter"
  url            String?           // null for PDF
  fileUrl        String?           // blob URL for PDF
  weight         Int      @default(1)   // multiplies signal score
  enabled        Boolean  @default(true)
  isReference    Boolean  @default(false) // URL/PDF: feeds briefs, never trends
  lastFetchedAt  DateTime?
  lastError      String?
  createdAt      DateTime @default(now())

  signals ContentSignal[]
  @@index([kind, enabled])
}

model ContentSignal {
  id          String   @id @default(cuid())
  sourceId    String
  source      ContentSource @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  fingerprint String   @unique  // sha256 of canonical URL — the dedupe key
  title       String
  url         String
  summary     String?
  author      String?
  publishedAt DateTime?
  engagement  Int      @default(0) // upvotes, comments, claps where available
  score       Float    @default(0)
  clusterKey  String?               // signals sharing a theme share this
  used        Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@index([used, score])
  @@index([clusterKey])
}

model ContentJob {
  id            String          @id @default(cuid())
  state         ContentJobState @default(SCOUTED)
  signalIds     String[]        // the cluster this job came from
  brief         Json?
  enPostId      String?
  faPostId      String?
  iteration     Int      @default(0)   // review loop counter
  seoScore      Int?
  reviewScore   Int?
  faScore       Int?
  costCents     Int      @default(0)
  trace         Json     @default("[]") // append-only: {at, state, agent, model, tokens, ms, note}
  error         String?
  lockedAt      DateTime?               // 5-minute lease; a stale lock is reclaimable
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([state, lockedAt])
}
```

Modifications to `Post`:

```prisma
locale             String  @default("en")   // "en" | "fa"
translationGroupId String?                  // pairs the en/fa versions
embedding          Float[]                  // text-embedding-3-small, for dedupe
contentJobId       String?                  // provenance: which job produced it

@@index([locale, status])
@@index([translationGroupId])
```

`slug` stays globally unique: the Persian version gets its own slug, so a
`@@unique([locale, slug])` compound is unnecessary and would be a wider change.

Settings live in the existing `AppSetting` key/value table under a `content.`
prefix — no new settings model:

| Key | Default | Meaning |
|---|---|---|
| `content.threshold.en` | `85` | Minimum combined score for English auto-publish |
| `content.threshold.fa` | `95` | Minimum combined score for Persian auto-publish |
| `content.maxRevisions` | `2` | Review loops before `NEEDS_HUMAN` |
| `content.enabled` | `true` | Master kill switch for the cron |
| `content.agent.<name>.provider` | see §4 | `openai` \| `google` \| `anthropic` |
| `content.agent.<name>.model` | see §4 | Model id |
| `content.budget.monthlyCents` | `4000` | Cron stops when the month's spend exceeds this |

---

## 4. Provider abstraction

`src/lib/content/provider.ts` exposes one function every agent calls:

```ts
type AgentName =
  | "brief" | "writer.en" | "writer.fa"
  | "seo" | "review.en" | "review.fa" | "art.prompt"

export async function complete<T>(opts: {
  agent: AgentName
  system: string
  user: string
  imageUrls?: string[]          // reference images for the writer
  schema: z.ZodType<T>          // one Zod schema per agent — mandatory
  schemaName: string
  maxTokens?: number
  settings?: Record<string, string>   // reuse one settings load per tick
}): Promise<{
  data: T; provider: Provider; model: string
  inputTokens: number; outputTokens: number; costCents: number; ms: number
}>
```

**Built, and corrected from the original design** *(25 Sep 2026, after reading
the `claude-api` skill)*. Two things in the first draft of this section were
wrong:

1. **The schema is a Zod schema, not a hand-written JSON Schema.** `zod@4` is
   already a dependency, and both vendor SDKs ship a Zod helper, so one schema
   per agent now drives native structured output on every vendor *and* validates
   the answer. A malformed reply throws `ProviderBadOutput` at the call site
   instead of surfacing as a strange failure two states later.
2. **Anthropic does not need a forced tool call.** Structured output is a
   first-class feature: `client.messages.parse()` with
   `output_config: { format: zodOutputFormat(schema) }` → `response.parsed_output`.
   The forced-tool-call trick the first draft prescribed is the old workaround
   and is worse: on the newest models forced `tool_choice` is rejected outright.

Resolution order for provider/model: `AppSetting` → per-agent default. The env
tier the first draft described was dropped — the admin is the intended control
surface, and a third source of truth only creates a place for the three to
disagree.

Three adapters behind one interface:

- **openai** — the `openai` SDK already in `package.json`:
  `chat.completions.parse()` with `zodResponseFormat(schema, name)`.
- **google** — the same SDK and the same call, pointed at Gemini's
  OpenAI-compatible endpoint
  (`https://generativelanguage.googleapis.com/v1beta/openai/`). No new
  dependency. Its compatibility layer does not implement every corner of
  `json_schema`, so a 400 naming the schema falls back once to plain JSON mode
  with the same generated JSON Schema quoted in the prompt — the Zod parse still
  guards the result, so the fallback cannot widen what is accepted.
- **anthropic** — `@anthropic-ai/sdk` (new dependency): `messages.parse()` with
  `zodOutputFormat(schema)`, plus an explicit check for
  `stop_reason === "refusal"`.

Defaults as built. `gpt-4o` is the OpenAI default because it is the one OpenAI id
this repo already calls successfully with the live key (`generate-post`,
`content-waterfall`, `ai-tools`); the point of the admin selector is that Farjad
can move to a newer model without a deploy. The Gemini id is the one unverified
value in the table — `scripts/content-provider-check.ts` is what confirms or
refutes it.

| Agent | Provider | Model | Why |
|---|---|---|---|
| `brief` | openai | `gpt-4o` | Clustering and angle-finding is the hardest judgement call |
| `writer.en` | openai | `gpt-4o` | Existing prompts are tuned for it |
| `writer.fa` | anthropic | `claude-opus-5` | Best Persian register; revisit against real output |
| `seo` | openai | `gpt-4o` | Rule-checking, not creative |
| `review.en` | anthropic | `claude-opus-5` | Must differ from `writer.en` |
| `review.fa` | openai | `gpt-4o` | Must differ from `writer.fa` |
| `art.prompt` | openai | `gpt-4o` | Short prompt rewriting |

The reviewer/writer vendor split is **enforced in code**, not just defaulted:
`resolveAgentFrom` throws when a stored setting puts `review.en` on the same
vendor as `writer.en` (likewise for `fa`), so the guard cannot be edited away
from the admin.

**API keys.** Keys are read from the environment: `OPENAI_API_KEY`,
`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`. The admin UI selects provider and model
per agent and shows which keys are present; it does **not** store secrets by
default. An optional encrypted override (AES-256-GCM, key derived from
`AUTH_SECRET`) may be added so a key can be pasted from the admin — if built, it
must be write-only in the UI (never rendered back) and the page must state that
a database leak then leaks the key. Without that caveat, do not build it.

Absent key → the agent returns 503 and the job goes `FAILED` with a readable
error, mirroring how `EMAIL_MARKETING.md` treats a missing `OPENAI_API_KEY`.

---

## 5. The agents

Every agent returns JSON against a schema. No agent returns prose for another
agent to parse.

### 5.1 Scout — `src/lib/content/scout.ts`

Not an LLM. Pure fetching and scoring.

- RSS via `fast-xml-parser` (already a dependency). Medium exposes
  `medium.com/feed/tag/<tag>`; Substack exposes `<publication>/feed`. **Only
  RSS** — scraping Medium's HTML is fragile and against its terms.
- Hacker News via the Algolia API (`hn.algolia.com/api/v1/search_by_date`).
- Reddit via `reddit.com/r/<sub>/top.json?t=week`, with a descriptive
  User-Agent as Reddit requires.
- `URL` and `PDF` sources are **reference material**, never trends: they are
  fetched once, stored as text, and injected into briefs. PDF text extraction
  needs a new dependency (`unpdf`, pure-JS, no native binary).

Score = `log1p(engagement) * source.weight * recencyDecay(publishedAt)`, where
recency halves every 7 days. Fingerprint = sha256 of the URL with tracking
parameters stripped, so the same story from two feeds collapses to one row.

### 5.2 Brief — `src/lib/content/brief.ts`

The step that decides whether the output is worth publishing. Takes the top
unused signal cluster plus reference material and produces:

```json
{
  "workingTitle": "...",
  "angle": "The specific claim only Farjad can make about this",
  "whyNow": "Which signals justify writing this week",
  "reader": "Who this is for and what they will do differently",
  "category": "one of the fixed taxonomy",
  "subcategory": "one of the fixed taxonomy",
  "primaryKeywordEn": "...",
  "primaryKeywordFa": "... (not a literal translation)",
  "mustCover": ["3–6 points"],
  "mustAvoid": ["claims the verified bio cannot support"],
  "faLocalisation": "How the Persian version differs: examples, references, framing",
  "sourceUrls": ["..."]
}
```

**Duplicate guard.** Before a brief is accepted, embed its angle with
`text-embedding-3-small` and compare against every existing `Post.embedding`
(≈100 rows — cosine similarity in JS, no pgvector needed). Above 0.88 the
cluster is marked used and skipped, with the near-duplicate slug recorded in the
trace. This is what stops the blog filling with near-identical posts.

### 5.3 Writer (English) — `src/lib/content/writer.ts`

The existing `generate-post` prompt stack, refactored to take a brief and, on a
revision pass, the reviewer's findings. Returns the same shape it returns today
(title, HTML content, excerpt, SEO fields, category, image prompts) so the
existing admin editor keeps working unchanged.

### 5.4 SEO / AEO / GEO auditor — `src/lib/content/seo-audit.ts`

Independent of the writer. Returns:

```json
{
  "score": 0,
  "checks": [{ "id": "h2-keyword-coverage", "pass": true, "note": "..." }],
  "fixes": [{ "where": "section 2 heading", "what": "...", "why": "..." }]
}
```

Criteria are drawn from the repo's existing SEO skills (`seo-geo`, `seo-content`,
`seo-page`) rather than invented: answer-first paragraphs, a real FAQ block,
heading keyword coverage, internal links to existing posts and services,
citable standalone passages for AI engines, meta length, schema completeness.
Deterministic checks (meta length, heading depth, link count, FAQ presence) run
in code and are not left to the model.

### 5.5 Reviewer — `src/lib/content/review.ts`

Adversarial. Its prompt frames it as a hostile editor whose job is to find the
reason not to publish. It receives `VERIFIED_BIO` as the only permissible source
of biographical fact. Returns:

```json
{
  "verdict": "PASS" | "REVISE" | "BLOCK",
  "score": 0,
  "findings": [{
    "severity": "blocker" | "major" | "minor",
    "kind": "fabricated-number" | "bio-contradiction" | "voice" | "ai-tell"
          | "unsupported-claim" | "source-overlap" | "structure",
    "quote": "the exact offending text",
    "fix": "the specific replacement"
  }]
}
```

Rules: any `fabricated-number` or `bio-contradiction` blocker forces `BLOCK`
regardless of score — those are reputation damage, not style. `REVISE` returns
the job to the writer with the findings attached; after
`content.maxRevisions` loops the job goes `NEEDS_HUMAN`.

`source-overlap` guards against the article restating a source trend article too
closely.

### 5.6 Persian writer and reviewer

`writer.fa` writes from the brief, never from the English article. Its prompt is
built from the repo's `persian-writing` and `humanizer` skills — those rules are
imported, not re-derived. Requirements it must satisfy:

- One consistent register throughout (`رسمی روان` for essays); mixed
  رسمی/محاوره is a defect.
- Correct ZWNJ (نیم‌فاصله): `می‌شود`, `نمی‌توان`, `کتاب‌ها`, `آن‌ها`.
- Persian letters only: `ی` and `ک`, never Arabic `ي`/`ك`.
- Persian digits, used consistently.
- `«گیومه»` for quotation.
- No translationese: no `در دنیای امروز`, no `بدون شک`, no stacked adjectives,
  no `این امر` chains, no headings that read as translated English.
- Examples, companies and references localised per `brief.faLocalisation`.

`review.fa` audits exactly those points and scores them, but it is **not** the
last line of defence — §7 is.

### 5.7 Art — `src/lib/content/art.ts`

The existing FLUX path, extracted. One cover (16:9) plus two body images,
watermarked, shared between both locales — the images do not need to differ by
language, and regenerating them would double the image cost for no gain.

---

## 6. State machine

`src/lib/content/engine.ts` exports `tick(): Promise<TickResult>`. One call
advances exactly one job by exactly one state, inside a transaction, then
returns. Concurrency safety: claim a job with a conditional update on
`lockedAt` (null or older than 5 minutes), which makes overlapping cron
invocations harmless.

```
SCOUTED   → BRIEFED    brief.ts, incl. duplicate guard (may end the job as FAILED:duplicate)
BRIEFED   → DRAFTED    writer.en
DRAFTED   → SEO_PASS   seo-audit.ts  (deterministic checks + model audit)
SEO_PASS  → REVIEW     review.en
REVIEW    → REVISING   verdict REVISE and iteration < maxRevisions
REVISING  → DRAFTED    writer.en with findings attached, iteration++
REVIEW    → FA_DRAFT   verdict PASS
REVIEW    → NEEDS_HUMAN verdict BLOCK, or revisions exhausted
FA_DRAFT  → FA_REVIEW  writer.fa
FA_REVIEW → ART        deterministic Persian gate + review.fa
FA_REVIEW → FA_DRAFT   Persian gate or reviewer failed, iteration < maxRevisions
ART       → READY      art.ts; creates both Post rows as DRAFT, linked by translationGroupId
READY     → PUBLISHED  publish gate (§7); each locale decided independently
PUBLISHED → —          content-waterfall + social-publisher for the English post
```

Every transition appends one entry to `trace` with agent, model, token count,
elapsed ms and cost. A thrown error records `error`, increments an attempt
counter, and retries up to three times before `FAILED`.

---

## 7. The publish gate

Per locale, independently:

```
publish(locale) = scoreOK && deterministicOK
  where scoreOK = (seoScore + reviewScore) / 2 >= threshold[locale]
```

`deterministicOK` is pure code with no model in the loop:

**Both locales:** cover image present; slug unique; no empty section; no
placeholder text (`TODO`, `Lorem`, `[insert`); every internal link resolves to a
real route; body length within bounds; no number in the body that is absent from
`VERIFIED_BIO` and not attributed to a cited source.

**Persian additionally** — `src/lib/content/persian-gate.ts`, and any single
failure blocks publication whatever the model scored:

1. ZWNJ: a `می`/`نمی` prefix followed by a space or joined without ZWNJ.
2. Any Arabic `ي` or `ك`.
3. Mixed Latin and Persian digits in the same document.
4. Any phrase from a banned-translationese list (starts at ~40 entries, editable
   from the admin, grows as Farjad rejects drafts).
5. Register mixing: colloquial verb endings (`می‌کنم` + `میکنم`/`می‌کنیم` style
   inconsistency, `نمیشه`, `بخوایم`) inside a formal essay.
6. Straight quotes `"` where `«»` belongs.

A failed gate sends the job back to `FA_DRAFT` with the exact failing lines. A
gate failure after the revision limit leaves the Persian post as DRAFT and the
English post publishes on its own — the two locales never block each other.

Everything failing any gate surfaces in `/admin/content` with its findings, so
nothing fails silently.

---

## 8. Admin surfaces

Under `/admin/content`, mirroring how `/admin/newsletter` is organised:

- **Pipeline** — jobs as a board by state, with score, cost, iteration, and the
  trace expandable per job. Actions: retry, force-publish, kill, edit brief.
- **Sources** — CRUD over `ContentSource`: add an RSS URL, an HN query, a
  subreddit, a reference URL, or upload a reference PDF; toggle, weight, and see
  last fetch and last error per source.
- **Signals** — the current trend inbox, sorted by score, with a "write about
  this" button that creates a job directly and skips the scout's choice.
- **Settings** — thresholds, max revisions, monthly budget, kill switch, and the
  provider/model selector per agent with key-presence indicators.
- **Persian rules** — the banned-phrase list, editable.

Seeded sources (Farjad reviews and edits after the first run):

`medium.com/feed/tag/{artificial-intelligence,startup,product-management,saas,entrepreneurship}`,
Substack feeds for Lenny's Newsletter, Stratechery, Every, The Diff, Platformer,
HN Algolia queries for `AI agents`, `product market fit`, `founder`,
`r/{startups,SaaS,ExperiencedDevs,ProductManagement,LocalLLaMA}`.

---

## 9. Cron and budget

`vercel.json` gains two entries beside the existing email cron:

```json
{ "path": "/api/cron/content-scout", "schedule": "0 6 * * *" },
{ "path": "/api/cron/content",       "schedule": "*/15 * * * *" }
```

Both authorise exactly like `/api/cron/email` (bearer `CRON_SECRET`), both set
`maxDuration = 300`. The tick route refuses to run when `content.enabled` is
false or the month's `costCents` exceeds `content.budget.monthlyCents`.

Cadence control: the scout creates at most one job per run and refuses if two
jobs already exist in a non-terminal state — which lands naturally on 2–3
articles a week without a scheduler.

Cost per article, roughly: 8–11 model calls (brief, en writer ×≤3, seo, review
×≤3, fa writer, fa review, art prompts) plus 3 FLUX images. Budget ≈ $1–2 per
article, so the $40/month default covers roughly 3 a week with headroom.

---

## 10. Out of scope, deliberately

- **The Persian blog surface itself** — `/fa/blog` routes, the index, the post
  page, sitemap and hreflang entries, RSS. The engine writes Persian posts into
  the database; rendering them is a separate body of work with its own plan.
  Until it ships, Persian posts accumulate as data and the engine's Persian path
  can be exercised entirely through `/admin`.
- Automatic image generation for the Persian post (images are shared).
- Newsletter distribution of new articles (the email suite is already capable;
  wiring it is a follow-up).
- Any change to the existing `/admin/posts` editor beyond the locale field.

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| Persian auto-publishes AI-sounding text because the reviewer scores its own family of output generously | §7's deterministic gate, which no model can override; `review.fa` forced onto a different provider than `writer.fa` |
| Fabricated metrics about Farjad reach the live site | `VERIFIED_BIO` as the only fact source, reviewer blockers, plus a code check that every number in the body traces to the bio or a cited source |
| The blog fills with near-identical articles | Embedding-based duplicate guard at the brief stage, before any writing cost is spent |
| Medium/Substack feed shape changes and the scout silently stops | `lastError` and `lastFetchedAt` per source, surfaced in admin; a source with no successful fetch in 7 days is flagged |
| A runaway review loop burns budget | `maxRevisions`, per-job attempt counter, monthly budget ceiling enforced in the cron route |
| Keys in the database if the admin key-override is built | Encrypted at rest, write-only in the UI, and the page says plainly what a database leak would mean |
