# Vinology

Full-stack VIN research desk: look up a vehicle, save it into named queries, and export a PDF.

Uses **free NHTSA open data** for factory specs, recalls, complaint counts, and safety ratings when available. Title/history/market value (Carfax-style) stay out of scope without paid NMVTIS providers.

Demo (legacy walkthrough): https://youtu.be/oEXVyASkCEE

## Quick start (Docker)

One command from the repo root:

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| UI | http://localhost:3001 |
| API | http://localhost:3000/health |
| Postgres | `localhost:5433` (mapped to avoid clashing with Postgres.app on 5432) |

Seed login: **`demo` / `password`**

Stop with `Ctrl-C`, or `docker compose down`.

## What you can do

- Create an account and sign in (JWT)
- Create, rename, and delete **queries** (research folders)
- Decode a VIN via NHTSA (server-side)
- Review specs, recalls, and safety snapshot
- Save the full report and download a PDF

## Stack

| Layer | Tech |
|-------|------|
| Frontend | **Next.js 15 + TypeScript** (`vinology-web`, port 3001) |
| Backend | Rails **7.2** API (Ruby **3.3**), JWT |
| Database | PostgreSQL |
| VIN data | NHTSA vPIC + recalls / complaints / ratings |
| Packaging | Root `docker compose` (API + web + DB) |

Legacy CRA client lives in `Vinology-client/` (deprecated).

## Project layout

```text
docker-compose.yml   One-command demo stack
vinology-web/        Next.js UI
Vinology-server/     Rails API
Vinology-client/     Legacy CRA (reference only)
```

## Run without Docker

### Prerequisites

- Ruby **3.3.x** + Bundler
- PostgreSQL on `localhost:5432` (Postgres.app is fine)
- Node.js **20+**

### API

```bash
cd Vinology-server
cp .env.example .env
bundle install
bin/rails db:prepare db:seed
bin/rails s
```

### UI

```bash
cd vinology-web
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3001

```bash
cd Vinology-server && bin/rails test
```

## Deploy story (portfolio)

A practical split that stays cheap for a personal demo:

| Piece | Typical host |
|-------|----------------|
| `vinology-web` | [Vercel](https://vercel.com) or Netlify — set `NEXT_PUBLIC_API_BASE_URL` to your API |
| `Vinology-server` | [Render](https://render.com), Fly.io, or Railway — Postgres add-on + `JWT_SECRET`, `CORS_ORIGINS`, `DATABASE_URL` |
| Secrets | Never commit `.env`; use the host’s env UI |

Checklist before going public:

1. Set a strong `JWT_SECRET`
2. Restrict `CORS_ORIGINS` to your real UI origin(s)
3. Use managed Postgres (not SQLite)
4. Keep `VIN_LOOKUP_RATE_LIMIT` enabled

Older Kubernetes notes: [vinology-kubernetes](https://github.com/ccdaniele/vinology-kubernetes).

## Versioning

| Practice | Convention |
|----------|------------|
| Default branch | `main` (PR required) |
| Feature work | `feature/*` → PR → `main` |
| Versions | SemVer tags + GitHub Releases |

- Legacy freeze: [`v1.1.4`](https://github.com/ccdaniele/vinology-app/releases/tag/v1.1.4)
- Refresh milestone: [`v2.0.0`](https://github.com/ccdaniele/vinology-app/releases/tag/v2.0.0) — Next.js + Rails 7.2 + NHTSA + Docker

## License

MIT. Sole author: Daniel Calderon.
