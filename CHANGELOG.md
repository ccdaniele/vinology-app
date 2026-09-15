# Changelog

All notable versions of Vinology are recorded here. The source of truth for published releases is also [GitHub Releases](https://github.com/ccdaniele/vinology-app/releases).

## [Unreleased]

## [2.0.0] - 2026-09-15

Full stack refresh for the portfolio demo: hardened Rails API, Next.js UI, live NHTSA VIN data, and a one-command Docker story.

### Phase 4 — polish

- Root `docker compose up --build` (Postgres + Rails API + Next.js UI)
- README rewrite: Docker-first quick start + deploy story
- Accessibility pass: skip link, landmarks, `aria-current` / `role="alert"` / busy forms
- Next.js `output: 'standalone'` for container builds

### Phase 3 — live NHTSA VIN data

- Server-side VIN decode via free NHTSA vPIC + recalls / complaints count / safety ratings
- Authenticated `POST /api/v1/vin_lookups` with per-user rate limiting
- Next.js client uses live decode (mock VIN helper removed)
- Persist full report payload on save so reopened cars and PDFs match the live report

### Phase 2 — Next.js client

- New `vinology-web` App Router + TypeScript UI (auth, queries, VIN report, PDF)
- Typed `api` client against the Rails API; CRA client marked legacy

### Phase 1 — Rails foundation

- Ruby **3.3** / Rails **7.2**, PostgreSQL (`pg`), `load_defaults 7.2`
- Replace Active Model Serializers with PORO serializers
- Ownership indexes; Docker Compose wires app → Postgres
- Integration tests for auth and query/car ownership

### Phase 0 — security stabilize

- Default-deny JWT auth; scope queries/cars to the current user
- JWT secret from `JWT_SECRET` (with expiry); CORS allowlist via `CORS_ORIGINS`
- Stop serializing passwords; remove public user listing and brand-code searcher
- Client `apiFetch` helper sends Bearer tokens; fix broken API URLs / query list shape

## [1.1.4] - 2026-09-15

### Frozen

- Legacy freeze tag for the original CRA (React 17) + Rails 7.0 demo before the refresh.
- Marks the last release of the pre-`main` / `v1.1` line.

### Included from earlier 1.1.x work

- Client env variables and `check-react-env` start checks
- Dynamic host connection for Cloud9-style hosts
- OpenSSL / webpack legacy provider workaround for newer Node
- Containerized client and server images

## [1.1.0] – [1.1.3]

- Ruby / Rails upgrades from the 1.0 line
- React start port and `current_user` API fixes
- README and Sass-related fixes

## [1.0.0]

- Original stack: Ruby 2.6.8, Rails 6.0, early React client

[Unreleased]: https://github.com/ccdaniele/vinology-app/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/ccdaniele/vinology-app/compare/v1.1.4...v2.0.0
[1.1.4]: https://github.com/ccdaniele/vinology-app/releases/tag/v1.1.4
