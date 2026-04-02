# Checklist — Third Party Service Monitor

## Phase 1 — Setup & Struktur Project

### Inisialisasi
- [x] `npm create vite@latest third-party-monitor -- --template react-ts`
- [x] Install dependencies: `npm install tailwindcss @tailwindcss/vite zustand @tanstack/react-query react-router-dom recharts date-fns lucide-react axios`
- [x] Install shadcn/ui: `npx shadcn@latest init`
- [x] Setup Tailwind CSS config
- [x] Setup folder struktur sesuai `stack.md`
- [x] Buat file `.env.local` dari template di `stack.md`
- [x] Setup ESLint + Prettier

### Types & Interfaces
- [x] Buat `src/types/index.ts` — implementasi semua interface dari `database.md`
- [x] Pastikan TypeScript strict mode aktif di `tsconfig.json`

---

## Phase 2 — Data Layer

### Seed Data
- [x] Buat `src/data/services.json` dengan 12 layanan awal (lihat `database.md` tabel seed)
- [x] Generate UUID untuk setiap layanan menggunakan `crypto.randomUUID()`
- [x] Set `renewalDate`, `costPerMonth`, `billingCycle` sesuai data di `prd.md`
- [x] Pastikan Rumahweb memiliki 2 entry di `accounts` array (primary + sub)

### Zustand Store
- [x] Buat `src/store/services.store.ts`
  - [x] State: `services: Service[]`, `isLoading: boolean`, `lastUpdated: string`
  - [x] Actions: `loadServices()`, `addService()`, `updateService()`, `deleteService()` (soft)
  - [x] Persist ke `localStorage` menggunakan zustand/middleware `persist`

### Hooks
- [x] `useServices()` — CRUD + filter + search
- [x] `useReminders()` — filter layanan berdasarkan daysUntilRenewal, sort ascending
- [x] `useCostSummary()` — kalkulasi total, breakdown per kategori
- [x] `useDashboardStats()` — hitung 5 metric stat card

### Utils
- [x] `date.utils.ts` — `daysUntil()`, `getStatus()`, `formatDate()` (locale id-ID)
- [x] `currency.utils.ts` — `formatIDR()`, `toMonthly()` (normalisasi cycle ke bulanan)
- [x] `export.utils.ts` — `exportToCSV()` dengan header: Nama, Kategori, Email, Biaya/Bulan, Renewal, Status

---

## Phase 3 — UI Components

### Base Components (shadcn/ui)
- [x] Install: Button, Input, Select, Dialog, Badge, Table, Tabs, Card
- [x] Sesuaikan theme warna di `tailwind.config.ts`

### Custom Components
- [x] `StatusBadge.tsx` — props: `status: ServiceStatus`, render badge warna sesuai
  - [x] `ok` → hijau
  - [x] `warn` → kuning/amber
  - [x] `danger` → merah
  - [x] `unknown` → abu-abu
- [x] `ApiStatusBadge.tsx` — props: `apiStatus: ApiStatus`
- [x] `StatCard.tsx` — props: `label`, `value`, `sub`, `color?`
- [x] `ServiceTable.tsx`
  - [x] Kolom: Nama + ikon inisial, Kategori, Email, Biaya/Bulan, Renewal + days, Status, Aksi
  - [x] Fitur sort per kolom
  - [x] Empty state ketika tidak ada hasil filter
- [x] `ServiceForm.tsx` — form tambah/edit dalam Dialog/Modal
  - [x] Field: name, category (dropdown), accounts (email + label), costPerMonth, billingCycle, renewalDate, apiStatus, notes
  - [x] Validasi: name wajib, email valid, costPerMonth ≥ 0, renewalDate valid
- [x] `ReminderList.tsx` — list item dengan warna dot per status, sorted by renewal
- [x] `CostSummary.tsx` — total card + tabel breakdown + mini bar chart (Recharts)
- [x] `SearchFilter.tsx` — input search + select status + select kategori

---

## Phase 4 — Pages & Routing

### Layout
- [x] `src/App.tsx` — setup React Router dengan layout shell (sidebar/navbar)
- [x] Sidebar/Navbar dengan link: Dashboard, Layanan, Pengingat, Biaya

### Pages
- [x] `Dashboard.tsx`
  - [x] Render 5 `StatCard` dari `useDashboardStats()`
  - [x] Preview 5 layanan dengan renewal terdekat (`useReminders()`)
  - [x] Tombol quick-add layanan baru
- [x] `Services.tsx`
  - [x] `SearchFilter` + `ServiceTable`
  - [x] Tombol "Tambah Layanan" buka `ServiceForm` dialog
  - [x] Tombol "Export CSV" trigger `exportToCSV()`
- [x] `Reminders.tsx`
  - [x] Full list dari `useReminders()`
  - [x] Filter: Semua / Kritis / Perlu Perhatian / Aman
- [x] `Costs.tsx`
  - [x] `CostSummary` component full width

---

## Phase 5 — API Integration

### Adapter Layer
- [ ] Buat `src/adapters/base.adapter.ts` — interface `ServiceAdapter`
- [ ] Implementasi adapter sesuai `api-adapters.md`:
  - [ ] `webpushr.ts`
  - [ ] `mailjet.ts`
  - [ ] `ahrefs.ts`
  - [ ] `semrush.ts`
  - [ ] `elastic-email.ts`
  - [ ] `qiscus.ts`
  - [ ] `zoom.ts`
  - [ ] `manual.ts` (fallback)
- [ ] `src/adapters/index.ts` — registry + `getAdapter()` function

### Sync Logic
- [ ] Hook `useApiSync(serviceId)` — trigger fetch adapter, update `liveData` di store
- [ ] Tampilkan `liveData` di ServiceTable (kolom tambahan atau tooltip)
- [ ] Tampilkan `lastSynced` timestamp per layanan
- [ ] Handle CORS error dengan pesan yang jelas di UI
- [ ] Setup Vite proxy untuk API yang butuh proxy (lihat `api-adapters.md`)

---

## Phase 6 — Polish & QA

### UI/UX
- [ ] Responsive layout (mobile-friendly)
- [ ] Loading skeleton saat data loading
- [ ] Toast notification setelah save/delete berhasil
- [ ] Konfirmasi dialog sebelum delete
- [ ] Form validation dengan pesan error yang jelas

### Edge Cases
- [ ] Layanan tanpa `renewalDate` → tampilkan "-" dan status "unknown"
- [ ] `costPerMonth: 0` → tampilkan "Gratis" bukan "Rp 0"
- [ ] `renewalDate` sudah lewat → status "danger" + label "Sudah lewat"
- [ ] Layanan soft-deleted tidak muncul di tabel (filter `isActive: true`)

### Testing Manual
- [ ] Tambah layanan baru → muncul di tabel
- [ ] Edit layanan → data terupdate
- [ ] Delete layanan → hilang dari tabel, tersimpan sebagai `isActive: false`
- [ ] Filter status "Kritis" → hanya tampilkan yang ≤7 hari
- [ ] Export CSV → file terdownload, data valid
- [ ] Semua 12 layanan awal tampil dengan benar

---

## Phase 7 — Deployment (Opsional)

- [ ] Build: `npm run build`
- [ ] Deploy ke Vercel / Netlify / Cloudflare Pages
- [ ] Set environment variables di platform deployment
- [ ] Pastikan semua route berfungsi (tambahkan `_redirects` atau `vercel.json` untuk SPA)

---

## Prioritas Pengerjaan

```
[MUST HAVE - v1]
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 6 (QA dasar)

[NICE TO HAVE - v1.5]
Phase 5 (API Integration) — dimulai dari layanan yang memiliki API paling mudah

[LATER - v2]
Phase 7 (Deployment)
Notifikasi email/WhatsApp saat renewal dekat
Multi-user authentication
```