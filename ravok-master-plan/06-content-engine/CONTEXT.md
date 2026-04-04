# 06 — Content Engine

## CONTEXT FOR CLAUDE CODE
> Read this before building the blog/insights CMS, Hollywood Confessions, or any content-related features.

---

## Why This Matters

RAVOK's content engine is audience-first. The strategy is NOT "build a site then hope people come." It's:

1. **Hollywood Confessions** draws creators and industry people in (top of funnel)
2. They share confessions on social → drives traffic to ravokstudios.com
3. Now you have an engaged audience → convert to newsletter, waitlist, partnerships
4. Insights articles build thought leadership for investors and press
5. The audience data feeds back into RAVOK's greenlight process (Phema thesis)

This is brand building through community, not marketing. RAVOK earns attention by giving creators a voice they don't have anywhere else.

---

## FLAGSHIP FEATURE: Hollywood Confessions

### What It Is
An anonymous feed of tips, warnings, confessions, and questions from creators and industry insiders navigating Hollywood. Think: anonymous gossip thread meets industry truth-telling. It lives at the HERO position on the Insights page — not buried, not secondary. This IS the brand.

### Why It's Strategic (Not Just a Feature)
- **Audience-first brand building** — Creators engage with RAVOK before they know about the venture model
- **Social flywheel** — Confessions are inherently shareable. Each one is a potential Instagram story, tweet, or LinkedIn post
- **Community ownership** — RAVOK becomes the place where the industry talks honestly
- **Content engine** — Confessions generate endless content: Amanda can respond to them, write articles inspired by them, use them as social prompts
- **Data signal** — What creators complain about = what RAVOK should build next
- **Trust builder** — If RAVOK is the place that lets people speak freely about Hollywood's problems, RAVOK is credible when it says "we're fixing those problems"

### How It Works
1. Anyone can submit anonymously via a simple form on the Insights page
2. Submissions go into a moderation queue (admin reviews before publishing)
3. Approved confessions appear in the live feed — displayed like a rolling ticker or card feed
4. Each confession gets a shareable link and social share buttons
5. Selected confessions get promoted to Instagram/LinkedIn with RAVOK branding
6. Amanda can "respond" to confessions with short takes or full articles

### Submission Form
- **Prompt**: "What do you wish you'd known?" or "Share your wisdom."
- **Fields**: Message only (text, 280 char limit for shareability). No name, no email required.
- **Optional**: Email field for "want us to follow up?" (builds newsletter list organically)
- **Moderation**: Admin approves/rejects. Reject reasons: identifying info, legal risk, spam.

### Display
- Hero of the Insights page — a visually distinct live feed, like a scrolling ticker or stacked card layout
- Each confession card: the text + timestamp + share buttons + "Reply" link (goes to Amanda's response if one exists)
- Visual style: typewriter or monospace font on dark background. Raw. Unfiltered energy.
- Auto-refreshes or loads more on scroll

### Database Schema Addition
```sql
CREATE TABLE confessions (
    id BIGSERIAL PRIMARY KEY,
    body TEXT NOT NULL,           -- max 280 chars enforced at app level
    email VARCHAR(255),           -- optional, for follow-up
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    featured BOOLEAN DEFAULT FALSE,  -- promoted to social
    response_article_id BIGINT REFERENCES articles(id),  -- Amanda's response
    ip_hash VARCHAR(64),         -- for spam prevention, not tracking
    created_at TIMESTAMP,
    moderated_at TIMESTAMP
);
```

### API Endpoints
```
# Public
GET    /api/confessions              -- approved confessions feed (paginated)
GET    /api/confessions/featured     -- featured/promoted confessions
POST   /api/confessions              -- submit new confession (rate-limited)

# Admin
GET    /api/admin/confessions        -- all confessions with moderation status
PUT    /api/admin/confessions/{id}   -- approve/reject/feature
```

### Social Integration Loop
```
Confession submitted
  → Admin approves
  → Appears in live feed on site
  → Admin marks as "featured"
  → Auto-generates branded image card (RAVOK logo + confession text + dark bg)
  → Amanda posts to Instagram/LinkedIn with commentary
  → Post links back to ravokstudios.com/insights
  → New visitors discover more confessions + the RAVOK brand
  → Some submit their own → flywheel continues
```

---

## Content Types

### 1. Hollywood Confessions (see above)
- Anonymous, community-driven, always-on
- The top of the funnel. The thing people come back for.

### 2. Insights (Blog Articles)
- Long-form thought pieces (800-2000 words)
- Amanda's voice, first-person when appropriate
- Topics: creator economy, film finance, venture studio model, industry critique
- Often inspired by or responding to confessions
- Published at `/insights/[slug]`

### 3. Portfolio Updates (Public-Facing)
- Short updates on venture progress (300-500 words)
- "Bite Me enters financing stage" type announcements

### 4. Press / Media Mentions
- Curated links to external coverage (Shoutout LA, etc.)
- Displayed on About page or dedicated Press section

---

## Insights Page Structure (`/insights`)

```
/insights
├── HERO: Hollywood Confessions live feed (scrolling/stacked cards)
├── Confession submission form ("Share your wisdom")
├── BELOW FOLD: Blog articles grid
│   ├── Category filters: All | Broken Economics | Future of Storytelling | Our Approach
│   └── Article cards with featured images
└── CTA: "Partner with Us" (persistent)

/insights/confessions/[id]    — Individual confession with share links
/insights/[slug]              — Individual article
```

### Content Categories (from original outline)
| Category | Focus |
|----------|-------|
| The Broken Economics of Hollywood | Data-driven exposés of the old system's failures |
| Shaping the Future of Storytelling | Forward-looking: tech, audience behavior, new models |
| Our Architectural Approach | Transparency on how RAVOK's venture studio works |

---

## CMS Architecture

**Recommended: Laravel-powered (already in stack)**
- Articles + Confessions tables in PostgreSQL
- Admin creates/edits articles + moderates confessions via portal admin panel
- Rich text editor: TipTap or similar in the Next.js admin UI
- Images uploaded to Railway volume or Cloudinary
- API serves articles and confessions to Next.js frontend

---

## Article Schema (in 04-backend-api)

```
articles:
  - title, slug, body (markdown or HTML)
  - excerpt (for cards and meta descriptions)
  - featured_image
  - author_id
  - status (draft / published / archived)
  - published_at
  - meta_title, meta_description (SEO overrides)
  - tags (many-to-many)
```

---

## Content Calendar

| Week | Topic | Type | SEO Target |
|------|-------|------|------------|
| 1 | Launch Hollywood Confessions + seed with 20 starter confessions | Feature launch | — |
| 2 | "Why We Built RAVOK" | Founder story | venture studio entertainment |
| 3 | Respond to top 3 confessions with "Amanda's Take" | Confession responses | — |
| 4 | "The SPV Model Explained" | Educational | film SPV structure |
| 5 | "Creator Equity: What Filmmakers Deserve" | Opinion | filmmaker equity ownership |
| 6 | Weekly confession roundup → Instagram carousel | Social | — |
| 7 | "Mid-Budget Films Beat Blockbusters on ROI" | Data-driven | independent film ROI |
| 8 | "Hollywood's Broken Incentive Structure" | Industry critique | hollywood broken model |

**Key insight:** Seed the confessions feed before launch. Amanda and team submit 15-20 real, raw confessions from their own experience to make the feed feel alive on day one. No one wants to be first on an empty feed.

---

## Social Content Pipeline

### Instagram (@ravokstudios)
- Branded confession cards (dark bg + RAVOK logo + confession text)
- Amanda's responses to confessions
- Behind-the-scenes of venture development
- Quote cards from insights articles
- Event recaps

### LinkedIn (Amanda Aoki)
- Long-form posts adapted from blog articles
- Industry commentary sparked by confessions
- Partnership announcements

### Automation opportunity:
- Confession marked "featured" → Auto-generate branded image card
- Blog article published → Auto-generate social snippets
- This can be a Claude Project workflow (see `09-tooling-strategy/CONTEXT.md`)

---

## SEO Implementation (Next.js)

```typescript
// app/insights/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.featured_image],
      type: 'article',
      publishedTime: article.published_at,
      authors: ['Amanda Aoki'],
    },
  };
}
```

---

## RSS Feed
- Generate at `/insights/feed.xml`
- Include both articles AND featured confessions
