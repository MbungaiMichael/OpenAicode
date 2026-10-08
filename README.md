# OpenAicode — International Patient Assistance Platform

Helps international patients (especially from Africa) access care in India:
hospital directory, translators/coordinators, appointments, cost estimates, support.

Docs: `PRD.md` (requirements + Steer One Choice) · `IMPLEMENTATION_PLAN.md` (phases) · `design.html` (design preview)

## Run locally (Phase 0–4 complete)

Requires Node 22+.

```powershell
cd web
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000

Demo accounts (password `demo1234`):
- patient@demo.test (patient)
- coordinator@demo.test (coordinator)
- admin@demo.test (admin)

## Verify

```powershell
cd web
npm run lint
npm run build
```

## Structure

- `web/app` — routes + API (`/api/...`)
- `web/components` — Nav, cards, forms
- `web/lib` — db, auth (JWT cookie), validators (zod), i18n, phrases
- `web/prisma` — schema + seed (SQLite local; Supabase Postgres in production)

Safety: information only — no diagnosis, no guaranteed costs. Medical decisions stay with qualified professionals.

## Secrets rule

Real passwords, API keys, service keys, and Android signing keys are NEVER
committed. They live in `web/.env` (local only, gitignored). Only `*.example`
placeholder files are tracked.

## Android APK (via PWA → Trusted Web Activity)

The app is server-rendered, so the APK is a signed wrapper around the
deployed site — it needs a public HTTPS URL first:

1. Deploy `web/` to Vercel with Supabase env vars set in the dashboard
   (never in git). Confirm `https://YOUR-APP/.well-known/assetlinks.json` loads.
2. On your machine: install JDK 17 + Bubblewrap (`npm i -g @bubblewrap/cli`), then:
   ```powershell
   bubblewrap init --manifest https://YOUR-APP/manifest.webmanifest
   ```
   Generate a release keystore when prompted and **keep it + its passwords
   off GitHub** (`*.jks` is gitignored).
3. Put the keystore's SHA-256 fingerprint in Vercel env as
   `TWA_SHA256_FINGERPRINTS` (and `TWA_PACKAGE_NAME`), redeploy, then:
   ```powershell
   bubblewrap build
   ```
   This outputs a signed APK (and AAB for Play Store).
4. Install the APK on your phone to test; publish the AAB to Google Play.
