# LIFELINK — Emergency Health Identity Platform

> **When you cannot speak for yourself, your Digital Twin speaks.**

---

## The Problem — A Real Scenario

**2:47 AM. A single-car collision on I-95. The driver — a 42-year-old woman — is unconscious when EMS arrives.**

No wallet. No medical ID bracelet. Her phone is locked. The paramedics have **zero information** — not her name, not her blood type, not that she's on warfarin (a blood thinner), not that she has a severe penicillin allergy, not that she has a history of atrial fibrillation.

Every minute they spend guessing is a minute they can't treat her correctly. If they give her penicillin, she could go into anaphylactic shock. If they don't know she's on warfarin, internal bleeding could kill her before they reach the ER.

**This happens every day.** In the U.S. alone, **over 50% of emergency patients arrive unable to communicate** their critical health information. The result: preventable adverse drug events, delayed treatment, and avoidable deaths.

### The Core Edge Case: The Patient Is Unconscious

The critical flaw in most health ID systems: **they assume the patient can open their phone and share their data.** In a real emergency, the patient is unconscious, confused, or in shock. The responder needs access **without the patient's active participation.**

LIFELINK solves this with **three independent access paths** — none requiring the patient to be conscious or cooperative.

---

## The Solution — LIFELINK

LIFELINK gives every patient a **secure, patient-owned emergency identity** backed by an **Ontomorph Digital Twin** — a living, structured model of their health that travels with them.

### How It Works — End to End

**1. Patient Onboarding (once)**
- Create account → connect **Ontomorph Digital Twin** (via DTP Twin Core API) → set granular permissions (what responders can see) → generate **Emergency Identity** with unique QR code.

**2. Daily Life**
- The Digital Twin continuously syncs health events (labs, vitals, medication changes, conditions) from connected sources.
- Patient controls **exactly what responders see** — blood type and allergies? Yes. Psychiatric history? No.
- Grants are **time-limited, scoped, and revocable** — patient owns the consent.

**3. The Emergency (three access paths — patient may be unconscious)**

| Path | How It Works | When to Use |
|------|--------------|-------------|
| **Search (name or LL-ID)** | Responder enters patient name or LL-ID in portal → instant lookup | Patient unconscious, responder can identify them (ID, bracelet, phone screen) |
| **QR Scan (lock screen)** | QR code on phone lock screen / wallet card / medical bracelet → scans to public `/emergency/[LL-ID]` page, no unlock needed | Phone visible, QR accessible without unlock |
| **Grant Code (pre-authorized)** | Responder enters 8-char code → patient gets push notification → approves | Patient conscious, can cooperate |

All access is logged, auditable, and time-stamped. Every path retrieves: blood type, allergies, medications, conditions, emergency contacts — enriched by **HOLON clinical knowledge API** (drug interactions, reference ranges, risk flags).

**4. Responder Portal**
- Clean, clinical summary: active medications, allergies, conditions, recent labs, risk flags.
- Works offline (PWA service worker) for dead-zone EMS scenarios.
- Every access logged, auditable, patient-notified.

---

## Architecture Overview

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
│   Grants,       │     │  (Grant-code     │
│   Events)       │     │   lookup)        │
└─────────────────┘     └──────────────────┘
```

**Data flow:**
1. Patient creates identity → stored in MongoDB + Ontomorph Twin
2. Health events sync to Twin (labs, vitals, meds, conditions)
3. Patient creates grant → scoped token issued
4. Responder scans QR / enters code → grant validated → scoped data returned
5. HOLON enriches: drug interactions, lab reference ranges, clinical risk flags

---

## Key Features

| Feature | What It Does |
|---------|--------------|
| **Digital Twin Connection** | One-click link to Ontomorph DTP; twin created via Twin Core API |
| **Granular Permissions** | Patient chooses exactly which data categories responders see |
| **Time-Limited Grants** | Scoped tokens (e.g., `cardiovascular:read`, `medications:read`) with expiry |
| **QR Emergency Card** | Downloadable SVG, Web Share API, works offline |
| **HOLON Enrichment** | Drug interactions, reference ranges, clinical risk flags on responder view |
| **PWA / Offline** | Installable, service-worker cached, works in dead zones |
| **Audit Trail** | Every access logged, patient notified, revocable anytime |
| **Role-Based Access** | Patient / Responder / Admin — separate portals, separate auth flows |

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS v4, CSS variables (zero hardcoded colors) |
| **Auth** | JWT (HttpOnly cookie) + bcryptjs, role-based routes |
| **Database** | MongoDB (Mongoose) |
| **Ontomorph** | `@ontomorph/dtp-sdk` + direct REST to Twin Core + HOLON |
| **UI** | Framer Motion, Lucide, `qrcode.react` |
| **PWA** | Custom manifest + service worker |
| **Validation** | Zod schemas on every API route |
| **Rate Limiting** | In-memory (auth endpoints) |
| **Logging** | Structured console logger |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                 # login, onboarding, responder-login/register
│   ├── (dashboard)/            # patient: dashboard, identity, twin, timeline, access
│   ├── responder/              # responder portal
│   └── api/                    # auth, identity, events, grants, ontomorph/twin, health
├── components/
│   ├── landing/                # hero, problem, how-it-works, tech, security, CTA
│   ├── layout/                 # nav, footer, dashboard-nav
│   └── ui/                     # button, card, badge, input, skeleton, loader, logo
├── lib/                        # auth, db, ontomorph, validate, rate-limit, logger, etc.
├── models/                     # User, EmergencyIdentity, EmergencyGrant, HealthEvent, AccessLog
├── hooks/                      # useMediaQuery, useLocalStorage, useOnlineStatus
├── middleware.ts               # cookie auth, route guards, security headers
├── config/index.ts             # single config from env
└── types/api.ts                # shared TS interfaces
```

---

## Getting Started

### Prerequisites
- Node.js **20+** (`.nvmrc` pinned)
- MongoDB (local or Atlas)
- **Ontomorph API keys**:
  - `ONTOMORPH_API_KEY` — DTP Twin Core key
  - `HOLON_API_KEY` (optional, falls back to DTP key)

### Install & Run

```bash
git clone https://github.com/Emerald-dev0/lifelink-emergency-twin.git
cd lifelink-emergency-twin
npm install

# Copy .env.example → .env.local and fill in keys
cp .env.example .env.local

# Seed test accounts + sample data (required for demo)
npm run seed

npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

### Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
ONTOMORPH_API_KEY=dtp_your_key
ONTOMORPH_BASE_URL=https://api.ontomorph.com/v1
HOLON_API_KEY=holon_your_key          # optional
MONGODB_URI=mongodb://localhost:27017/lifelink
JWT_SECRET=your_32_byte_hex
ENCRYPTION_KEY=your_16_byte_hex
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | — | Register patient/responder |
| `POST` | `/api/auth/login` | — | Login → JWT cookie |
| `GET` | `/api/auth/me` | Bearer | Current user profile |
| `GET/POST/PUT` | `/api/identity` | Bearer | Emergency identity CRUD |
| `GET/POST` | `/api/events` | Bearer | Health event timeline |
| `GET/POST` | `/api/grants` | Bearer | Grant create/list |
| `GET` | `/api/grants/[code]` | — | Public grant validation |
| `GET` | `/api/emergency/[id]` | — | **Public emergency identity** (QR-encoded, no auth) |
| `POST` | `/api/responder` | — | Responder grant-code lookup |
| `GET` | `/api/responder/search?q=` | — | **Responder patient search** (by name or LL-ID) |
| `POST/GET` | `/api/ontomorph/twin` | Bearer | Create/fetch Ontomorph twin |
| `GET` | `/api/health` | — | MongoDB + Ontomorph status |

---

## Security

- JWT in **HttpOnly, Secure, SameSite=Lax** cookie + localStorage mirror
- Bcrypt cost factor **12**
- Rate limiting on auth endpoints (10 req/min/IP)
- Security headers via middleware: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Zod validation on every API body
- No secrets in client bundle

---

## PWA

- ✅ `manifest.json` (standalone, theme_color, icons, shortcuts)
- ✅ Service worker (cache-first static, network-first API)
- ✅ Maskable icons (192/512), `apple-touch-icon`, `favicon.svg`
- ✅ `theme-color` meta (light/dark)
- ✅ Offline fallback
- ✅ **PWA Shortcuts:** Emergency Card (one-tap from home screen), Dashboard
- ✅ **Emergency Card Page:** `/emergency-card/[LL-ID]` — high contrast, lock screen optimized, always-on display
- ✅ **QR on Lock Screen:** Download QR → set as wallpaper → EMS scans without unlock

---

## Future Roadmap (Post-Hackathon)

| Feature | Description |
|---------|-------------|
| **Native Mobile Apps** | React Native / Expo with offline-first sync, biometric unlock |
| **Apple Health / Google Fit Sync** | Import vitals, workouts, sleep as health events |
| **FHIR / EHR Import** | SMART on FHIR connectors (Epic, Cerner, OpenMRS) |
| **Family/Caregiver Portal** | Delegated access for elderly/pediatric patients |
| **Wearable Integration** | Real-time HR, SpO₂, glucose via BLE/Web Bluetooth |
| **AI Risk Stratification** | HOLON-powered predictive alerts (sepsis, MI, ADEs) |
| **Offline-First Responder Mode** | Cached patient summary for dead-zone EMS |
| **Multi-Language Support** | i18n for identity card (ES, FR, ZH, AR, etc.) |
| **Automated Grant Expiry** | Cron + webhook for revocation/notification |
| **End-to-End Encryption** | Client-side encryption of sensitive fields |
| **SMS/WhatsApp Fallback** | Short-code lookup for feature phones |
| **Blockchain Anchoring** | Merkle root of grant logs for tamper-evidence |
| **Test Suite** | Vitest + Playwright + contract tests |
| **CI/CD Pipeline** | GitHub Actions → typecheck → lint → test → deploy |

---

## For Judges / Testing

### Test Accounts (pre-seeded)

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| **Patient** | `patient@lifelink.demo` | `Patient123!` | Sarah Johnson — blood type O+, LL-ID `LL-6QS4-24W4`, connected Digital Twin, emergency identity with QR code, 6 health events, 3 emergency contacts, 3 medications, 3 allergies, 1 active grant |
| **Responder** | `responder@lifelink.demo` | `Responder123!` | Dr. James Carter — responder portal with grant-code lookup access |

> **Run locally:** `npm run seed` → `npm run dev` → open `http://localhost:3000`

### How to Demo the Full Flow

**You'll need two devices (or two browser windows in incognito):**

#### Scenario A — Patient Is Unconscious (Primary Flow)

**Device A — Responder (EMS)**
1. Go to `/responder` → choose **Search** tab
2. Type `Sarah Johnson` → click **Search Patient**
3. Portal instantly shows: blood type O+, allergies (Penicillin, Sulfa, Peanuts), medications, conditions, emergency contacts with tap-to-call
4. HOLON summary shows drug interaction warnings and clinical risk flags

**Or search by LL-ID:** `LL-6QS4-24W4`

#### Scenario B — QR Code on Phone Lock Screen

**Device A — Patient (before emergency)**
1. Login → Identity page → QR code links to `/emergency/LL-6QS4-24W4`
2. Screenshot QR, set as lock screen wallpaper, or print wallet card

**Device B — Responder**
1. Go to `/responder` → choose **Scan QR** tab
2. Scan the QR (or enter `LL-6QS4-24W4` manually)
3. Public emergency page loads instantly — no unlock needed, no auth required

**Direct link:** `http://localhost:3000/emergency/LL-6QS4-24W4`

#### Scenario C — Grant Code (Patient Conscious)

**Device A — Patient**
1. Login → Identity page → share grant code verbally or via message

**Device B — Responder**
1. Go to `/responder` → choose **Grant Code** tab
2. Enter the code → patient data loads with HOLON enrichment

**Pre-seeded grant code:** `GC-X59A-OVGA` (active, expires 24h)

### Three Access Paths for Responders

| Path | How It Works | Patient Status |
|------|--------------|----------------|
| **Search (name / LL-ID)** | Responder types patient name or LL-ID → instant lookup via `/api/responder/search` | **Unconscious** — responder identifies patient from ID, phone, bracelet |
| **QR Scan (lock screen)** | QR encodes `/emergency/[LL-ID]` → public page loads, no auth, no unlock | **Unconscious** — QR visible on phone lock screen, wallet card, or bracelet |
| **Grant Code** | Responder enters code → validated via `/api/responder` → scoped data returned | **Conscious** — patient shares code verbally or via message |

> **Key design decision:** The emergency page (`/emergency/[id]`) is **public and unauthenticated** — this is intentional. In a life-threatening emergency, barriers to data access cost lives. All access is logged with IP, timestamp, and user agent for audit.

### Quick Verification Checklist

- [ ] Patient login → Identity page shows QR + LL-ID + grant code
- [ ] Responder search → type "Sarah Johnson" → patient found
- [ ] Responder search → type LL-ID → patient found
- [ ] QR scan / LL-ID entry → public emergency page loads (no auth)
- [ ] Grant code entry → patient data loads in responder portal
- [ ] HOLON summary shows drug interaction / risk flags
- [ ] Emergency page shows blood type, allergies, medications, contacts with tap-to-call
- [ ] Emergency card page (`/emergency-card/[id]`) — high contrast, lock screen optimized
- [ ] PWA install prompt appears → "Add Emergency Card to Home Screen"
- [ ] Access log appears on patient's **Access** page
- [ ] Responder logout → portal locks
- [ ] Patient can revoke grant from **Access** page

### PWA Setup for Judges

**Install the PWA on your phone:**
1. Open `http://localhost:3000` in Chrome/Safari
2. Tap "Add to Home Screen" (or use the install prompt on Identity page)
3. LIFELINK now appears as a native app

**Set up emergency card for lock screen:**
1. Login → Identity page → tap "Open Emergency Card (Lock Screen View)"
2. Screenshot the QR code → set as phone wallpaper
3. Or: tap "Download QR" → print on card stock → keep in wallet

**Print physical emergency cards:**
1. Login → Identity page → tap "Wallet Card" → download SVG → print → cut → keep in wallet
2. Or: tap "Car Sticker" → download → print → place in car window / glove box
3. Each QR code is **unique per patient** — encodes their personal emergency URL
4. Card shows: blood type, allergies, medications, LIFELINK branding, QR code

**Test the unconscious patient flow:**
1. Phone is locked, QR visible on lock screen
2. Responder opens `/responder` → scans QR or types LL-ID
3. Blood type, allergies, meds, contacts load instantly

---

## License

MIT — free for hackathon, commercial, or educational use.

---

## Team

Built by **Emerald**.