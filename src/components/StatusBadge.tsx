import { Badge } from '@/components/ui/badge';
import type { ServiceStatus } from '@/types';

export interface StatusBadgeProps {
  status: ServiceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    ok: { label: 'Aman', color: 'bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200' },
    warn: { label: 'Perlu Perhatian', color: 'bg-amber-100 text-amber-800 hover:bg-amber-100/80 border-amber-200' },
    danger: { label: 'Kritis', color: 'bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200' },
    unknown: { label: 'Unknown', color: 'bg-slate-100 text-slate-800 hover:bg-slate-100/80 border-slate-200' },
  };

  const { label, color } = config[status] || config.unknown;

  return (
    <Badge variant="outline" className={`${color} font-medium`}>
      {label}
    </Badge>
  );
}
