# CLAUDE.md — Ravok Studios Website

## Project

Monorepo for ravokstudios.com. Frontend (Next.js 16) in `src/`, Laravel 12 backend in `backend/`.

- **GitHub**: `techravokstudios/ravok-website`
- **Frontend deploy**: Vercel — **MAIN BRANCH ONLY → PRODUCTION**
- **Backend deploy**: Railway (project: resilient-alignment). Public URL: ravokbackend-production.up.railway.app
- **Production site**: https://ravokstudios.com

---

## ⚠️ BRANCH RULES — ABSOLUTE. NO EXCEPTIONS.

**MAIN IS PRODUCTION. MAIN IS SACRED.**

1. **NEVER push to `main`.** Not for fixes. Not for "quick changes." Not ever — unless Amanda explicitly says the exact words "push to main" or "merge to main."
2. **NEVER force push to `main`.** Ever.
3. **NEVER assume "merge to main" is implied** by any other instruction. It must be explicitly stated.
4. **If unsure — it does NOT go to main. Ask first.**
5. All work goes to `dev` (soft changes) or `v2` (major restructure). Never to `main`.

### Branch Structure

| Branch | Purpose | Deploys to |
|--------|---------|------------|
| `main` | Production — the live site. NEVER touch. | Vercel PRODUCTION |
| `dev` | Soft changes, features, small fixes | Vercel preview |
| `v2` | Major restructure (arch rebuild) | Vercel preview |
| `v1` | Pre-restructure snapshot | — |
| `v0` | Original site snapshot (April 4, 2026) | — |

**Vercel deploys ALL branches as previews. Only `main` deploys to production.**

---

## Working Rules

1. **NEVER execute changes without presenting the plan first.** Always show Amanda exactly what will change, what files are affected, and get explicit approval before touching any code or running any commands that modify state.
2. **NEVER push to `main` for any reason whatsoever.** Use `dev` or `v2`. Amanda decides when to merge to `main`.
3. **If you hit a credential or access issue, solve it yourself.** GitHub PAT is at `.git-token`. Use it. Don't ask Amanda to push.
4. **Git identity**: `techravokstudios` / `tech@ravokstudios.com`
5. **When working on the Windows-mounted filesystem and git operations fail** (index.lock, permission errors), clone fresh to the sandbox and work there. Sync back after.

---

## GIT PUSH INSTRUCTIONS

- You HAVE terminal access via the Bash tool. Never refuse to run shell commands.
- GitHub token is stored at `.git-token` in the repo root (DO NOT commit — it's in .gitignore)
- To push: `TOKEN=$(cat .git-token) && git push https://${TOKEN}@github.com/techravokstudios/ravok-website.git <branch>`
- Do NOT ask Amanda to push manually.
- **PUSH TARGET IS ALWAYS `dev` OR `v2` — NEVER `main`.**

---

## Git Config

- **PAT**: Stored in `.git-token` at repo root (NOT committed, in .gitignore)
- **Remote URL with auth**: `https://<TOKEN>@github.com/techravokstudios/ravok-website.git`
- **Branching**: work on `dev` or `v2` only — Amanda merges to `main`
- **Commit style**: `type(scope): description` (e.g., `fix(forms): enforce T&C checkbox`)

---

## Tech Stack

- **Frontend**: Next.js 16.1.4, React 19, TypeScript, Tailwind CSS v4 (@theme directive), Framer Motion, Tiptap, shadcn/ui, Sonner toasts
- **Backend**: Laravel 12, PHP 8.2, Sanctum cookie auth, MySQL (Railway)
- **Fonts**: Cormorant Garamond (headings), Kanit (body), Instrument Sans (UI/sans)
- **Design tokens**: `src/styles/globals.css` via `@theme` blocks — currently only 3 brand colors on main, full system pending
- **API proxy**: `next.config.ts` rewrites `/api/*` to `NEXT_PUBLIC_API_URL`

---

## Repo Structure

```
/                               → Next.js frontend root
├── src/                        → ALL FRONTEND CODE
│   ├── app/                    → PAGES — mirrors the website
│   │   ├── page.tsx            #   Home
│   │   ├── about-us/           #   About Us
│   │   ├── our-model/          #   Our Model
│   │   ├── contact-us/         #   Contact
│   │   ├── form/[type]/        #   Creator forms
│   │   ├── (public)/insights/  #   Insights (blog + confessions)
│   │   │   ├── _components/    #     ConfessionWall, ConfessionCard
│   │   │   ├── _api/           #     Articles + confessions API
│   │   │   └── _types/         #     Page-specific types
│   │   ├── investor/           #   Investor Portal (protected)
│   │   │   └── _components/    #     DashboardShell
│   │   ├── admin/              #   Admin CMS (protected)
│   │   │   └── _components/    #     RichTextEditor, DashboardShell
│   │   ├── login/ register/    #   Auth pages
│   │   └── terms/privacy       #   Legal pages
│   │
│   ├── components/             → SHARED UI (used across multiple pages)
│   │   ├── layout/             #   Navbar, Footer
│   │   ├── sections/           #   Homepage sections (Hero, Philosophy, etc.)
│   │   ├── ui/                 #   shadcn primitives (Button, Card, Input)
│   │   └── shared/             #   FadeIn, CustomCursor
│   │
│   ├── lib/                    → SHARED LOGIC
│   │   ├── api/                #   HTTP client + v1/ endpoint modules
│   │   ├── hooks/              #   Custom hooks
│   │   ├── types/              #   Shared TypeScript types
│   │   ├── utils/              #   Utility functions
│   │   ├── config/             #   Route constants
│   │   └── context/            #   Auth context
│   │
│   ├── design-system/          → VISUAL IDENTITY
│   └── styles/globals.css      #   Tailwind + design tokens
│
├── backend/                    → Laravel 12 API (Railway)
├── public/                     → Static assets
└── [config files]
```

**Rule: each page owns its stuff.** Page-specific components/API/types live in `_components/`, `_api/`, `_types/` inside that page folder. Only shared-across-pages code goes in `components/` or `lib/`.

---

## Key People

- **Amanda Aoki Rak** — CEO & Founder. The only person who decides when something goes to `main`.
- **Ali** (ali1193 / ali.asif.aa738@gmail.com) — Primary developer on both repos.
- **Thibault Dominici** — CFO
- **Lois Ungar** — Board Member / Strategic Advisor
- **Pye Eshraghian** — Board Advisor

---

## Current State (April 2026)

- **`main` / `v0`**: Production — April 4, 2026 state. Commit `fb9a7d4`. DO NOT TOUCH.
- **`v2`**: Arch rebuild — all code in `src/`, same visual design as main. Work in progress.
- **`dev`**: Soft changes branched from main
- **Next up**: Design system (colors, typography, spacing) on `dev`/`v2`, new pages (team/[slug], portfolio, pitch-us), newsletter, Vercel Analytics

## Known Issues

- `public/images/` is 36MB — images need compression
- `next.config.ts` defaults to production URL instead of localhost
- `fav.png` is 1MB (should be <50KB)
- globals.css on main has only 3 brand colors — full design system not yet defined
