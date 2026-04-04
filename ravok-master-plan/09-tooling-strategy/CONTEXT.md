# 09 — Tooling Strategy

## CONTEXT FOR CLAUDE CODE
> This is the meta-doc. It tells you WHEN to use Claude Code vs Claude Projects vs other tools, and what skills/integrations to plug in.

---

## When To Use Claude Code vs Claude Projects

### CLAUDE CODE (Command Line Agent)
Use for: **Building features, writing code, running tests, deploying**

Best for:
- "Build the investor dashboard page"
- "Write the Laravel migration for the ventures table"
- "Create the contact form component with validation"
- "Fix this bug in the auth flow"
- "Refactor the API routes to match the spec in 04-backend-api"
- "Run the test suite and fix failures"
- Any task that requires reading/writing files in the actual codebase

**How to use with this master plan:**
```bash
# Start Claude Code in the repo
cd ravok-website
claude

# Then tell it to read context first
> Read ravok-master-plan/03-investor-portal/CONTEXT.md then build the dashboard API endpoint
```

**Pro tip:** Create a `.claude` file in the repo root that auto-loads the project overview:
```
# .claude
Read ravok-master-plan/00-project-overview/CONTEXT.md for project context before starting any task.
```

---

### CLAUDE PROJECTS (claude.ai)
Use for: **Strategy, content creation, planning, research, reviewing**

Best for:
- Writing blog articles in Amanda's voice (load brand identity doc as project knowledge)
- Drafting investor update emails
- Creating social media content calendars
- Reviewing copy for tone and brand consistency
- Planning feature specs before handing to Claude Code
- Generating pitch deck talking points
- Legal document review (surface-level, not legal advice)
- Competitor analysis and market research

**Recommended Claude Projects to create:**

| Project Name | Knowledge Base Docs | Use For |
|-------------|--------------------|---------| 
| **RAVOK Brand Voice** | `01-brand-identity/CONTEXT.md` + `00-project-overview/CONTEXT.md` | All content creation, copy review |
| **RAVOK Investor Comms** | `03-investor-portal/CONTEXT.md` + `07-crm-automations/CONTEXT.md` | Drafting updates, emails, reports |
| **RAVOK Content Engine** | `06-content-engine/CONTEXT.md` + `01-brand-identity/CONTEXT.md` | Blog articles, social posts, SEO |
| **RAVOK Tech Planning** | All context files | Architecture decisions, feature planning |

---

## Skills & Integrations to 10x Speed

### Already Available (Claude.ai connected tools):
| Tool | Use For RAVOK |
|------|--------------|
| **Canva** | Social media graphics, pitch deck slides, event materials |
| **Gmail** | Drafting investor emails, reviewing contact form responses |
| **Google Calendar** | Scheduling investor meetings, content publishing calendar |
| **Slack** | Team notifications, lead alerts, deploy notifications |
| **Vercel** | Check deployments, preview URLs, environment management |
| **Figma** | Design system, component specs, rebrand mockups |
| **Gamma** | Quick pitch presentations for partners/investors |
| **Google Drive** | Shared docs, financial models, legal templates |

### Recommended New Integrations:

| Tool | What It Does | Why RAVOK Needs It |
|------|-------------|-------------------|
| **Resend** | Transactional email API | Investor notifications, waitlist confirmations |
| **PostHog** | Product analytics | Track investor portal usage, conversion funnels |
| **Sentry** | Error monitoring | Catch bugs before investors see them |
| **BetterStack** | Uptime monitoring | 99.9% uptime for investor-facing portal |
| **Cloudinary** | Image CDN + optimization | Blog images, portfolio hero shots, responsive images |
| **Cal.com** | Scheduling | Let partners/investors book calls with Amanda directly |

---

## Automations To Build (Priority Order)

### Tier 1: Build This Week
1. **Contact form → email notification** (Laravel Mail → Amanda's inbox)
2. **Waitlist signup → confirmation email** (automated)
3. **User registration → admin notification** (Slack or email)

### Tier 2: Build This Month
4. **Blog published → social media drafts** (Claude Project generates, Amanda reviews)
5. **Weekly lead digest** (scheduled Laravel command → email)
6. **Document upload → investor notification** (event-driven)

### Tier 3: Build This Quarter
7. **Investor portal analytics dashboard** (PostHog → embedded charts)
8. **Automated investor report generation** (quarterly, templated)
9. **Content pipeline automation** (editorial calendar → draft generation → review → publish)
10. **CRM sync** (when contacts exceed 100+, sync to Attio/HubSpot)

---

## Development Workflow: How To Ship Fast

### For a new feature:
```
1. Amanda describes what she wants (in Claude Project "RAVOK Tech Planning")
2. Claude generates a spec and adds it to the relevant CONTEXT.md
3. Developer opens Claude Code in the repo
4. Claude Code reads the CONTEXT.md → builds the feature
5. PR to dev → test → PR to main → auto-deploy
6. Amanda reviews on ravokstudios.com
```

### For content:
```
1. Amanda picks a topic from the content calendar
2. Opens Claude Project "RAVOK Content Engine"
3. Claude drafts the article in Amanda's voice
4. Amanda edits/approves
5. Admin panel → publish → auto-generates social drafts
```

### For investor communications:
```
1. Amanda writes bullet points of the update
2. Opens Claude Project "RAVOK Investor Comms"
3. Claude drafts the full update in brand voice
4. Amanda reviews → publishes in portal → auto-emails investors
```

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro | $20/mo |
| Railway | Starter | ~$5-20/mo (usage-based) |
| Resend | Free tier (3k emails/mo) | $0 |
| PostHog | Free tier (1M events/mo) | $0 |
| Sentry | Free tier | $0 |
| Cloudinary | Free tier (25k transforms/mo) | $0 |
| Domain (ravokstudios.com) | Annual | ~$12/yr |
| **Total** | | **~$25-40/mo** |

This is a startup-budget stack. Everything scales on usage.
