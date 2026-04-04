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

## Git Config

- **PAT**: Stored in environment (GitHub PAT for techravokstudios account)
- **Remote URL with auth**: `https://techravokstudios:<PAT>@github.com/techravokstudios/ravok-website.git`
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
/                       → Next.js frontend root
├── app/                → App Router pages
│   ├── admin/          → Admin dashboard (protected)
│   ├── investor/       → Investor portal (protected)
│   ├── form/[type]/    → Writer/Director/Producer submission forms
│   ├── about-us/
│   ├── our-model/
│   ├── contact-us/
│   ├── insights/       → Blog/insights
│   └── ...
├── components/         → React components
│   ├── ui/             → shadcn/ui primitives
│   ├── dashboard/      → Admin/investor dashboard components
│   └── *.tsx           → Public site components (Hero, Navbar, Footer, etc.)
├── lib/                → Utilities (api.ts, utils.ts, toast.ts)
├── public/images/      → Static images
├── backend/            → Laravel 12 API
│   ├── app/
│   ├── routes/api.php
│   ├── database/
│   └── ...
└── .github/            → PR template, contributing guide
```

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
- **Master plan integrated**: `ravok-master-plan/` directory in repo root contains business context for all build phases (00-project-overview through 10-roadmap)
- **Pending rebrand**: Website needs to match Q2 2026 pitch deck visual identity (warm charcoal bg, brighter gold, blueprint grid, wireframe statues, Ionic columns, meander borders). Full spec in `ravok-master-plan/01-brand-identity/CONTEXT.md`
- **dev branch active**: Feature work proceeds feature/* → dev → main

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

- `images/` directory at repo root (tracked, not referenced by code) — should be removed
- `public/images/` is 36MB total — several images are 4-6MB and need compression
- Unused files tracked in git: `01.png`, `bg_image_1.png`, `partners1.png`, Next.js template SVGs
- `next.config.ts` defaults to production URL instead of localhost
- No frontend `.env.example`
- `fav.png` is 1MB (should be <50KB for a favicon)
