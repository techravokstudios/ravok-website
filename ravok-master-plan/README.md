# RAVOK Studios — Master Plan Knowledge Base

> **Purpose:** This directory is the skeleton that Claude Code (and any dev) uses to build everything 10x faster. Every section has context markdown files that explain the WHY, WHAT, and HOW so AI agents never hallucinate business logic.

## Who We Are

RAVOK Studios is the first venture studio turning filmmakers into founders and films into sustainable businesses. Founded by Amanda Aoki, based in Los Angeles. We apply venture capital principles to filmmaking — SPVs, creator equity, transparent governance.

## Repo

- **GitHub:** `techravokstudios/ravok-website`
- **Stack:** Next.js 16 (App Router, TypeScript) + Laravel 12 (Sanctum auth)
- **Frontend hosting:** Vercel
- **Backend hosting:** Railway (PostgreSQL + file storage)
- **Live site:** ravokstudios.com
- **Branch strategy:** `feature/* → dev → main`

## Current State (April 2026)

- Site is live at ravokstudios.com but needs rebranding + new features
- 23 commits on main — early stage monorepo
- Investor portal exists (login/register) but needs full buildout
- 2025 slate: Bite Me, HYSTERA, Phema (all in development)
- 4 film ventures in development, 1 in financing
- 4 production label divisions
- 3 tech ventures in development, 1 in validation
- Advisory board being finalized
- First hosted event completed (70+ attendees)
- Flagship feature raising PE round

## Knowledge Base Directory Map

| # | Section | What Claude Code Needs It For |
|---|---------|-------------------------------|
| 00 | [Project Overview](./00-project-overview/) | Global context — business model, venture structure, team, tone |
| 01 | [Brand Identity](./01-brand-identity/) | Design tokens, voice guidelines, visual language |
| 02 | [Public Site](./02-public-site/) | Every page spec, copy direction, SEO, component map |
| 03 | [Investor Portal](./03-investor-portal/) | Auth flows, dashboards, document access, data rooms |
| 04 | [Backend API](./04-backend-api/) | Laravel routes, models, migrations, Sanctum auth, email |
| 05 | [Tech Ventures](./05-tech-ventures/) | Phema platform, audience data, greenlight process |
| 06 | [Content Engine](./06-content-engine/) | Blog/Insights CMS, SEO strategy, social content pipeline |
| 07 | [CRM & Automations](./07-crm-automations/) | Lead capture, email sequences, partner onboarding |
| 08 | [DevOps & CI/CD](./08-devops-cicd/) | Vercel + Railway config, GitHub Actions, env management |
| 09 | [Tooling Strategy](./09-tooling-strategy/) | When to use Claude Code vs Projects, skills, integrations |
| 10 | [Roadmap](./10-roadmap/) | Phased delivery plan with milestones |

## How To Use This With Claude Code

1. Clone the repo: `git clone https://github.com/techravokstudios/ravok-website.git`
2. Copy this `ravok-master-plan/` folder into the repo root (or keep it adjacent)
3. When starting a Claude Code session, point it to the relevant section:
   - "Read `ravok-master-plan/03-investor-portal/CONTEXT.md` then build the investor dashboard"
   - "Read `ravok-master-plan/01-brand-identity/CONTEXT.md` then rebrand the homepage"
4. Each CONTEXT.md file is self-contained — Claude Code gets full business + technical context in one file

## Golden Rules

- **Never commit `.env` files** — secrets live in Vercel/Railway dashboards
- **All PRs go to `dev` first** — never push directly to `main`
- **Every new API endpoint gets documented** in `backend/README.md`
- **Brand voice is founder-led** — Amanda's voice is the brand. Direct, rebellious, no corporate fluff.
