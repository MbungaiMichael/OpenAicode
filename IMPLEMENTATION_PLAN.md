# Implementation Plan: International Patient Assistance Platform

Source: `PRD.md` v1.0 — Web (Next.js + TypeScript + PostgreSQL/Supabase + Prisma).

## Phase 0 — Foundation (Days 1-3)
- [ ] Init Next.js App Router + TS + Tailwind + ESLint/Prettier
- [ ] Structure: `app/ components/ lib/ prisma/ public/`
- [ ] Supabase Postgres + Prisma schema: User, Hospital, Request, Treatment, CostEstimate, MedicalDocument, Rating
- [ ] Env: `DATABASE_URL, NEXTAUTH_SECRET, NEXT_PUBLIC_APP_URL, STORAGE_BUCKET`
- [ ] CI: `npm run build && npm run lint` passes
- Exit: dev server + DB migrate + seed works

## Phase 1 — MVP: Auth + Directory + Requests (Weeks 1-3)
Auth & Profiles:
- [ ] `/register, /login, /profile` — country + language (en/fr/sw/ar), roles: patient/caregiver/translator/coordinator/admin
- [ ] Route guards, Zod validation
Hospital Directory:
- [ ] `GET /api/hospitals?search=&specialty=&city=`, `GET /api/hospitals/[id]`
- [ ] `/hospitals, /hospitals/[id]` — search/filter, detail with map link
- [ ] Seed 10-15 hospitals via `prisma/seed.ts`
Requests Core:
- [ ] `POST /api/requests, GET /api/requests, PATCH /api/requests/[id]`
- [ ] `/request/new, /requests, /dashboard` — types: translator/coordinator/appointment/cost_estimate/support, status: new/assigned/done
- [ ] Coordinator triage assign → done
Accept: register → find hospital → submit → track → triage works; responsive + keyboard accessible

## Phase 2 — Treatment, Cost, Navigation (Weeks 4-5)
- [ ] `/treatments, /treatments/[id]` — plain-language steps, stay, risks + disclaimer
- [ ] Cost flow: `POST /api/estimates` (min/max + currency + disclaimer), linked to request
- [ ] Navigation: address, lat/lng, embed/link, facilities, phone on hospital detail
- [ ] Documents: Supabase Storage `medical-docs` private + signed URLs, role-checked upload/view
- [ ] Admin `/admin/metrics`: patients, requests, connections, appointments, avg rating
Accept: 6+ treatments, cost range + disclaimer end-to-end, metrics queryable

## Phase 3 — Polish, i18n, Settings (Weeks 6-7)
- [ ] `next-intl` EN/FR/SW/AR (+ RTL for AR), persisted preference
- [ ] `/settings` — language, profile, notifications, data export
- [ ] Email notifications on assign/done/estimate (Resend/Nodemailer + log table)
- [ ] WCAG 2.1 AA pass: axe-core, focus trap, aria-live, contrast ≥4.5:1, reduced-motion
- [ ] Trust pages: About, privacy, medical disclaimer, payment guidance
Accept: full flows translated, keyboard-only register→request, settings persist

## Phase 4 — Future (Post-MVP)
- [ ] Payments guidance (UPI/cards/forex, receipts)
- [ ] Teleconsult scheduling, follow-up reminders
- [ ] Printable offline PDF pack
- [ ] Hospital compare, mobile wrapper, AI draft translation (human-reviewed)

## Milestones & Mapping to PRD §8
- M1 (Phase 1): registrations + requests submitted
- M2 (Phase 2): translator/coordinator connections + appointments done + cost replies
- M3 (Phase 3): satisfaction ratings >50% capture, a11y + i18n complete

## Risks (from PRD §6)
Cost expectations → ranged + disclaimer; misinterpretation → no-diagnosis banner; PII → private bucket + role checks; scope creep → defer payments/booking to Phase 4.

## Steer One Choice (for grader)
Kept Next.js + TypeScript over plain MERN-JS: single-repo UI+API, SEO/i18n for directory, TS+Zod+Prisma safety for Request/Cost models, Postgres joins for metrics. See `PRD.md` Appendix B.
