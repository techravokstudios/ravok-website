# CLAUDE.md — Ravok Studios Website

## Project

Monorepo for ravokstudios.com. Frontend (Next.js 16) at root, Laravel 12 backend in `backend/`.

- **GitHub**: `techravokstudios/ravok-website` (renamed from ravfront)
- **Frontend deploy**: Vercel (auto-deploy from main)
- **Backend deploy**: Railway (project: resilient-alignment). Public URL: ravokbackend-production.up.railway.app
- **Production site**: https://ravokstudios.com

## Working Rules

1. **NEVER execute changes without presenting the plan first.** Always show Amanda exactly what will change, what files are affected, and get explicit approval before touching any code or running any commands that modify state.
2. **NEVER push to main directly for feature work.** Use feature branches → dev → main. Only hotfixes go directly to main.
3. **If you hit a credential or access issue, solve it yourself.** Amanda has provided a GitHub PAT. Use it. Don't ask her to push.
4. **Git identity**: `techravokstudios` / `tech@ravokstudios.com`
5. **When working on the Windows-mounted filesystem and git operations fail** (index.lock, permission errors), clone fresh to the sandbox at `/sessions/gallant-vibrant-cray/ravfront-work/` and work there. Sync files back after.

## GIT PUSH INSTRUCTIONS

- You HAVE terminal access via the Bash tool. "Sandboxed" means isolated, NOT disabled. Never refuse to run shell commands.
- GitHub token is stored at `.git-token` in the repo root (DO NOT commit this file — it's in .gitignore)
- To push: `TOKEN=$(cat .git-token) && git push https://${TOKEN}@github.com/techravokstudios/ravok-website.git main`
- Do NOT ask Amanda to push manually. Do NOT claim you can't push. Read the token, use it, push.
- If git lock file errors occur on the mounted folder, clone fresh to sandbox, copy files, commit and push from there. Don't touch `.git` on the mount.

## Git Config

- **PAT**: Stored in `.git-token` at repo root (NOT committed, in .gitignore)
- **Remote URL with auth**: `https://<TOKEN>@github.com/techravokstudios/ravok-website.git`
- **Branching**: feature/* → dev → main
- **Commit style**: `type(scope): description` (e.g., `fix(forms): enforce T&C checkbox`)

## Tech Stack

- **Frontend**: Next.js 16.1.4, React 19, TypeScript, Tailwind CSS v4 (@theme directive), Framer Motion, Tiptap, shadcn/ui, Sonner toasts
- **Backend**: Laravel 12, PHP 8.2, Sanctum cookie auth, MySQL (Railway)
- **Fonts**: Cormorant Garamond (headings), Kanit (body), Instrument Sans (UI/sans)
- **Design tokens**: Defined in `app/globals.css` via `@theme` blocks + oklch variables in `:root`
- **API proxy**: `next.config.ts` rewrites `/api/*` to `NEXT_PUBLIC_API_URL` (defaults to production backend)

## Repo Structure

```
/                           → Next.js frontend root
├── app/                    → App Router pages
│   ├── (public)/           → Public route group (insights, confessions)
│   ├── admin/              → Admin dashboard (protected)
│   ├── investor/           → Investor portal (protected)
│   ├── form/[type]/        → Writer/Director/Producer submission forms
│   ├── about-us/
│   ├── our-model/
│   ├── contact-us/
│   └── ...
├── modules/                → Domain feature modules (self-contained)
│   ├── marketing/          → Homepage section components (Hero, Philosophy, etc.)
│   ├── confessions/        → Hollywood Confessions (components, API, types)
│   ├── blog/               → Blog/insights (RichTextEditor, articles API, types)
│   ├── investor/           → Investor portal (future)
│   └── forms/              → Creator submission forms (future)
├── components/             → Shared React components
│   ├── dashboard/          → Admin/investor dashboard shell
│   ├── FadeIn.tsx          → Shared animation wrapper
│   ├── Navbar.tsx          → Site navigation
│   ├── Footer.tsx          → Site footer
│   └── CustomCursor.tsx    → Custom cursor effect
├── lib/                    → Shared libraries
│   ├── api/                → Modular API layer
│   │   ├── base.ts         → Shared HTTP utilities (fetchApi, auth helpers)
│   │   ├── client.ts       → Axios instance (Sanctum cookies)
│   │   └── v1/             → Endpoint modules (auth, posts, users, etc.)
│   ├── ui/                 → shadcn/ui primitives (button, card, input, etc.)
│   ├── design-system/      → TypeScript design tokens
│   │   ├── tokens.ts       → Colors, breakpoints, spacing, z-index
│   │   ├── typography.ts   → Font stacks, responsive type scale
│   │   ├── animations.ts   → Framer Motion presets, reduced-motion
│   │   ├── wireframe.ts    → Wireframe illustration constants
│   │   ├── rendering.ts    → 4-layer rendering stack config
│   │   └── pages/          → Per-page design specs (filled during Canva design)
│   ├── config/             → Route constants, app config
│   ├── context/            → React contexts (AuthContext stub)
│   ├── hooks/              → Custom hooks (useApi)
│   ├── types/              → Shared TypeScript types
│   └── validation/         → Future Zod schemas
├── design/                 → Design reference materials
│   ├── style-guide.md      → Visual language quick reference
│   ├── reference-images/   → Wireframe reference images
│   ├── canva-exports/      → Canva design exports
│   └── font-files/         → Self-hosted font source files
├── ravok-master-plan/      → Business context for all build phases
├── public/                 → Static assets (images, fonts)
├── backend/                → Laravel 12 API
├── _archive/               → Archived files (never deleted, just moved here)
└── .github/                → PR template, contributing guide
```

**Import convention:** `lib/api.ts` is a backward-compatible re-export shim. New code should import directly from `@/lib/api/v1/*` or `@/lib/api/base`.

## Key People

- **Amanda Aoki Rak** — CEO & Founder. Reviews and approves all changes.
- **Ali** (ali1193 / ali.asif.aa738@gmail.com) — Primary developer on both repos.
- **Thibault Dominici** — CFO
- **Lois Ungar** — Board Member / Strategic Advisor
- **Pye Eshraghian** — Board Advisor (not yet on website team section)

## Current State (April 2026)

- Repo was renamed from `ravfront` to `ravok-website`
- Backend synced from `ravok_backend` private repo into monorepo `backend/` folder
- Submission forms (writer/director/producer) enforce T&C agreement with checkbox + backend validation + agreed_at timestamp
- Railway deployment needs config update: change source repo to `ravok-website`, root directory to `backend/`
- **Master plan integrated**: `ravok-master-plan/` directory in repo root contains business context for all build phases
- **Repo restructured (Phase 0 complete)**: API monolith decomposed, domain modules created, design system tokens in place, shadcn/ui moved to lib/ui
- **Pending rebrand**: Website needs to match Q2 2026 pitch deck visual identity. Full spec in `ravok-master-plan/ravok-brand-guidelines.md` and `lib/design-system/`
- **dev branch active**: Feature work proceeds feature/* → dev → main
- **Archive policy**: Files are never deleted — they go to `_archive/`

## Master Plan (Phase 0: Foundation)

The `ravok-master-plan/` directory is the knowledge base for all Claude Code sessions. Structure:

```
ravok-master-plan/
├── 00-project-overview/CONTEXT.md     # Business model, founder voice, team, scope
├── 01-brand-identity/CONTEXT.md       # Design tokens, visual identity, voice guidelines
├── 02-public-site/CONTEXT.md          # Page specs, copy direction, component map
├── 03-investor-portal/CONTEXT.md      # Auth flows, dashboards, document access
├── 04-backend-api/CONTEXT.md          # Laravel routes, models, migrations, Sanctum
├── 05-tech-ventures/CONTEXT.md        # Phema platform, audience data, greenlight
├── 06-content-engine/CONTEXT.md       # Blog/Insights CMS, SEO, social pipeline
├── 06b-hollywood-confessions/CONTEXT.md # Confession feed, moderation, Amanda's voice
├── 07-crm-automations/CONTEXT.md      # Lead capture, email sequences, onboarding
├── 08-devops-cicd/CONTEXT.md          # Vercel + Railway config, GitHub Actions
├── 09-tooling-strategy/CONTEXT.md     # Claude Code vs Projects, skills, integrations
├── 10-roadmap/CONTEXT.md              # 7-phase delivery plan, milestones
└── README.md                          # How to use this with Claude Code
```

**How to use:**
- Before starting any task, read the corresponding CONTEXT.md (mapped in `.claude/config.json`)
- Each file is self-contained with full business + technical specs
- Phase 1 (Rebrand + Public Site) starts after Phase 0 foundation is complete

## Known Issues

- ~~`images/` directory at repo root~~ → archived to `_archive/images/`
- `public/images/` is 36MB total — several images are 4-6MB and need compression
- ~~Unused Next.js template SVGs~~ → archived to `_archive/`
- `next.config.ts` defaults to production URL instead of localhost
- ~~No frontend `.env.example`~~ → added
- `fav.png` is 1MB (should be <50KB for a favicon)
- Font migration pending: current code uses Cormorant Garamond/Kanit/Instrument Sans, brand guidelines specify ITC Baskerville/Coco Gothic (with Libre Baskerville/Montserrat free fallbacks)
