# Cognibloom Frontend (Next.js App Router)

Cognibloom is an AI-powered adaptive learning platform designed for structured mastery of complex concepts through socratic AI conversations, dynamic learning modes, and real-time activity analytics.

---

## 🛠 Tech Stack

- **Framework & Runtime:** Next.js (App Router), React 19, TypeScript (Strict Mode)
- **Styling:** Tailwind CSS, PostCSS, Lucide React Icons
- **HTTP & API Client:** Axios with centralized interceptors, Bearer JWT token management, and normalized error handling
- **Visualizations:** Recharts (responsive analytics & mode breakdowns)
- **Fonts:** Inter (`next/font/google`)

---

## 📁 Directory Structure

```
frontend/
├── .env.example
├── .env.local
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── topics/
│   │   │       ├── page.tsx
│   │   │       └── [topicId]/
│   │   │           ├── page.tsx
│   │   │           └── session/
│   │   │               └── [sessionId]/
│   │   │                   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── dashboard/          # Metrics cards, mode breakdown chart, recent activity
│   │   ├── interactions/       # Chat bubbles, markdown renderer, feedback buttons
│   │   ├── layout/             # Navbar, footer, shell layout
│   │   ├── sessions/           # Mode selector, session header, question input
│   │   ├── topics/             # Topic card, create topic modal
│   │   └── ui/                 # Reusable buttons, inputs, cards, badges, modals, skeletons, alerts
│   ├── hooks/
│   │   └── useAuth.ts          # Auth state consumer hook
│   ├── lib/
│   │   ├── api/                # Centralized Axios API clients (auth, topics, sessions, interactions, dashboard)
│   │   └── utils.ts
│   ├── providers/
│   │   └── AuthProvider.tsx    # JWT authentication, profile bootstrap, auto-logout
│   ├── types/                  # Strict TypeScript interfaces matching backend contracts
│   └── utils/                  # Formatters, mode metadata
```

---

## ⚡ Setup & Run Instructions

### 1. Prerequisites
- Node.js (v18+ recommended, v22+ supported)
- Cognibloom Backend running at `http://localhost:5000`

### 2. Installation
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

### 3. Environment Configuration
Create `.env.local`:
```bash
cp .env.example .env.local
```

Ensure `NEXT_PUBLIC_API_URL` points to your backend REST API:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Development Server
Start the Next.js development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 5. Production Build
Build the production bundle:
```bash
npm run build
```

Start production server:
```bash
npm run start
```

---

## 🔐 Authentication & Demo Credentials

If you seeded the backend using `npm run prisma:seed`, you can log in with:
- **Email:** `alex@cognibloom.com`
- **Password:** `password123`

*(The Login page includes a one-click demo autofill button for instant testing.)*

---

## 🧭 Routes & Learning Flow

- `/login` — Sign in with email and password
- `/register` — Create a new learner account
- `/dashboard` — Activity overview, mode breakdown chart, top studied topic, and recent sessions
- `/topics` — Browse and search learning topics or create a new topic
- `/topics/[topicId]` — View topic details, historical sessions, and start a new learning session
- `/topics/[topicId]/session/[sessionId]` — Core AI learning session with interactive Q&A, mode switching (`LEARN`, `CHALLENGE`, `EXPLAIN`, `VALIDATE`), inline feedback (`👍 Helpful` / `👎 Not Helpful`), and session completion
