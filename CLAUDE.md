# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio CMS with admin panel. Runs entirely on **Vercel** as a single Next.js 14 App Router deployment — no separate backend. All content (hero sections, projects, settings) is managed dynamically through the CMS without redeployment.

## Commands

### Frontend (run from `frontend/`)

```bash
npm install
npm run dev         # Dev server at http://localhost:3004
npm run build       # Production build
npm run lint        # ESLint
npm run type-check  # TypeScript (tsc --noEmit)
```

### Database (run from `frontend/`)

```bash
npx prisma generate                    # Regenerate Prisma client after schema changes
npx prisma migrate dev --name <desc>   # Create and apply a new migration
npx prisma db seed                     # Seed admin user + default CMS sections
npx prisma studio                      # Browse DB in browser
```

## Architecture

```
Next.js 14 (App Router)
  ├── src/app/api/**      — Route Handlers (replaces FastAPI)
  ├── prisma/             — Schema + migrations + seed
  └── src/lib/auth.ts     — NextAuth.js v5 (Credentials + JWT)

Vercel Postgres (Neon)    — via Prisma ORM
Vercel Blob               — images + large video uploads
```

### Frontend layers

| Layer | Location | Responsibility |
|---|---|---|
| Pages | `src/app/` | Next.js App Router; public pages + `/admin/**` |
| API | `src/app/api/` | Route Handlers: projects, cms, settings, uploads, auth |
| Components | `src/components/` | Organized by scope: `admin/`, `cms/`, `public/`, `shared/`, `ui/` |
| Store | `src/store/` | Zustand — `auth.ts` (NextAuth wrapper), `projects.ts` |
| API clients | `src/lib/` | `api.ts` (axios, baseURL=relative), `cms-api.ts`, `settings-api.ts` |
| Hooks | `src/hooks/` | `useCMSContent`, `usePermissions`, `useGlobalSettings` |
| Contexts | `src/contexts/` | `EditModeContext` (CMS inline editing toggle), `ThemeContext` |

### Auth flow

1. `POST /api/auth/signin` (NextAuth Credentials handler)
2. Password verified with bcrypt against `User.hashedPassword` in Postgres
3. Session stored as JWT in `HttpOnly` cookie (no localStorage)
4. `src/middleware.ts` — `export { auth as middleware }` — protects `/admin/:path*` at edge
5. `useSession()` from `next-auth/react` used in components; `useAuthStore()` is a compatibility wrapper

### CMS system

Page content is stored per-section in `PageContent` table (Prisma). The frontend `EditModeContext` exposes an edit toggle; when active, `EditableSection` wraps each section with inline editing via `SectionEditor`.

- Public API: `GET /api/cms/pages/[pageKey]/public`, `GET /api/cms/sections/[pageKey]/[sectionKey]/public`
- Admin API: `GET/PUT/DELETE /api/cms/sections/[pageKey]/[sectionKey]`, `PATCH .../reorder`
- Pages list: hardcoded in `src/lib/cms-pages.ts` (9 pages: home, about, projects, contact, footer, navbar, admin_header, privacy, terms)

### Upload flow

- Images / small files: `POST /api/uploads/image` → `put()` from `@vercel/blob` (max 10 MB)
- Large videos (>4.5 MB): client-side signed URL via `@vercel/blob/client` `upload()` — bypasses serverless body limit
- `src/lib/blob.ts` — shared helper `uploadToBlob(file, folder)`

## Key Environment Variables

### `frontend/.env.local` (copy from `frontend/env.local.example`)

```env
# Vercel Postgres (Neon)
DATABASE_URL=...
POSTGRES_URL_NON_POOLING=...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=...

# NextAuth
AUTH_SECRET=<random 32+ chars>
NEXTAUTH_URL=http://localhost:3004

# Seed / first admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<strong password>
ADMIN_NAME=Admin
```

## First-time Setup

```bash
cd frontend
npm install
# Pull Vercel env vars (requires `vercel link` first):
vercel env pull .env.local
npx prisma migrate dev --name init
npx prisma db seed        # creates admin user + default CMS content
npm run dev
```

Then log in at `http://localhost:3004/admin/login` with the credentials from env vars.

## Deployment

- **Hosting**: Vercel (root dir: `frontend/`)
- **Database**: Vercel Postgres (Neon) — `DATABASE_URL` env var set in Vercel dashboard
- **File storage**: Vercel Blob — `BLOB_READ_WRITE_TOKEN` env var set in Vercel dashboard
- Vercel auto-deploys on push to `main`; no CI/CD workflows needed

## Commit Convention

Follows Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
