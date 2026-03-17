# Changelog

All notable changes to the Official Website project will be documented in this file.

## [2026-03-13 16:25] - Social Publishing Bug Fixes

### Fixed
- **LinkedIn OAuth Flow**: Fixed a rendering bug causing Next.js router interception and hardcoded parameters to bypass strict URI validation and caching bugs.
- **Background Actions**: Wrapped Vercel Server Actions in `@vercel/functions` `waitUntil()` to prevent premature termination of the OpenAI-powered `runWaterfallPipeline`.
- **Hashtag Formatting**: Updated OpenAI prompts for LinkedIn and X (Twitter) to strictly place hashtags at the absolute end of the generated post, preventing overrides by the Call-to-Action.

## [2026-03-16 17:40] - System Logging + Backup Overhaul

### Added
- **System Logs (DB)**: Introduced `SystemLog` model to persist server/client logs, with indexes on level and timestamp.
- **Admin Logs UI**: New Settings tab + page to browse, filter, and delete log entries.
- **API Logging Wrapper**: `withApiLogging` wrapper logs all API requests/errors with timing and context.
- **Client Error Capture**: Global error boundary + `window.onerror` / `unhandledrejection` reporting to `/api/logs`.
- **UI Event Logger**: `logUiEvent` helper and logging for key admin actions (posts, tags, categories, testimonials, inbox, portfolio, backups).
- **Backup Blob Script**: New `scripts/backup-blob.mjs` for DB dump + code archive to Vercel Blob.
- **Backup Manifests**: Blob manifest storage for backup history and deletion tracking.

### Changed
- **Backup Workflow**: GitHub Actions now runs the Blob backup script and uses `BLOB_READ_WRITE_TOKEN`.
- **Backup Admin UI**: Added download links for DB/code files; updated Cloud Backups copy to Vercel Blob.
- **Backup API**: Logs backup actions to SystemLog and supports Blob download proxy with logging.
- **NextAuth Routes**: Auth route handlers wrapped with API logging.
- **Migrations**: Fixed broken `20260315_add_backup_log` migration SQL and added `20260316_add_system_log`.

### Fixed
- **Backup Trigger Feedback**: Improved error surfacing and logging around backup actions.


## [2026-03-07 16:13] - Platform Overhaul & Strategic Realignment

### Added
- **Diagnostic Tools**: Built "Startup Readiness Score" and "Investor Readiness Score" lead-capture tools with dynamic result scorecards.
- **Tools Hub**: Created an engaging `/tools` directory featuring 2 live tools and 5 new "Coming Soon" tools.
- **Founder Mentorship Service**: Added `/services/founder-mentorship` detailing pre-seed strategy, focus areas, and mental sparring frameworks.
- **Immigrant Founders Service**: Added `/services/immigrant-founders` with a strict business-first strategy positioning explicitly differentiating from standard visa consulting.
- **Business Automation Service**: Added `/services/business-automation` featuring operational systems architecture and AI automation stacks.
- **Founder Journey Timeline**: Implemented an honest, realistic vertical timeline on the Portfolio page tracking the status (Active, Dead, Acquired, etc.) of 9 personal startup ventures.

### Changed
- **About Page Redesign**: Sharpened hero positioning, added a "Credibility Strip" (15+ years experience), and restructured the Education section to highlight the transition from Anthropology to Systems Building.
- **Portfolio Data Architecture**: Unified disjointed data arrays (`STARTUPS_FOUNDED`, `GITHUB_REPOS`, etc.) into a single `PORTFOLIO_ITEMS` schema with explicit `role` tracking.
- **Portfolio UI Simplification**: Consolidated the portfolio interface into a clean, 3-tab layout: "My Startups", "Companies & Ventures", and "GitHub Projects".
- **Brand Consistency**: Applied strict brand guidelines (Alabaster, Dark Green `#0F3F35`, Burnt Orange `#D97706`, and Emerald `#10b981`) across all newly created pages.
