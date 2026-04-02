# Checklist — Third Party Service Monitor

## Phase 1 — Setup & Struktur Project ✅
- [x] Vite + React + TypeScript
- [x] Dependencies installed
- [x] shadcn/ui initialized
- [x] Tailwind CSS configured
- [x] Folder structure
- [x] .env.local template
- [x] ESLint + Prettier
- [x] TypeScript interfaces (src/types/index.ts)

## Phase 2 — Data Layer ✅
- [x] src/data/services.json seed data (12 layanan)
- [x] Zustand store dengan persist ke localStorage
- [x] useServices(), useReminders(), useCostSummary(), useDashboardStats()
- [x] date.utils.ts, currency.utils.ts, export.utils.ts

## Phase 3 — UI Components ✅
- [x] shadcn/ui: Button, Input, Select, Dialog, Badge, Table, Tabs, Card
- [x] StatusBadge, ApiStatusBadge, StatCard
- [x] ServiceTable (sort, empty state)
- [x] ServiceForm (add/edit dialog, validasi)
- [x] ReminderList, CostSummary, SearchFilter

## Phase 4 — Pages & Routing ✅
- [x] App.tsx + React Router v6
- [x] Sidebar desktop + bottom navbar mobile
- [x] Dashboard.tsx (stats, reminder preview, tambah layanan)
- [x] Services.tsx (tabel + filter + export CSV)
- [x] Reminders.tsx (filter tabs: semua/kritis/perhatian/aman)
- [x] Costs.tsx (ringkasan + chart)

---

## Phase 5 — Multi-Project & Usage-Based Billing (v1.5)

### Data Model Refactor
- [ ] Update src/types/index.ts — tambah interface: `Project`, `AlertContact`, `UsageData`, `AlertRule`, `AlertLog`, `AppData`
- [ ] Update src/types/index.ts — tambah field di `Service`: `projectId`, `billingType`, `budgetCap`, `usageData`, `alertRules`
- [ ] Tambah `BillingType` = `'subscription' | 'usage-based' | 'hybrid'`
- [ ] Tambah `BillingCycle` = `'biannual'` (untuk Qiscus 6 bulanan)
- [ ] Buat src/data/app-data.json — gabungan projects + services + alertLogs
- [ ] Migrate seed data ke struktur baru (13 layanan + 3 project awal)

### Store Refactor
- [ ] Buat src/store/projects.store.ts — CRUD project, persist localStorage
- [ ] Update src/store/services.store.ts — tambah projectId, billingType, budgetCap, usageData
- [ ] Buat src/store/alerts.store.ts — CRUD alert log, persist localStorage

### Hooks Baru
- [ ] useProjects() — CRUD project
- [ ] useServicesByProject(projectId) — filter services per project
- [ ] useBudgetStatus(serviceId) — hitung budgetUsedPercent, return status
- [ ] useUsageBasedServices() — filter hanya usage-based, sort by budgetUsedPercent desc
- [ ] useAlertLogs() — list alert history

### Utils Baru
- [ ] budget.utils.ts — calcBudgetPercent(), getBudgetStatus(), estimateDaysLeft()
- [ ] alert.utils.ts — buildAlertMessage(service, project, threshold)

---

## Phase 6 — UI Multi-Project & Budget Monitoring

### Komponen Baru
- [ ] ProjectBadge.tsx — chip/badge nama project dengan warna
- [ ] BillingTypeBadge.tsx — badge: Subscription / Usage-Based / Hybrid
- [ ] BudgetProgressBar.tsx — progress bar warna (hijau/kuning/merah) + persen
- [ ] UsageCard.tsx — card khusus usage-based: sisa balance, progress, estimasi
- [ ] ProjectForm.tsx — dialog CRUD project (nama, kontak PM+TL, nomor WA)
- [ ] AlertRuleForm.tsx — setting threshold alert per layanan

### Update Komponen Existing
- [ ] ServiceTable.tsx — tambah kolom: Project, Billing Type, Budget Status
- [ ] ServiceForm.tsx — tambah field: projectId (select), billingType, budgetCap, usageData manual input
- [ ] SearchFilter.tsx — tambah filter: per project, per billing type
- [ ] StatCard di Dashboard — tambah card: "Usage Alert" (merah jika ada ≥80%)
- [ ] CostSummary.tsx — tambah breakdown per project

### Halaman Baru
- [ ] src/pages/Projects.tsx
  - [ ] List semua project (card grid)
  - [ ] Setiap card: nama, jumlah layanan, total biaya/bln, PM & TL
  - [ ] Tombol tambah/edit/hapus project
  - [ ] Klik project → filter Services ke project tersebut
- [ ] src/pages/UsageMonitor.tsx
  - [ ] List semua layanan usage-based & hybrid
  - [ ] Progress bar budget per layanan
  - [ ] Sisa balance + estimasi habis N hari
  - [ ] Tombol "Refresh" per layanan (manual sync)
  - [ ] Alert history per layanan

### Update Navigation
- [ ] Tambah menu: "Project" dan "Usage Monitor" di sidebar
- [ ] Update Dashboard — tambah section "Usage Alert" jika ada yang ≥80%

---

## Phase 7 — Notifikasi WhatsApp via Qiscus (v2)

### Setup Backend Proxy
- [ ] Buat server/ folder dengan Express + TypeScript (Hono sebagai alternatif)
- [ ] Endpoint: POST /api/notify/whatsapp
- [ ] Endpoint: GET /api/sync/:serviceId (proxy ke API third party)
- [ ] Setup CORS untuk development

### Qiscus WA Integration
- [ ] Konfigurasi Qiscus WA API credentials di .env
- [ ] Buat src/services/qiscus-wa.service.ts — fungsi sendWhatsApp(to, message)
- [ ] Template pesan alert:
  ```
  ⚠️ *Budget Alert — [Nama Layanan]*
  Project: [Nama Project]
  Usage: Rp X.XXX.XXX / Rp X.XXX.XXX (XX%)
  Status: Mendekati batas budget!
  Segera cek dashboard: [URL]
  ```
- [ ] Log setiap pengiriman ke alerts.store

### Alert Trigger Logic
- [ ] Cek threshold saat usageData diupdate
- [ ] Jangan kirim duplikat — cek lastTriggeredAt per threshold
- [ ] Reset trigger jika memasuki bulan baru
- [ ] Tombol "Test Alert" di UI untuk verifikasi

---

## Phase 8 — API Integration Real-Time (v2)

### GCP Billing API
- [ ] Setup Service Account di GCP Console (lihat api-adapters.md)
- [ ] Download credentials JSON → simpan di server/, jangan di frontend
- [ ] Buat adapter: server/adapters/gcp-billing.ts
  - [ ] Endpoint: GET billing bulan berjalan per project
  - [ ] Parse response → update usageData di store
- [ ] Auto-refresh setiap 1 jam via setInterval di backend

### Qiscus Balance API
- [ ] Buat adapter: src/adapters/qiscus-balance.ts
- [ ] Endpoint: GET saldo balance + usage hari ini
- [ ] Update usageData.balance dan usageData.usageToday

### Adsmedia API
- [ ] Cek dokumentasi Adsmedia untuk endpoint balance
- [ ] Buat adapter: src/adapters/adsmedia.ts
- [ ] Handle jika tidak ada public API → fallback manual input

---

## Phase 9 — Polish & QA (v1.5)

- [ ] Responsive semua halaman baru (mobile-friendly)
- [ ] Loading skeleton untuk UsageMonitor saat fetch data
- [ ] Toast notification: save/delete berhasil, alert terkirim
- [ ] Konfirmasi dialog sebelum delete project/service
- [ ] Empty state yang informatif untuk semua halaman
- [ ] Validasi: budgetCap wajib diisi jika billingType = usage-based
- [ ] Edge case: usage-based tanpa budgetCap → tampilkan peringatan
- [ ] Testing manual semua CRUD flow

---

## Phase 10 — Deployment

- [ ] npm run build — pastikan no error
- [ ] Deploy frontend ke Vercel / Netlify
- [ ] Deploy backend (jika ada) ke Railway / Render / VPS
- [ ] Set semua environment variables di platform
- [ ] Setup _redirects untuk SPA routing
- [ ] Verifikasi alert WA berjalan di production

---

## Prioritas Pengerjaan

```
[SELESAI - v1]
Phase 1 → 4 ✅

[NEXT SPRINT - v1.5]
Phase 5 (Data Model) → Phase 6 (UI) → Phase 9 (QA)

[SPRINT BERIKUTNYA - v2]
Phase 7 (WA Notif) → Phase 8 (API Real-Time)

[OPTIONAL]
Phase 10 (Deployment)
```