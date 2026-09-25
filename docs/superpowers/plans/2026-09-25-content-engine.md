# Content Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A cron-driven multi-agent pipeline that turns external trend signals into bilingual, reviewed, illustrated articles published to farjadp.info.

**Architecture:** Two new tables (`ContentSource`, `ContentSignal`) plus a job table (`ContentJob`) hold all state; a single `tick()` advances one job by one state per cron invocation, so no Vercel function ever has to hold the whole chain. Each agent is a pure function that takes typed input and returns JSON against a schema, behind a provider abstraction that lets each agent run on a different LLM vendor. The existing `generate-post` and `content-waterfall` routes are the writer and the distributor; they are extracted into libraries, not rewritten.

**Tech Stack:** Next.js 16 App Router, Prisma 7 + Neon Postgres, `openai` SDK (OpenAI *and* Gemini via its OpenAI-compatible endpoint), `@anthropic-ai/sdk` (new), `@fal-ai/client` + FLUX for imagery, `fast-xml-parser` for RSS, `unpdf` for PDF reference material (new), Vercel Cron, Tailwind + shadcn for admin UI, `vitest` for pure-function tests (new).

**Spec:** `CONTENT_ENGINE.md` — read it in full before Task 1. It contains the six non-negotiable decisions and the exact agent contracts; this plan argues from it.

## Global Constraints

- TypeScript only. Functional React components. Tailwind classes only, no inline styles.
- Every config value comes from env or `AppSetting`. No hardcoded keys, model ids, thresholds or URLs.
- Every agent returns structured JSON validated against a schema. No prose passed between agents.
- `VERIFIED_BIO` in `src/app/api/ai/generate-post/route.ts` is the **only** permissible source of biographical fact. Never widen it to make a draft pass.
- The reviewer's provider must differ from the writer's provider for the same locale. Enforce this in code, not just in defaults.
- The deterministic Persian gate can veto publication regardless of any model score. No code path may bypass it.
- One cron tick = one state transition, inside one transaction, idempotent, guarded by a 5-minute `lockedAt` lease.
- File header comments follow the existing convention in `src/app/api/cron/email/route.ts` (`Hardware Source / Version / Why / Env`).
- Cron routes authorise exactly as `src/app/api/cron/email/route.ts` does: bearer `CRON_SECRET`, dev-permissive when the secret is unset.
- Persian copy rules come from the `persian-writing` and `humanizer` skills. Import their rules; do not re-derive them.
- **Never run `prisma migrate dev` / `migrate deploy`.** This repo's migration
  history is divergent from the live database, and `DATABASE_URL` is production —
  there is no dev database. Hand-written idempotent SQL applied with
  `prisma db execute` over `DATABASE_URL_UNPOOLED`, and only with Farjad's
  go-ahead. Full procedure in Task 2, Step 2.
- **Any script that imports `src/lib/prisma` must `import "./_env"` first.**
  `prisma.ts` reads `DATABASE_URL` at module load and falls back to a localhost
  connection; ES imports are hoisted, so calling dotenv's `config()` in the
  script body is too late and the script silently talks to a local Postgres
  instead of Neon — reporting "table does not exist" rather than failing to
  connect.
- Commit after every task. Small, focused commits.
- `docs/` plans and `CONTENT_ENGINE.md` are updated in the same commit as any change that contradicts them.

## Test strategy for this repo

This repo has **no test runner** — verification lives in standalone `scripts/*.ts`
run by hand. Both idioms are used here, deliberately:

- **`vitest`** is added for the pure functions where a test is genuinely cheaper
  than a manual run: the Persian gate, signal scoring and fingerprinting, cosine
  similarity, and the state-machine transition table. These have no network and
  no database, and they are exactly where silent regressions would hurt.
- **`scripts/content-*.ts`** cover everything that needs a real key or a real
  database — provider round-trips, one live fetch per source kind, one full job
  end to end. Each script prints a pass/fail summary and exits non-zero on
  failure, matching `scripts/test-blob.ts`.

Never test an LLM's wording. Test the schema, the gate, and the transition.

---

### Task 1: Provider abstraction and model settings

**Files:**
- Create: `src/lib/content/provider.ts`
- Create: `src/lib/content/settings.ts`
- Create: `scripts/content-provider-check.ts`
- Modify: `package.json` (add `@anthropic-ai/sdk`, `vitest`, `test` script)
- Test: `src/lib/content/__tests__/settings.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `complete<T>({ agent, system, user, schema, maxTokens? }): Promise<{ data: T; model: string; tokens: number; costCents: number }>`
  - `getSetting(key: string, fallback: string): Promise<string>`, `setSetting(key, value): Promise<void>`
  - `resolveAgent(agent: AgentName): Promise<{ provider: "openai" | "google" | "anthropic"; model: string }>`
  - `type AgentName = "brief" | "writer.en" | "writer.fa" | "seo" | "review.en" | "review.fa" | "art.prompt"`

- [ ] **Step 1: Read `CONTENT_ENGINE.md` §4 and confirm model ids**

Load the `claude-api` skill and verify the Anthropic model ids and the Gemini
OpenAI-compatible base URL before writing any adapter. The spec's table is a
starting point, not a source of truth for ids.

- [ ] **Step 2: Add dependencies and the test script**

`npm i @anthropic-ai/sdk && npm i -D vitest`, add `"test": "vitest run"` to
`package.json` scripts.

- [ ] **Step 3: Write the failing test for settings resolution**

```ts
// resolveAgent falls back through AppSetting → env → hardcoded default
it("prefers AppSetting over the env default", async () => {
  await setSetting("content.agent.review.en.provider", "anthropic")
  expect((await resolveAgent("review.en")).provider).toBe("anthropic")
})
it("rejects a reviewer on the same provider as its writer", async () => {
  await setSetting("content.agent.writer.fa.provider", "openai")
  await setSetting("content.agent.review.fa.provider", "openai")
  await expect(resolveAgent("review.fa")).rejects.toThrow(/same provider/i)
})
```

- [ ] **Step 4: Run it and watch it fail**

`npm test -- settings` → FAIL, module not found.

- [ ] **Step 5: Implement `settings.ts`**

Thin wrapper over `AppSetting` with an in-request memo. No caching across
requests — settings change from the admin and must take effect on the next tick.

- [ ] **Step 6: Implement `provider.ts` with three adapters**

One `complete()` entry point. OpenAI and Google share the `openai` SDK (Google
gets `baseURL`); Anthropic uses a single forced tool call for structured output.
Every return includes token count and a cost estimate from a per-model rate
table. A missing key throws a readable `ProviderKeyMissing` error naming the env
var.

- [ ] **Step 7: Run the tests**

`npm test` → PASS.

- [ ] **Step 8: Write and run the live round-trip script**

`scripts/content-provider-check.ts` asks all three providers for the same tiny
JSON object and prints provider, model, tokens, cost, and whether the JSON
validated. Run it with real keys in `.env.local`. Note in the output which keys
were absent rather than failing the whole script.

- [ ] **Step 9: Commit**

`feat(content): provider abstraction across OpenAI, Gemini and Anthropic`

---

### Task 2: Schema, migration and the job state machine

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<date>_add_content_engine/migration.sql` (via `prisma migrate dev`)
- Create: `src/lib/content/states.ts`
- Create: `src/lib/content/engine.ts`
- Test: `src/lib/content/__tests__/states.test.ts`

**Interfaces:**
- Consumes: Task 1's `getSetting`.
- Produces:
  - `TRANSITIONS: Record<ContentJobState, ContentJobState[]>`
  - `nextState(job, outcome): ContentJobState`
  - `tick(): Promise<{ jobId?: string; from?: string; to?: string; note: string }>`
  - `claimJob(): Promise<ContentJob | null>` — conditional update on `lockedAt`
  - `appendTrace(jobId, entry): Promise<void>`

- [ ] **Step 1: Add the models from `CONTENT_ENGINE.md` §3 verbatim**

Including the `Post` additions (`locale`, `translationGroupId`, `embedding`,
`contentJobId`) and their indexes.

- [ ] **Step 2: Write the migration by hand — never `prisma migrate`**

<!-- Corrected 25 Sep 2026: the first draft of this plan said to run
     `prisma migrate dev`. That would have been destructive. -->

**This repo's Prisma migration history is divergent from the live database.**
`prisma migrate dev` and `prisma migrate deploy` must never be run here — either
would try to reconcile that history against production. There is also no
separate development database: `DATABASE_URL` points at the production Neon
branch, so any DDL is production DDL and needs Farjad's explicit go-ahead before
it runs.

The procedure that works in this repo:

1. Write idempotent, transactional SQL by hand at
   `prisma/migrations/20260925_add_content_engine/migration.sql` —
   `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`,
   `CREATE INDEX IF NOT EXISTS`, wrapped in `BEGIN`/`COMMIT`, so a re-run is a
   no-op rather than an error.
2. Apply it with the **unpooled** connection, which is the one that accepts DDL:
   `DATABASE_URL="$DATABASE_URL_UNPOOLED" npx prisma db execute --file prisma/migrations/20260925_add_content_engine/migration.sql`
3. `npx prisma generate`.
4. Verify with a read: the new tables exist, `Post.locale` defaults to `'en'`,
   and every existing row carries `'en'`.

`Post.locale` must be added as `NOT NULL DEFAULT 'en'` so existing English posts
are backfilled by the default rather than by a separate UPDATE.

- [ ] **Step 3: Write the failing transition-table test**

```ts
it("returns REVISING when the reviewer asks for changes under the limit", () => {
  expect(nextState({ state: "REVIEW", iteration: 1 }, { verdict: "REVISE", maxRevisions: 2 }))
    .toBe("REVISING")
})
it("goes NEEDS_HUMAN once revisions are exhausted", () => {
  expect(nextState({ state: "REVIEW", iteration: 2 }, { verdict: "REVISE", maxRevisions: 2 }))
    .toBe("NEEDS_HUMAN")
})
it("always goes NEEDS_HUMAN on BLOCK, whatever the score", () => {
  expect(nextState({ state: "REVIEW", iteration: 0 }, { verdict: "BLOCK", score: 99, maxRevisions: 2 }))
    .toBe("NEEDS_HUMAN")
})
```

- [ ] **Step 4: Run it and watch it fail**

- [ ] **Step 5: Implement `states.ts` as a pure transition table**

No database, no IO — a data structure plus one function, so the whole flow is
readable in one screen and testable without a database.

- [ ] **Step 6: Implement `engine.ts` with a stub handler per state**

`tick()` claims one job, dispatches on state to a handler, writes the new state
and a trace entry in one transaction, releases the lock. Handlers are stubs that
throw `NotImplemented` — later tasks fill them in one at a time. This makes every
later task independently runnable.

- [ ] **Step 7: Run the tests and `npx prisma generate`**

- [ ] **Step 8: Commit**

`feat(content): job state machine, sources and signals schema`

---

### Task 3: Sources and the scout

**Files:**
- Create: `src/lib/content/sources.ts` (fetch adapters per `ContentSourceKind`)
- Create: `src/lib/content/scout.ts` (scoring, fingerprinting, persistence)
- Create: `src/app/api/cron/content-scout/route.ts`
- Create: `scripts/content-scout-check.ts`
- Modify: `vercel.json`, `package.json` (add `unpdf`)
- Test: `src/lib/content/__tests__/scout.test.ts`

**Interfaces:**
- Produces:
  - `fetchSource(source: ContentSource): Promise<RawSignal[]>` where `RawSignal = { title, url, summary?, author?, publishedAt?, engagement }`
  - `fingerprint(url: string): string`
  - `scoreSignal(raw: RawSignal, weight: number, now: Date): number`
  - `runScout(): Promise<{ fetched: number; created: number; errors: {sourceId, message}[] }>`
  - `referenceText(source: ContentSource): Promise<string>` for URL/PDF sources

- [ ] **Step 1: Write the failing tests for fingerprint and score**

```ts
it("collapses the same story arriving with tracking params", () => {
  expect(fingerprint("https://m.com/p?utm_source=rss&ref=x"))
    .toBe(fingerprint("https://m.com/p"))
})
it("halves a signal's score every seven days", () => {
  const fresh = scoreSignal({ engagement: 100 } as RawSignal, 1, NOW)
  const week  = scoreSignal({ engagement: 100, publishedAt: WEEK_AGO } as RawSignal, 1, NOW)
  expect(week).toBeCloseTo(fresh / 2, 2)
})
it("multiplies by source weight", () => { /* ... */ })
```

- [ ] **Step 2: Run them and watch them fail**

- [ ] **Step 3: Implement `sources.ts`**

<!-- Corrected 25 Sep 2026 against the live network. -->

RSS through `fast-xml-parser` (handle both RSS 2.0 `<item>` and Atom `<entry>`);
HN through the Algolia API; **Reddit through its Atom feed**, not `top.json` —
that endpoint answers 403 unauthenticated, and `old.reddit.com`'s JSON answers
200 with the body "Not Found". Reddit also rate-limits hard, so space calls to
the same host. `URL` and `PDF` return no signals at all — they resolve to reference
text. PDFs come from the blob URL through `unpdf`. Every fetch has a timeout and
records `lastError` instead of throwing out of the loop; one dead feed must not
stop the scout.

- [ ] **Step 4: Implement `scout.ts`**

Fetch all enabled non-reference sources, dedupe by fingerprint, insert new
signals, update `lastFetchedAt`. Create at most one job per run, and none if two
non-terminal jobs already exist — this is the cadence control.

- [ ] **Step 5: Run the tests**

- [ ] **Step 6: Seed the sources from `CONTENT_ENGINE.md` §8**

A `scripts/seed-content-sources.ts` in the style of `scripts/seed-categories.ts`,
idempotent on `label`.

- [ ] **Step 7: Write and run the live fetch check**

`scripts/content-scout-check.ts` fetches one source of every kind against the
network and prints counts, a sample title and any error per kind. All five kinds
must return plausible data before this task is done.

- [ ] **Step 8: Add the cron route and the `vercel.json` entry**

`0 6 * * *`, `maxDuration = 300`, `CRON_SECRET` bearer auth copied from the email
cron.

- [ ] **Step 9: Commit**

`feat(content): trend scout over RSS, HN, Reddit and reference documents`

---

### Task 4: Brief and the duplicate guard

**Files:**
- Create: `src/lib/content/brief.ts`
- Create: `src/lib/content/embedding.ts`
- Create: `src/lib/content/taxonomy.ts` (extracted from `generate-post/route.ts`)
- Create: `scripts/content-backfill-embeddings.ts`
- Test: `src/lib/content/__tests__/embedding.test.ts`

**Interfaces:**
- Consumes: `complete` (Task 1), `ContentSignal` rows (Task 3).
- Produces:
  - `buildBrief(job): Promise<Brief>` — the schema in `CONTENT_ENGINE.md` §5.2
  - `embed(text: string): Promise<number[]>`
  - `cosine(a: number[], b: number[]): number`
  - `findNearDuplicate(vec: number[], threshold: number): Promise<{ slug: string; score: number } | null>`

- [ ] **Step 1: Write the failing cosine tests**

Identical vectors → 1; orthogonal → 0; the function must not mutate its inputs
and must throw on a length mismatch rather than returning a wrong number.

- [ ] **Step 2: Run them and watch them fail**

- [ ] **Step 3: Implement `embedding.ts`**

`text-embedding-3-small`, plus a backfill script that embeds every existing
`Post` from its title, excerpt and keywords. Run the backfill once, on
production data, before the guard goes live — an empty guard silently passes
everything.

- [ ] **Step 4: Extract the category taxonomy**

Move `CATEGORY_TAXONOMY` out of `generate-post/route.ts` into `taxonomy.ts` and
import it back, so the writer and the brief cannot drift apart. Export a
validator that rejects a category/subcategory pair outside the tree.

- [ ] **Step 5: Implement `buildBrief`**

Cluster the top unused signals, call `complete({ agent: "brief", schema })`,
validate the category pair, embed `angle`, and run `findNearDuplicate` at 0.88.
A duplicate marks the signals used, ends the job `FAILED` with
`error = "duplicate:<slug>"`, and records the similarity in the trace — the cost
of writing is never paid for a near-duplicate.

- [ ] **Step 6: Wire the `SCOUTED → BRIEFED` handler in `engine.ts`**

- [ ] **Step 7: Run one job end to end through BRIEFED**

`npx tsx scripts/content-scout-check.ts` then a `tick()` call; print the brief
and read it critically. If the angle is generic, the brief prompt is wrong — fix
it here, not downstream. **This is the step that determines whether the whole
pipeline produces anything worth publishing.**

- [ ] **Step 8: Commit**

`feat(content): brief agent with embedding-based duplicate guard`

---

### Task 5: English writer, SEO auditor, reviewer and the revision loop

**Files:**
- Create: `src/lib/content/writer.ts`, `src/lib/content/seo-audit.ts`, `src/lib/content/review.ts`
- Create: `src/lib/content/checks.ts` (deterministic, locale-agnostic)
- Modify: `src/app/api/ai/generate-post/route.ts` (becomes a thin caller of `writer.ts`)
- Modify: `src/lib/content/engine.ts`
- Test: `src/lib/content/__tests__/checks.test.ts`

**Interfaces:**
- Produces:
  - `writeArticle({ brief, locale, findings? }): Promise<Draft>`
  - `auditSeo(draft): Promise<{ score, checks, fixes }>`
  - `reviewDraft({ draft, brief, locale }): Promise<{ verdict, score, findings }>`
  - `runChecks(draft): { pass: boolean; failures: string[] }`

- [ ] **Step 1: Write the failing deterministic-check tests**

```ts
it("fails a draft containing a number absent from the verified bio", () => {
  expect(runChecks(draftWith("I have mentored 400 startups")).failures)
    .toContain("unverified-number:400")
})
it("fails placeholder text", () => { /* TODO, Lorem, [insert */ })
it("fails an internal link to a route that does not exist", () => { /* ... */ })
it("passes a clean draft", () => { /* ... */ })
```

- [ ] **Step 2: Run them and watch them fail**

- [ ] **Step 3: Implement `checks.ts`**

Number extraction compared against `VERIFIED_BIO` (allow numbers inside a cited
`<a href>` context); placeholder scan; internal-link resolution against the real
route list; meta length; FAQ presence; heading depth.

- [ ] **Step 4: Extract the writer without changing its behaviour**

Move the prompt stack out of `generate-post/route.ts` into `writer.ts`, add a
`brief` input and an optional `findings` input for revision passes. The route
keeps its current request/response shape so `/admin/posts/new` is untouched.
Verify by generating one article through the existing admin UI and diffing the
shape of the response against a pre-refactor capture.

- [ ] **Step 5: Implement `seo-audit.ts`**

Deterministic checks first, then the model audit for what code cannot judge.
Criteria from the repo's `seo-geo` / `seo-content` / `seo-page` skills — read
them; do not invent rules.

- [ ] **Step 6: Implement `review.ts`**

Hostile-editor prompt, `VERIFIED_BIO` as the only fact table, the §5.5 schema. A
`fabricated-number` or `bio-contradiction` blocker forces `BLOCK` in code after
the call — never rely on the model to set the verdict correctly.

- [ ] **Step 7: Wire `BRIEFED → DRAFTED → SEO_PASS → REVIEW → REVISING → DRAFTED`**

Assert in code that `review.en`'s resolved provider differs from `writer.en`'s,
and fail the tick loudly if a setting change has broken that.

- [ ] **Step 8: Run a full English job and read the output yourself**

Take it to `REVIEW` at least twice: once accepting, once with a deliberately
planted fabricated number in the draft to prove the reviewer catches it and the
loop returns to the writer.

- [ ] **Step 9: Commit**

`feat(content): English writer, SEO auditor and adversarial review loop`

---

### Task 6: Persian writer, Persian gate and Persian review

**Files:**
- Create: `src/lib/content/persian-gate.ts`
- Create: `src/lib/content/persian-rules.ts` (banned phrases, seeded, admin-editable)
- Modify: `src/lib/content/writer.ts`, `src/lib/content/review.ts`, `src/lib/content/engine.ts`
- Test: `src/lib/content/__tests__/persian-gate.test.ts`

**Interfaces:**
- Produces: `persianGate(html: string): { pass: boolean; failures: { rule: string; line: number; quote: string }[] }`

- [ ] **Step 1: Read the `persian-writing` and `humanizer` skills**

Both are installed. The gate's rules and the writer's prompt come from them.

- [ ] **Step 2: Write the failing gate tests, one per rule in `CONTENT_ENGINE.md` §7**

```ts
it("fails a missing ZWNJ", () => {
  expect(persianGate("<p>این کار انجام میشود.</p>").failures[0].rule).toBe("zwnj")
})
it("fails Arabic yeh and kaf", () => {
  expect(persianGate("<p>كتاب هاي من</p>").pass).toBe(false)
})
it("fails mixed digit systems", () => {
  expect(persianGate("<p>۳ شرکت و 4 بنیان‌گذار</p>").pass).toBe(false)
})
it("fails banned translationese", () => {
  expect(persianGate("<p>در دنیای امروز، بدون شک...</p>").failures).toHaveLength(2)
})
it("fails register mixing in a formal essay", () => {
  expect(persianGate("<p>باید بسازیم. نمیشه صبر کرد.</p>").pass).toBe(false)
})
it("fails straight quotes where guillemets belong", () => { /* ... */ })
it("passes clean formal Persian", () => {
  expect(persianGate("<p>این کار انجام می‌شود و ۳ شرکت آن را آزموده‌اند.</p>").pass).toBe(true)
})
```

- [ ] **Step 3: Run them and watch every one fail**

- [ ] **Step 4: Implement the gate as pure string analysis**

No model, no network. Report the line and the offending quote for each failure so
the writer's revision pass has something exact to fix. Banned phrases load from
`AppSetting` with `persian-rules.ts` as the seed.

- [ ] **Step 5: Add the Persian writer path**

`writeArticle({ brief, locale: "fa" })` writes from `brief` and
`brief.faLocalisation` only. Assert in code that it never receives the English
draft as input — a translation path is forbidden by the spec, and the assertion
is what keeps a future refactor from quietly adding one.

- [ ] **Step 6: Add the Persian review path**

`review.fa` audits register, ZWNJ, translationese and localisation quality, on a
provider different from `writer.fa` (asserted).

- [ ] **Step 7: Wire `FA_DRAFT → FA_REVIEW → ART`, with the gate first**

The gate runs before the model reviewer — if the gate fails there is no point
paying for a review. A gate failure returns to `FA_DRAFT` with the failing lines
attached, up to `maxRevisions`; after that the Persian post stays DRAFT and the
English post proceeds alone.

- [ ] **Step 8: Run three Persian articles and read them as a native speaker**

Hand them to Farjad. Every phrase he flags as AI-sounding that the gate let
through becomes a new banned-phrase entry in the same commit. The gate is
supposed to grow this way.

- [ ] **Step 9: Commit**

`feat(content): Persian writer with a deterministic publication gate`

---

### Task 7: Art, publish gate, cron and the admin surface

**Files:**
- Create: `src/lib/content/art.ts`, `src/lib/content/publish.ts`
- Create: `src/app/api/cron/content/route.ts`
- Create: `src/app/admin/content/{page.tsx,sources/page.tsx,signals/page.tsx,settings/page.tsx,rules/page.tsx}`
- Create: `src/app/api/admin/content/{jobs,sources,signals,settings}/route.ts`
- Modify: `vercel.json`, `src/app/admin/layout.tsx` (nav entry)
- Test: `src/lib/content/__tests__/publish.test.ts`

**Interfaces:**
- Produces:
  - `generateArt(draft): Promise<{ coverImage: string; bodyImages: string[] }>`
  - `shouldPublish({ locale, seoScore, reviewScore, draft }): Promise<{ publish: boolean; reasons: string[] }>`
  - `materialise(job): Promise<{ enPostId: string; faPostId: string }>`

- [ ] **Step 1: Write the failing publish-gate tests**

```ts
it("publishes English at or above its threshold", async () => { /* 85 → true */ })
it("holds Persian below its higher threshold", async () => { /* 90 vs 95 → false */ })
it("refuses to publish Persian that fails the gate even at score 100", async () => {
  const r = await shouldPublish({ locale: "fa", seoScore: 100, reviewScore: 100, draft: draftWithArabicYeh })
  expect(r.publish).toBe(false)
  expect(r.reasons).toContain("persian-gate:arabic-letters")
})
it("decides the locales independently", async () => { /* en publishes, fa holds */ })
```

- [ ] **Step 2: Run them and watch them fail**

- [ ] **Step 3: Implement `publish.ts`**

Score comparison plus `runChecks` plus, for Persian, `persianGate`. The gate's
veto is unconditional; there is no override parameter. A human force-publish from
the admin is a separate explicit action on the job, not a flag through this
function.

- [ ] **Step 4: Extract `art.ts` from `generate-post/route.ts`**

The FLUX + watermark path, unchanged in behaviour. Images are generated once and
shared by both locale posts.

- [ ] **Step 5: Implement `materialise` and wire `ART → READY → PUBLISHED`**

Two `Post` rows, one per locale, sharing `translationGroupId` and
`contentJobId`, created as DRAFT; then per-locale publication through
`shouldPublish`. Publishing the English post triggers the existing
content-waterfall and social publisher.

- [ ] **Step 6: Add the tick cron route**

`*/15 * * * *`, `maxDuration = 300`, `CRON_SECRET` bearer. Refuses to run when
`content.enabled` is false or the month's summed `costCents` exceeds
`content.budget.monthlyCents`.

- [ ] **Step 7: Build the admin surfaces**

Pipeline board by state with score, cost, iteration and an expandable trace;
sources CRUD including PDF upload through the existing `/api/media/upload`;
signals inbox with "write about this"; settings for thresholds, revisions,
budget, kill switch and per-agent provider/model with key-presence indicators;
the Persian banned-phrase editor. Follow the existing `/admin/newsletter`
layout patterns. Every job action (retry, force-publish, kill, edit brief) posts
to the jobs route and is recorded in the trace.

- [ ] **Step 8: Run the whole pipeline once, on a real trend, end to end**

Scout → published English post + Persian draft or post, with imagery. Read both
articles. Verify the trace shows every agent, model, token count and cost, and
that the total lands in the $1–2 range the spec predicts.

- [ ] **Step 9: Document and commit**

Update `CONTENT_ENGINE.md` with anything the build proved wrong, add a
`FEATURES.md` entry, and commit:
`feat(content): art, publish gate, cron driver and the content admin`

---

## Follow-up work, not in this plan

- **The Persian blog surface** (`/fa/blog` index and post routes, sitemap
  entries, hreflang pairs via `localeAlternates`, Persian RSS). Until it ships,
  Persian posts accumulate in the database and are reviewed through `/admin`.
  This is its own plan.
- Newsletter distribution of new articles through the existing email suite.
- Per-locale imagery, if shared images ever prove wrong for the Persian audience.
