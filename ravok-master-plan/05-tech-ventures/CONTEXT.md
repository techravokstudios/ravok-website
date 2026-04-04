# 05 — Tech Ventures

## CONTEXT FOR CLAUDE CODE
> Read this for any work related to Phema or the tech ventures pillar. This is the long-term platform play.

---

## The Tech Ventures Thesis

RAVOK's Tech Ventures pillar incubates proprietary technology companies that:
1. Eliminate traditional media gatekeepers
2. Give creators direct relationships with their audiences
3. Capture first-party audience data on engagement and narrative preferences
4. Feed data back into the studio's greenlight process to de-risk future ventures
5. Provide measurable returns independent of film performance

---

## Current State
- 3 tech ventures in development
- 1 in validation stage
- Flagship: **Phema** (details below)

---

## Phema — Flagship Tech Venture

### What We Know (from public sources):
- Referenced as a direct-to-audience distribution platform
- Amanda mentioned it as an alternative to traditional distribution: "Boutique streamers, festival-to-platform paths, direct-to-audience through platforms like ours (Phema)"
- Name suggests Greek root: "phēmē" = voice, reputation, fame

### Likely Function:
- Creator-to-audience content platform
- First-party data collection on viewing behavior and narrative preferences
- Feeds audience intelligence back into RAVOK's greenlight process
- Potential: ticketed premieres, subscription, TVOD, or hybrid model

### Integration with ravokstudios.com:
- For now: Phema gets a card on the `/portfolio/tech-ventures` page
- Future: Phema will likely be its own domain/app, but authentication may share infrastructure with the RAVOK investor portal
- Data pipeline: Phema audience data → RAVOK dashboard metrics

---

## What Claude Code Should NOT Do:
- Don't build Phema's full platform in this repo — it will be a separate project
- Don't speculate on features Amanda hasn't confirmed
- DO build the portfolio page that showcases tech ventures
- DO build the data infrastructure (database schema) that can later connect to Phema analytics

---

## Future Architecture Consideration

```
ravokstudios.com          → Marketing + Investor Portal (this repo)
phema.app (or similar)    → Audience-facing platform (separate repo)
api.ravokstudios.com      → Shared API layer (this repo's backend, potentially)

Shared auth? → Consider OAuth2 or shared Sanctum sessions across subdomains
Shared data? → PostgreSQL views or API endpoints that Phema can query
```

---

## Amanda: Questions to Answer

- [ ] What is Phema's one-line description for the portfolio page?
- [ ] Is Phema a streaming platform, marketplace, or something else?
- [ ] Will it share auth with the investor portal?
- [ ] What's the timeline for Phema's MVP?
- [ ] Are the other 2 tech ventures ready to be named/described?
