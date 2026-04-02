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
