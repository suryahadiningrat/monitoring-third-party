# Database — Third Party Service Monitor

## Strategi Penyimpanan

Project ini menggunakan **file JSON lokal** sebagai penyimpanan utama (`src/data/services.json`).  
Tidak memerlukan database server. Data disimpan di filesystem dan dibaca/ditulis via Node.js fs (jika ada backend) atau via localStorage + JSON export jika pure frontend.

---

## TypeScript Interfaces

```typescript
// src/types/index.ts

export type ServiceStatus = 'ok' | 'warn' | 'danger' | 'unknown';
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';
export type ApiStatus = 'manual' | 'connected' | 'pending' | 'error';
export type ServiceCategory =
  | 'Domain & Hosting'
  | 'Email Marketing'
  | 'Push Notification'
  | 'SEO Tools'
  | 'QR & Link Tool'
  | 'WhatsApp & Notif'
  | 'Cloud Storage'
  | 'Meeting & Collab'
  | 'Analytics'
  | 'Lainnya';

export interface ServiceAccount {
  email: string;
  label?: string; // cth: "Primary" | "Sub-account"
}

export interface ApiConfig {
  status: ApiStatus;
  endpoint?: string;
  apiKey?: string;         // disimpan di .env, bukan di JSON
  lastSynced?: string;     // ISO date string
  errorMessage?: string;
}

export interface ApiLiveData {
  balance?: number;        // saldo/kredit tersisa (jika ada)
  balanceCurrency?: string;
  usagePercent?: number;   // persentase penggunaan (0-100)
  usageLabel?: string;     // cth: "1,200 / 10,000 emails"
  nextBillingAmount?: number;
  raw?: Record<string, unknown>; // raw response dari API
}

export interface Service {
  id: string;              // UUID v4
  name: string;
  category: ServiceCategory;
  accounts: ServiceAccount[];
  costPerMonth: number;    // dalam IDR
  billingCycle: BillingCycle;
  renewalDate: string;     // ISO date string: "2025-12-01"
  apiConfig: ApiConfig;
  liveData?: ApiLiveData;
  notes?: string;
  isActive: boolean;
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}

export interface ServicesData {
  version: string;
  lastUpdated: string;
  services: Service[];
}

// Derived / computed types
export interface ServiceWithStatus extends Service {
  daysUntilRenewal: number | null;
  status: ServiceStatus;
}

export interface CostSummary {
  totalMonthly: number;
  totalYearly: number;
  byCategory: {
    category: ServiceCategory;
    monthly: number;
    yearly: number;
    percentage: number;
    count: number;
  }[];
}

export interface DashboardStats {
  totalServices: number;
  totalMonthly: number;
  criticalCount: number;   // ≤7 hari
  warnCount: number;       // ≤30 hari
  apiConnectedCount: number;
}
```

---

## Schema JSON (`src/data/services.json`)

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-10-01T00:00:00.000Z",
  "services": [
    {
      "id": "uuid-v4-here",
      "name": "Niagahoster Domain",
      "category": "Domain & Hosting",
      "accounts": [
        { "email": "floothink360@gmail.com", "label": "Primary" }
      ],
      "costPerMonth": 150000,
      "billingCycle": "yearly",
      "renewalDate": "2025-12-01",
      "apiConfig": {
        "status": "manual",
        "lastSynced": null,
        "errorMessage": null
      },
      "liveData": null,
      "notes": "",
      "isActive": true,
      "createdAt": "2025-10-01T00:00:00.000Z",
      "updatedAt": "2025-10-01T00:00:00.000Z"
    }
  ]
}
```

---

## Seed Data Lengkap (12 Layanan Awal)

| id | name | category | email | costPerMonth | billingCycle | renewalDate | apiStatus |
|----|------|----------|-------|-------------|--------------|-------------|-----------|
| auto | Niagahoster Domain | Domain & Hosting | floothink360@gmail.com | 150000 | yearly | 2025-12-01 | manual |
| auto | Webpushr Push Notif | Push Notification | floothink360@gmail.com | 0 | monthly | 2025-11-15 | pending |
| auto | Mailjet Email Marketing | Email Marketing | floothink360@gmail.com | 200000 | monthly | 2025-10-20 | pending |
| auto | Ahrefs | SEO Tools | floothink360@gmail.com | 1500000 | monthly | 2025-11-01 | manual |
| auto | Semrush | SEO Tools | floothink360@gmail.com | 1800000 | monthly | 2025-10-10 | manual |
| auto | me-QR Code | QR & Link Tool | floothink360@gmail.com | 50000 | yearly | 2026-03-01 | manual |
| auto | Rumahweb | Domain & Hosting | idealivejkt@gmail.com | 300000 | yearly | 2025-12-15 | manual |
| auto | Elastic Email | Email Marketing | suzukihyperlocal@gmail.com | 80000 | monthly | 2025-11-30 | pending |
| auto | Qiscus WA Notif | WhatsApp & Notif | integrated.data.platform@gmail.com | 500000 | monthly | 2025-10-25 | pending |
| auto | Adsmedia OTP | WhatsApp & Notif | suzukihyperlocal@gmail.com | 200000 | monthly | 2026-01-01 | manual |
| auto | Google One Drive | Cloud Storage | integrated.data.platform@gmail.com | 130000 | monthly | 2025-11-10 | manual |
| auto | Zoom Pro | Meeting & Collab | superuser.global@gmail.com | 350000 | yearly | 2026-02-01 | manual |

> Catatan Rumahweb: akun sub adalah f3brili0@gmail.com — simpan sebagai accounts array dengan 2 entry.

---

## Operasi CRUD

### Read
```typescript
// hooks/useServices.ts
const { data: services } = useQuery({
  queryKey: ['services'],
  queryFn: () => loadFromJSON(), // baca dari localStorage atau file
});
```

### Create
```typescript
const newService: Service = {
  id: crypto.randomUUID(),
  ...formData,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

### Update
```typescript
const updated = services.map(s =>
  s.id === id ? { ...s, ...changes, updatedAt: new Date().toISOString() } : s
);
```

### Delete (Soft Delete)
```typescript
// Tandai isActive: false, jangan hapus dari file
const updated = services.map(s =>
  s.id === id ? { ...s, isActive: false, updatedAt: new Date().toISOString() } : s
);
```

---

## Business Logic

### Kalkulasi Status
```typescript
function getStatus(renewalDate: string): ServiceStatus {
  const days = differenceInDays(new Date(renewalDate), new Date());
  if (days <= 0) return 'danger';   // sudah lewat
  if (days <= 7) return 'danger';   // kritis
  if (days <= 30) return 'warn';    // perlu perhatian
  return 'ok';
}
```

### Normalisasi Biaya ke Bulanan
```typescript
function toMonthly(cost: number, cycle: BillingCycle): number {
  if (cycle === 'yearly') return Math.round(cost / 12);
  if (cycle === 'quarterly') return Math.round(cost / 3);
  return cost;
}
```