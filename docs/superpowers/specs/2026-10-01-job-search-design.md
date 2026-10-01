# Job Search — design

Date: 2026-10-01 · Status: phases 1 and 2 built · Route: `/admin/jobs`

## Why

A private section for the site owner's own job search across Canada and the
United States: find postings, rank them against one career profile, track each
one from "found" to "offer", and prepare tailored application documents.

It started as a request to fork `feder-cr/invisible_playwright_mcp`. That repo
was read and rejected as a base: its value is a patched Firefox that hides
automation from anti-bot systems, it ships no macOS engine, it contains no
job-search code, and using it against job sites puts the owner's accounts at
risk. Three ideas are kept from it: a small set of single-purpose tools, state
that survives between runs, and its own rule that nothing is submitted that a
person has not read.

## Rules that shape everything

1. **Sanctioned sources only.** Public job-board APIs and feeds. No logged-in
   scraping, no fingerprint spoofing, no bot-detection workarounds.
2. **A person submits.** The system finds, ranks, drafts and tracks. It never
   sends an application.
3. **This repository is public.** No personal data in code, fixtures, seeds,
   tests or docs: the career profile, target companies, postings and drafts
   live in the database only.
4. **One fact table.** Every generated document is built from one career
   profile, so two documents cannot disagree about a date or a title.
5. **Owner only.** `/admin` admits EDITOR; this section does not. The page and
   every server action check `role === "OWNER"` themselves.

## Sources

Verified on 2026-10-01 with unauthenticated GETs:

| Kind | Endpoint | Result |
|---|---|---|
| `GREENHOUSE` | `boards-api.greenhouse.io/v1/boards/{token}/jobs?content=true` | 200, JSON |
| `LEVER` | `api.lever.co/v0/postings/{token}?mode=json` | 200, JSON |
| `ASHBY` | `api.ashbyhq.com/posting-api/job-board/{token}` | 200, JSON |
| `REMOTIVE` | `remotive.com/api/remote-jobs?search=…` | 200, JSON |

Later, not in phase 1: `ADZUNA` (CA + US aggregate; needs an API key the owner
creates) and Job Bank Canada (its feed answered with an empty stub; unverified).

A board is one company on one system, identified by a token the owner types
in. Every fetch goes through the existing `safeFetch` with a time box; a
failing board records `lastError` and never stops the run.

## Data

TEXT states with the union in a comment, no Postgres enums, one idempotent SQL
file applied with `prisma db execute` — the conventions `PerkOffer` and the
content engine already follow.

- **`JobBoard`** — `kind`, `label`, `token`, `enabled`, `lastFetchedAt`,
  `lastError`, `lastCount`. Unique on (`kind`, `token`).
- **`JobPosting`** — `boardId`, `fingerprint` (unique: kind + token + external
  id), `externalId`, `title`, `company`, `location`, `country`
  (`CA` | `US` | `NA` for both | `OTHER` | null), `remote`, `department`, `url`, `description`
  (plain text), `postedAt`, `firstSeenAt`, `lastSeenAt`, `closedAt`.
  - Triage: `prefilter` (`PASS` | `REJECT`), `prefilterReason`.
  - Ranking: `score` (0–100), `lane`, `scoreNotes` (JSON: why it fits, gaps,
    work-authorisation flag), `scoredAt`.
  - Pipeline: `status` (`NEW` | `SHORTLISTED` | `APPLIED` | `INTERVIEW` |
    `OFFER` | `REJECTED` | `DISMISSED`), `appliedAt`, `notes`.
- **`JobDocument`** (phase 2) — `postingId`, `kind` (`RESUME` | `COVER`),
  `content`, `model`, `createdAt`.
- **Career profile** — one `AppSetting` row, key `jobs.profile`, JSON:
  identity line, work authorisation per country, lanes with their title
  keywords, locations, the dated role history, verified figures, exclusions.
  Edited in the admin; never committed.

## Pipeline

One cron tick (`/api/cron/jobs`, daily, `CRON_SECRET` like the other two):

1. **Ingest.** For each enabled board: fetch, normalise to one shape, upsert by
   fingerprint, bump `lastSeenAt`. A posting absent from its board for two
   consecutive runs gets `closedAt`.
2. **Prefilter — no model call.** Pure function over title, location and the
   profile: title must match a lane keyword and no exclusion; location must be
   Canada, the US, or remote open to Canada. Most postings stop here, which is
   what keeps the cost small.
3. **Score.** Up to N new `PASS` postings per tick (default 25) go to one
   structured-output call through the existing `provider.complete`, with a new
   agent `jobs.score`. Output: `score`, `lane`, `fit`, `gaps`,
   `authorisation` (`OK` | `NEEDS_SPONSORSHIP` | `UNCLEAR`).

A posting's description is untrusted text. The prompt presents it as data, the
answer is schema-constrained, and nothing in the pipeline acts on it — the
worst a hostile posting can do is earn a wrong score.

## Screens

- **`/admin/jobs`** — ranked list. Filters: status, lane, country, remote,
  minimum score. Each row: title, company, location, score, age, the one-line
  reason. Status changes inline.
- **`/admin/jobs/[id]`** — description, score notes, notes field, status,
  link to the original posting. Phase 2 adds "draft résumé" and "draft cover
  letter".
- **`/admin/jobs/boards`** — add, disable and test boards; last fetch, count
  and error per board.
- **`/admin/jobs/profile`** — the career profile editor.

Sidebar: one item, "Job Search", under Business, shown to OWNER only.

## Phases

1. **Find and track** — models, four sources, cron, prefilter, scoring, the
   list, the detail page, boards, profile. Useful by itself.
2. **Tailored documents** — résumé and cover letter per posting, generated
   from the profile only, with a PDF export. Blocked until the role history in
   the profile is settled.
3. **Reach** — Adzuna, Job Bank, a daily digest email of new postings above a
   score, and apply-assist: the form is filled in the owner's own browser
   session and the owner presses submit.

## Testing

Vitest, as `src/lib/content/__tests__`:

- one normaliser test per source, on invented fixtures (rule 3);
- prefilter: lane match, exclusion, each location case;
- fingerprint stability and the closed-after-two-misses rule;
- the owner check: an EDITOR session is refused by every action.

## Out of scope

Auto-submitting applications; LinkedIn, Indeed or Glassdoor scraping; stealth
browsers; storing third-party credentials.

## Phase 2 as built (2026-10-01)

- **Career record** in the profile: contact, history, education, certifications,
  skills. History is edited as text (`## Company | City | YYYY-MM – present`,
  `titles: A, B`, `- fact`) and parsed by `src/lib/jobs/history.ts`.
- **One timeline, several titles.** Each role has one start and one end date,
  used on every résumé. It lists every title that was true for it; a résumé
  picks the one that fits the posting.
- **Generation** (`documents.ts`, `generate.ts`, agent `jobs.resume`): the model
  returns a draft; code copies employers, dates, contact, education and
  certifications from the record, accepts a title only if the record lists it,
  restores any role the model dropped, and sends the draft back once if it
  contains a figure the record does not. Every version is kept (`JobDocument`).
- **Export:** `/admin/jobs/[id]/documents` lays out the résumé and the cover
  letter for print; the browser's "Save as PDF" is the export, so the text stays
  selectable for applicant-tracking systems.
- **Scoring** now estimates a realistic chance of being shortlisted, not fit.
- **Adzuna** source (`ADZUNA`, token `ca:title` or `us:title`): a market-wide
  title search, the main source once `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` exist.
  The "Boards" tab is now "Searches".

## Résumé editor (2026-10-01)

- `/admin/jobs/[id]/documents` is an editor beside the printed page. Wording
  is editable; employers, places and dates are locked and re-applied on the
  server (`editor.ts`); a title must be one the profile lists for that role.
  Saving updates the document and stamps `editedAt`.
- **AI help** (`assist.ts`, agent `jobs.assist`) on the headline, summary, a
  role's bullets and the cover letter: quick actions or a free instruction.
  The answer is a suggestion with warnings (figures not in the profile, a
  dropped qualifier); nothing changes until "Use this".
- **Review**: instant checks in the browser (`review.ts`: contact, length,
  long or same-opening bullets, uniform rhythm, em dashes, stock phrases,
  figures not in the profile, qualifiers dropped) and a model pass
  (agent `jobs.review`): posting keywords with coverage computed in code,
  each requirement met / partly / no, and lines that read as AI-written with
  a rewrite that can be applied in place.
- Generation now keeps qualifiers ("nearly $5M"): a draft that drops one is
  sent back once, and noted if it still does.
