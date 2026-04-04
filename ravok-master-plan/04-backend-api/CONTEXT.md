# 04 — Backend API

## CONTEXT FOR CLAUDE CODE
> Read this before writing any Laravel code. The backend is a REST API — no Blade views except email templates.

---

## Architecture

- **Framework:** Laravel 12
- **Auth:** Sanctum (cookie-based sessions for SPA)
- **Database:** PostgreSQL on Railway
- **File Storage:** Railway volume mounted at `investor-docs/`
- **Deployment:** Railway, triggered by push to `main` (root dir: `backend/`)
- **API prefix:** All routes under `/api/*`

---

## Database Schema (Current + Planned)

### Existing (from migrations):
- `users` — Standard Laravel users table + role column
- `password_reset_tokens`
- `sessions`

### Planned Models:

```sql
-- Ventures (SPVs, Labels, Tech Ventures)
CREATE TABLE ventures (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type ENUM('film_spv', 'production_label', 'tech_venture') NOT NULL,
    status ENUM('concept', 'development', 'financing', 'production', 'distribution', 'released', 'exited') NOT NULL DEFAULT 'concept',
    logline TEXT,
    genre VARCHAR(100),
    budget_low INTEGER,          -- in USD
    budget_high INTEGER,
    capital_raised INTEGER DEFAULT 0,
    equity_allocated DECIMAL(5,2) DEFAULT 0,
    target_return VARCHAR(50),
    hero_image VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Venture Team Members
CREATE TABLE venture_members (
    id BIGSERIAL PRIMARY KEY,
    venture_id BIGINT REFERENCES ventures(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,    -- "Creative Founder", "Producer", "Director"
    bio TEXT,
    headshot VARCHAR(500),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Documents
CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category ENUM('pitch_deck', 'financial', 'legal', 'quarterly', 'board', 'diligence', 'general') NOT NULL,
    venture_id BIGINT REFERENCES ventures(id) ON DELETE SET NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    uploaded_by BIGINT REFERENCES users(id),
    visibility ENUM('all_investors', 'specific', 'partners') NOT NULL DEFAULT 'all_investors',
    requires_signature BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Document Access (for specific-visibility docs)
CREATE TABLE document_access (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT NOW()
);

-- Download Audit Log
CREATE TABLE download_logs (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    downloaded_at TIMESTAMP DEFAULT NOW()
);

-- Investor Updates
CREATE TABLE updates (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    venture_id BIGINT REFERENCES ventures(id) ON DELETE SET NULL,
    visibility ENUM('all', 'investors_only', 'partners_only') NOT NULL DEFAULT 'all',
    sent_email BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Contact Submissions
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    partner_type ENUM('co_producer', 'financier', 'distributor', 'operator', 'creator', 'other'),
    message TEXT NOT NULL,
    responded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Waitlist (2026 Creator Cohort)
CREATE TABLE waitlist (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    logline TEXT,
    portfolio_url VARCHAR(500),
    created_at TIMESTAMP
);

-- Blog/Insights Articles
CREATE TABLE articles (

-- Hollywood Confessions (STRATEGIC PRIORITY — audience-first content engine)
CREATE TABLE confessions (
    id BIGSERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    category ENUM('tip', 'warning', 'confession', 'question') DEFAULT 'confession',
    status ENUM('pending', 'approved', 'rejected', 'featured') NOT NULL DEFAULT 'pending',
    featured_on_social BOOLEAN DEFAULT FALSE,
    submitted_from VARCHAR(45),
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Blog/Insights Articles
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    body TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    author_id BIGINT REFERENCES users(id),
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Article Tags
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE article_tag (
    article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);
```

---

## API Route Groups

```php
// routes/api.php

// Public
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/waitlist', [WaitlistController::class, 'store']);
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);
Route::get('/ventures/public', [VentureController::class, 'publicIndex']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// Investor Portal (auth required)
Route::middleware('auth:sanctum')->prefix('portal')->group(function () {
    Route::get('/dashboard', [PortalController::class, 'dashboard']);
    Route::get('/ventures', [VentureController::class, 'index']);
    Route::get('/ventures/{id}', [VentureController::class, 'show']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
    Route::get('/updates', [UpdateController::class, 'index']);
    Route::get('/updates/{id}', [UpdateController::class, 'show']);
});

// Admin (auth + admin role required)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::apiResource('ventures', AdminVentureController::class);
    Route::apiResource('documents', AdminDocumentController::class);
    Route::apiResource('updates', AdminUpdateController::class);
    Route::apiResource('articles', AdminArticleController::class);
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::put('/users/{id}/role', [AdminUserController::class, 'updateRole']);
    Route::get('/contacts', [AdminContactController::class, 'index']);
    Route::get('/waitlist', [AdminWaitlistController::class, 'index']);
    Route::get('/audit-log', [AdminAuditController::class, 'index']);
});
```

---

## Email Templates Needed

| Trigger | Template | To |
|---------|----------|----|
| User registers | `welcome.blade.php` | New user |
| Admin approves user | `approved.blade.php` | User |
| New investor update | `update-notification.blade.php` | Investors |
| Contact form submitted | `contact-received.blade.php` | Amanda / Admin |
| Waitlist signup | `waitlist-confirmation.blade.php` | Creator |
| Document uploaded | `new-document.blade.php` | Relevant investors |

---

## Environment Variables (Backend)

```
APP_NAME=RavokStudios
APP_URL=https://api.ravokstudios.com  # or Railway URL
DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=ravok
DB_USERNAME=
DB_PASSWORD=
SANCTUM_STATEFUL_DOMAINS=ravokstudios.com,www.ravokstudios.com
SESSION_DOMAIN=.ravokstudios.com
MAIL_MAILER=smtp  # Postmark, SendGrid, or Resend
MAIL_FROM_ADDRESS=contact@ravokstudios.com
```
