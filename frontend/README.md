# FraudShield Frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4. Talks to the FraudShield FastAPI backend
via `NEXT_PUBLIC_API_URL` — no ML/Python dependency in this project.

## Setup

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to your backend
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Pages

`/` landing · `/dashboard` live model metrics · `/predict` single-transaction analysis ·
`/batch` CSV batch prediction · `/explainability` SHAP explanations · `/analytics` model
comparison · `/model` model card & pipeline · `/docs` API reference · `/about`

## Deploy to Vercel

Import this `frontend/` directory as the project root in Vercel, set `NEXT_PUBLIC_API_URL` in
the project's environment variables, and deploy.

**`NEXT_PUBLIC_API_URL` must include the `https://` scheme** — e.g.
`https://fraudshield-production-xxxx.up.railway.app`, not just
`fraudshield-production-xxxx.up.railway.app`. Without a scheme, the browser treats the value as a
*relative path* and sends every API call to the frontend's own domain instead of the backend,
which shows up as "Service Offline" and 404s in the console for requests aimed at the frontend's
own URL. `lib/api.ts` now auto-prepends `https://` if it's missing as a safety net, but setting it
correctly in the dashboard avoids relying on that fallback.
