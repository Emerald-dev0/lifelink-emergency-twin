# LIFELINK — Emergency Health Identity Platform

> **When you cannot speak for yourself, your Digital Twin speaks.**

LIFELINK is a patient-owned emergency health identity platform powered by **Ontomorph Digital Twins**. Patients create a secure emergency profile (blood type, allergies, medications, conditions, emergency contacts) and connect their Ontomorph Digital Twin. In an emergency, first responders scan the patient's QR code to instantly access critical medical data — scoped by patient-defined permissions and gated by time-limited grants.

---

## Features

| Area | Highlights |
|------|------------|
| **Patient Onboarding** | Multi-step flow: account → connect Digital Twin (Ontomorph DTP) → set permissions → generate emergency identity |
| **Emergency Identity** | QR-encoded card with blood type, allergies, meds, conditions, contacts; downloadable SVG; Web Share API |
| **Digital Twin Health** | Body-systems overview (cardiovascular, nervous, respiratory, blood, medication) synced from Ontomorph Twin Core API |
| **Health Timeline** | Chronological event stream (labs, vitals, meds, alerts, grants) with severity badges |
| **Access Control** | Patient creates time-limited grants (`cardiovascular:read`, `events:read`, `medications:read`); revocable anytime |
| **Responder Portal** | Grant-code lookup → patient summary powered by HOLON clinical knowledge API |
| **PWA** | Installable, offline-capable, service-worker cached, native icons & splash screens |
| **Theming** | Two design systems: **Landing** (white/black) + **App** (dark/cyan) — zero hardcoded colors, all CSS variables |
| **Auth** | JWT in HttpOnly cookie + localStorage; role-based routes (`patient`, `responder`, `admin`) |

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, CSS variables, `clsx` |
| Auth | `jsonwebtoken` + `bcryptjs`, HttpOnly cookies |
| Database | MongoDB (Mongoose) |
| Ontomorph | `@ontomorph/dtp-sdk` + direct REST to Twin Core API (`/twins`, `/grants`, `/events/emergency-card`) + HOLON knowledge API |
| UI | Framer Motion, Lucide icons, `qrcode.react` |
| PWA | `next-pwa` compatible manifest + custom SW |
| Lint/Format | ESLint (Next.js), Prettier |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                 # public auth pages
│   │   ├── login/
│   │   ├── onboarding/
│   │   ├── responder-login/
│   │   └── responder-register/
│   ├── (dashboard)/            # patient dashboard (protected)
│   │   ├── dashboard/
│   │   ├── identity/
│   │   ├── twin/
│   │   ├── timeline/
│   │   └── access/
│   ├── responder/              # responder portal (protected)
│   ├── api/
│   │   ├── auth/               # register, login, me
│   │   ├── identity/           # CRUD emergency identity
│   │   ├── events/             # health event timeline
│   │   ├── grants/             # grant create/list/validate
│   │   ├── ontomorph/twin/     # proxy to Ontomorph Twin Core
│   │   ├── responder/          # grant-code lookup
│   │   └── health/             # health check
│   ├── globals.css             # CSS variables for both themes
│   ├── layout.tsx              # root layout (landing-theme)
│   └── page.tsx                # landing page
├── components/
│   ├── landing/                # hero, problem, how-it-works, tech, security, CTA
│   ├── layout/                 # nav, footer, dashboard-nav
│   ├── ui/                     # button, card, badge, input, skeleton, loader, logo, empty-state
│   └── pwa-register.tsx
├── lib/
│   ├── auth.ts                 # client-side token/user helpers
│   ├── db.ts                   # Mongoose connection singleton
│   ├── ontomorph.ts            # server-side Ontomorph REST client
│   ├── validate.ts             # Zod schemas for API bodies
│   ├── rate-limit.ts           # in-memory rate limiter
│   ├── logger.ts               # structured console logger
│   ├── api-response.ts         # standardised response helpers
│   ├── security.ts             # email/password/phone/sanitize helpers
│   └── utils.ts                # cn(), generateId(), formatDate, timeAgo
├── models/                     # Mongoose models (User, EmergencyIdentity, EmergencyGrant, HealthEvent, AccessLog)
├── hooks/                      # useMediaQuery, useLocalStorage, useOnlineStatus
├── middleware.ts               # Next.js 16 middleware (cookie auth, route guards, security headers)
├── config/index.ts             # single config object from env
└── types/api.ts                # shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js **20+** (`.nvmrc` / `.node-version` pinned)
- MongoDB (local or Atlas)
- **Ontomorph API keys**:
  - `ONTOMORPH_API_KEY` — DTP Twin Core key (for `/twins`, `/grants`, `/events`)
  - `HOLON_API_KEY` (optional, falls back to DTP key) — HOLON clinical knowledge API

### Install

```bash
git clone https://github.com/<your-org>/lifelink-emergency-twin.git
cd lifelink-emergency-twin
npm install
```

### Environment

Copy `.env.example` → `.env.local` and fill:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Ontomorph (single DTP key powers both Twin Core & HOLON)
ONTOMORPH_API_KEY=dtp_your_key_here
ONTOMORPH_BASE_URL=https://api.ontomorph.com/v1
HOLON_API_KEY=holon_your_key_here   # optional; defaults to ONTOMORPH_API_KEY

# MongoDB
MONGODB_URI=mongodb://localhost:27017/lifelink
# or Atlas: mongodb+srv://user:pass@cluster.mongodb.net/lifelink

# Auth
JWT_SECRET=your_32_char_base64_secret
ENCRYPTION_KEY=your_16_char_hex_key
```

Generate secrets:

```bash
# JWT secret (32 bytes base64)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Encryption key (16 bytes hex)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Run

```bash
npm run dev          # Turbopack dev server on http://localhost:3000
npm run build        # production build
npm start            # production server
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

---

## Key API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | — | Register patient/responder |
| `POST` | `/api/auth/login` | — | Login → JWT cookie |
| `GET`  | `/api/auth/me` | Bearer | Current user profile |
| `GET/POST/PUT` | `/api/identity` | Bearer | Emergency identity CRUD |
| `GET/POST` | `/api/events` | Bearer | Health event timeline |
| `GET/POST` | `/api/grants` | Bearer | Grant create/list |
| `GET` | `/api/grants/[code]` | — | Public grant validation |
| `POST` | `/api/responder` | — | Responder grant-code lookup |
| `POST/GET` | `/api/ontomorph/twin` | Bearer | Create/fetch Ontomorph twin |
| `GET` | `/api/health` | — | MongoDB + Ontomorph status |

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import in Vercel → add env vars from `.env.local`
3. Deploy — automatic HTTPS, edge functions, PWA headers

### Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t lifelink .
docker run -p 3000:3000 --env-file .env.local lifelink
```

---

## PWA Checklist

- ✅ `manifest.json` (name, icons, theme_color, display: standalone)
- ✅ Service worker (`public/sw.js`) — cache-first for static, network-first for API
- ✅ `apple-touch-icon`, `favicon.svg`, maskable icons (192/512)
- ✅ `theme-color` meta tags (light/dark variants)
- ✅ Offline fallback page

---

## Security

- JWT in **HttpOnly, Secure, SameSite=Lax** cookie + localStorage mirror
- Bcrypt cost factor **12**
- Rate limiting on auth endpoints (10 req/min/IP)
- Helmet-style headers via middleware: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Zod validation on every API body
- No secrets in client bundle

---

## Hackathon Judging Highlights

| Criterion | How LIFELINK Delivers |
|-----------|----------------------|
| **Real-world problem** | 50% of ER patients can't communicate critical health info |
| **Technical depth** | Dual-API integration (DTP + HOLON), grant-based consent, Digital Twin sync |
| **UX polish** | Two design systems, Framer Motion micro-interactions, QR download/share, PWA |
| **Completeness** | End-to-end: onboarding → twin → identity → grants → responder lookup |
| **Code quality** | Strict TS, ESLint, modular libs, middleware auth, structured logging |

---

## License

MIT — free for hackathon, commercial, or educational use.

---

## Team

Built for **[Hackathon Name]** by **[Your Team Name]**.

- **Repo**: `https://github.com/<org>/lifelink-emergency-twin`
- **Demo**: `https://lifelink-demo.vercel.app`
- **Contact**: `team@lifelink.dev`