# Vinology

Full-stack app for researching a vehicle from its VIN.

A VIN is the vehicle’s permanent identifier. Titles, insurance events, sales, and major repairs often attach to it. Vinology helps you look that information up, organize it into queries, and export a PDF report.

This is a personal project: a complete product with auth, saved research, reporting, and a path to real VIN data providers.

Demo: https://youtu.be/oEXVyASkCEE

## What you can do

- Create an account and sign in (JWT)
- Create, edit, and delete **queries** (research sessions)
- Add vehicles to a query by VIN
- Review a report and download it as PDF

## VIN data integrations

The UI is built around lookup types for vehicle research:

| Lookup | Purpose |
|--------|---------|
| Specifications | Make, model, year, engine, drivetrain, and related attributes |
| Vehicle background / history | Title and odometer history (sample data today) |
| Market value | Retail, trade, and auction-style values (sample data today) |

**Today the client uses sample responses** so the product flow can be demoed without live API keys. The refresh roadmap replaces samples with free NHTSA APIs.

Auth, queries, cars, and PDF export talk to the real Rails API.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 17, Redux, React Router, Bootstrap, jsPDF (Next.js refresh planned) |
| Backend | Rails **7.2** API (Ruby **3.3**), JWT, PORO JSON serializers |
| Database | **PostgreSQL** (Postgres.app / Homebrew / Docker Compose) |
| Packaging | Docker / Compose; also deployable via [vinology-kubernetes](https://github.com/ccdaniele/vinology-kubernetes) |

## Project layout

```text
Vinology-client/   React SPA (port 3001)
Vinology-server/   Rails API (port 3000)
```

## Prerequisites

- Ruby **3.3.x** (see `Vinology-server/.ruby-version`)
- Bundler
- PostgreSQL running on `localhost:5432` (Postgres.app 18+ or Homebrew)
- Node.js for the legacy CRA client

## Run locally

### Backend

```bash
cd Vinology-server
cp .env.example .env   # set JWT_SECRET / CORS_ORIGINS
# Postgres.app: leave DB_USERNAME/DB_PASSWORD unset (uses your macOS user)
bundle install
bin/rails db:prepare db:seed
bin/rails s
```

Demo seed user: `demo` / `password`

```bash
bin/rails test   # auth + ownership smoke tests
```

### Frontend

```bash
cd Vinology-client
cp .env.example .env.development
npm install
npm start
```

See `.env.example` for API host/port defaults (`127.0.0.1:3000`, client on `3001`).

Open http://localhost:3001

## Run with Docker

Client and server each have a `Dockerfile` and `docker-compose.yml`.

```bash
# from Vinology-server
docker compose up --build

# from Vinology-client (point REACT_APP_API_* at the server)
docker compose up --build
```

Published images used in the Kubernetes experiment: `ccdaniele/vin-client`, `ccdaniele/vinology-server`.

## Related

- Kubernetes experiment: [vinology-kubernetes](https://github.com/ccdaniele/vinology-kubernetes)
- Client image notes: [vinology-client-image](https://github.com/ccdaniele/vinology-client-image)

## Repo hygiene

Dependencies should be installed from the lockfile (`npm install` / `bundle install`), not committed. Local env files, SQLite databases, logs, and Rails secrets belong in `.gitignore`.

## Versioning and releases

This repo follows a lightweight GitHub Flow:

| Practice | Convention |
|----------|------------|
| Default branch | `main` |
| Feature work | Short-lived `feature/*` or `fix/*` branches → pull request into `main` |
| Versions | [Semantic Versioning](https://semver.org) tags (`vMAJOR.MINOR.PATCH`) |
| Releases | Annotated git tags + [GitHub Releases](https://github.com/ccdaniele/vinology-app/releases) |

**Legacy freeze:** [`v1.1.4`](https://github.com/ccdaniele/vinology-app/releases/tag/v1.1.4) is the last release of the original CRA + Rails 7 demo stack.

**Next milestone:** `v2.0.0` will mark the first cut of the TypeScript Next.js + hardened Rails refresh.

Do not push directly to `main` (branch protection requires a pull request). Prefer deleting the head branch after merge.

## License

MIT. Sole author: Daniel Calderon.
