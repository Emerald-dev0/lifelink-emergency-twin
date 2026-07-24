# LIFELINK — Emergency Health Identity Platform

> **When you cannot speak for yourself, your Digital Twin speaks.**

---

## The Problem

**2:47 AM. A single-car collision on I-95. The driver is unconscious when EMS arrives.**

No wallet. No medical ID bracelet. Phone is locked. The paramedics have **zero information** — not her name, not her blood type, not that she's on warfarin, not that she has a severe penicillin allergy.

**This happens every day.** Globally, **over 50% of emergency patients arrive unable to communicate** their critical health information. Every minute they spend guessing is a minute they can't treat her correctly.

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

## How to Set Up Your Emergency Card

### Step 1: Create Your Account

1. Go to `http://localhost:3000` (or your Vercel URL)
2. Click **Get Started** or **Create Account**
3. Fill in your details → you'll be guided through onboarding
4. Connect your **Ontomorph Digital Twin** (click "Connect Digital Twin" on the dashboard)

### Step 2: Set Up Your Emergency Identity

1. After onboarding, go to the **Identity** page (click "Identity" in the sidebar)
2. You'll see:
   - Your **LL-ID** (e.g., `LL-CW4P-KDFV`) — unique to you
   - Your **QR Code** — encodes your emergency page URL
   - Your **Grant Code** (e.g., `GC-U3PX-L3BQ`) — for conscious patient access
3. Fill in your health info: blood type, allergies, medications, conditions, emergency contacts

### Step 3: Download Your Emergency Cards

On the **Identity** page, you'll see four download options:

#### Option A: Wallet Card (Recommended)

1. Click **"Download Wallet Card"**
2. An SVG file downloads — credit-card sized (85.6mm × 53.98mm)
3. **What's on it:**
   - Your name and LL-ID
   - Blood type (large, bold)
   - Allergies (list)
   - Medications (list)
   - LIFELINK branding
   - Your personal QR code
4. **Print it:**
   - Print on card stock or photo paper
   - Cut along the edges
   - Laminate if possible (optional but recommended)
5. **Keep it:**
   - In your wallet (like a credit card)
   - In your purse or bag
   - With your ID documents

**Why this works:** Even if your phone is dead, broken, or locked, paramedics can find this card in your wallet and scan the QR code.

#### Option B: Car Sticker

1. Click **"Download Car Sticker"**
2. An SVG file downloads — 4" × 3" (large format)
3. **What's on it:**
   - Large, high-contrast QR code
   - "EMERGENCY MEDICAL INFO" header
   - Your LL-ID
   - LIFELINK branding
4. **Print it:**
   - Print on adhesive paper or vinyl
   - Cut to size
5. **Place it:**
   - Inside your car (glove box, visor, or dashboard)
   - On your car window (if local laws allow)
   - Near your driver's license/registration

**Why this works:** In a car accident, paramedics check the glove box and visor for medical info. A large QR code on a sticker means they can scan it without moving you.

#### Option C: QR Code Only

1. Click **"Download QR Code"**
2. Just the QR code image downloads
3. **Use it:**
   - Set as your phone's lock screen wallpaper
   - Print on a small card and attach to your medical bracelet
   - Engrave the URL on a medical ID bracelet
   - Share with family members

**Why this works:** The QR code is the fastest way for paramedics to access your info. Phone lock screen = instant access without unlocking.

#### Option D: Emergency Card Page

1. Click **"Open Emergency Card (Lock Screen View)"**
2. Opens `/emergency-card/[your-LL-ID]`
3. This is a **high-contrast, always-on display** optimized for phone screens
4. **Use it:**
   - Screenshot it → set as lock screen wallpaper
   - Leave it open on your phone during travel
   - Show it to paramedics directly

**Why this works:** Designed for lock screen viewing — large text, high contrast, no scrolling needed. Works even on low-brightness screens.

### Step 4: Set Up Phone Lock Screen (Optional but Powerful)

1. Open the **Emergency Card Page** on your phone
2. Take a screenshot
3. Set as your lock screen wallpaper
4. Now when paramedics find your phone, they see your medical info without unlocking

**Why this works:** Most people keep their phone on them at all times. A lock screen medical ID is always accessible.

### Step 5: Share with Family

1. Give your family members your **LL-ID** (e.g., `LL-CW4P-KDFV`)
2. They can access your emergency info at any time: `http://localhost:3000/emergency/LL-CW4P-KDFV`
3. They can also create their own LIFELINK accounts

---

## Contingencies & Edge Cases

LIFELINK is designed for **real-world emergency scenarios** where things go wrong. Here's how we handle every edge case:

### Contingency 1: Phone is Dead

| Problem | Solution |
|---------|----------|
| Patient's phone is dead | **Wallet card** in their purse/wallet → paramedic scans QR → emergency page loads on paramedic's phone |
| No wallet card | Paramedic searches by **name** or **LL-ID** (from medical bracelet, ID, or asking bystanders) |
| No ID at all | **Public emergency page** can be accessed if anyone knows the patient's name |

### Contingency 2: Phone is Locked

| Problem | Solution |
|---------|----------|
| Patient's phone is locked | **QR code on lock screen wallpaper** → paramedic scans with their phone → emergency page loads (no unlock needed) |
| No QR on lock screen | Paramedic searches by **name** or **LL-ID** in the responder portal |

### Contingency 3: Patient is Unconscious

| Problem | Solution |
|---------|----------|
| Patient can't communicate | **3 access paths work without patient cooperation:** Search (name/LL-ID), QR scan, or grant code (if someone else has it) |
| No one knows the patient's name | Paramedic checks wallet for **wallet card** → scans QR → instant access |
| In a car accident | **Car sticker** in glove box → paramedic scans → emergency page loads |

### Contingency 4: No Internet

| Problem | Solution |
|---------|----------|
| Paramedic has no signal | **PWA service worker** caches the emergency page → loads from cache if previously visited |
| First-time access, no cache | Paramedic can call the **grant code** line (future: SMS fallback) |
| Dead zone (rural area) | **Wallet card** has the LL-ID printed → paramedic can note it and access later when signal returns |

### Contingency 5: Allergic Reaction Emergency

| Problem | Solution |
|---------|----------|
| Paramedic needs to know allergies fast | **Emergency page** shows allergies in large, bold text at the top |
| Drug interaction risk | **HOLON enrichment** flags drug interactions in the responder view |
| Unknown medication | **Medication list** shows all current meds with dosages |

### Contingency 6: Multiple Patients

| Problem | Solution |
|---------|----------|
| Mass casualty incident | Each patient has a **unique LL-ID** → paramedic searches by LL-ID for each patient |
| Mixed up patients | **QR codes** are unique per patient → scanning the right QR gets the right data |
| Unidentified patient | **Name search** in responder portal → if patient is in the system, they're found |

### Contingency 7: Consent & Privacy

| Problem | Solution |
|---------|----------|
| Patient wants to control what's shared | **Granular permissions** → patient chooses exactly which data categories responders see |
| Grant was shared but patient changed their mind | **Revoke grant** from the Access page → immediate effect |
| Grant expired | **Time-limited grants** (default 24h) → automatically expire → no permanent access |
| Audit trail needed | **Access logging** → every access logged with IP, timestamp, user agent, fields accessed |

### Contingency 8: Technical Failures

| Problem | Solution |
|---------|----------|
| MongoDB is down | Health check endpoint shows `down` status → alerts admin |
| Ontomorph API is down | Fallback to local MongoDB data → emergency page still works |
| Vercel is down | **PWA service worker** serves cached emergency page |
| All systems down | **Physical wallet card** and **car sticker** still work (QR code + printed info) |

### Contingency 9: Different Devices

| Problem | Solution |
|---------|----------|
| Paramedic uses Android | **PWA** works on any device with a browser |
| Paramedic uses iPhone | Same — PWA works on iOS Safari |
| Paramedic uses old phone | **SVG QR codes** scale to any screen size |
| Patient uses tablet | **Responsive design** works on all screen sizes |

### Contingency 10: Real-World Scenarios

| Scenario | How LIFELINK Helps |
|----------|-------------------|
| **Car accident** | Car sticker in glove box → paramedic scans → blood type, allergies, meds load instantly |
| **Heart attack at home** | Family member opens LIFELINK app → shares emergency page with paramedics |
| **Allergic reaction at restaurant** | Friend searches by name in responder portal → allergy list shows → paramedic avoids penicillin |
| **Unconscious on the street** | Paramedic finds wallet → wallet card → scans QR → emergency page loads on their phone |
| **Traveling alone** | QR on lock screen → anyone who finds you can scan → paramedics get your data |
| **Mass casualty event** | Each patient has unique LL-ID → paramedics triage by scanning QR codes |

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
1. Go to `/responder-login` → login as responder
2. Go to `/responder` → **Search** tab
3. Type `Sarah Johnson` → patient found instantly
4. See: blood type O+, allergies (Penicillin, Sulfa, Peanuts), medications, conditions, contacts with tap-to-call

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
- [ ] Responder login → portal loads with 3 tabs (Search, QR, Grant Code)
- [ ] Responder search → "Sarah Johnson" → patient found
- [ ] Responder search → LL-ID → patient found
- [ ] QR / LL-ID → public emergency page loads (no auth)
- [ ] Grant code → patient data loads in responder portal
- [ ] Emergency page shows blood type, allergies, meds, contacts with tap-to-call
- [ ] Emergency card page (`/emergency-card/[id]`) — high contrast, lock screen
- [ ] Wallet card download → SVG file
- [ ] Car sticker download → SVG file
- [ ] QR code download → image file
- [ ] PWA install prompt appears
- [ ] Access log appears on patient's Access page
- [ ] Responder logout → portal locks

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

---

## License

MIT — free for hackathon, commercial, or educational use.

---

## Team

Built by **Emerald**.
