import { useState, useMemo } from 'react';
import { useReminders } from '@/hooks';
import { ReminderList } from '@/components/ReminderList';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

type FilterTab = 'all' | 'critical' | 'warning' | 'safe';

export function Reminders() {
  const { reminders } = useReminders();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const {
    criticalReminders,
    warningReminders,
    safeReminders,
  } = useMemo(() => {
    return {
      criticalReminders: reminders.filter((r) => r.status === 'danger'),
      warningReminders: reminders.filter((r) => r.status === 'warn'),
      safeReminders: reminders.filter((r) => r.status === 'ok'),
    };
  }, [reminders]);

  const getFilteredReminders = () => {
    switch (activeTab) {
      case 'critical':
        return criticalReminders;
      case 'warning':
        return warningReminders;
      case 'safe':
        return safeReminders;
      case 'all':
      default:
        return reminders;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Pengingat Perpanjangan</h2>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={(val) => setActiveTab(val as FilterTab)}>
        <TabsList className="grid w-full sm:w-auto grid-cols-4 sm:flex">
          <TabsTrigger value="all" className="flex gap-2">
            <span>Semua</span>
            <Badge variant="secondary" className="hidden sm:inline-flex">{reminders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="critical" className="flex gap-2 text-red-600 data-[state=active]:text-red-700">
            <span>Kritis</span>
            <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 hidden sm:inline-flex">
              {criticalReminders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="warning" className="flex gap-2 text-amber-600 data-[state=active]:text-amber-700">
            <span>Perhatian</span>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 hidden sm:inline-flex">
              {warningReminders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="safe" className="flex gap-2 text-green-600 data-[state=active]:text-green-700">
            <span>Aman</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 hidden sm:inline-flex">
              {safeReminders.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <ReminderList services={getFilteredReminders()} />
        </div>
      </Tabs>
    </div>
  );
}
