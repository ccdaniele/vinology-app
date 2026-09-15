# Vinology web (Next.js)

TypeScript App Router client for the Vinology Rails API.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3001

Requires the Rails API on port 3000 (`Vinology-server`).

VIN decode calls `POST /api/v1/vin_lookups` (NHTSA vPIC + recalls / ratings).
