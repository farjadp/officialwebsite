# Features

Overview of the core capabilities, functionality, and sections of the Farjad.P Official Website platform.

## 1. Core Pages & Identity
- **Premium Branded UI**: Strictly enforces a high-trust, serious aesthetic using Alabaster for reading, Dark Green (`#0F3F35`), and Burnt Orange (`#D97706`) accents.
- **Responsive Architecture**: Fully mobile-optimized layouts with custom UI components.
- **About / Authority Page**: Showcases a credibility strip (15+ years experience), explicit "Anti-Goals" (clarifying who is NOT a fit), and an education timeline contextualized by an Anthropology foundation.

## 2. Portfolio & Founder Journey
- **Unified Portfolio System**: A dynamic, data-driven portfolio rendering engine capable of displaying projects with role descriptors, GitHub links, tech stacks, and visibility metrics (Public/Private).
- **Portfolio Detail Pages**: Each portfolio item has a dedicated slug-based page (`/portfolio/[slug]`) available in both English and Farsi, rendering full project metadata, tech stack, and role context.
- **Categorized Tabs**: Clean content navigation separating "Companies & Ventures" and "GitHub Projects".
- **Founder Journey Timeline**: A dedicated "My Startups" tab featuring a vertical timeline that honestly tracks the status (Active, In Progress, Dead, Concluded, Acquired) of all historical ventures.

## 3. Service Offerings
- **Founder Mentorship**: Details pre-seed strategy, product-market validation, and engagement formats. Includes fit constraints and pricing structures.
- **Immigrant Founders (SUV Strategy)**: A distinctly positioned service focusing on building real companies in Canada, explicitly separate from visa application factories.
- **Business Automation**: Highlights systems architecture, CRM/Sales automation, and AI integration for scaling businesses. Maps workflows (e.g., Lead Capture -> CRM -> Automation).

## 4. Interactive Diagnostics & Tools
- **Tools Hub**: A vibrant directory for interactive diagnostics and capability assessments.
- **Startup Readiness Score**: A comprehensive 30-question interactive assessment generating customized advice on go-to-market strategies.
- **Investor Readiness Score**: A 30-question tool assessing fundraising preparedness with categorized strength/weakness output.
- **NPI Assessment Tool**: A 6-page brand assessment wizard at `/tools/npi-assessment` that generates a fully populated 5-sheet Excel file and sends it to the user via email, with a Telegram lead alert to the admin.
- **Lead Capture Integration**: Forms and routing to safely capture lead data upon diagnostic completion.

## 5. Admin & Content Management
- **Admin Dashboard**: Secure panel for managing blog posts, portfolio items, and mentored startups.
- **Startup CMS**: Full CRUD interface for the `MentoredStartup` database model — create, edit, reorder, and delete startup entries without touching code.
- **User Management**: Admin-level user table with inline editing and delete operations backed by REST API routes.
- **System Logs**: Persistent log viewer for server and client errors with filtering and deletion controls.

## 6. Technical Stack
- **Framework**: Built with Next.js 15 (App Router), React, and TypeScript.
- **Design System**: Tailwind CSS, Shadcn UI / Radix primitives, Lucide Icons.
- **Data Architecture**: PostgreSQL database managed via Prisma ORM; statically typed TypeScript data structures for public content.
- **Deployment**: Automated Git-to-production pipelines via Google Cloud Build and Cloud Run.
