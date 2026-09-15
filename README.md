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
- Look up brand / title codes in the code searcher

## VIN data integrations

The UI is built around four lookup types:

| Lookup | Purpose |
|--------|---------|
| Specifications | Make, model, year, engine, drivetrain, and related attributes |
| Vehicle background / history | Title and odometer history |
| Market value | Retail, trade, and auction-style values |
| Salvage / brands | Brand codes and salvage-related status |

**Today the client uses sample responses** so the product flow can be demoed without live API keys. The same client hooks (`getSpecifications`, `getHistory`, `getValue`, `getSalvage`) are where real VIN data providers would plug in.

Auth, queries, cars, and PDF export talk to the real Rails API.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 17, Redux, React Router, Bootstrap, jsPDF |
| Backend | Rails 7 API (Ruby 3.1.2), JWT, Active Model Serializers |
| Database | SQLite locally (Postgres available via Docker Compose) |
| Packaging | Docker / Compose; also deployable via [vinology-kubernetes](https://github.com/ccdaniele/vinology-kubernetes) |

## Project layout

```text
Vinology-client/   React SPA (port 3001)
Vinology-server/   Rails API (port 3000)
```

## Run locally

### Backend

```bash
cd Vinology-server
bundle install
bin/rails db:create db:migrate db:seed
bin/rails s
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

## License

MIT. Sole author: Daniel Calderon.
