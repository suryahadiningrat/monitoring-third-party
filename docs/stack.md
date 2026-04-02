# Stack — Third Party Service Monitor

## Tech Stack

### Frontend (v1 — sudah running)
- **Framework**: React 18 + Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **State Management**: Zustand + persist middleware
- **Data Fetching**: TanStack Query v5
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date**: date-fns

### Backend (v2 — akan ditambahkan)
- **Runtime**: Node.js 20+
- **Framework**: Hono (lightweight, TypeScript-first) atau Express.js
- **Purpose**:
  1. Proxy API third party (hindari CORS)
  2. Scheduler polling usage data setiap 1 jam
  3. Kirim notifikasi WhatsApp via Qiscus WA API
  4. Handle GCP Service Account credentials (tidak boleh di frontend)

### Penyimpanan Data
- **v1**: localStorage + JSON (pure frontend)
- **v2**: SQLite via better-sqlite3 (untuk alert log, history usage)

---

## Struktur Folder (v1.5 — Target)

```
third-party-monitor/
├── src/
│   ├── adapters/
│   │   ├── base.adapter.ts
│   │   ├── qiscus-balance.ts      # fetch saldo balance Qiscus
│   │   ├── adsmedia.ts            # fetch saldo Adsmedia (jika ada API)
│   │   └── manual.ts              # fallback untuk layanan tanpa API
│   ├── components/
│   │   ├── ui/                    # shadcn/ui
│   │   ├── ServiceTable.tsx       # ✅ update: tambah kolom project & billing type
│   │   ├── ServiceForm.tsx        # ✅ update: tambah field project, billingType, budgetCap
│   │   ├── StatCard.tsx           # ✅
│   │   ├── ReminderList.tsx       # ✅
│   │   ├── CostSummary.tsx        # ✅ update: breakdown per project
│   │   ├── SearchFilter.tsx       # ✅ update: filter per project & billing type
│   │   ├── StatusBadge.tsx        # ✅
│   │   ├── ApiStatusBadge.tsx     # ✅
│   │   ├── ProjectBadge.tsx       # 🆕 chip nama project
│   │   ├── BillingTypeBadge.tsx   # 🆕 Subscription / Usage-Based / Hybrid
│   │   ├── BudgetProgressBar.tsx  # 🆕 progress bar hijau/kuning/merah
│   │   ├── UsageCard.tsx          # 🆕 card usage-based lengkap
│   │   ├── ProjectForm.tsx        # 🆕 CRUD project
│   │   └── AlertRuleForm.tsx      # 🆕 setting threshold alert
│   ├── hooks/
│   │   ├── useServices.ts         # ✅
│   │   ├── useReminders.ts        # ✅
│   │   ├── useCostSummary.ts      # ✅ update: breakdown per project
│   │   ├── useDashboardStats.ts   # ✅ update: tambah budgetAlertCount
│   │   ├── useProjects.ts         # 🆕 CRUD project
│   │   ├── useServicesByProject.ts # 🆕
│   │   ├── useBudgetStatus.ts     # 🆕
│   │   ├── useUsageBasedServices.ts # 🆕
│   │   └── useAlertLogs.ts        # 🆕
│   ├── store/
│   │   ├── services.store.ts      # ✅ update: tambah billingType, budgetCap, usageData
│   │   ├── projects.store.ts      # 🆕
│   │   └── alerts.store.ts        # 🆕
│   ├── types/
│   │   └── index.ts               # ✅ update: Project, AlertContact, UsageData, AlertRule
│   ├── utils/
│   │   ├── date.utils.ts          # ✅
│   │   ├── currency.utils.ts      # ✅
│   │   ├── export.utils.ts        # ✅
│   │   ├── budget.utils.ts        # 🆕 calcBudgetPercent, estimateDaysLeft
│   │   └── alert.utils.ts         # 🆕 buildAlertMessage
│   ├── data/
│   │   └── app-data.json          # 🆕 ganti services.json, include projects
│   ├── pages/
│   │   ├── Dashboard.tsx          # ✅ update: tambah usage alert section
│   │   ├── Services.tsx           # ✅ update: filter per project
│   │   ├── Reminders.tsx          # ✅
│   │   ├── Costs.tsx              # ✅ update: breakdown per project
│   │   ├── Projects.tsx           # 🆕
│   │   └── UsageMonitor.tsx       # 🆕
│   ├── App.tsx                    # ✅ update: tambah route Projects & UsageMonitor
│   └── main.tsx
│
├── server/                        # 🆕 v2 — backend proxy & scheduler
│   ├── adapters/
│   │   └── gcp-billing.ts         # GCP Billing API (butuh Service Account)
│   ├── services/
│   │   └── qiscus-wa.service.ts   # Kirim WA notification
│   ├── routes/
│   │   ├── notify.ts              # POST /api/notify/whatsapp
│   │   └── sync.ts                # GET /api/sync/:serviceId
│   └── index.ts                   # Entry point server
│
├── docs/                          # project documentation
│   ├── prd.md
│   ├── stack.md
│   ├── database.md
│   ├── checklist.md
│   ├── prompts.md
│   ├── api-adapters.md
│   └── project-rules.md
│
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

Legend: ✅ sudah ada | 🆕 akan dibuat

---

## Environment Variables (Updated)

```env
# ─── Qiscus WA Notification ───────────────────────────────
VITE_QISCUS_WA_APP_ID=
VITE_QISCUS_WA_SECRET=
VITE_QISCUS_WA_SENDER_NUMBER=   # nomor WA pengirim (format: 628xxx)

# ─── Qiscus Balance Monitoring ───────────────────────────
VITE_QISCUS_BALANCE_APP_ID=
VITE_QISCUS_BALANCE_SECRET=

# ─── Google Cloud Billing (v2 — server only, jangan di VITE_) ──
GCP_SERVICE_ACCOUNT_KEY_PATH=./server/credentials/gcp-sa.json
GCP_BILLING_ACCOUNT_ID=

# ─── Adsmedia ─────────────────────────────────────────────
VITE_ADSMEDIA_API_KEY=

# ─── Webpushr ─────────────────────────────────────────────
VITE_WEBPUSHR_API_KEY=
VITE_WEBPUSHR_AUTH_KEY=

# ─── Mailjet ──────────────────────────────────────────────
VITE_MAILJET_API_KEY=
VITE_MAILJET_SECRET_KEY=

# ─── Ahrefs ───────────────────────────────────────────────
VITE_AHREFS_API_KEY=

# ─── Semrush ──────────────────────────────────────────────
VITE_SEMRUSH_API_KEY=

# ─── Elastic Email ────────────────────────────────────────
VITE_ELASTIC_EMAIL_API_KEY=

# ─── Zoom ─────────────────────────────────────────────────
VITE_ZOOM_CLIENT_ID=
VITE_ZOOM_CLIENT_SECRET=
VITE_ZOOM_ACCOUNT_ID=
```

> ⚠️ Variabel `GCP_*` TIDAK boleh di prefix `VITE_` karena mengandung credentials sensitif.
> Hanya diakses dari server/, bukan dari browser.

---

## Catatan GCP Billing API

Cloud Billing API di screenshot menunjukkan status **"Enable"** (belum aktif) untuk project Suzuki Hyperlocal. Untuk mengaktifkan:

1. Klik "Enable" di halaman Cloud Billing API
2. Buat Service Account baru dengan role **"Billing Account Viewer"**
3. Download credentials JSON → simpan di `server/credentials/gcp-sa.json`
4. Jangan commit file ini ke Git (tambahkan ke .gitignore)

Service Account yang sudah ada (`firebase-adminsdk`, `google-sheets`) belum memiliki akses ke Billing API — perlu dibuat service account baru khusus untuk billing monitoring.