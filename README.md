# LIFELINK — Emergency Health Identity Platform

> **When you cannot speak for yourself, your Digital Twin speaks.**

---

## The Problem

**2:47 AM. A single-car collision on I-95. The driver is unconscious when EMS arrives.**

No wallet. No medical ID bracelet. Phone is locked. The paramedics have **zero information** — not her name, not her blood type, not that she's on warfarin, not that she has a severe penicillin allergy.

**This happens every day.** In the U.S., **over 50% of emergency patients arrive unable to communicate** their critical health information. Every minute they spend guessing is a minute they can't treat her correctly.

### The Core Edge Case: The Patient Is Unconscious

Most health ID systems **assume the patient can open their phone and share their data.** In a real emergency, the patient is unconscious, confused, or in shock. LIFELINK solves this with **three independent access paths** — none requiring the patient to be conscious or cooperative.

---

## The Solution

LIFELINK gives every patient a **secure, patient-owned emergency identity** backed by an **Ontomorph Digital Twin** — a living, structured model of their health that travels with them.

---

## All Features — And Why Each Exists

### Emergency Access (The Core)

| Feature | Why It Exists |
|---------|---------------|
| **3 Access Paths** (Search, QR, Grant Code) | Different emergencies need different approaches. An unconscious patient can't share a code — search or QR works. A conscious patient can verbally share a grant code. All three are independent. |
| **Search by Name or LL-ID** | Paramedics can identify a patient from their ID, phone, or bracelet. Typing `Sarah Johnson` or `LL-CW4P-KDFV` instantly returns their profile. |
| **QR Code on Lock Screen** | The QR code encodes `/emergency/[LL-ID]` — it loads a public page with zero auth, zero unlock needed. Set it as phone wallpaper or print on a wallet card. |
| **Grant Code Access** | Patient shares an 8-character code (`GC-XXXX-XXXX`) verbally or via message. Responder enters it → scoped data returned. Time-limited, revocable. |
| **Public Emergency Page** (`/emergency/[id]`) | **Intentionally unauthenticated.** In a life-threatening emergency, barriers to data access cost lives. Shows blood type, allergies, medications, conditions, emergency contacts with tap-to-call. All access logged with IP, timestamp, user agent. |
| **Emergency Card Page** (`/emergency-card/[id]`) | High-contrast, lock-screen-optimized view of the same emergency data. Designed for always-on display, no scrolling, no interaction needed. |

### Patient Identity & Data

| Feature | Why It Exists |
|---------|---------------|
| **LL-ID Identifier** (e.g., `LL-CW4P-KDFV`) | A unique, human-readable identifier that doesn't expose personal info. Can be memorized, printed on cards, or engraved on medical bracelets. |
| **Blood Type Display** | First thing paramedics need. Critical for transfusion decisions. Displayed prominently on all emergency views. |
| **Allergy List** | Prevents adverse drug events — the #1 cause of preventable harm in emergencies. Lists like "Penicillin, Sulfa drugs, Peanuts" are life-saving. |
| **Medication List** | Paramedics need to know current meds to avoid drug interactions and understand the patient's conditions. |
| **Conditions List** | Diabetes, hypertension, asthma — these affect treatment decisions in emergencies. |
| **Emergency Contacts** | Tap-to-call phone numbers for family, spouses, physicians. Responders can notify next-of-kin immediately. |
| **Granular Permissions** | Patient chooses exactly which data categories responders see. Blood type and allergies? Yes. Psychiatric history? Maybe not. Patient owns the consent. |
| **Ontomorph Digital Twin** | A living, structured model of the patient's health via Ontomorph DTP. Twin Core API creates and syncs the twin. Enables structured, queryable health data beyond static records. |
| **HOLON Clinical Enrichment** | Ontomorph HOLON API adds drug interaction warnings, lab reference ranges, and clinical risk flags to the responder view. Turns raw data into actionable clinical intelligence. |

### Health Events Timeline

| Feature | Why It Exists |
|---------|---------------|
| **Health Event Timeline** | Chronological record of checkups, medication changes, lab results, emergencies, vitals. Gives responders context — not just "what" but "when" and "why." |
| **Event Types** (checkup, medication, allergy, vitals, emergency, lab) | Categorized events let responders quickly scan for relevant history. A paramedic cares about recent allergies and medication changes, not routine checkups. |
| **Event Metadata** | Structured data within events — blood pressure readings, glucose levels, doctor names, treatment details. Enables HOLON enrichment and trend analysis. |
| **Severity Levels** (info, warning, critical) | Color-coded severity helps responders prioritize. A critical allergy reaction stands out from routine vitals. |

### Responder Portal

| Feature | Why It Exists |
|---------|---------------|
| **Responder Portal** (`/responder`) | Dedicated interface for EMS/first responders. Clean, clinical, fast. No patient dashboard clutter — just what they need to save a life. |
| **3 Access Tabs** (Search, QR, Grant Code) | Matches the 3 access paths. Responder picks the method that fits the situation. |
| **Patient Search** (`/api/responder/search`) | Instant lookup by name or LL-ID. Returns patient identifier, blood type, and links to full profile. |
| **Grant Code Lookup** | Enter code → patient data loads. Permissions are enforced — only granted fields are returned. |
| **Tap-to-Call Contacts** | Emergency contacts have clickable phone numbers. One tap to call spouse, daughter, or physician. |
| **Clinical Summary View** | Medications, allergies, conditions, contacts displayed in a clinical format designed for rapid scanning under pressure. |
| **Responder Registration/Login** | Separate auth flow for responders. Role-based access ensures responders can't access patient dashboards. |

### Emergency Cards & Physical Media

| Feature | Why It Exists |
|---------|---------------|
| **Wallet Card** (SVG, credit-card size) | Printable card with blood type, allergies, medications, QR code, LIFELINK branding. Keep in wallet — works even if phone is dead. |
| **Car Sticker** (SVG, 4×3") | For car windows or glove boxes. Paramedics check these at accident scenes. Large QR code, high contrast. |
| **QR Only Download** | Just the QR code — for custom printing or engraving on medical bracelets. |
| **Print View** | Optimized layout for printing on standard paper/card stock. |
| **Unique QR Per Patient** | Each QR encodes that patient's specific `/emergency/[LL-ID]` URL. No generic codes. |
| **SVG Format** | Vector graphics scale to any size without quality loss. Print at wallet size or billboard — always crisp. |

### PWA & Offline

| Feature | Why It Exists |
|---------|---------------|
| **Progressive Web App** | Installable on any device without app stores. Works as a native app with home screen icon. |
| **Service Worker** | Network-first strategy for API calls, cache-first for static assets. Emergency page works even in dead zones. |
| **PWA Shortcuts** | Home screen shortcuts for "Emergency Card" and "Dashboard" — one tap to critical features. |
| **Offline Fallback** | If network is unavailable, cached emergency data is still accessible. |
| **Lock Screen Optimization** | Emergency card page designed for always-on display, high contrast, no interaction needed. |
| **`theme-color` Meta** | Adapts to light/dark mode for native app feel. |

### Security

| Feature | Why It Exists |
|---------|---------------|
| **JWT Authentication** | HttpOnly, Secure, SameSite=Lax cookies + localStorage mirror. Stateless auth that scales. |
| **Bcrypt (Cost Factor 12)** | Passwords are hashed with strong bcrypt. Cost factor 12 balances security and performance. |
| **Rate Limiting** | 10 req/min/IP on auth endpoints. Prevents brute force attacks. |
| **Zod Validation** | Every API body is validated with Zod schemas. No malformed data reaches the database. |
| **Security Headers** | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` — standard protections. |
| **No Secrets in Client Bundle** | API keys stay server-side. Environment variables never leak to the browser. |
| **Time-Limited Grants** | Grants expire (default 24h). No permanent access. Patient can revoke anytime. |
| **Access Logging** | Every data access is logged with IP, timestamp, user agent, and fields accessed. Full audit trail. |
| **Role-Based Routes** | Middleware enforces patient/responder/admin separation. Responders can't access patient dashboards. |

### Dashboard & UX

| Feature | Why It Exists |
|---------|---------------|
| **Patient Dashboard** | At-a-glance view: twin status, LL-ID, blood type, quick actions. The "home base" for patients. |
| **Identity Page** | QR code display, download options (wallet card, car sticker, QR, print), grant code sharing. The most important patient page. |
| **Twin Page** | Shows Digital Twin status, sync info, Ontomorph connection. Transparency about what data is stored. |
| **Timeline Page** | Chronological health event history. Gives patients visibility into their own data. |
| **Access Page** | View and manage active grants. See who accessed data, when, and what they saw. Revoke grants. |
| **Responsive Design** | Works on phones, tablets, desktops. Paramedics might use a phone, patients might use a laptop. |
| **Loading States** (skeleton, spinner) | Professional UX — no blank screens while data loads. Critical for trust in emergency scenarios. |
| **Framer Motion Animations** | Smooth transitions that feel native. Professional polish for hackathon judges. |

### Backend & Infrastructure

| Feature | Why It Exists |
|---------|---------------|
| **MongoDB** | Flexible document schema for health data. Easy to add new fields without migrations. |
| **Ontomorph DTP Integration** | Digital Twin Core API for creating, syncing, and querying patient twins. The backbone of structured health data. |
| **HOLON Knowledge API** | Clinical knowledge enrichment — drug interactions, reference ranges, risk flags. Turns data into intelligence. |
| **13 API Routes** | Complete REST API: auth, identity, events, grants, emergency, responder, twin, health. |
| **13 Pages** | Full application: landing, auth (login, register, onboarding), dashboard (identity, twin, timeline, access), responder, emergency, emergency-card. |
| **Structured Logging** | Consistent log format for debugging and monitoring. |
| **Config Module** | Single source of truth for all environment variables. |

### Onboarding

| Feature | Why It Exists |
|---------|---------------|
| **Patient Onboarding** | Guided flow: create account → connect Digital Twin → set permissions → generate emergency identity. Reduces friction. |
| **Responder Registration** | Separate signup for EMS/first responders. Role-based from day one. |
| **Permission Selection** | Patient chooses what responders can see during onboarding. Sets the consent model early. |

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Patient App   │────▶│  Ontomorph DTP   │◀───▶│   HOLON API     │
│  (Next.js PWA)  │     │  Twin Core API   │     │  (Clinical KB)  │
└────────┬────────┘     └────────┬─────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌──────────────────┐
│   MongoDB       │     │  Responder       │
│  (Identity,     │     │  Portal          │
│   Grants,       │     │  (3 access       │
│   Events)       │     │   methods)       │
└─────────────────┘     └──────────────────┘
```

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4, CSS variables |
| **Auth** | JWT (HttpOnly cookie) + bcryptjs |
| **Database** | MongoDB Atlas (Mongoose) |
| **Ontomorph** | DTP Twin Core + HOLON REST API |
| **UI** | Framer Motion, Lucide, qrcode.react |
| **PWA** | Custom manifest + service worker |
| **Validation** | Zod schemas |
| **Rate Limiting** | In-memory (auth endpoints) |
| **Hosting** | Vercel (serverless) |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                 # login, onboarding, responder-login/register
│   ├── (dashboard)/            # patient: dashboard, identity, twin, timeline, access
│   ├── responder/              # responder portal (3 access methods)
│   ├── emergency/[id]/         # public emergency page (no auth)
│   ├── emergency-card/[id]/    # lock screen optimized card
│   └── api/                    # 13 API routes
├── components/
│   ├── landing/                # hero, problem, how-it-works, tech, security, CTA
│   ├── layout/                 # nav, footer, dashboard-nav
│   └── ui/                     # button, card, badge, input, skeleton, loader, logo
├── lib/                        # auth, db, ontomorph, validate, rate-limit, logger
├── models/                     # User, EmergencyIdentity, EmergencyGrant, HealthEvent, AccessLog
├── hooks/                      # useMediaQuery, useLocalStorage, useOnlineStatus
├── middleware.ts               # cookie auth, route guards, security headers
├── config/index.ts             # single config from env
└── types/api.ts                # shared TS interfaces
scripts/
├── seed.ts                     # seed test accounts + sample data
└── seed-user.ts                # seed data for specific user
```

---

## Getting Started

### Prerequisites
- Node.js **20+**
- MongoDB Atlas (or local)
- **Ontomorph API keys** (DTP + HOLON)

### Install & Run

```bash
git clone https://github.com/Emerald-dev0/lifelink-emergency-twin.git
cd lifelink-emergency-twin
npm install

cp .env.example .env.local    # fill in your keys
npm run seed                   # seed test accounts
npm run dev                    # http://localhost:3000
```

### Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
ONTOMORPH_API_KEY=dtp_live_personal_your_key
ONTOMORPH_BASE_URL=https://api.ontomorph.com
HOLON_API_KEY=holon_your_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_32_byte_hex
ENCRYPTION_KEY=your_16_byte_hex
```

### Deploy to Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set env vars in Vercel dashboard
4. Deploy — done

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | — | Register patient/responder |
| `POST` | `/api/auth/login` | — | Login → JWT |
| `GET` | `/api/auth/me` | Bearer | Current user profile |
| `GET/POST` | `/api/identity` | Bearer | Emergency identity CRUD |
| `GET/POST` | `/api/events` | Bearer | Health event timeline |
| `GET/POST` | `/api/grants` | Bearer | Grant create/list |
| `GET` | `/api/grants/[code]` | — | Public grant validation |
| `GET` | `/api/emergency/[id]` | — | **Public emergency identity** |
| `POST` | `/api/responder` | — | Responder grant-code lookup |
| `GET` | `/api/responder/search?q=` | — | **Responder patient search** |
| `POST/GET` | `/api/ontomorph/twin` | Bearer | Create/fetch Digital Twin |
| `GET` | `/api/health` | — | MongoDB + Ontomorph status |

---

## For Judges / Testing

### Test Accounts (pre-seeded)

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| **Patient** | `patient@lifelink.demo` | `Patient123!` | Sarah Johnson — O+, LL-ID `LL-CW4P-KDFV`, connected Twin, 6 health events, 3 contacts, 3 meds, 3 allergies |
| **Responder** | `responder@lifelink.demo` | `Responder123!` | Dr. James Carter — responder portal access |

### Demo Flow

**You need two browser windows (or two devices):**

#### A. Unconscious Patient (Primary Flow)

**Responder window:**
1. Go to `/responder` → **Search** tab
2. Type `Sarah Johnson` → patient found instantly
3. See: blood type O+, allergies (Penicillin, Sulfa, Peanuts), medications, conditions, contacts with tap-to-call

**Or search by LL-ID:** `LL-CW4P-KDFV`

#### B. QR Code on Lock Screen

**Patient window:**
1. Login → Identity page → QR code shows
2. Screenshot QR → set as lock screen wallpaper

**Responder window:**
1. `/responder` → **Scan QR** tab
2. Enter `LL-CW4P-KDFV` → public emergency page loads, no auth, no unlock

**Direct link:** `http://localhost:3000/emergency/LL-CW4P-KDFV`

#### C. Grant Code (Conscious Patient)

**Patient window:**
1. Login → Identity page → share grant code

**Responder window:**
1. `/responder` → **Grant Code** tab
2. Enter code → patient data loads

### Three Access Paths

| Path | When | Patient Status |
|------|------|----------------|
| **Search** (name/LL-ID) | Responder can identify patient | **Unconscious** |
| **QR Scan** (lock screen) | QR visible on phone/card/bracelet | **Unconscious** |
| **Grant Code** | Patient can share verbally | **Conscious** |

> **Design decision:** The emergency page is **public and unauthenticated.** In a life-threatening emergency, barriers cost lives. All access is logged for audit.

### Verification Checklist

- [ ] Patient login → Identity page shows QR + LL-ID + grant code
- [ ] Responder search → "Sarah Johnson" → patient found
- [ ] Responder search → LL-ID → patient found
- [ ] QR / LL-ID → public emergency page loads (no auth)
- [ ] Grant code → patient data loads in responder portal
- [ ] Emergency page shows blood type, allergies, meds, contacts with tap-to-call
- [ ] Emergency card page (`/emergency-card/[id]`) — high contrast, lock screen
- [ ] PWA install prompt appears
- [ ] Wallet card / car sticker / QR downloads work
- [ ] Access log appears on patient's Access page
- [ ] Responder logout → portal locks

---

## License

MIT — free for hackathon, commercial, or educational use.

---

## Team

Built by **Emerald**.
