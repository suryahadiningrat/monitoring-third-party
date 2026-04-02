# Stack — Third Party Service Monitor

## Tech Stack

### Frontend
- **Framework**: React 18 (Vite sebagai bundler)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query v5)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

### Backend (Opsional — jika diperlukan server)
- **Runtime**: Node.js 20+
- **Framework**: Express.js atau Hono (lightweight)
- **Language**: TypeScript

### Penyimpanan Data
- **Utama**: File JSON lokal (`data/services.json`) — simple, tidak perlu database
- **Opsional v2**: SQLite (via better-sqlite3) jika data makin besar

### API Integration Layer
- Setiap third party memiliki adapter tersendiri di `src/adapters/`
- Pattern: setiap adapter mengekspos fungsi `fetchStatus(config): Promise<ServiceStatus>`
- HTTP client: native `fetch` atau `axios`

### Development Tools
- **Package Manager**: npm atau pnpm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Git**: Conventional commits

---

## Struktur Folder Project

```
third-party-monitor/
├── public/
├── src/
│   ├── adapters/              # API adapter per layanan
│   │   ├── base.adapter.ts    # Interface dasar semua adapter
│   │   ├── niagahoster.ts
│   │   ├── webpushr.ts
│   │   ├── mailjet.ts
│   │   ├── ahrefs.ts
│   │   ├── semrush.ts
│   │   ├── rumahweb.ts
│   │   ├── elastic-email.ts
│   │   ├── qiscus.ts
│   │   ├── adsmedia.ts
│   │   ├── google-drive.ts
│   │   └── zoom.ts
│   ├── components/
│   │   ├── ui/                # shadcn/ui base components
│   │   ├── ServiceTable.tsx
│   │   ├── ServiceForm.tsx
│   │   ├── StatCard.tsx
│   │   ├── ReminderList.tsx
│   │   ├── CostSummary.tsx
│   │   └── StatusBadge.tsx
│   ├── hooks/
│   │   ├── useServices.ts     # CRUD operations
│   │   ├── useReminders.ts
│   │   └── useCostSummary.ts
│   ├── store/
│   │   └── services.store.ts  # Zustand store
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   └── export.utils.ts
│   ├── data/
│   │   └── services.json      # Persistent local data
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Services.tsx
│   │   ├── Reminders.tsx
│   │   └── Costs.tsx
│   ├── App.tsx
│   └── main.tsx
├── prd.md
├── stack.md
├── database.md
├── checklist.md
├── prompts.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## Cara Menjalankan Project

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

---

## Environment Variables

Buat file `.env.local` di root project:

```env
# Webpushr
VITE_WEBPUSHR_API_KEY=
VITE_WEBPUSHR_AUTH_KEY=

# Mailjet
VITE_MAILJET_API_KEY=
VITE_MAILJET_SECRET_KEY=

# Ahrefs
VITE_AHREFS_API_KEY=

# Semrush
VITE_SEMRUSH_API_KEY=

# Elastic Email
VITE_ELASTIC_EMAIL_API_KEY=

# Qiscus
VITE_QISCUS_APP_ID=
VITE_QISCUS_SECRET_KEY=

# Zoom
VITE_ZOOM_CLIENT_ID=
VITE_ZOOM_CLIENT_SECRET=

# me-QR
VITE_MEQR_API_KEY=
```

> Layanan yang tidak memiliki public API (Niagahoster, Rumahweb, Adsmedia) menggunakan mode manual.

---

## Dependency Versions (Pinned)

```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "typescript": "^5.4.0",
  "vite": "^5.2.0",
  "tailwindcss": "^3.4.0",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.40.0",
  "react-router-dom": "^6.23.0",
  "recharts": "^2.12.0",
  "date-fns": "^3.6.0",
  "lucide-react": "^0.383.0",
  "axios": "^1.7.0"
}
```