# 03 — Investor Portal

## CONTEXT FOR CLAUDE CODE
> Read this before building any authenticated investor-facing features. This is the highest-trust, highest-stakes part of the site.

---

## What This Is

A secure, gated section of ravokstudios.com where registered investors (and approved partners) can:
- View portfolio performance and venture updates
- Access confidential documents (pitch decks, financials, legal docs)
- Track their positions across SPVs
- Receive and review new investment opportunities

## Auth Architecture (Already Scaffolded)

- **Laravel Sanctum** — Cookie-based session auth (NOT token-based for this use case)
- **Frontend:** Next.js calls Laravel API at `/api/*`
- **Registration flow:** `/register` → Email verification → Admin approval → Portal access
- **Login:** `/login` → Session cookie → Redirect to `/portal/dashboard`

### User Roles:
| Role | Access |
|------|--------|
| `admin` | Full access. Manage users, upload docs, edit ventures, send updates |
| `investor` | View portfolio, download docs, see updates, submit interest forms |
| `partner` | View relevant ventures, submit proposals, access partnership docs |
| `pending` | Registered but not yet approved — sees "under review" message |

---

## Portal Pages

```
/portal/dashboard           — Overview: portfolio summary, recent updates, key metrics
/portal/ventures            — List of all ventures with status
/portal/ventures/[id]       — Individual venture detail (financials, team, timeline, docs)
/portal/documents           — Document library with categories and search
/portal/documents/[id]      — Document viewer / download
/portal/updates             — Timeline of investor updates (reverse chronological)
/portal/profile             — User profile, notification preferences
/portal/opportunities       — NEW: Open investment opportunities
```

---

## Dashboard Spec (`/portal/dashboard`)

### Sections:
1. **Welcome banner** — "Welcome back, [Name]" + last login timestamp
2. **Portfolio snapshot** — Cards showing each venture they're invested in, with status badges
3. **Recent updates** — Last 5 investor updates (clickable to full update)
4. **Key metrics** — Total committed capital, number of ventures, next milestone
5. **Documents requiring attention** — Unsigned docs, new uploads flagged
6. **Quick actions** — "View Documents" / "Contact Team" / "Submit Interest"

---

## Data Room / Document Management

### Document Categories:
- Pitch Decks
- Financial Models / Projections
- Legal (Operating Agreements, PPMs, Subscription Agreements)
- Quarterly Reports
- Board Meeting Minutes
- Due Diligence Materials

### Document Model:
```
documents
├── id
├── title
├── category (enum: pitch_deck, financial, legal, quarterly, board, diligence)
├── venture_id (nullable — some docs are studio-level)
├── file_path (Railway volume: investor-docs/)
├── uploaded_by (admin user id)
├── visibility (enum: all_investors, specific_investors, partners)
├── requires_signature (boolean)
├── created_at
└── updated_at
```

### Access Control:
- Documents can be visible to ALL investors, SPECIFIC investors (by ID), or PARTNERS
- Admin uploads via portal → stored on Railway volume
- Downloads logged for compliance (who downloaded what, when)
- Watermarking consideration: PDFs could be dynamically watermarked with investor name

---

## Investor Updates

### Update Model:
```
updates
├── id
├── title
├── body (rich text / markdown)
├── venture_id (nullable — studio-wide updates)
├── visibility (enum: all, investors_only, partners_only)
├── sent_email (boolean — was this also emailed?)
├── published_at
├── created_at
└── updated_at
```

### Email Integration:
- When admin publishes an update, optionally trigger email via Laravel Mail
- Email template in `backend/resources/views/emails/`
- Use Blade templates with RAVOK branding
- Track opens/clicks if using a provider like Postmark/SendGrid

---

## Venture Detail Page (`/portal/ventures/[id]`)

### Sections:
1. **Hero** — Venture name, status badge, genre, logline
2. **Key Metrics** — Budget, capital raised, equity allocated, target return
3. **Team** — Creative founder, producers, key attachments
4. **Timeline** — Milestone tracker (Development → Financing → Production → Distribution)
5. **Documents** — Filtered to this venture's docs
6. **Updates** — Filtered to this venture's updates

---

## Backend API Endpoints Needed

```
# Auth
POST   /api/register
POST   /api/login
POST   /api/logout
GET    /api/user                    # Current authenticated user

# Portal
GET    /api/portal/dashboard        # Aggregated dashboard data
GET    /api/portal/ventures         # List ventures (filtered by user access)
GET    /api/portal/ventures/{id}    # Venture detail
GET    /api/portal/documents        # Document library
GET    /api/portal/documents/{id}   # Document metadata
GET    /api/portal/documents/{id}/download  # Secure file download
GET    /api/portal/updates          # Investor updates
GET    /api/portal/updates/{id}     # Single update

# Admin
POST   /api/admin/ventures          # Create venture
PUT    /api/admin/ventures/{id}     # Update venture
POST   /api/admin/documents         # Upload document
DELETE /api/admin/documents/{id}    # Remove document
POST   /api/admin/updates           # Publish update
PUT    /api/admin/users/{id}/role   # Approve/change user role
GET    /api/admin/users             # List all users
GET    /api/admin/audit-log         # Download logs
```

---

## Security Considerations

- All portal routes require authenticated session (Sanctum middleware)
- Admin routes require `admin` role middleware
- Document downloads should be signed URLs or streamed through Laravel (not direct file links)
- Rate limiting on login/register endpoints
- CSRF protection via Sanctum
- Input validation on all forms
- SQL injection prevention via Eloquent ORM
- XSS prevention via React's default escaping + server-side sanitization
- Consider: IP allowlisting for admin access, 2FA for investors
