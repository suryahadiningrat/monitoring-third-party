import { useCostSummary, useServices } from '@/hooks';
import { CostSummary } from '@/components/CostSummary';
import { formatDate } from '@/utils/date.utils';

export function Costs() {
  const summary = useCostSummary();
  const { allServices } = useServices();

  const lastUpdated = allServices.length > 0 
    ? allServices.reduce((latest, service) => {
        return new Date(service.updatedAt) > new Date(latest) ? service.updatedAt : latest;
      }, allServices[0].updatedAt)
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ringkasan Biaya</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Terakhir diperbarui: {lastUpdated ? formatDate(lastUpdated, 'd MMM yyyy HH:mm') : '-'}
          </p>
        </div>
      </div>

      <div className="w-full">
        <CostSummary summary={summary} />
      </div>
    </div>
  );
}
