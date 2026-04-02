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
- [ ] Buat `src/data/services.json` dengan 12 layanan awal (lihat `database.md` tabel seed)
- [ ] Generate UUID untuk setiap layanan menggunakan `crypto.randomUUID()`
- [ ] Set `renewalDate`, `costPerMonth`, `billingCycle` sesuai data di `prd.md`
- [ ] Pastikan Rumahweb memiliki 2 entry di `accounts` array (primary + sub)

### Zustand Store
- [ ] Buat `src/store/services.store.ts`
  - [ ] State: `services: Service[]`, `isLoading: boolean`, `lastUpdated: string`
  - [ ] Actions: `loadServices()`, `addService()`, `updateService()`, `deleteService()` (soft)
  - [ ] Persist ke `localStorage` menggunakan zustand/middleware `persist`

### Hooks
- [ ] `useServices()` — CRUD + filter + search
- [ ] `useReminders()` — filter layanan berdasarkan daysUntilRenewal, sort ascending
- [ ] `useCostSummary()` — kalkulasi total, breakdown per kategori
- [ ] `useDashboardStats()` — hitung 5 metric stat card

### Utils
- [ ] `date.utils.ts` — `daysUntil()`, `getStatus()`, `formatDate()` (locale id-ID)
- [ ] `currency.utils.ts` — `formatIDR()`, `toMonthly()` (normalisasi cycle ke bulanan)
- [ ] `export.utils.ts` — `exportToCSV()` dengan header: Nama, Kategori, Email, Biaya/Bulan, Renewal, Status

---

## Phase 3 — UI Components

### Base Components (shadcn/ui)
- [ ] Install: Button, Input, Select, Dialog, Badge, Table, Tabs, Card
- [ ] Sesuaikan theme warna di `tailwind.config.ts`

### Custom Components
- [ ] `StatusBadge.tsx` — props: `status: ServiceStatus`, render badge warna sesuai
  - [ ] `ok` → hijau
  - [ ] `warn` → kuning/amber
  - [ ] `danger` → merah
  - [ ] `unknown` → abu-abu
- [ ] `ApiStatusBadge.tsx` — props: `apiStatus: ApiStatus`
- [ ] `StatCard.tsx` — props: `label`, `value`, `sub`, `color?`
- [ ] `ServiceTable.tsx`
  - [ ] Kolom: Nama + ikon inisial, Kategori, Email, Biaya/Bulan, Renewal + days, Status, Aksi
  - [ ] Fitur sort per kolom
  - [ ] Empty state ketika tidak ada hasil filter
- [ ] `ServiceForm.tsx` — form tambah/edit dalam Dialog/Modal
  - [ ] Field: name, category (dropdown), accounts (email + label), costPerMonth, billingCycle, renewalDate, apiStatus, notes
  - [ ] Validasi: name wajib, email valid, costPerMonth ≥ 0, renewalDate valid
- [ ] `ReminderList.tsx` — list item dengan warna dot per status, sorted by renewal
- [ ] `CostSummary.tsx` — total card + tabel breakdown + mini bar chart (Recharts)
- [ ] `SearchFilter.tsx` — input search + select status + select kategori

---

## Phase 4 — Pages & Routing

### Layout
- [ ] `src/App.tsx` — setup React Router dengan layout shell (sidebar/navbar)
- [ ] Sidebar/Navbar dengan link: Dashboard, Layanan, Pengingat, Biaya

### Pages
- [ ] `Dashboard.tsx`
  - [ ] Render 5 `StatCard` dari `useDashboardStats()`
  - [ ] Preview 5 layanan dengan renewal terdekat (`useReminders()`)
  - [ ] Tombol quick-add layanan baru
- [ ] `Services.tsx`
  - [ ] `SearchFilter` + `ServiceTable`
  - [ ] Tombol "Tambah Layanan" buka `ServiceForm` dialog
  - [ ] Tombol "Export CSV" trigger `exportToCSV()`
- [ ] `Reminders.tsx`
  - [ ] Full list dari `useReminders()`
  - [ ] Filter: Semua / Kritis / Perlu Perhatian / Aman
- [ ] `Costs.tsx`
  - [ ] `CostSummary` component full width

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