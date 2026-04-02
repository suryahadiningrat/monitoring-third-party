# Prompts — Third Party Service Monitor

## Deskripsi Project (context agent)

Kamu adalah agent yang membangun **Third Party Service Monitor** — aplikasi financial control internal untuk memantau biaya third party lintas 10+ project perusahaan.

Masalah nyata yang diselesaikan: insiden GCP menghabiskan Rp 98jt tanpa ada yang sadar karena tidak ada budget cap & alert.

Stack: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Zustand + TanStack Query.
Phase 1-4 sudah selesai dan running. Fokus sekarang di Phase 5+ (multi-project, usage-based billing, budget cap).
Referensi: `prd.md`, `stack.md`, `database.md`, `checklist.md`, `api-adapters.md`.

---

## Aturan Umum Agent

1. Selalu TypeScript strict — tidak ada `any`
2. Type dari `src/types/index.ts` — jangan definisikan ulang
3. Tailwind CSS only — tidak ada inline style
4. shadcn/ui untuk UI base components
5. date-fns untuk tanggal, formatIDR() untuk currency
6. Data dari Zustand store — tidak hardcode di komponen
7. Jangan break Phase 1-4 yang sudah working
8. Props interface eksplisit setiap komponen baru

---

## Prompt Spesifik Per Task

### Update Types (Phase 5)
```
Update src/types/index.ts sesuai database.md versi terbaru.
Tambahkan interfaces baru: Project, AlertContact, UsageData, AlertRule, AlertLog, AppData.
Update interface Service: tambah projectId, billingType, budgetCap, usageData, alertRules.
Tambah type baru: BillingType, AlertThreshold, NotifStatus.
Tambah 'biannual' ke BillingCycle.
Tambah 'Cloud Infrastructure' ke ServiceCategory.
Jangan hapus interface yang sudah ada — hanya tambah dan update.
Pastikan tidak ada TypeScript error setelah update.
```

### Buat Projects Store
```
Buat src/store/projects.store.ts menggunakan Zustand dengan persist middleware.
State: projects: Project[], isLoading: boolean.
Actions: addProject, updateProject, deleteProject (soft delete isActive: false), loadProjects.
Seed 3 project awal sesuai database.md jika localStorage kosong:
- Floothink (id: proj-floothink)
- Suzuki Hyperlocal (id: proj-suzuki)
- IDP / Integrated Data Platform (id: proj-idp)
Contacts diisi placeholder dulu (nama: TBD, waNumber: kosong string).
```

### Update Services Store untuk Multi-Project
```
Update src/store/services.store.ts:
- Tambah field projectId, billingType, budgetCap, usageData ke setiap service
- Migrate seed data: assign projectId ke masing-masing layanan sesuai database.md
  (Floothink: Niagahoster, Webpushr, Mailjet, Ahrefs, Semrush, me-QR)
  (Suzuki: Elastic Email, Adsmedia OTP, GCP Suzuki)
  (IDP: Qiscus WA, Google One Drive)
  (Global/shared project baru: Rumahweb, Zoom Pro)
- Tambah layanan baru: Google Cloud GCP (billingType: usage-based, budgetCap: 5000000)
- Set alertRules default: [{threshold:50,enabled:true}, {threshold:80,enabled:true}, {threshold:100,enabled:true}]
Jangan hapus data yang sudah ada di localStorage — cek dulu apakah migrasi diperlukan.
```

### Buat BudgetProgressBar Component
```
Buat src/components/BudgetProgressBar.tsx.
Props: { currentUsage: number, budgetCap: number, showLabel?: boolean }
Hitung percent = (currentUsage / budgetCap) * 100, clamp ke 0-100.
Warna bar:
  - 0-49%: hijau (bg-green-500)
  - 50-79%: kuning (bg-amber-500)
  - 80-99%: oranye (bg-orange-500)
  - 100%: merah (bg-red-500)
Tampilkan label: "Rp X.XXX.XXX / Rp X.XXX.XXX (XX%)" jika showLabel=true.
Gunakan formatIDR() dari currency.utils.ts.
```

### Buat UsageCard Component
```
Buat src/components/UsageCard.tsx untuk menampilkan layanan usage-based.
Props: { service: ServiceWithStatus, project?: Project }
Tampilkan:
  - Nama layanan + ProjectBadge
  - BillingTypeBadge
  - BudgetProgressBar (currentUsage vs budgetCap)
  - Sisa balance (jika ada) + estimasi habis N hari
  - Usage hari ini (usageToday)
  - Last synced timestamp
  - Tombol "Update Manual" → buka form input manual usageData
  - Status badge (ok/warn/danger berdasarkan budgetUsedPercent)
```

### Buat Halaman Projects
```
Buat src/pages/Projects.tsx.
Tampilkan semua project dalam card grid (2 kolom desktop, 1 kolom mobile).
Setiap card berisi:
  - Nama project
  - Jumlah layanan aktif
  - Total biaya subscription/bulan
  - Jumlah layanan usage-based + status alert
  - Nama PM & Tech Lead (atau "Belum dikonfigurasi" jika kosong)
  - Tombol Edit (buka ProjectForm dialog)
Tombol "+ Tambah Project" di header.
Klik nama project → navigate ke /services?project=projectId (filter services).
```

### Buat Halaman UsageMonitor
```
Buat src/pages/UsageMonitor.tsx.
Tampilkan HANYA layanan dengan billingType = 'usage-based' atau 'hybrid'.
Sort by budgetUsedPercent descending (yang paling kritis di atas).
Setiap layanan tampil sebagai UsageCard.
Filter: per project (dropdown).
Banner alert merah di atas jika ada layanan ≥80% budget cap.
Section terpisah: "Kritis (≥80%)" dan "Normal (<80%)".
```

### Update Dashboard untuk Usage Alert
```
Update src/pages/Dashboard.tsx.
Tambah StatCard baru: "Usage Alert" — jumlah layanan usage-based yang ≥80% cap, warna merah.
Tambah section baru "⚠️ Perhatian Segera" di bawah stat cards:
  Jika ada layanan usage-based ≥80% cap, tampilkan list singkat (max 3).
  Setiap item: nama layanan, project, persentase, tombol "Lihat Detail" → /usage-monitor.
Jika tidak ada yang alert, section ini disembunyikan.
```

### Alert WA Message Builder
```
Buat src/utils/alert.utils.ts.
Fungsi: buildAlertMessage(service: Service, project: Project, threshold: AlertThreshold): string
Output template pesan WA:
  ⚠️ *BUDGET ALERT — [threshold]%*
  
  Layanan: [service.name]
  Project: [project.name]
  
  Usage bulan ini: Rp X.XXX.XXX
  Budget cap: Rp X.XXX.XXX
  Terpakai: XX%
  
  Segera cek dashboard untuk tindakan lebih lanjut.
  
  _Third Party Monitor — [tanggal & jam]_

Fungsi: shouldSendAlert(service: Service, threshold: AlertThreshold): boolean
Cek lastTriggeredAt — jangan kirim duplikat dalam hari yang sama.
Reset jika sudah masuk bulan baru.
```

### Debugging / Fix
```
Cek error berikut dan perbaiki sesuai TypeScript strict mode.
Jangan ubah logic bisnis atau interface yang sudah ada.
Hanya perbaiki yang error, jangan refactor hal lain.
```

---

## Konvensi Penamaan

| Tipe | Konvensi | Contoh |
|------|----------|--------|
| Komponen React | PascalCase | `BudgetProgressBar.tsx` |
| Hooks | camelCase prefix `use` | `useProjects.ts` |
| Utils | camelCase suffix tipe | `budget.utils.ts` |
| Store | camelCase suffix `.store` | `projects.store.ts` |
| Adapters | kebab-case | `qiscus-balance.ts` |
| Props interface | `[ComponentName]Props` | `UsageCardProps` |

---

## Data Project & Layanan (Quick Reference)

```typescript
// 3 project awal
const PROJECTS = [
  { id: 'proj-floothink', name: 'Floothink' },
  { id: 'proj-suzuki',    name: 'Suzuki Hyperlocal' },
  { id: 'proj-idp',       name: 'IDP (Integrated Data Platform)' },
  { id: 'proj-global',    name: 'Global / Shared' },
];

// Mapping layanan ke project
const PROJECT_MAPPING = {
  'proj-floothink': ['Niagahoster Domain', 'Webpushr Push Notif', 'Mailjet Email Marketing', 'Ahrefs', 'Semrush', 'me-QR Code'],
  'proj-suzuki':    ['Elastic Email', 'Adsmedia OTP', 'Google Cloud (GCP) - Suzuki'],
  'proj-idp':       ['Qiscus WA Notif', 'Google One Drive'],
  'proj-global':    ['Rumahweb', 'Zoom Pro'],
};

// Layanan usage-based (yang kritis)
const USAGE_BASED = [
  { name: 'Google Cloud (GCP)', projectId: 'proj-suzuki', budgetCap: 5_000_000 },
  { name: 'Qiscus WA Notif',    projectId: 'proj-idp',    budgetCap: 1_000_000 }, // hybrid
  { name: 'Adsmedia OTP',       projectId: 'proj-suzuki', budgetCap:   500_000 },
];
```