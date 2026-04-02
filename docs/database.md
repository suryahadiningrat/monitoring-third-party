# Database — Third Party Service Monitor

## Strategi Penyimpanan

- **v1 (sekarang)**: localStorage + JSON lokal — pure frontend, tidak perlu server
- **v2**: Tambah backend ringan (Express/Hono) + SQLite untuk scheduler alert & log notifikasi

---

## TypeScript Interfaces (Updated v1.5)

```typescript
// src/types/index.ts

// ─── Enums & Literal Types ───────────────────────────────────────────────────

export type ServiceStatus = 'ok' | 'warn' | 'danger' | 'unknown';
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly' | 'biannual';

// billingType: subscription = biaya tetap, usage-based = habis pakai, hybrid = keduanya
export type BillingType = 'subscription' | 'usage-based' | 'hybrid';

export type ApiStatus = 'manual' | 'connected' | 'pending' | 'error';
export type AlertThreshold = 50 | 80 | 100; // persen dari budget cap
export type NotifStatus = 'delivered' | 'failed' | 'pending';

export type ServiceCategory =
  | 'Domain & Hosting'
  | 'Email Marketing'
  | 'Push Notification'
  | 'SEO Tools'
  | 'QR & Link Tool'
  | 'WhatsApp & Notif'
  | 'Cloud Storage'
  | 'Cloud Infrastructure'  // tambahan untuk GCP
  | 'Meeting & Collab'
  | 'Analytics'
  | 'Lainnya';

// ─── Project ─────────────────────────────────────────────────────────────────

export interface AlertContact {
  name: string;
  role: 'pm' | 'tech_lead' | 'finance' | 'admin';
  waNumber: string;  // format: 628xxxxxxxx
}

export interface Project {
  id: string;              // UUID v4
  name: string;            // cth: "Suzuki Hyperlocal"
  description?: string;
  contacts: AlertContact[]; // PM + Tech Lead yang menerima alert WA
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export interface ServiceAccount {
  email: string;
  label?: string;          // "Primary" | "Sub-account"
}

export interface ApiConfig {
  status: ApiStatus;
  endpoint?: string;
  apiKey?: string;         // dari .env, bukan di JSON
  lastSynced?: string;
  errorMessage?: string;
}

// Data live dari API atau input manual
export interface UsageData {
  // Untuk subscription
  renewalDate?: string;
  costPerMonth?: number;

  // Untuk usage-based
  currentUsage?: number;       // pengeluaran/usage bulan ini (IDR atau unit)
  currentUsageCurrency?: string; // 'IDR' | 'USD'
  budgetCap?: number;          // batas maksimal per bulan (IDR)
  budgetUsedPercent?: number;  // 0-100, dihitung otomatis
  balance?: number;            // sisa balance (untuk Qiscus, Adsmedia)
  balanceCurrency?: string;
  estimatedDaysLeft?: number;  // estimasi balance habis dalam N hari
  usageToday?: number;         // usage hari ini
  usageLabel?: string;         // cth: "Rp 3.200.000 / Rp 5.000.000"

  lastSynced?: string;
  raw?: Record<string, unknown>;
}

export interface AlertRule {
  threshold: AlertThreshold;   // 50 | 80 | 100
  enabled: boolean;
  lastTriggeredAt?: string;
}

export interface Service {
  id: string;
  projectId: string;           // relasi ke Project.id
  name: string;
  category: ServiceCategory;
  billingType: BillingType;    // 'subscription' | 'usage-based' | 'hybrid'
  accounts: ServiceAccount[];
  costPerMonth: number;        // biaya tetap/bulan (0 jika pure usage-based)
  billingCycle: BillingCycle;
  renewalDate?: string;        // wajib untuk subscription, opsional untuk usage-based
  budgetCap?: number;          // IDR/bulan, wajib untuk usage-based
  apiConfig: ApiConfig;
  usageData?: UsageData;
  alertRules: AlertRule[];     // [{ threshold: 50 }, { threshold: 80 }, { threshold: 100 }]
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Alert Log ───────────────────────────────────────────────────────────────

export interface AlertLog {
  id: string;
  serviceId: string;
  projectId: string;
  threshold: AlertThreshold;
  message: string;
  recipients: string[];        // nomor WA yang dituju
  status: NotifStatus;
  sentAt: string;
  errorMessage?: string;
}

// ─── Derived / Computed Types ─────────────────────────────────────────────────

export interface ServiceWithStatus extends Service {
  daysUntilRenewal: number | null;
  renewalStatus: ServiceStatus;
  budgetStatus: ServiceStatus;  // ok/warn/danger berdasarkan budgetUsedPercent
  project?: Project;
}

export interface CostSummary {
  totalMonthly: number;
  totalYearly: number;
  byProject: {
    projectId: string;
    projectName: string;
    monthly: number;
    percentage: number;
    count: number;
  }[];
  byCategory: {
    category: ServiceCategory;
    monthly: number;
    yearly: number;
    percentage: number;
    count: number;
  }[];
  usageBasedTotal: number;     // total dari layanan usage-based bulan ini
  subscriptionTotal: number;   // total dari layanan subscription
}

export interface DashboardStats {
  totalServices: number;
  totalProjects: number;
  totalMonthly: number;
  renewalCriticalCount: number;   // renewal ≤7 hari
  renewalWarnCount: number;       // renewal ≤30 hari
  budgetAlertCount: number;       // usage-based yang ≥80% cap
  apiConnectedCount: number;
}

// ─── App Data Store ───────────────────────────────────────────────────────────

export interface AppData {
  version: string;
  lastUpdated: string;
  projects: Project[];
  services: Service[];
  alertLogs: AlertLog[];
}
```

---

## Schema JSON (`src/data/app-data.json`)

```json
{
  "version": "1.5.0",
  "lastUpdated": "2026-04-02T00:00:00.000Z",
  "projects": [
    {
      "id": "proj-floothink",
      "name": "Floothink",
      "description": "Project internal Floothink",
      "contacts": [
        { "name": "PM Floothink", "role": "pm", "waNumber": "628xxxxxxxxx" },
        { "name": "Tech Lead Floothink", "role": "tech_lead", "waNumber": "628xxxxxxxxx" }
      ],
      "isActive": true,
      "createdAt": "2026-04-02T00:00:00.000Z",
      "updatedAt": "2026-04-02T00:00:00.000Z"
    },
    {
      "id": "proj-suzuki",
      "name": "Suzuki Hyperlocal",
      "description": "Project Suzuki Hyperlocal",
      "contacts": [
        { "name": "PM Suzuki", "role": "pm", "waNumber": "628xxxxxxxxx" },
        { "name": "Tech Lead Suzuki", "role": "tech_lead", "waNumber": "628xxxxxxxxx" }
      ],
      "isActive": true,
      "createdAt": "2026-04-02T00:00:00.000Z",
      "updatedAt": "2026-04-02T00:00:00.000Z"
    },
    {
      "id": "proj-idp",
      "name": "IDP (Integrated Data Platform)",
      "description": "Project IDP",
      "contacts": [
        { "name": "PM IDP", "role": "pm", "waNumber": "628xxxxxxxxx" },
        { "name": "Tech Lead IDP", "role": "tech_lead", "waNumber": "628xxxxxxxxx" }
      ],
      "isActive": true,
      "createdAt": "2026-04-02T00:00:00.000Z",
      "updatedAt": "2026-04-02T00:00:00.000Z"
    }
  ],
  "services": [],
  "alertLogs": []
}
```

---

## Seed Data Layanan (v1.5)

### Project: Floothink
| Layanan | Billing Type | Cost/Bulan | Renewal | Budget Cap |
|---------|-------------|-----------|---------|-----------|
| Niagahoster Domain | subscription | 150.000 | 2026-12-01 | - |
| Webpushr Push Notif | subscription | 0 | 2026-05-15 | - |
| Mailjet Email Marketing | subscription | 200.000 | 2026-05-20 | - |
| Ahrefs | subscription | 1.500.000 | 2026-05-01 | - |
| Semrush | subscription | 1.800.000 | 2026-05-10 | - |
| me-QR Code | subscription | 50.000 | 2027-03-01 | - |

### Project: Suzuki Hyperlocal
| Layanan | Billing Type | Cost/Bulan | Renewal | Budget Cap |
|---------|-------------|-----------|---------|-----------|
| Elastic Email | subscription | 80.000 | 2026-05-30 | - |
| Adsmedia OTP | usage-based ⚠️ | 0 | - | 500.000 |
| Google Cloud (GCP) | usage-based ⚠️ | 0 | - | 5.000.000 |

### Project: IDP
| Layanan | Billing Type | Cost/Bulan | Renewal | Budget Cap |
|---------|-------------|-----------|---------|-----------|
| Qiscus WA Notif | hybrid ⚠️ | 500.000 | 2026-10-25 | 1.000.000 |
| Google One Drive | subscription | 130.000 | 2026-05-10 | - |

### Project: Global (shared)
| Layanan | Billing Type | Cost/Bulan | Renewal | Budget Cap |
|---------|-------------|-----------|---------|-----------|
| Rumahweb | subscription | 300.000 | 2026-12-15 | - |
| Zoom Pro | subscription | 350.000 | 2027-02-01 | - |

---

## Business Logic

### Status Renewal
```typescript
function getRenewalStatus(renewalDate?: string): ServiceStatus {
  if (!renewalDate) return 'unknown';
  const days = differenceInDays(new Date(renewalDate), new Date());
  if (days <= 0) return 'danger';
  if (days <= 7) return 'danger';
  if (days <= 30) return 'warn';
  return 'ok';
}
```

### Status Budget (Usage-Based)
```typescript
function getBudgetStatus(usedPercent?: number): ServiceStatus {
  if (usedPercent === undefined) return 'unknown';
  if (usedPercent >= 100) return 'danger';
  if (usedPercent >= 80) return 'warn';
  if (usedPercent >= 50) return 'ok'; // info saja
  return 'ok';
}
```

### Kalkulasi Budget Used Percent
```typescript
function calcBudgetPercent(currentUsage: number, budgetCap: number): number {
  if (budgetCap <= 0) return 0;
  return Math.min(Math.round((currentUsage / budgetCap) * 100), 100);
}
```

### Estimasi Hari Tersisa (Balance)
```typescript
function estimateDaysLeft(balance: number, usageToday: number): number | null {
  if (!usageToday || usageToday <= 0) return null;
  const avgPerDay = usageToday; // bisa diganti rata-rata 7 hari
  return Math.floor(balance / avgPerDay);
}
```

### Normalisasi Biaya ke Bulanan
```typescript
function toMonthly(cost: number, cycle: BillingCycle): number {
  if (cycle === 'yearly') return Math.round(cost / 12);
  if (cycle === 'quarterly') return Math.round(cost / 3);
  if (cycle === 'biannual') return Math.round(cost / 6);
  return cost;
}
```