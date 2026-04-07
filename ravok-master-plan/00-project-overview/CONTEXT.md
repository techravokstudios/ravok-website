# 00 — Project Overview

## CONTEXT FOR CLAUDE CODE
> Read this file before touching ANY part of the ravok-website codebase. This is the business brain.

---

## The Business Model

RAVOK Studios is NOT a production company. NOT an accelerator. It's a **Venture Studio** that applies VC principles to filmmaking.

### How It Works:
1. **Film Ventures** — Each film is launched as a Special Purpose Vehicle (SPV), a standalone company co-founded with the creative partner. RAVOK deploys pre-seed development capital. Creator gets real equity and board seats. Currently: 4 in development, 1 in financing.

2. **Production Labels** — Specialized subsidiaries that function as repeatable venture pipelines, spinning up new SPVs. Each label targets a genre/audience niche. Currently: 4 divisions.

3. **Tech Ventures** — Proprietary technology companies that eliminate gatekeepers and give creators direct audience relationships. First-party data feeds back into the greenlight process. Currently: 3 in development, 1 in validation. Flagship: Phema.

### The Thesis:
- Mid-budget originals ($1M-$5M) outperform tentpoles on ROI
- Film is the LAST creative industry running on the old extractive model
- Musicians own masters. Writers own IP. YouTubers own channels. Filmmakers should own their work.
- Distribution: Festival-first (Sundance, TIFF, Cannes) → boutique streamers → direct-to-audience via Phema

### 2025 Slate (Fully Committed):
- **Bite Me** — [details TBD by Amanda]
- **HYSTERA** — [details TBD by Amanda]
- **Phema** — Tech venture / platform (audience-facing)

### Revenue Model:
- Equity stakes in SPVs (determined by development stage when creator joins)
- Production label IP ownership
- Tech venture exits and revenue
- NOT: work-for-hire, licensing fees, or traditional studio overhead

---

## The Founder

**Amanda Aoki** — Brazilian-born, LA-based. Started as an actress, moved to producing, saw the system was broken, built RAVOK to fix it.

Key quotes that define the brand voice:
- "We don't pitch to the gatekeepers — we build platforms to replace them."
- "The real risk is letting gatekeepers decide what gets made."
- "Your 'weakness' is your advantage."
- "Demand founder-level equity in your own work or go home."

---

## The Team Structure (as referenced on site)
- Visionary founder (Amanda)
- In-house legal counsel
- Professional producers
- Marketing strategy
- Design & IT specialists
- Talent guidance
- Advisory board (being finalized)

---

## Target Audiences for the Website

| Audience | What They Need | Primary CTA |
|----------|---------------|-------------|
| Co-Producers | See the equity model, understand SPV structure | "Partner with us" |
| Financiers / Investors | Portfolio exposure, transparent structures, returns | Register → Investor Portal |
| Distribution Partners | First-look at creator-owned IP, festival positioning | Contact |
| Operational Partners | COO/legal/marketing equity opportunities | Contact |
| Creators / Filmmakers | 2026 waitlist, understand the model | Join waitlist |
| Press / Media | Amanda's story, the thesis, social proof | Insights/Blog |

---

## Technical Architecture

```
ravok-website/
├── app/                  # Next.js 16 App Router pages
├── components/           # Shared React components
├── lib/                  # Frontend utilities and API client
├── public/               # Static assets (images, logo)
├── backend/              # Laravel 12 REST API
│   ├── app/              # Controllers, Models, Mail
│   ├── database/         # Migrations and seeders
│   ├── routes/           # API route definitions
│   └── resources/        # Blade email templates
└── .github/              # PR templates, CONTRIBUTING.md
```

| Layer | Tech | Host |
|-------|------|------|
| Frontend | Next.js 16, TypeScript, App Router | Vercel |
| Backend | Laravel 12, Sanctum auth | Railway |
| Database | PostgreSQL | Railway |
| File Storage | Railway volume (`investor-docs`) | Railway |
| Domain | ravokstudios.com | — |

---

## What Needs To Be Built (Full Scope)

1. **Rebrand the public site** — new visual identity, copy refresh, page additions
2. **Investor portal** — secure login, document access, dashboards, data rooms
3. **Content engine** — blog/insights CMS, SEO, social content pipeline
4. **CRM + automations** — lead capture, email sequences, partner onboarding flows
5. **Tech ventures integration** — Phema platform foundations
6. **Analytics + reporting** — investor dashboards, event tracking, conversion funnels
