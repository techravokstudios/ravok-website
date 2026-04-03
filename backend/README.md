# Ravok Studios — Backend API

Laravel 12 REST API powering the Ravok Studios investor portal and public website forms.

## Stack

- **Framework:** Laravel 12
- **Auth:** Laravel Sanctum (cookie-based sessions)
- **Database:** PostgreSQL
- **File storage:** Local disk (`investor-docs` volume on Railway)
- **Mail:** SMTP (configurable via admin settings panel)
- **Hosting:** Railway (`backend/` subfolder of `ravok-website` monorepo)

## Local setup

### 1. Install dependencies

```bash
cd backend
composer install
```

### 2. Environment

```bash
cp .env.example .env
php artisan key:generate
```

Fill in the following in `.env`:

```env
APP_NAME="Ravok Studios"
APP_ENV=local
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ravok
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# Mail (use Mailtrap for local dev)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_user
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM_ADDRESS=noreply@ravokstudios.com
MAIL_FROM_NAME="Ravok Studios"

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### 3. Database

```bash
# Run all migrations
php artisan migrate

# Seed admin user (creates default admin account)
php artisan db:seed --class=AdminSeeder
```

Default admin credentials after seeding are set in `database/seeders/AdminSeeder.php`.

### 4. Run

```bash
php artisan serve
# API available at http://localhost:8000/api
```

## API overview

### Public endpoints (no auth)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/login` | Authenticate |
| `POST` | `/api/register` | Register new user |
| `GET` | `/api/public/posts` | List published insights |
| `GET` | `/api/public/posts/slug/{slug}` | Single insight by slug |
| `GET` | `/api/public/categories` | Insight categories |
| `POST` | `/api/public/forms/{type}` | Submit contact form (`writer`, `director`, `producer`) |

### Authenticated — investor (must be approved)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Dashboard summary |
| `GET` | `/api/posts` | All published insights |
| `GET` | `/api/documents` | Investor documents |
| `GET` | `/api/document-categories` | Document categories |

### Authenticated — admin only

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | All users |
| `POST` | `/api/users/{user}/approve` | Approve investor |
| `POST` | `/api/users/{user}/reject` | Reject investor |
| `apiResource` | `/api/categories` | Insight categories CRUD |
| `apiResource` | `/api/document-categories` | Document categories CRUD |
| `POST` | `/api/documents` | Upload investor documents |
| `GET` | `/api/forms` | View form submissions |
| `GET` | `/api/forms/export/csv` | Export submissions as CSV |
| `GET/PUT` | `/api/settings/mail` | Mail settings |
| `POST` | `/api/settings/email/test` | Send test email |
| `POST` | `/api/upload/image` | Upload blog image |

## Migrations

```
0001_01_01_000000 — users table
0001_01_01_000001 — cache table
0001_01_01_000002 — jobs table
2025_01_29_000001 — role + status columns on users
2025_01_29_000002 — profiles
2025_01_29_000003 — categories (insights)
2025_01_29_000004 — posts
2026_01_29_120000 — settings
2026_01_29_140000 — post comments
2026_01_30_083712 — personal access tokens
2026_01_30_100000 — is_featured on posts
2026_02_20_000001 — document_categories
2026_02_20_000002 — investor_documents
2026_02_23_000003 — group_key + group fields on investor_documents
2026_03_08_000001 — form_submissions
```

Run all at once: `php artisan migrate`
Run fresh with seed: `php artisan migrate:fresh --seed`

## Deployment (Railway)

The backend deploys automatically when `main` is pushed to GitHub.

**Railway configuration:**
- **Repo:** `techravokstudios/ravok-website`
- **Root directory:** `backend/`
- **Start command:** *(Railway auto-detects Laravel)*

**Required Railway env vars** (set in Railway dashboard):

```env
APP_ENV=production
APP_KEY=           # php artisan key:generate
APP_URL=           # your Railway backend URL

DB_CONNECTION=pgsql
DB_HOST=           # Railway Postgres host
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

FRONTEND_URL=      # https://ravokstudios.com
SANCTUM_STATEFUL_DOMAINS=ravokstudios.com
SESSION_DOMAIN=.ravokstudios.com

MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@ravokstudios.com
MAIL_FROM_NAME="Ravok Studios"
```

After first deploy, run migrations on Railway:

```bash
# Via Railway CLI
railway run php artisan migrate --force
```

## Mail

Mail settings (host, port, credentials) can also be updated at runtime via the admin panel under **Settings → Email**. These are stored in the `settings` table and take precedence over `.env` values for outbound mail.
