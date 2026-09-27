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
