# Product Requirements Document: International Patient Assistance Platform

## 1. Overview

**Product Name:** International Patient Assistance Platform
**Version:** 1.0
**Platform:** Web (Responsive, Mobile-First)
**Platform Description:** Centralized web platform helping international patients, especially from African countries, access medical care in India. Hosted Next.js app with PostgreSQL backend, searchable hospital directory, and coordinated assistance requests.
**Core Requirement:** Patient can register, find a hospital, and submit an assistance request (translator / coordinator / appointment / cost estimate / support) end-to-end

### 1.1 Purpose
A digital platform designed to help international patients access medical care in India by providing hospital information, translation services, treatment coordination, and assistance throughout their healthcare journey. It simplifies language access, hospital navigation, treatment understanding, cost estimation, and payment guidance.

### 1.2 Target Audience
- International patients traveling to India for medical treatment
- Patients from African countries who face language and cultural barriers
- Family members or caregivers accompanying patients
- Translators and patient coordinators assisting international patients
- Hospital admins / platform admins triaging requests

### 1.3 Design Principles
1. **Clarity First** — Plain-language medical info, no jargon without explanation
2. **Language Access** — Every core flow usable in patient's preferred language (EN, FR, SW, AR initially)
3. **Coordination** — One request system for translator, coordinator, appointment, cost, support
4. **Trust & Safety** — No diagnosis/prescription; clear disclaimers on costs and availability
5. **Accessibility** — WCAG 2.1 AA compliant, mobile-first for travelers
6. **Measurability** — Every MVP feature maps to a success metric

### 1.4 Architecture
- **Next.js (App Router) + TypeScript** frontend + API routes in one repo
- **PostgreSQL (Supabase) + Prisma ORM** as primary data store
- **NextAuth** for auth (email + phone OTP future)
- **Tailwind CSS** for styling, responsive layout
- **i18n routing** for multi-language UI
- **File storage (Supabase Storage)** for medical documents / hospital images
- **Map embed (Google Maps / OpenStreetMap link)** for hospital navigation — no custom GIS in MVP

### 1.5 Technical Requirements

#### Data Model
```typescript
// User
{
  id: "uuid",
  name: string,
  email: string,
  phone?: string,
  country: string,          // e.g. "Kenya", "Nigeria"
  language: "en" | "fr" | "sw" | "ar",
  role: "patient" | "caregiver" | "translator" | "coordinator" | "admin",
  createdAt: string          // ISO 8601
}

// Hospital
{
  id: "uuid",
  name: string,              // e.g. "Apollo Hospitals, Delhi"
  city: string,
  state: string,
  address: string,
  lat?: number,
  lng?: number,
  phone: string,
  specialties: string[],     // ["Cardiology","Orthopedics","Oncology"]
  services: string[],
  facilities: string[],
  images: string[]
}

// Assistance Request (core MVP entity)
{
  id: "uuid",
  patientId: string,         // User.id
  type: "translator" | "coordinator" | "appointment" | "cost_estimate" | "support",
  languageNeeded?: string,
  hospitalId?: string,
  specialty?: string,
  message: string,
  status: "new" | "assigned" | "done",
  assigneeId?: string,       // translator/coordinator User.id
  createdAt: string,
  updatedAt: string
}

// Treatment
{
  id: "uuid",
  title: string,             // e.g. "Knee Replacement"
  description_simple: string,// plain-language explanation
  procedure_steps: string[],
  avgStay: string,           // e.g. "5-7 days"
  risks: string[]
}

// CostEstimate
{
  id: "uuid",
  requestId: string,
  treatmentId: string,
  hospitalId: string,
  minCost: number,
  maxCost: number,
  currency: "INR" | "USD",
  notes: string,
  disclaimer: string         // "Estimate only, not a guarantee"
}

// MedicalDocument (follow-up)
{
  id: "uuid",
  patientId: string,
  requestId?: string,
  fileUrl: string,
  label: string,
  createdAt: string
}
```

#### API Endpoints (MVP)
- `POST /api/auth/register, POST /api/auth/login, GET/PATCH /api/profile`
- `GET /api/hospitals?search=&specialty=&city=, GET /api/hospitals/[id]`
- `GET /api/treatments, GET /api/treatments/[id]`
- `POST /api/requests, GET /api/requests?mine=1, PATCH /api/requests/[id]`
- `POST /api/estimates (coordinator/admin), GET /api/estimates?requestId=`
- `GET /api/metrics (admin: counts + ratings)`

#### Browser Support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+, mobile Chrome/Safari
- Responsive breakpoints: Mobile <640px (primary), Tablet 640-1024px, Desktop >1024px

### 1.6 Non-Functional Requirements
- **Performance:** Initial load <2.5s on 3G; directory search <500ms for 500 hospitals; request submit <1s
- **Reliability:** Postgres backups; form drafts survive refresh; 99% request persistence
- **Privacy:** PII access by role only; documents private to patient + assignee + admin; no sale of data
- **Safety:** Disclaimer on all treatment/cost pages: no diagnosis, no guaranteed cost/availability; medical decisions by qualified professionals only
- **Accessibility:** WCAG 2.1 AA; keyboard navigation; screen-reader labels; focus trap in modals

---

## 2. Phase 1 — MVP (Weeks 1-3)

**Goal:** Ship end-to-end journey: register → find hospital → request assistance → track status.

### 2.1 Features

#### Patient Registration & Profiles
| Feature | Description | Priority |
|---------|-------------|----------|
| Register/Login | Email + password, create profile with country + preferred language | P0 |
| Profile Edit | Update name, phone, country, language, caregiver link | P0 |
| Roles | patient, caregiver, translator, coordinator, admin with route guards | P0 |

#### Hospital Directory
| Feature | Description | Priority |
|---------|-------------|----------|
| Browse Hospitals | List with name, city, specialties, services | P0 |
| Search/Filter | By text, specialty, city | P0 |
| Hospital Detail | Address, phone, specialties, services, facilities, map link | P0 |
| Seed Data | 10-15 real Indian hospitals with specialties | P0 |

#### Assistance Requests (Core)
| Feature | Description | Priority |
|---------|-------------|----------|
| New Request Form | Type, language needed, hospital, specialty, message | P0 |
| My Requests | List + status (new/assigned/done) | P0 |
| Triage | Coordinator/admin assigns, updates status | P0 |
| Support Contact | Contact-coordinator entry point routes to `support` request | P0 |

### 2.2 User Experience

#### User Flow 1: Register → Request Help
1. User opens `/register` → enters name, email, country, language → account created
2. Lands on `/hospitals` → searches "Cardiology in Delhi"
3. Opens hospital → clicks "Request Assistance"
4. Fills `/request/new` (type=translator, language=French, message) → submits
5. Sees toast + entry in `/requests` with status `new`

#### User Flow 2: Coordinator Triage
1. Coordinator opens `/dashboard` → sees `new` requests
2. Assigns self → status `assigned`
3. Contacts patient (phone/email shown) → resolves → marks `done`
4. Patient sees updated status + satisfaction rating prompt

#### Responsive
- Mobile-first cards for hospitals/requests; single-column forms; sticky CTA on hospital detail

### 2.3 Technical Details

#### Frontend Architecture
- Next.js App Router: `app/(auth)/register, app/hospitals, app/request/new, app/requests, app/dashboard`
- Server components for directory; client components for forms
- Zod validation on all forms + API routes
- Prisma queries with pagination (`take 20`)

#### Data Layer
```typescript
class RequestService {
  create(data: NewRequest) { /* validate, insert status=new */ }
  listForUser(userId, role) { /* patient sees own, staff sees queue */ }
  assign(id, assigneeId) { /* new -> assigned */ }
  complete(id) { /* assigned -> done */ }
}
```

#### Seed Strategy
- `prisma/seed.ts` inserts hospitals, 6 treatments, 1 admin, demo translator/coordinator

### 2.4 Design System (Phase 1)

#### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary-500` | `#2563EB` | Primary actions, links |
| `--color-primary-600` | `#1D4ED8` | Button bg |
| `--color-success-500` | `#22C55E` | Done status, confirmations |
| `--color-warning-500` | `#F59E0B` | Assigned/pending |
| `--color-neutral-900` | `#0F172A` | Primary text |
| `--color-neutral-600` | `#475569` | Secondary text |
| `--color-neutral-100` | `#F1F5F9` | Borders, secondary bg |
| `--color-neutral-50` | `#F8FAFC` | Page bg |

#### Typography / Spacing
- `--font-sans: Inter, system-ui`; `--text-base 1rem`, `--text-2xl 1.5rem` for hospital names; 4px spacing scale; `--radius-md 8px` cards/inputs; `--shadow-md` cards

### 2.5 Success Metrics
| Metric | Target |
|--------|--------|
| Registered patients (test) | 20+ in UAT |
| Assistance requests submitted | 30+ in UAT |
| Request submit p95 | <1s |
| Directory search <500ms | for 500 records |

### 2.6 Acceptance Criteria
- [ ] User can register with language, log in, edit profile
- [ ] Hospitals seeded, searchable by text/specialty/city
- [ ] Patient can submit all 5 request types and see status
- [ ] Coordinator can assign/complete requests
- [ ] All pages responsive and keyboard accessible
- [ ] `npm run build && npm run lint` passes

---

## 3. Phase 2 — Treatment Info, Cost & Navigation (Weeks 4-5)

**Goal:** Help patients understand procedures, get cost ranges, and navigate facilities.

### 3.1 Features
| Feature | Description | Priority |
|---------|-------------|----------|
| Treatment Library | Plain-language pages: steps, stay length, risks | P0 |
| Cost Estimate Request | `cost_estimate` request linked to treatment + hospital | P0 |
| Cost Response | Coordinator returns min/max + currency + disclaimer | P0 |
| Hospital Navigation | Address, map embed/link, facilities, directions | P0 |
| Admin Metrics V1 | Counts: patients, requests, connections, appointments | P1 |
| Documents V1 | Upload/view follow-up docs per patient | P1 |

### 3.2 User Experience

#### User Flow 1: Plan Treatment
1. Patient opens `/treatments` → selects "Knee Replacement"
2. Reads steps/risks → clicks "Get Cost Estimate"
3. Picks hospital → submits → coordinator replies with range + disclaimer
4. Patient views estimate in request thread

#### User Flow 2: Navigate Hospital
1. Patient opens hospital detail → "Directions" → map link
2. Sees facilities (pharmacy, ICU, translators desk), phone, visiting info

### 3.3 Technical Details
- `Treatment`, `CostEstimate`, `MedicalDocument` tables + Supabase Storage bucket `medical-docs` (private, signed URLs)
- Cost API validates min<=max, requires disclaimer text
- Map: static embed iframe + external directions URL; store lat/lng when known
- Metrics query: `GROUP BY type, status` + ratings avg

### 3.4 Design Additions
- **EstimateCard** (range, currency, disclaimer banner), **TreatmentSteps** timeline, **FacilityChips**, **RatingStars** (1-5)

### 3.5 Success Metrics
| Metric | Target |
|--------|--------|
| Cost estimates returned | 100% of valid requests in <48h (manual SLA) |
| Treatment page readability | Grade 8 or below |
| Satisfaction rating capture | >50% of done requests |

### 3.6 Acceptance Criteria
- [ ] 6+ treatments with plain-language content + disclaimers
- [ ] Cost flow works end-to-end with ranged estimate + disclaimer
- [ ] Every hospital has address + map link + facilities
- [ ] Documents upload/view restricted by role
- [ ] Admin sees counts per success metric

---

## 4. Phase 3 — Polish, Language & Settings (Weeks 6-7)

**Goal:** Production-ready UX for travelers: full i18n, accessibility, settings.

### 4.1 Features
| Feature | Description | Priority |
|---------|-------------|----------|
| i18n UI | EN, FR, SW, AR for nav, forms, statuses; RTL for AR | P0 |
| Settings Page | Language, notifications, profile, data/export | P0 |
| Accessibility Pass | WCAG 2.1 AA audit, focus management, ARIA on charts/status | P0 |
| Notifications V1 | Email on assign/done + estimate reply (log in dev) | P1 |
| Search Polish | Specialty autocomplete, empty states, skeletons | P1 |
| Trust Pages | About, privacy, medical disclaimer, payment guidance | P1 |

### 4.2 User Experience
1. User switches language in header → entire flow re-renders, preference persisted
2. Screen-reader user completes register→request with announcements
3. User changes phone/country in `/settings` with toast confirm

### 4.3 Technical Details
- `next-intl` dictionaries per locale; locale-prefixed routes
- Nodemailer/Resend for email; notification log table
- axe-core audit; `prefers-reduced-motion` respected; contrast ≥4.5:1

### 4.4 Acceptance Criteria
- [ ] All core flows translated (human-reviewed for medical terms)
- [ ] Keyboard-only completion of register→request
- [ ] Settings persist across sessions
- [ ] Disclaimer visible on treatment/cost/hospital pages

---

## 5. Phase 4 — Future Enhancements

| Feature | Description | Priority |
|---------|-------------|----------|
| Payments Guidance | UPI/cards/forex info, receipts, no in-app charge in V1 | P2 |
| Teleconsult Booking | Video pre-consult scheduling | P2 |
| Recurring Follow-up | Reminders, check-in prompts | P2 |
| Offline Pack | Printable hospital + estimate summary PDF | P2 |
| Mobile App | React Native/Flutter wrapper using same API | P3 |
| AI Assist | Draft translation, symptom-to-specialty guide (with disclaimer, human review) | P3 |
| Multi-hospital Compare | Side-by-side specialties/costs/facilities | P3 |

Acceptance: each future item ships with updated risks, disclaimer review, and metric.

---

## 6. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation | Phase |
|------|------------|--------|------------|-------|
| Inaccurate cost expectations | High | High | Ranged estimates + mandatory disclaimer, no guarantees | 2 |
| Medical misinterpretation | Medium | High | Plain language + "see a doctor" banner, no diagnosis feature | 1-2 |
| Language mistranslation (medical) | Medium | High | Human translators only in MVP; glossary review | 1,3 |
| PII exposure (documents) | Medium | High | Private bucket, signed URLs, role checks, audit log | 2 |
| Low hospital data quality | Medium | Medium | Curated seed, admin edit UI, source attribution | 1 |
| Email deliverability (OTP/notifs) | Medium | Medium | Log + retry, fallback to in-app inbox | 3 |
| Scope creep (payments/booking) | Medium | Medium | Defer to Phase 4, keep MVP to request coordination | 1 |

---

## 7. Appendix

### 7.1 MVP Routes
`/register, /login, /profile, /hospitals, /hospitals/[id], /treatments, /treatments/[id], /request/new, /requests, /dashboard, /support, /settings, /admin/metrics`

### 7.2 Seed Specialties
Cardiology, Orthopedics, Oncology, Neurology, Nephrology, Gastroenterology, Cosmetic Surgery, IVF/Fertility, Pediatrics, General Surgery

### 7.3 Success Metrics Mapping
- Registered patients → `User.count(role=patient)`
- Assistance requests → `Request.count()`
- Translator/coordinator connections → `Request.count(status!=new AND assigneeId!=null)`
- Appointments completed → `Request.count(type=appointment AND status=done)`
- Satisfaction → `Rating.avg`

### 7.4 Out of Scope (per original §9)
No independent diagnosis, prescription, guaranteed costs, or guaranteed availability. Medical decisions remain with qualified professionals.

---

## Appendix B: Change Log + Steer One Choice

### Change 1: Expanded thin PRD into phased implementation PRD
**Date:** 2026-09-28
**Reason:** Original `PRD.md` (§1-§9) defined goals/features/journey but had no data model, API, phases, acceptance criteria, or metrics queries needed to build. Restructured using Income Tracker PRD as format template into §1-§7 + phased delivery (MVP → Treatment/Cost → Polish → Future) matching the implementation plan.

### Steer One Choice — Tool decision for AI grader verification
**Question asked to AI builder:** "Why Next.js and TypeScript?" — should we keep it or switch to plain MERN-JS?
**Decision:** KEEP Next.js (App Router) + TypeScript with PostgreSQL (Supabase) + Prisma + NextAuth + Tailwind.
**Why:**
1. One repo serves UI + `/api` for MVP (no separate Express backend to host), and file routes map 1:1 to PRD journeys (`/hospitals`, `/treatments`, `/request/new`, `/dashboard`).
2. SEO + image optimization + i18n routing needed for hospital directory and EN/FR/SW/AR patients.
3. TypeScript + Zod + Prisma catches `Request.type/status` and `CostEstimate.min/max` errors at build time, critical where cost/medical data requires disclaimers.
4. Postgres relational model fits `User → Request → Hospital/Treatment/CostEstimate` joins and admin metrics better than localStorage/Mongo for this use case.
**Alternatives considered:** Plain MERN-JS (faster to start, weaker type safety, two deploys), Flutter (better mobile, overkill for web MVP). Plan stays valid if stack is swapped — only Phase 0 setup changes.
**Verified in:** This `PRD.md` §1.4 Architecture, §1.5 Data Model/API, §2.3/§3.3 implementation notes.


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
