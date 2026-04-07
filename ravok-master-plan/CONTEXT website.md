# 10 — Roadmap

## CONTEXT FOR CLAUDE CODE
> This is the build order. Follow these phases sequentially. Each phase is designed to ship value before starting the next.

---

## Phase 0: Foundation (Week 1)
**Goal:** Get the master plan into the repo and establish the dev workflow.

- [ ] Copy `ravok-master-plan/` into the repo root
- [ ] Create `.claude` config file for Claude Code auto-context
- [ ] Set up `dev` branch if not already active
- [ ] Verify Vercel deploys from `main`
- [ ] Verify Railway deploys from `main`
- [ ] Confirm PostgreSQL is running on Railway
- [ ] Run existing migrations (`php artisan migrate`)
- [ ] Test local dev setup (frontend + backend)

**Deliverable:** Working local dev environment, master plan in repo.

---

## Phase 1: Rebrand + Public Site (Weeks 2-3)
**Goal:** ravokstudios.com looks and feels like a $10M venture studio.

### Week 2:
- [ ] Amanda confirms brand direction (see `01-brand-identity/CONTEXT.md` checklist)
- [ ] Implement design tokens (colors, fonts, spacing)
- [ ] Rebuild `<Header />` with updated nav (Home, About, Model, Portfolio, Insights, Investors, Contact)
- [ ] Rebuild `<Footer />` with socials, legal links, newsletter signup
- [ ] Rebuild Homepage hero section
- [ ] Rebuild Homepage problem/solution sections
- [ ] Build `<VentureModelDiagram />` component

### Week 3:
- [ ] Build Portfolio page with venture cards
- [ ] Rebuild About page with Amanda's story (she fills in the "[SPECIFIC MOMENT]" placeholder)
- [ ] Build Our Model page with SPV explainer
- [ ] Build Contact page with form (connected to backend)
- [ ] Build Creators page with waitlist form
- [ ] Build Partners page
- [ ] SEO: metadata, OpenGraph, structured data, sitemap
- [ ] Mobile responsive pass on all pages

**Deliverable:** Fully rebranded public site live at ravokstudios.com.

---

## Phase 2: Backend Infrastructure (Weeks 3-4)
**Goal:** Database, API, and admin foundations ready for the portal.

- [ ] Write and run all migrations (ventures, documents, updates, contacts, waitlist, articles, tags)
- [ ] Create Eloquent models with relationships
- [ ] Build public API endpoints (contact form, waitlist, articles, public ventures)
- [ ] Build auth endpoints (register, login, logout, user)
- [ ] Add role-based middleware (admin, investor, partner, pending)
- [ ] Set up email provider (Resend) and test transactional emails
- [ ] Build admin endpoints (CRUD for ventures, documents, updates, articles, users)
- [ ] Seed database with current ventures (Bite Me, HYSTERA, Phema + labels)
- [ ] Test all endpoints via Postman or similar

**Deliverable:** Fully functional REST API with all core endpoints.

---

## Phase 3: Investor Portal (Weeks 5-6)
**Goal:** Investors can log in, see their portfolio, and access documents.

### Week 5:
- [ ] Build portal layout (sidebar nav, header with user info)
- [ ] Build Dashboard page (portfolio snapshot, recent updates, metrics)
- [ ] Build Ventures list page
- [ ] Build Venture detail page (financials, team, timeline, docs)
- [ ] Build Documents library page with category filters

### Week 6:
- [ ] Build secure document download (signed URLs or streamed)
- [ ] Build Updates timeline page
- [ ] Build User profile page
- [ ] Build admin panel: user management (approve/reject, change roles)
- [ ] Build admin panel: venture management (CRUD)
- [ ] Build admin panel: document upload
- [ ] Build admin panel: publish updates (with optional email trigger)
- [ ] Download audit logging
- [ ] Security review: CSRF, XSS, SQL injection, rate limiting

**Deliverable:** Secure investor portal, admin can manage everything.

---

## Phase 4: Content Engine (Weeks 7-8)
**Goal:** Amanda can publish thought leadership and it ranks on Google.

- [ ] Build admin article editor (rich text — TipTap recommended)
- [ ] Build article management (draft/publish/archive)
- [ ] Build tag management
- [ ] Build `/insights` listing page with filters
- [ ] Build `/insights/[slug]` article page with SEO metadata
- [ ] Build article cards component for homepage
- [ ] Set up image upload (Cloudinary or Railway volume)
- [ ] Generate RSS feed at `/insights/feed.xml`
- [ ] Write and publish first 3 articles (using Claude Project "RAVOK Content Engine")
- [ ] Submit sitemap to Google Search Console

**Deliverable:** Live blog with published content, indexed by Google.

---

## Phase 5: CRM & Automations (Weeks 8-9)
**Goal:** No lead falls through the cracks. Amanda gets a weekly digest.

- [ ] Wire contact form → database + email notification
- [ ] Wire waitlist form → database + confirmation email
- [ ] Wire registration → admin notification
- [ ] Build admin contacts/leads view with filters
- [ ] Build admin waitlist view
- [ ] Build weekly digest scheduled command
- [ ] Set up Slack webhook for real-time lead notifications
- [ ] Build document upload → investor email notification
- [ ] Set up PostHog for analytics (or Vercel Analytics if simpler)
- [ ] Create conversion funnel dashboard

**Deliverable:** Automated lead management, analytics running.

---

## Phase 6: Polish & Scale (Weeks 10-12)
**Goal:** Everything is production-hardened and ready for investor traffic.

- [ ] Performance optimization (Core Web Vitals, image optimization, caching)
- [ ] Error monitoring (Sentry integration)
- [ ] Uptime monitoring (BetterStack)
- [ ] GitHub Actions: PR checks, security audits, deploy notifications
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Legal review: Terms & Privacy Policy updated
- [ ] Load testing (can the portal handle 50+ concurrent investors?)
- [ ] Backup strategy for PostgreSQL + file storage
- [ ] Documentation: API docs, deployment runbook, admin guide
- [ ] Social content pipeline setup (blog → social drafts)

**Deliverable:** Production-ready, monitored, documented system.

---

## Phase 7: Tech Ventures Foundation (Weeks 12+)
**Goal:** Lay infrastructure for Phema and other tech ventures.

- [ ] Define Phema MVP scope (Amanda's call)
- [ ] Decide: separate repo or monorepo service?
- [ ] Design shared auth strategy (OAuth2 or shared Sanctum sessions)
- [ ] Build data pipeline foundation (audience analytics → RAVOK dashboard)
- [ ] Portfolio page shows tech venture progress with live metrics
- [ ] This phase is highly dependent on Amanda's product decisions for Phema

---

## Milestone Summary

| Phase | Weeks | Milestone |
|-------|-------|-----------|
| 0 | 1 | Foundation: dev environment + master plan in repo |
| 1 | 2-3 | Rebranded public site live |
| 2 | 3-4 | Backend API complete |
| 3 | 5-6 | Investor portal live |
| 4 | 7-8 | Content engine live, first articles published |
| 5 | 8-9 | CRM + automations running |
| 6 | 10-12 | Production hardened, fully monitored |
| 7 | 12+ | Tech ventures infrastructure |

**Total timeline to full v1: ~12 weeks with 1 developer using Claude Code.**
**With 2 developers: ~8 weeks (frontend + backend in parallel from Phase 2).**
