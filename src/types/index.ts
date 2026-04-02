export type ServiceStatus = 'ok' | 'warn' | 'danger' | 'unknown';
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly' | 'biannual';
export type BillingType = 'subscription' | 'usage-based' | 'hybrid';
export type ApiStatus = 'manual' | 'connected' | 'pending' | 'error';
export type AlertThreshold = 50 | 80 | 100;
export type NotifStatus = 'delivered' | 'failed' | 'pending';

export type ServiceCategory =
  | 'Domain & Hosting'
  | 'Email Marketing'
  | 'Push Notification'
  | 'SEO Tools'
  | 'QR & Link Tool'
  | 'WhatsApp & Notif'
  | 'Cloud Storage'
  | 'Cloud Infrastructure'
  | 'Meeting & Collab'
  | 'Analytics'
  | 'Lainnya';

export interface AlertContact {
  name: string;
  role: 'pm' | 'tech_lead' | 'finance' | 'admin';
  waNumber: string; // format: 628xxxxxxxx
}

export interface Project {
  id: string; // UUID v4
  name: string;
  description?: string;
  contacts: AlertContact[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAccount {
  email: string;
  label?: string; // cth: "Primary" | "Sub-account"
}

export interface ApiConfig {
  status: ApiStatus;
  endpoint?: string;
  apiKey?: string; // disimpan di .env, bukan di JSON
  lastSynced?: string; // ISO date string
  errorMessage?: string;
}

export interface UsageData {
  // Untuk subscription
  renewalDate?: string;
  costPerMonth?: number;

  // Untuk usage-based
  currentUsage?: number; // pengeluaran/usage bulan ini (IDR atau unit)
  currentUsageCurrency?: string; // 'IDR' | 'USD'
  budgetCap?: number; // batas maksimal per bulan (IDR)
  budgetUsedPercent?: number; // 0-100, dihitung otomatis
  balance?: number; // sisa balance (untuk Qiscus, Adsmedia)
  balanceCurrency?: string;
  estimatedDaysLeft?: number; // estimasi balance habis dalam N hari
  usageToday?: number; // usage hari ini
  usageLabel?: string; // cth: "Rp 3.200.000 / Rp 5.000.000"

  lastSynced?: string;
  raw?: Record<string, unknown>;
}

export interface AlertRule {
  threshold: AlertThreshold; // 50 | 80 | 100
  enabled: boolean;
  lastTriggeredAt?: string;
}

export interface Service {
  id: string; // UUID v4
  projectId: string; // relasi ke Project.id
  name: string;
  category: ServiceCategory;
  billingType: BillingType;
  accounts: ServiceAccount[];
  costPerMonth: number; // biaya tetap/bulan (0 jika pure usage-based)
  billingCycle: BillingCycle;
  renewalDate?: string; // wajib untuk subscription, opsional untuk usage-based
  budgetCap?: number; // IDR/bulan, wajib untuk usage-based
  apiConfig: ApiConfig;
  usageData?: UsageData;
  alertRules: AlertRule[]; // [{ threshold: 50 }, { threshold: 80 }, { threshold: 100 }]
  notes?: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface AlertLog {
  id: string;
  serviceId: string;
  projectId: string;
  threshold: AlertThreshold;
  message: string;
  recipients: string[]; // nomor WA yang dituju
  status: NotifStatus;
  sentAt: string;
  errorMessage?: string;
}

// Derived / computed types
export interface ServiceWithStatus extends Service {
  daysUntilRenewal: number | null;
  renewalStatus: ServiceStatus;
  budgetStatus: ServiceStatus; // ok/warn/danger berdasarkan budgetUsedPercent
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
  usageBasedTotal: number;
  subscriptionTotal: number;
}

export interface DashboardStats {
  totalServices: number;
  totalProjects: number;
  totalMonthly: number;
  renewalCriticalCount: number; // ≤7 hari
  renewalWarnCount: number; // ≤30 hari
  budgetAlertCount: number; // usage-based yang ≥80% cap
  apiConnectedCount: number;
}

export interface AppData {
  version: string;
  lastUpdated: string;
  projects: Project[];
  services: Service[];
  alertLogs: AlertLog[];
}
