# Changelog

All notable changes to the Official Website project will be documented in this file.

## [2026-03-13 16:25] - Social Publishing Bug Fixes

### Fixed
- **LinkedIn OAuth Flow**: Fixed a rendering bug causing Next.js router interception and hardcoded parameters to bypass strict URI validation and caching bugs.
- **Background Actions**: Wrapped Vercel Server Actions in `@vercel/functions` `waitUntil()` to prevent premature termination of the OpenAI-powered `runWaterfallPipeline`.
- **Hashtag Formatting**: Updated OpenAI prompts for LinkedIn and X (Twitter) to strictly place hashtags at the absolute end of the generated post, preventing overrides by the Call-to-Action.


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
