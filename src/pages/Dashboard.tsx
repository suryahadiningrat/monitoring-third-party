import { useState } from 'react';
import { useDashboardStats, useReminders, useServices } from '@/hooks';
import { StatCard } from '@/components/StatCard';
import { ReminderList } from '@/components/ReminderList';
import { ServiceForm } from '@/components/ServiceForm';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';
import { formatIDR } from '@/utils/currency.utils';

export function Dashboard() {
  const stats = useDashboardStats();
  const { reminders } = useReminders();
  const { addService } = useServices();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Layanan
        </Button>
      </div>

      {stats.renewalCriticalCount > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <p className="text-sm font-medium">
            Ada {stats.renewalCriticalCount} layanan yang berstatus kritis (jatuh tempo ≤ 7 hari). Segera periksa daftar pengingat.
          </p>
        </div>
      )}

      {stats.budgetAlertCount > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <p className="text-sm font-medium">
            Ada {stats.budgetAlertCount} layanan usage-based yang mendekati atau melewati budget cap (≥ 80%). Segera periksa Usage Monitor.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Layanan" value={stats.totalServices} />
        <StatCard label="Biaya per Bulan" value={formatIDR(stats.totalMonthly)} />
        <StatCard
          label="Kritis (≤7 Hari)"
          value={stats.renewalCriticalCount}
          color={stats.renewalCriticalCount > 0 ? 'text-red-600' : ''}
        />
        <StatCard
          label="Perlu Perhatian"
          value={stats.renewalWarnCount}
          color={stats.renewalWarnCount > 0 ? 'text-amber-600' : ''}
          sub="≤30 hari"
        />
        <StatCard
          label="Usage Alert"
          value={stats.budgetAlertCount}
          color={stats.budgetAlertCount > 0 ? 'text-red-600' : ''}
          sub="≥80% budget cap"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-1">
          <ReminderList services={reminders} limit={5} />
        </div>
      </div>

      <ServiceForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={(data) => {
          addService(data as Parameters<typeof addService>[0]);
          setIsFormOpen(false);
        }}
      />
    </div>
  );
}
