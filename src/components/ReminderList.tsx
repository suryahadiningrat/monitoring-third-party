import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatIDR } from '@/utils/currency.utils';
import { formatDate } from '@/utils/date.utils';
import type { ServiceWithStatus } from '@/types';

export interface ReminderListProps {
  services: ServiceWithStatus[];
  limit?: number;
}

export function ReminderList({ services, limit }: ReminderListProps) {
  const displayServices = limit ? services.slice(0, limit) : services;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'danger':
        return 'bg-red-500';
      case 'warn':
        return 'bg-amber-500';
      case 'ok':
        return 'bg-green-500';
      default:
        return 'bg-slate-300';
    }
  };

  if (displayServices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pengingat Tagihan</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-8">
          Tidak ada tagihan dalam waktu dekat.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pengingat Tagihan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayServices.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${getStatusColor(
                    service.status
                  )}`}
                />
                <div>
                  <h4 className="text-sm font-semibold">{service.name}</h4>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{service.category}</span>
                    <span>&bull;</span>
                    <span className="truncate max-w-[120px] sm:max-w-[200px]">
                      {service.accounts[0]?.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">
                  {formatIDR(service.costPerMonth)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {service.daysUntilRenewal !== null
                    ? service.daysUntilRenewal < 0
                      ? 'Sudah lewat'
                      : `${service.daysUntilRenewal} hari lagi`
                    : formatDate(service.renewalDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
