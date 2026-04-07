# 08 — DevOps & CI/CD

## CONTEXT FOR CLAUDE CODE
> Read this before touching deployment, environment, or GitHub Actions config.

---

## Current Deployment

| Service | What | Trigger | Root Dir |
|---------|------|---------|----------|
| **Vercel** | Next.js frontend | Push to `main` | `/` (repo root) |
| **Railway** | Laravel backend + PostgreSQL | Push to `main` | `backend/` |

### Vercel Config:
- Framework: Next.js (auto-detected)
- Build command: `npm run build`
- Output: `.next/`
- Environment variables set in Vercel dashboard
- Domain: `ravokstudios.com` (custom domain pointed to Vercel)
- Preview deployments on every PR (auto)

### Railway Config:
- Service: PHP/Laravel
- Build command: `composer install && php artisan migrate --force`
- Start command: `php artisan serve --host=0.0.0.0 --port=$PORT` (or Octane)
- PostgreSQL provisioned as Railway service
- Volume: `investor-docs/` for file storage
- Environment variables set in Railway dashboard

---

## Branch Strategy

```
main         → Production (auto-deploys to Vercel + Railway)
dev          → Staging / active development
feature/*    → Individual feature branches

Workflow: feature/* → PR to dev → test → PR to main → deploy
```

---

## GitHub Actions (To Build)

### 1. PR Checks (`.github/workflows/pr-checks.yml`)
```yaml
name: PR Checks
on:
  pull_request:
    branches: [dev, main]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with: { php-version: '8.2' }
      - run: cd backend && composer install --no-interaction
      - run: cd backend && php artisan test
```

### 2. Deploy Notification (`.github/workflows/deploy-notify.yml`)
```yaml
name: Deploy Notification
on:
  push:
    branches: [main]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Slack notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: '🚀 RAVOK deployed to production'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### 3. Dependency Audit (Weekly)
```yaml
name: Security Audit
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9am UTC

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - run: cd backend && composer audit
```

---

## Environment Variables Master List

### Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://api.ravokstudios.com
NEXT_PUBLIC_SITE_URL=https://ravokstudios.com
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx          # If using PostHog
NEXT_PUBLIC_GA_ID=G-xxx                   # If using GA4
```

### Backend (Railway):
```
APP_NAME=RavokStudios
APP_ENV=production
APP_KEY=base64:xxx
APP_URL=https://api.ravokstudios.com
DB_CONNECTION=pgsql
DB_HOST=xxx.railway.app
DB_PORT=5432
DB_DATABASE=ravok
DB_USERNAME=xxx
DB_PASSWORD=xxx
SANCTUM_STATEFUL_DOMAINS=ravokstudios.com,www.ravokstudios.com
SESSION_DOMAIN=.ravokstudios.com
CORS_ALLOWED_ORIGINS=https://ravokstudios.com
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=465
MAIL_USERNAME=resend
MAIL_PASSWORD=re_xxx
MAIL_FROM_ADDRESS=hello@ravokstudios.com
MAIL_FROM_NAME="RAVOK Studios"
```

---

## Domain Setup

```
ravokstudios.com       → Vercel (A/CNAME records)
www.ravokstudios.com   → Redirect to ravokstudios.com
api.ravokstudios.com   → Railway (CNAME to Railway URL)
```

---

## Monitoring

| What | Tool | Notes |
|------|------|-------|
| Uptime | Railway built-in + BetterStack | Alert if site goes down |
| Errors | Sentry | Frontend + Backend error tracking |
| Performance | Vercel Analytics | Web vitals, TTFB, LCP |
| Logs | Railway logs | Backend request logs, queue failures |
