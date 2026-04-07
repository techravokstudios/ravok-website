# 07 — CRM & Automations

## CONTEXT FOR CLAUDE CODE
> Read this before building any lead capture, email, or automation features.

---

## The Conversion Funnel

```
Visitor → Contact Form / Waitlist / Register
   ↓
Lead (in database)
   ↓
Amanda reviews → Approve / Reject / Follow up
   ↓
Onboarded Partner / Investor / Creator
   ↓
Active relationship (portal access, updates, deal flow)
```

---

## Lead Capture Points

| Form | Location | Fields | Table |
|------|----------|--------|-------|
| Contact form | `/contact` | Name, email, partner type, message | `contacts` |
| Creator waitlist | `/creators` | Name, email, logline, portfolio URL | `waitlist` |
| Investor registration | `/register` | Name, email, password, accreditation status | `users` (role: pending) |
| Newsletter signup | Footer / blog | Email only | `waitlist` or separate `subscribers` table |

---

## Email Sequences

### Sequence 1: New Contact
```
Trigger: Contact form submission
→ Immediate: "Thanks for reaching out" confirmation email
→ Internal: Notify Amanda via email or Slack
→ +3 days (if no response from Amanda): Reminder to follow up
```

### Sequence 2: Creator Waitlist
```
Trigger: Waitlist signup
→ Immediate: "You're on the 2026 waitlist" + what to expect
→ +7 days: "While you wait — read our model" (link to /model)
→ +30 days: "Applications opening soon" (when ready)
```

### Sequence 3: Investor Registration
```
Trigger: User registers with investor intent
→ Immediate: "We've received your registration" email
→ Internal: Admin notification to review + approve
→ On approval: "Welcome to the RAVOK Investor Portal" + login link
→ +1 day after approval: "Start here — your portfolio overview"
```

### Sequence 4: Investor Updates
```
Trigger: Admin publishes new update
→ Email all investors (or filtered by venture/visibility)
→ Subject: "[RAVOK] {Update Title}"
→ Body: Excerpt + "Read full update in your portal"
```

---

## Email Provider Recommendation

| Provider | Why |
|----------|-----|
| **Resend** | Best DX for Next.js/Laravel stack, React email templates, generous free tier |
| **Postmark** | Gold standard for transactional email deliverability |
| **SendGrid** | Most feature-rich but more complex |

**Recommendation:** Start with **Resend** for simplicity. Migrate to Postmark if deliverability becomes critical for investor communications.

---

## CRM Options

### Option A: Built-in (Recommended for now)
- The `contacts`, `waitlist`, and `users` tables ARE the CRM
- Admin panel in the investor portal shows all leads
- Amanda can filter by partner_type, responded status, date
- Simple but effective for current scale

### Option B: External CRM (When scaling)
- HubSpot Free CRM — integrates with everything
- Attio — modern, built for relationship-heavy businesses like VC
- Sync via API: Contact form → Laravel → Webhook to CRM

**Recommendation:** Build Option A first. When Amanda has 100+ active relationships, migrate to Attio or HubSpot.

---

## Automations To Build

### 1. Contact Form → Slack Notification
```
Contact submitted → Laravel webhook → Slack #leads channel
Message: "New {partner_type} lead: {name} ({email}) — {first 100 chars of message}"
```

### 2. Weekly Digest for Amanda
```
Every Monday 9am PT:
- New contacts this week: X
- New waitlist signups: X  
- Pending investor registrations: X
- Unresponded contacts older than 3 days: X
Delivered via email or Slack
```

### 3. Document Upload → Investor Notification
```
Admin uploads document → If visibility = all_investors → Email all active investors
"New document available in your portal: {document title}"
```

### 4. Blog Published → Social Drafts
```
Article status changes to published →
- Generate Instagram caption (Claude API or manual for now)
- Generate LinkedIn post draft
- Save to admin panel for Amanda to review/post
```

---

## Analytics & Tracking

### Event Tracking (Frontend):
- Page views (all pages)
- CTA clicks (which button, which page)
- Form submissions (contact, waitlist, register)
- Portal logins
- Document downloads
- Time on page (especially /model and /about)

### Tools:
| Tool | Purpose |
|------|---------|
| **Vercel Analytics** | Built-in, zero-config page views + web vitals |
| **PostHog** | Open-source product analytics, funnels, session replay |
| **Plausible** | Privacy-first alternative to Google Analytics |
| **Google Analytics 4** | If Amanda needs it for investor reporting |

**Recommendation:** Vercel Analytics (free, already there) + PostHog (self-hostable, powerful funnels). Skip GA4 unless investors specifically ask for it.
