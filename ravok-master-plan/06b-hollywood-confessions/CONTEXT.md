# 06B — Hollywood Confessions

## CONTEXT FOR CLAUDE CODE
> This is NOT a nice-to-have blog feature. This is an audience-first growth engine and a core part of the RAVOK brand. Build it with the same priority as the investor portal.

---

## The Strategic Thesis

RAVOK's content strategy is audience-first. Before creators sign up, before investors write checks, before partners reach out — people need to *care* about what RAVOK is saying. Hollywood Confessions is how we earn that attention.

Anonymous confessions are gossip. Gossip is currency. Gossip builds brands.

### Why This Works:
1. **Confessions are inherently shareable** — People screenshot and repost anonymous industry tea. Every confession is a micro-piece of viral content.
2. **It drives repeat visits** — "What's new on Hollywood Confessions?" becomes a habit. People come back without being asked.
3. **It positions RAVOK as the town square** — We become the place where the real conversation about Hollywood happens. Not Deadline, not Variety — RAVOK. The insider feed.
4. **It validates the thesis** — Every confession about getting screwed by a studio, losing equity, or having a project killed in development *proves* why RAVOK exists. The audience convinces itself.
5. **It builds the email list** — "Submit your confession" and "Get the weekly digest" are both email capture points. The newsletter becomes must-read.
6. **It fuels social content** — Curated confessions become Instagram carousels, LinkedIn posts, TikTok content, Twitter threads. One feature feeds every channel.

### The Flywheel:
```
Confession submitted → Moderated → Published on site
        ↓                                    ↓
Amanda picks a confession        Social post (IG/LinkedIn/X)
to respond to publicly                      ↓
        ↓                          Traffic back to site
Thought leadership +                        ↓
community engagement            New visitors → submit → repeat
```

---

## Product Spec

### What Users See:

**On the Insights page hero:**
A rolling feed of anonymous confessions — short, tweet-length, displayed like a live ticker or social feed. Think: Blind (the app) meets DeuxMoi meets PostSecret — but for Hollywood creators.

**Each confession shows:**
- The confession text (max ~280 characters)
- A timestamp ("2 hours ago", "3 days ago")
- A reaction count (hearts, flames, or a custom "this happened to me too" counter)
- Optional: a category tag ("Development Hell", "Shady Accounting", "Gatekeeping", "Equity Theft", "Casting Couch Politics")

**Submission form:**
- Accessible from the Insights page and a persistent link in the footer
- Fields: Confession text (required, max 500 chars), optional category dropdown
- Completely anonymous — no name, no email required to submit
- Optional email field: "Want to be notified when your confession is featured? (We'll never reveal your identity)"
- Submit button: "Share your wisdom." (from the copy doc)

**Weekly Digest:**
- Email signup: "Get the week's most unhinged confessions + Amanda's takes — delivered every Friday."
- This IS the newsletter. Not a generic "RAVOK updates" newsletter. It's the confessions digest with Amanda's commentary woven in.

---

## Data Model

```sql
CREATE TABLE confessions (
    id BIGSERIAL PRIMARY KEY,
    body TEXT NOT NULL,                    -- max 500 chars, enforced at app level
    category VARCHAR(50),                  -- nullable, from predefined list
    notify_email VARCHAR(255),             -- nullable, hashed for privacy
    status ENUM('pending', 'approved', 'rejected', 'featured') NOT NULL DEFAULT 'pending',
    reactions INTEGER DEFAULT 0,
    ip_hash VARCHAR(64),                   -- hashed IP for spam prevention, not identification
    featured_at TIMESTAMP,                 -- when Amanda picks it for social/response
    amanda_response TEXT,                  -- Amanda's public take on this confession
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Index for the feed display (approved, newest first)
CREATE INDEX idx_confessions_feed ON confessions (status, created_at DESC);

-- Index for featured confessions
CREATE INDEX idx_confessions_featured ON confessions (featured_at DESC) WHERE status = 'featured';
```

### Categories (predefined):
- Development Hell
- Shady Accounting
- Gatekeeping
- Equity Theft
- The Waiting Game
- Festival Politics
- Streaming Nightmares
- Work For Hire Horror
- The Meeting That Changed Nothing
- General Confession

---

## API Endpoints

```php
// Public
GET    /api/confessions                    // Paginated feed (approved only)
GET    /api/confessions/featured           // Amanda's picks with her responses
POST   /api/confessions                    // Submit a confession (rate-limited, no auth required)
POST   /api/confessions/{id}/react         // Add a reaction (rate-limited by IP hash)

// Admin
GET    /api/admin/confessions              // All confessions (pending, approved, rejected)
PUT    /api/admin/confessions/{id}/status  // Approve, reject, or feature
PUT    /api/admin/confessions/{id}/respond // Add Amanda's response
```

---

## Moderation Strategy

### Auto-moderation:
- Profanity filter (basic — confessions should be raw but not abusive)
- Spam detection (duplicate text, link injection, bot patterns)
- Rate limiting: max 3 submissions per IP per hour
- Min length: 20 characters. Max: 500 characters.

### Manual moderation (Amanda or admin):
- All confessions start as `pending`
- Admin reviews queue → approve or reject
- `featured` status = Amanda has chosen to respond publicly
- Rejected confessions are soft-deleted (kept in DB for audit but never shown)

### Safety:
- No real names allowed — auto-flag confessions containing common first+last name patterns
- No specific company names initially (can relax this later once the feature has momentum)
- Add a report button for approved confessions
- Legal: Terms page must include a disclaimer that confessions are unverified anonymous submissions and RAVOK takes no responsibility for their accuracy

---

## Frontend Components

```
components/confessions/
├── ConfessionFeed.tsx          // Rolling feed — the hero display
├── ConfessionCard.tsx          // Individual confession with reactions
├── ConfessionSubmitForm.tsx    // Anonymous submission form
├── ConfessionFeatured.tsx      // Amanda's pick with her response
├── ConfessionDigestSignup.tsx  // Email signup for weekly digest
└── ConfessionAdmin.tsx         // Moderation queue (portal only)
```

### Feed Display Options:

**Option A: Ticker/marquee style** — Confessions scroll vertically in a contained box at the top of Insights. Feels like a live feed. High visual impact.

**Option B: Card grid** — Pinterest-style masonry layout. Each confession is a card. Good for browsing.

**Option C: Social feed** — Linear scroll, newest first, with reactions inline. Most familiar UX.

**Recommendation:** Start with Option C (social feed) — it's the most buildable and the most interactive. Add the ticker/marquee as a compact "preview" widget on the homepage that links to the full feed on /insights.

---

## Social Content Pipeline

### Instagram:
- Screenshot-style confession cards with RAVOK branding
- Weekly carousel: "This week's top 5 confessions"
- Amanda's video response to a featured confession (Reels)

### LinkedIn:
- Amanda posts a confession + her professional take
- "This is exactly why we built RAVOK" framing
- Long-form posts that use a confession as a hook

### X/Twitter:
- Individual confessions posted as tweets (credited to @ravokstudios)
- Quote tweets with Amanda's commentary
- Threads compiling confessions by category

### TikTok (if/when):
- Text-on-screen confession + Amanda's reaction
- "Reading Hollywood Confessions" series

---

## Integration with Existing Master Plan

### Updates to other sections:

**02-public-site:** Add a compact confession ticker/preview widget to the homepage Status section. "See what creators are saying" → links to /insights.

**06-content-engine:** Hollywood Confessions IS the content engine. The blog articles layer on top — Amanda's deeper takes on patterns she sees in the confessions become the long-form thought leadership pieces.

**07-crm-automations:** The weekly digest email replaces the generic newsletter. Confession submission with optional email = lead capture. Featured confession notification = engagement email.

### Roadmap placement:
- Move from Phase 7 to **Phase 4** (alongside Content Engine, Weeks 7-8)
- The database table and API can be built during Phase 2 (Backend Infrastructure)
- The frontend feed can be built during Phase 4
- Social content pipeline is ongoing from launch

---

## Success Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Confessions submitted per week | 20+ | 100+ |
| Approved and published | 10+ per week | 50+ per week |
| Unique visitors to /insights | 500+ | 5,000+ |
| Digest email signups | 100+ | 1,000+ |
| Social shares of confession content | 50+ per week | 500+ per week |
| Confession → site visit conversion | Track with UTM | Optimize |

---

## Amanda: Questions to Confirm

- [ ] Category list — are these the right ones? Add/remove?
- [ ] Moderation: are you comfortable being the sole moderator at launch, or do you need to delegate?
- [ ] Should confessions allow replies/threads from other anonymous users, or is it one-way?
- [ ] Branding: "Hollywood Confessions" is the name from the outline. Still the right name? Alternatives: "Industry Confessions", "Creator Confessions", "The Real Hollywood"
- [ ] Legal review: do you have counsel who can draft the disclaimer/terms for UGC?
