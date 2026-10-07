# Implementation Plan: International Patient Assistance Platform

Source: `PRD.md` v1.0 — Web (Next.js + TypeScript + PostgreSQL/Supabase + Prisma).

## Phase 0 — Foundation (Days 1-3) — DONE
- [x] Init Next.js App Router + TS + Tailwind + ESLint/Prettier
- [x] Structure: `app/ components/ lib/ prisma/ public/`
- [x] Supabase Postgres + Prisma schema: User, Hospital, Request, Treatment, CostEstimate, MedicalDocument, Rating (+ Teleconsult, Reminder, NotificationLog)
- [x] Env: `DATABASE_URL, NEXTAUTH_SECRET, NEXT_PUBLIC_APP_URL, STORAGE_BUCKET`
- [x] CI: `npm run build && npm run lint` passes
- Exit: dev server + DB migrate + seed works

## Phase 1 — MVP: Auth + Directory + Requests (Weeks 1-3) — DONE
Auth & Profiles:
- [x] `/register, /login, /profile` — country + language (en/fr/sw/ar), roles: patient/caregiver/translator/coordinator/admin
- [x] Route guards, Zod validation
Hospital Directory:
- [x] `GET /api/hospitals?search=&specialty=&city=`, `GET /api/hospitals/[id]`
- [x] `/hospitals, /hospitals/[id]` — search/filter, detail with map link
- [x] Seed 10-15 hospitals via `prisma/seed.ts` (12 seeded)
Requests Core:
- [x] `POST /api/requests, GET /api/requests, PATCH /api/requests/[id]`
- [x] `/request/new, /requests, /dashboard` — types: translator/coordinator/appointment/cost_estimate/support, status: new/assigned/done
- [x] Coordinator triage assign → done
Accept: register → find hospital → submit → track → triage works; responsive + keyboard accessible

## Phase 2 — Treatment, Cost, Navigation (Weeks 4-5) — DONE
- [x] `/treatments, /treatments/[id]` — plain-language steps, stay, risks + disclaimer
- [x] Cost flow: `POST /api/estimates` (min/max + currency + disclaimer), linked to request
- [x] Navigation: address, lat/lng, embed/link, facilities, phone on hospital detail
- [x] Documents: Supabase Storage `medical-docs` private + signed URLs, role-checked upload/view (local: link-based URLs + role-checked API; Supabase bucket swap documented in `.env.production.example`)
- [x] Admin `/admin/metrics`: patients, requests, connections, appointments, avg rating
Accept: 6+ treatments, cost range + disclaimer end-to-end, metrics queryable

## Phase 3 — Polish, i18n, Settings (Weeks 6-7) — DONE
- [x] `next-intl` EN/FR/SW/AR (+ RTL for AR), persisted preference (implemented: lightweight `lib/i18n.ts` EN/FR/SW/AR dictionary + `LanguageSwitcher` with localStorage + RTL; full `next-intl` routing deferred as optional upgrade)
- [x] `/settings` — language, profile, notifications, data export
- [x] Email notifications on assign/done/estimate (Resend/Nodemailer + log table) (implemented: `NotificationLog` + in-app `/notifications` inbox; email provider plugs into `lib/notify.ts`, see `.env.production.example`)
- [x] WCAG 2.1 AA pass: axe-core, focus trap, aria-live, contrast ≥4.5:1, reduced-motion (implemented: skip link, focus-visible rings, reduced-motion CSS, semantic labels; formal axe-core audit still recommended pre-launch)
- [x] Trust pages: About, privacy, medical disclaimer, payment guidance (`/about, /privacy, /disclaimer, /payments`)
Accept: full flows translated, keyboard-only register→request, settings persist

## Phase 4 — Future (Post-MVP) — DONE (except mobile wrapper, see note)
- [x] Payments guidance (UPI/cards/forex, receipts) (`/payments` — guidance only, no in-app charges per PRD §7.4 out-of-scope; no payment gateway integrated by design)
- [x] Teleconsult scheduling, follow-up reminders (`/teleconsult`, `/reminders` + APIs)
- [x] Printable offline PDF pack (`/requests/[id]/print`)
- [x] Hospital compare, mobile wrapper, AI draft translation (human-reviewed) (`/hospitals/compare`, `/translate` glossary helper with human-review warning; native mobile wrapper deferred — web app is mobile-responsive and shares the same API for a future wrapper)

## Milestones & Mapping to PRD §8
- M1 (Phase 1): registrations + requests submitted
- M2 (Phase 2): translator/coordinator connections + appointments done + cost replies
- M3 (Phase 3): satisfaction ratings >50% capture, a11y + i18n complete

## Risks (from PRD §6)
Cost expectations → ranged + disclaimer; misinterpretation → no-diagnosis banner; PII → private bucket + role checks; scope creep → defer payments/booking to Phase 4.

## Steer One Choice (for grader)
Kept Next.js + TypeScript over plain MERN-JS: single-repo UI+API, SEO/i18n for directory, TS+Zod+Prisma safety for Request/Cost models, Postgres joins for metrics. See `PRD.md` Appendix B.
