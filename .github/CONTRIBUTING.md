# Contributing to ravok-website

## Branches

| Branch | Purpose |
|---|---|
| `main` | Production. Deploys to Vercel + Railway on push. |
| `dev` | Default working branch. Open all PRs here. |

**Never push directly to `main`.** All changes go through a PR from `dev` or a feature branch.

## Workflow

```
feature/your-feature  →  dev  →  main
```

1. Branch off `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. Make your changes. Keep commits focused — one concern per commit.

3. Open a PR against `dev`. Fill out the PR template.

4. When `dev` is stable and tested, it gets merged to `main` for deployment.

## PR checklist

- [ ] Frontend changes tested locally (`npm run dev`)
- [ ] Backend changes tested locally (`php artisan serve`)
- [ ] New API endpoints documented in `backend/README.md`
- [ ] New migrations included and tested (`php artisan migrate:fresh --seed`)
- [ ] No `.env` values or secrets committed
- [ ] No `console.log` or `dd()` / `dump()` left in code

## Commit style

Use short, descriptive commit messages:

```
Add investor document upload endpoint
Fix CORS issue on public forms route
Update admin dashboard to show form submissions
```

No rigid convention required — just be clear about what changed and why.

## Environment files

- `.env.local` — frontend (never commit)
- `backend/.env` — backend (never commit)

Use `.env.example` files as the source of truth for what variables are required.

## Who to ask

All questions → Amanda (@techravokstudios)
